import { issues, deliveryTargets, issueAssignments, type Issue, type InsertIssue, type DeliveryTarget, type InsertDeliveryTarget, type IssueAssignment, type InsertIssueAssignment } from "../shared/schema";
import { db } from "./db";
import { eq, desc, isNull, inArray } from "drizzle-orm";

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
    return await db.select().from(issues).orderBy(desc(issues.createdAt));
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
      return await db.select().from(issues).where(isNull(issues.parentId)).orderBy(desc(issues.createdAt));
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
    const [target] = await db.select().from(deliveryTargets).where(eq(deliveryTargets.key, targetKey));
    if (!target) return [];
    
    const assignments = await db.select().from(issueAssignments).where(eq(issueAssignments.targetId, target.id));
    if (assignments.length === 0) return [];
    
    const issueIds = assignments.map(a => a.issueId);
    return await db.select().from(issues).where(inArray(issues.id, issueIds)).orderBy(desc(issues.createdAt));
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
