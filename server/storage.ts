import { issues, deliveryTargets, issueAssignments, type Issue, type InsertIssue, type DeliveryTarget, type InsertDeliveryTarget, type IssueAssignment, type InsertIssueAssignment } from "../shared/schema";
import { db } from "./db";
import { eq, asc, isNull, inArray } from "drizzle-orm";

export interface IStorage {
  getAllIssues(): Promise<Issue[]>;
  getIssue(id: number): Promise<Issue | undefined>;
  getIssueWithChildren(id: number): Promise<{ issue: Issue; children: Issue[] } | undefined>;
  getIssuesByParent(parentId: number | null): Promise<Issue[]>;
  createIssue(issue: InsertIssue): Promise<Issue>;
  updateIssue(id: number, issue: Partial<InsertIssue>): Promise<Issue | undefined>;
  deleteIssue(id: number): Promise<boolean>;
  
  getAllDeliveryTargets(): Promise<DeliveryTarget[]>;
  getDeliveryTarget(id: number): Promise<DeliveryTarget | undefined>;
  createDeliveryTarget(target: InsertDeliveryTarget): Promise<DeliveryTarget>;
  
  getAssignmentsForIssue(issueId: number): Promise<(IssueAssignment & { target?: DeliveryTarget })[]>;
  getIssuesForTarget(targetKey: string): Promise<Issue[]>;
  setIssueAssignments(issueId: number, targetIds: number[]): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getAllIssues(): Promise<Issue[]> {
    return await db.select().from(issues).orderBy(asc(issues.id));
  }

  async getIssue(id: number): Promise<Issue | undefined> {
    const [issue] = await db.select().from(issues).where(eq(issues.id, id));
    return issue || undefined;
  }

  async getIssueWithChildren(id: number): Promise<{ issue: Issue; children: Issue[] } | undefined> {
    const [issue] = await db.select().from(issues).where(eq(issues.id, id));
    if (!issue) return undefined;
    
    const children = await db.select().from(issues).where(eq(issues.parentId, id)).orderBy(issues.id);
    return { issue, children };
  }

  async getIssuesByParent(parentId: number | null): Promise<Issue[]> {
    if (parentId === null) {
      return await db.select().from(issues).where(isNull(issues.parentId)).orderBy(asc(issues.id));
    }
    return await db.select().from(issues).where(eq(issues.parentId, parentId)).orderBy(issues.id);
  }

  async createIssue(insertIssue: InsertIssue): Promise<Issue> {
    const [issue] = await db
      .insert(issues)
      .values(insertIssue)
      .returning();
    return issue;
  }

  async updateIssue(id: number, updates: Partial<InsertIssue>): Promise<Issue | undefined> {
    const [issue] = await db
      .update(issues)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(issues.id, id))
      .returning();
    return issue || undefined;
  }

  async deleteIssue(id: number): Promise<boolean> {
    await db.delete(issueAssignments).where(eq(issueAssignments.issueId, id));
    await db.update(issues).set({ parentId: null }).where(eq(issues.parentId, id));
    const result = await db.delete(issues).where(eq(issues.id, id)).returning();
    return result.length > 0;
  }

  async getAllDeliveryTargets(): Promise<DeliveryTarget[]> {
    return await db.select().from(deliveryTargets).orderBy(deliveryTargets.type, deliveryTargets.name);
  }

  async getDeliveryTarget(id: number): Promise<DeliveryTarget | undefined> {
    const [target] = await db.select().from(deliveryTargets).where(eq(deliveryTargets.id, id));
    return target || undefined;
  }

  async createDeliveryTarget(target: InsertDeliveryTarget): Promise<DeliveryTarget> {
    const [result] = await db.insert(deliveryTargets).values(target).returning();
    return result;
  }

  async getAssignmentsForIssue(issueId: number): Promise<(IssueAssignment & { target?: DeliveryTarget })[]> {
    const assignments = await db.select().from(issueAssignments).where(eq(issueAssignments.issueId, issueId));
    
    if (assignments.length === 0) return [];
    
    const targetIds = assignments.map(a => a.targetId);
    const targets = await db.select().from(deliveryTargets).where(inArray(deliveryTargets.id, targetIds));
    const targetMap = new Map(targets.map(t => [t.id, t]));
    
    return assignments.map(a => ({
      ...a,
      target: targetMap.get(a.targetId)
    }));
  }

  async getIssuesForTarget(targetKey: string): Promise<Issue[]> {
    // Page-to-widget mapping for page-level queries
    const pageWidgets: Record<string, string[]> = {
      'dashboard': ['dashboard', 'squad-health-check', 'issue-filter', 'issue-cards'],
      'squad': ['squad', 'pitch-view', 'squad-list'],
      'player-search': ['player-search', 'search-filters', 'search-results'],
      'shortlists': ['shortlists', 'shortlist-cards', 'shortlist-panel'],
      'global': ['global', 'ai-assistant', 'feedback-system', 'player-panel', 'timeline-modal', 'whatsapp-panel', 'create-shortlist-modal'],
    };
    
    // Determine which keys to search for (page includes all its widgets)
    const keysToSearch = pageWidgets[targetKey] || [targetKey];
    
    // Get issues from issue_assignments table
    const targets = await db.select().from(deliveryTargets).where(inArray(deliveryTargets.key, keysToSearch));
    let assignedIssueIds: number[] = [];
    
    if (targets.length > 0) {
      const targetIds = targets.map(t => t.id);
      const assignments = await db.select().from(issueAssignments).where(inArray(issueAssignments.targetId, targetIds));
      assignedIssueIds = assignments.map(a => a.issueId);
    }
    
    // Also get issues where the screen field matches any of the keys
    const screenIssues = await db.select().from(issues).where(inArray(issues.screen, keysToSearch));
    const screenIssueIds = screenIssues.map(i => i.id);
    
    // Combine and deduplicate
    const allIssueIds = [...new Set([...assignedIssueIds, ...screenIssueIds])];
    
    if (allIssueIds.length === 0) return [];
    
    return await db.select().from(issues).where(inArray(issues.id, allIssueIds)).orderBy(asc(issues.id));
  }

  async setIssueAssignments(issueId: number, targetIds: number[]): Promise<void> {
    await db.delete(issueAssignments).where(eq(issueAssignments.issueId, issueId));
    
    if (targetIds.length > 0) {
      const values = targetIds.map(targetId => ({ issueId, targetId }));
      await db.insert(issueAssignments).values(values);
    }
  }
}

export const storage = new DatabaseStorage();
