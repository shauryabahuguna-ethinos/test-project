export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 1 | 2 | 3 | 4 | 5; // 1 = highest, 5 = lowest
  estimatedTime: number; // in minutes
  actualTime?: number; // in minutes
  deadline?: Date;
  scheduledStart?: Date;
  scheduledEnd?: Date;
  progress: number; // 0-100
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  createdAt: Date;
  updatedAt: Date;
}

export interface AIGeneratedContent {
  id: string;
  type: 'user-story' | 'acceptance-criteria' | 'test-scenarios';
  originalText: string;
  generatedContent: string;
  createdAt: Date;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  taskId?: string;
  color?: string;
}

export interface WorkingHours {
  start: string; // "09:00"
  end: string; // "17:00"
  days: number[]; // [1,2,3,4,5] for Monday-Friday
}

export interface Analytics {
  totalTasks: number;
  completedTasks: number;
  averageCompletionTime: number;
  accuracyRate: number; // estimated vs actual time
  productivityScore: number;
}