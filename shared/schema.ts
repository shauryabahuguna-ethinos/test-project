import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, real, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Tasks table
export const tasks = pgTable("tasks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  title: text("title").notNull(),
  description: text("description"),
  priority: integer("priority").notNull().default(3), // 1-5 scale
  estimatedTime: integer("estimated_time").notNull(), // minutes
  actualTime: integer("actual_time"),
  deadline: timestamp("deadline"),
  scheduledStart: timestamp("scheduled_start"),
  scheduledEnd: timestamp("scheduled_end"),
  progress: real("progress").notNull().default(0), // 0-100
  status: text("status").notNull().default('pending'), // pending, in-progress, completed, overdue
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`)
});

// AI Generated Content table
export const aiGeneratedContent = pgTable("ai_generated_content", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  type: text("type").notNull(), // user-story, acceptance-criteria, test-scenarios
  originalText: text("original_text").notNull(),
  generatedContent: text("generated_content").notNull(),
  createdAt: timestamp("created_at").notNull().default(sql`now()`)
});

// Working Hours table
export const workingHours = pgTable("working_hours", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  startTime: text("start_time").notNull().default('09:00'),
  endTime: text("end_time").notNull().default('17:00'),
  daysOfWeek: json("days_of_week").notNull().default([1,2,3,4,5]), // Monday-Sunday as 1-7
  timezone: text("timezone").default('UTC')
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertTaskSchema = createInsertSchema(tasks).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertAiContentSchema = createInsertSchema(aiGeneratedContent).omit({
  id: true,
  createdAt: true
});

export const insertWorkingHoursSchema = createInsertSchema(workingHours).omit({
  id: true
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Task = typeof tasks.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;
export type AIGeneratedContent = typeof aiGeneratedContent.$inferSelect;
export type InsertAIGeneratedContent = z.infer<typeof insertAiContentSchema>;
export type WorkingHours = typeof workingHours.$inferSelect;
export type InsertWorkingHours = z.infer<typeof insertWorkingHoursSchema>;
