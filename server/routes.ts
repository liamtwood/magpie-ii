import { Router, Request, Response } from "express";
import { storage } from "./storage";
import type { InsertIssue } from "../shared/schema";

export const router = Router();

router.get("/api/issues", async (_req: Request, res: Response) => {
  try {
    const issues = await storage.getAllIssues();
    res.json(issues);
  } catch (error) {
    console.error("Error fetching issues:", error);
    res.status(500).json({ error: "Failed to fetch issues" });
  }
});

router.get("/api/issues/:id", async (req: Request<{id: string}>, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const issue = await storage.getIssue(id);
    if (!issue) {
      return res.status(404).json({ error: "Issue not found" });
    }
    res.json(issue);
  } catch (error) {
    console.error("Error fetching issue:", error);
    res.status(500).json({ error: "Failed to fetch issue" });
  }
});

router.get("/api/issues/:id/tree", async (req: Request<{id: string}>, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const result = await storage.getIssueWithChildren(id);
    if (!result) {
      return res.status(404).json({ error: "Issue not found" });
    }
    res.json(result);
  } catch (error) {
    console.error("Error fetching issue tree:", error);
    res.status(500).json({ error: "Failed to fetch issue tree" });
  }
});

router.get("/api/issues/:id/assignments", async (req: Request<{id: string}>, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const assignments = await storage.getAssignmentsForIssue(id);
    res.json(assignments);
  } catch (error) {
    console.error("Error fetching assignments:", error);
    res.status(500).json({ error: "Failed to fetch assignments" });
  }
});

router.post("/api/issues", async (req: Request, res: Response) => {
  try {
    const { targetIds, ...issueData } = req.body;
    const issue = await storage.createIssue(issueData as InsertIssue);
    
    if (targetIds && Array.isArray(targetIds) && targetIds.length > 0) {
      await storage.setIssueAssignments(issue.id, targetIds);
    }
    
    res.status(201).json(issue);
  } catch (error) {
    console.error("Error creating issue:", error);
    res.status(500).json({ error: "Failed to create issue" });
  }
});

router.patch("/api/issues/:id", async (req: Request<{id: string}>, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { targetIds, ...updates } = req.body;
    const issue = await storage.updateIssue(id, updates as Partial<InsertIssue>);
    if (!issue) {
      return res.status(404).json({ error: "Issue not found" });
    }
    
    if (targetIds !== undefined && Array.isArray(targetIds)) {
      await storage.setIssueAssignments(id, targetIds);
    }
    
    res.json(issue);
  } catch (error) {
    console.error("Error updating issue:", error);
    res.status(500).json({ error: "Failed to update issue" });
  }
});

router.delete("/api/issues/:id", async (req: Request<{id: string}>, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const deleted = await storage.deleteIssue(id);
    if (!deleted) {
      return res.status(404).json({ error: "Issue not found" });
    }
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting issue:", error);
    res.status(500).json({ error: "Failed to delete issue" });
  }
});

router.get("/api/delivery-targets", async (_req: Request, res: Response) => {
  try {
    const targets = await storage.getAllDeliveryTargets();
    res.json(targets);
  } catch (error) {
    console.error("Error fetching delivery targets:", error);
    res.status(500).json({ error: "Failed to fetch delivery targets" });
  }
});

router.get("/api/delivery-targets/:key/issues", async (req: Request<{key: string}>, res: Response) => {
  try {
    const issues = await storage.getIssuesForTarget(req.params.key);
    res.json(issues);
  } catch (error) {
    console.error("Error fetching issues for target:", error);
    res.status(500).json({ error: "Failed to fetch issues for target" });
  }
});

router.get("/api/objects", async (_req: Request, res: Response) => {
  try {
    const objects = await storage.getAllObjects();
    res.json(objects);
  } catch (error) {
    console.error("Error fetching objects:", error);
    res.status(500).json({ error: "Failed to fetch objects" });
  }
});

router.get("/api/objects/:id/issues", async (req: Request<{id: string}>, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const issues = await storage.getIssuesForObject(id);
    res.json(issues);
  } catch (error) {
    console.error("Error fetching issues for object:", error);
    res.status(500).json({ error: "Failed to fetch issues for object" });
  }
});
