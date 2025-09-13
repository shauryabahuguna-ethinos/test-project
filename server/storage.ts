import { type User, type InsertUser, type Task, type InsertTask, type AIGeneratedContent, type InsertAIGeneratedContent, type WorkingHours, type InsertWorkingHours } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Task methods
  getTasks(userId: string): Promise<Task[]>;
  getTask(id: string): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: string, updates: Partial<InsertTask>): Promise<Task | undefined>;
  deleteTask(id: string): Promise<boolean>;
  getTasksByStatus(userId: string, status: string): Promise<Task[]>;
  getTasksByDateRange(userId: string, startDate: Date, endDate: Date): Promise<Task[]>;

  // AI Content methods
  getAIContent(userId: string): Promise<AIGeneratedContent[]>;
  createAIContent(content: InsertAIGeneratedContent): Promise<AIGeneratedContent>;

  // Working Hours methods
  getWorkingHours(userId: string): Promise<WorkingHours | undefined>;
  setWorkingHours(workingHours: InsertWorkingHours): Promise<WorkingHours>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private tasks: Map<string, Task>;
  private aiContent: Map<string, AIGeneratedContent>;
  private workingHours: Map<string, WorkingHours>;

  constructor() {
    this.users = new Map();
    this.tasks = new Map();
    this.aiContent = new Map();
    this.workingHours = new Map();
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Task methods
  async getTasks(userId: string): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter(task => task.userId === userId);
  }

  async getTask(id: string): Promise<Task | undefined> {
    return this.tasks.get(id);
  }

  async createTask(task: InsertTask): Promise<Task> {
    const id = randomUUID();
    const now = new Date();
    const newTask: Task = { 
      ...task, 
      id,
      status: task.status || 'pending',
      userId: task.userId || null,
      description: task.description || null,
      priority: task.priority || 3,
      progress: task.progress || 0,
      actualTime: task.actualTime || null,
      deadline: task.deadline || null,
      scheduledStart: task.scheduledStart || null,
      scheduledEnd: task.scheduledEnd || null,
      createdAt: now,
      updatedAt: now
    };
    this.tasks.set(id, newTask);
    return newTask;
  }

  async updateTask(id: string, updates: Partial<InsertTask>): Promise<Task | undefined> {
    const existingTask = this.tasks.get(id);
    if (!existingTask) return undefined;

    const updatedTask: Task = {
      ...existingTask,
      ...updates,
      updatedAt: new Date()
    };
    this.tasks.set(id, updatedTask);
    return updatedTask;
  }

  async deleteTask(id: string): Promise<boolean> {
    return this.tasks.delete(id);
  }

  async getTasksByStatus(userId: string, status: string): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter(
      task => task.userId === userId && task.status === status
    );
  }

  async getTasksByDateRange(userId: string, startDate: Date, endDate: Date): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter(task => 
      task.userId === userId && 
      task.scheduledStart && 
      task.scheduledStart >= startDate && 
      task.scheduledStart <= endDate
    );
  }

  // AI Content methods
  async getAIContent(userId: string): Promise<AIGeneratedContent[]> {
    return Array.from(this.aiContent.values()).filter(content => content.userId === userId);
  }

  async createAIContent(content: InsertAIGeneratedContent): Promise<AIGeneratedContent> {
    const id = randomUUID();
    const newContent: AIGeneratedContent = {
      ...content,
      id,
      userId: content.userId || null,
      createdAt: new Date()
    };
    this.aiContent.set(id, newContent);
    return newContent;
  }

  // Working Hours methods
  async getWorkingHours(userId: string): Promise<WorkingHours | undefined> {
    return Array.from(this.workingHours.values()).find(wh => wh.userId === userId);
  }

  async setWorkingHours(workingHours: InsertWorkingHours): Promise<WorkingHours> {
    const existingWH = Array.from(this.workingHours.values()).find(wh => wh.userId === workingHours.userId);
    
    if (existingWH) {
      const updated: WorkingHours = { ...existingWH, ...workingHours };
      this.workingHours.set(existingWH.id, updated);
      return updated;
    } else {
      const id = randomUUID();
      const newWH: WorkingHours = { 
        ...workingHours, 
        id,
        userId: workingHours.userId || null,
        startTime: workingHours.startTime || '09:00',
        endTime: workingHours.endTime || '17:00',
        daysOfWeek: workingHours.daysOfWeek || [1,2,3,4,5],
        timezone: workingHours.timezone || 'UTC'
      };
      this.workingHours.set(id, newWH);
      return newWH;
    }
  }
}

export const storage = new MemStorage();
