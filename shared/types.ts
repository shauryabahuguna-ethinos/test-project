// Re-export types from schema for frontend compatibility
export type { Task, AIGeneratedContent, WorkingHours } from "@shared/schema";

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  taskId?: string;
  color?: string;
}

export interface Analytics {
  totalTasks: number;
  completedTasks: number;
  averageCompletionTime: number;
  accuracyRate: number; // estimated vs actual time
  productivityScore: number;
}