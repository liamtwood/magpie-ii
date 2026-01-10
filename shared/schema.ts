import { pgTable, serial, varchar, text, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";

export const deliveryTargets = pgTable("delivery_targets", {
  id: serial("id").primaryKey(),
  type: varchar("type", { length: 50 }).notNull(),
  key: varchar("key", { length: 100 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const issues = pgTable("issues", {
  id: serial("id").primaryKey(),
  type: varchar("type", { length: 50 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  screen: varchar("screen", { length: 100 }),
  parentId: integer("parent_id"),
  status: varchar("status", { length: 50 }).notNull().default("new"),
  priority: varchar("priority", { length: 50 }).default("medium"),
  fixBy: varchar("fix_by", { length: 50 }).default("current-release"),
  area: varchar("area", { length: 100 }),
  ideasToDiscuss: text("ideas_to_discuss"),
  createdBy: varchar("created_by", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const issueAssignments = pgTable("issue_assignments", {
  id: serial("id").primaryKey(),
  issueId: integer("issue_id").notNull(),
  targetId: integer("target_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const issuesRelations = relations(issues, ({ one, many }) => ({
  parent: one(issues, {
    fields: [issues.parentId],
    references: [issues.id],
    relationName: "parentChild",
  }),
  children: many(issues, { relationName: "parentChild" }),
  assignments: many(issueAssignments),
}));

export const issueAssignmentsRelations = relations(issueAssignments, ({ one }) => ({
  issue: one(issues, {
    fields: [issueAssignments.issueId],
    references: [issues.id],
  }),
  target: one(deliveryTargets, {
    fields: [issueAssignments.targetId],
    references: [deliveryTargets.id],
  }),
}));

export const deliveryTargetsRelations = relations(deliveryTargets, ({ many }) => ({
  assignments: many(issueAssignments),
}));

export type Issue = typeof issues.$inferSelect;
export type InsertIssue = typeof issues.$inferInsert;
export type DeliveryTarget = typeof deliveryTargets.$inferSelect;
export type InsertDeliveryTarget = typeof deliveryTargets.$inferInsert;
export type IssueAssignment = typeof issueAssignments.$inferSelect;
export type InsertIssueAssignment = typeof issueAssignments.$inferInsert;

export const insertIssueSchema = createInsertSchema(issues);
export const insertDeliveryTargetSchema = createInsertSchema(deliveryTargets);
export const insertIssueAssignmentSchema = createInsertSchema(issueAssignments);
