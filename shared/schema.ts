import { pgTable, serial, varchar, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

export const issues = pgTable("issues", {
  id: serial("id").primaryKey(),
  type: varchar("type", { length: 50 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  screen: varchar("screen", { length: 100 }),
  status: varchar("status", { length: 50 }).notNull().default("new"),
  priority: varchar("priority", { length: 50 }).default("medium"),
  fixBy: varchar("fix_by", { length: 50 }).default("current-release"),
  area: varchar("area", { length: 100 }),
  ideasToDiscuss: text("ideas_to_discuss"),
  createdBy: varchar("created_by", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Issue = typeof issues.$inferSelect;
export type InsertIssue = typeof issues.$inferInsert;

export const insertIssueSchema = createInsertSchema(issues);
