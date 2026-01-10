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

router.post("/api/issues", async (req: Request, res: Response) => {
  try {
    const issueData: InsertIssue = req.body;
    const issue = await storage.createIssue(issueData);
    res.status(201).json(issue);
  } catch (error) {
    console.error("Error creating issue:", error);
    res.status(500).json({ error: "Failed to create issue" });
  }
});

router.patch("/api/issues/:id", async (req: Request<{id: string}>, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const updates: Partial<InsertIssue> = req.body;
    const issue = await storage.updateIssue(id, updates);
    if (!issue) {
      return res.status(404).json({ error: "Issue not found" });
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
