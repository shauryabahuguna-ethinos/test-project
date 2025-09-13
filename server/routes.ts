import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTaskSchema, insertAiContentSchema } from "@shared/schema";
import { analyzeTask, generateContent } from "./gemini";

export async function registerRoutes(app: Express): Promise<Server> {
  // For demo purposes, we'll use a mock user ID
  // In a real app, this would come from authentication middleware
  const DEMO_USER_ID = "demo-user";

  // Ensure demo user exists
  const existingUser = await storage.getUserByUsername("demo");
  if (!existingUser) {
    await storage.createUser({ username: "demo", password: "demo" });
  }

  // Task routes
  app.get("/api/tasks", async (req, res) => {
    try {
      const { status, startDate, endDate } = req.query;
      
      let tasks;
      if (status && status !== 'all') {
        tasks = await storage.getTasksByStatus(DEMO_USER_ID, status as string);
      } else if (startDate && endDate) {
        tasks = await storage.getTasksByDateRange(
          DEMO_USER_ID, 
          new Date(startDate as string), 
          new Date(endDate as string)
        );
      } else {
        tasks = await storage.getTasks(DEMO_USER_ID);
      }
      
      res.json(tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      res.status(500).json({ error: "Failed to fetch tasks" });
    }
  });

  app.get("/api/tasks/:id", async (req, res) => {
    try {
      const task = await storage.getTask(req.params.id);
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }
      res.json(task);
    } catch (error) {
      console.error("Error fetching task:", error);
      res.status(500).json({ error: "Failed to fetch task" });
    }
  });

  app.post("/api/tasks", async (req, res) => {
    try {
      // Validate request body
      const taskData = insertTaskSchema.parse({
        ...req.body,
        userId: DEMO_USER_ID
      });

      // Get AI analysis if title and description are provided
      let aiAnalysis = null;
      if (taskData.title && taskData.description) {
        aiAnalysis = await analyzeTask(taskData.title, taskData.description);
        
        // Apply AI suggestions if user hasn't set priority/time
        if (!req.body.priority) {
          taskData.priority = aiAnalysis.suggestedPriority;
        }
        if (!req.body.estimatedTime) {
          taskData.estimatedTime = aiAnalysis.estimatedTime;
        }
      }

      const task = await storage.createTask(taskData);
      
      res.json({ 
        task, 
        aiAnalysis: aiAnalysis ? {
          suggestions: aiAnalysis.suggestions,
          complexity: aiAnalysis.complexity
        } : null 
      });
    } catch (error) {
      console.error("Error creating task:", error);
      res.status(500).json({ error: "Failed to create task" });
    }
  });

  app.put("/api/tasks/:id", async (req, res) => {
    try {
      const updates = insertTaskSchema.partial().parse(req.body);
      const task = await storage.updateTask(req.params.id, updates);
      
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }
      
      res.json(task);
    } catch (error) {
      console.error("Error updating task:", error);
      res.status(500).json({ error: "Failed to update task" });
    }
  });

  app.delete("/api/tasks/:id", async (req, res) => {
    try {
      const success = await storage.deleteTask(req.params.id);
      
      if (!success) {
        return res.status(404).json({ error: "Task not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting task:", error);
      res.status(500).json({ error: "Failed to delete task" });
    }
  });

  // AI Content Generation routes
  app.post("/api/ai/generate", async (req, res) => {
    try {
      const { type, originalText } = req.body;
      
      if (!type || !originalText) {
        return res.status(400).json({ error: "Type and originalText are required" });
      }

      if (!['user-story', 'acceptance-criteria', 'test-scenarios'].includes(type)) {
        return res.status(400).json({ error: "Invalid content type" });
      }

      const generatedContent = await generateContent(type, originalText);
      
      // Save to storage
      const contentData = insertAiContentSchema.parse({
        userId: DEMO_USER_ID,
        type,
        originalText,
        generatedContent
      });
      
      const savedContent = await storage.createAIContent(contentData);
      
      res.json(savedContent);
    } catch (error) {
      console.error("Error generating AI content:", error);
      res.status(500).json({ error: "Failed to generate content" });
    }
  });

  app.get("/api/ai/content", async (req, res) => {
    try {
      const content = await storage.getAIContent(DEMO_USER_ID);
      res.json(content);
    } catch (error) {
      console.error("Error fetching AI content:", error);
      res.status(500).json({ error: "Failed to fetch AI content" });
    }
  });

  // Task analysis route
  app.post("/api/ai/analyze-task", async (req, res) => {
    try {
      const { title, description } = req.body;
      
      if (!title) {
        return res.status(400).json({ error: "Title is required" });
      }

      const analysis = await analyzeTask(title, description || "");
      res.json(analysis);
    } catch (error) {
      console.error("Error analyzing task:", error);
      res.status(500).json({ error: "Failed to analyze task" });
    }
  });

  // Analytics routes
  app.get("/api/analytics", async (req, res) => {
    try {
      const tasks = await storage.getTasks(DEMO_USER_ID);
      
      const analytics = {
        totalTasks: tasks.length,
        completedTasks: tasks.filter(t => t.status === 'completed').length,
        inProgressTasks: tasks.filter(t => t.status === 'in-progress').length,
        overdueTasks: tasks.filter(t => t.status === 'overdue').length,
        averageCompletionTime: tasks
          .filter(t => t.actualTime)
          .reduce((sum, t) => sum + (t.actualTime || 0), 0) / 
          tasks.filter(t => t.actualTime).length || 0,
        accuracyRate: calculateAccuracyRate(tasks),
        productivityScore: calculateProductivityScore(tasks)
      };
      
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}

// Helper functions for analytics
function calculateAccuracyRate(tasks: any[]): number {
  const tasksWithBothTimes = tasks.filter(t => t.estimatedTime && t.actualTime);
  if (tasksWithBothTimes.length === 0) return 0;
  
  const accurateEstimates = tasksWithBothTimes.filter(t => {
    const ratio = t.actualTime / t.estimatedTime;
    return ratio >= 0.8 && ratio <= 1.2; // Within 20% is considered accurate
  });
  
  return Math.round((accurateEstimates.length / tasksWithBothTimes.length) * 100);
}

function calculateProductivityScore(tasks: any[]): number {
  const completedTasks = tasks.filter(t => t.status === 'completed');
  const totalTasks = tasks.length;
  
  if (totalTasks === 0) return 0;
  
  const completionRate = completedTasks.length / totalTasks;
  const onTimeCompletions = completedTasks.filter(t => 
    !t.deadline || new Date(t.updatedAt) <= new Date(t.deadline)
  ).length;
  
  const onTimeRate = completedTasks.length > 0 ? onTimeCompletions / completedTasks.length : 0;
  
  return Math.round((completionRate * 0.6 + onTimeRate * 0.4) * 100);
}
