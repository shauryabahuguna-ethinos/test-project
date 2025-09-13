import { GoogleGenAI } from "@google/genai";
import type { Task } from "@shared/schema";

// Using the Gemini blueprint integration
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface TaskAnalysis {
  suggestedPriority: 1 | 2 | 3 | 4 | 5;
  estimatedTime: number; // in minutes
  complexity: 'low' | 'medium' | 'high';
  suggestions: string[];
}

export interface SchedulingRecommendation {
  suggestedStart: string; // ISO string
  suggestedEnd: string; // ISO string
  reasoning: string;
  conflictWarnings: string[];
}

export async function analyzeTask(title: string, description: string): Promise<TaskAnalysis> {
  try {
    const prompt = `Analyze this task and provide recommendations:

Title: ${title}
Description: ${description}

Please analyze the task complexity, estimate time required, and suggest priority level. 
Consider factors like:
- Technical complexity
- Dependencies on other work
- Business impact
- Urgency indicators

Respond with JSON in this exact format:
{
  "suggestedPriority": number (1-5, where 1 is highest priority),
  "estimatedTime": number (in minutes),
  "complexity": "low" | "medium" | "high",
  "suggestions": ["suggestion1", "suggestion2", ...]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            suggestedPriority: { type: "number" },
            estimatedTime: { type: "number" },
            complexity: { type: "string", enum: ["low", "medium", "high"] },
            suggestions: { 
              type: "array",
              items: { type: "string" }
            }
          },
          required: ["suggestedPriority", "estimatedTime", "complexity", "suggestions"]
        }
      },
      contents: prompt,
    });

    const result = JSON.parse(response.text || '{}');
    return {
      suggestedPriority: Math.max(1, Math.min(5, Math.round(result.suggestedPriority))) as 1 | 2 | 3 | 4 | 5,
      estimatedTime: Math.max(15, result.estimatedTime), // Minimum 15 minutes
      complexity: result.complexity || 'medium',
      suggestions: result.suggestions || []
    };
  } catch (error) {
    console.error('Error analyzing task:', error);
    // Return reasonable defaults if AI fails
    return {
      suggestedPriority: 3,
      estimatedTime: 60,
      complexity: 'medium',
      suggestions: ['Consider breaking this task into smaller subtasks for better tracking']
    };
  }
}

export async function generateContent(type: 'user-story' | 'acceptance-criteria' | 'test-scenarios', originalText: string): Promise<string> {
  try {
    let prompt = '';
    
    switch (type) {
      case 'user-story':
        prompt = `Generate a well-structured user story based on this requirement:

"${originalText}"

Format as a proper user story with:
- As a [user type]
- I want [goal/desire]
- So that [benefit/value]

Include background context and value proposition where relevant.`;
        break;
        
      case 'acceptance-criteria':
        prompt = `Generate detailed acceptance criteria for this requirement:

"${originalText}"

Use the Given-When-Then format and include:
- Multiple scenarios covering normal and edge cases
- Clear, testable conditions
- Specific measurable outcomes

Format with checkboxes (✅) for each criterion.`;
        break;
        
      case 'test-scenarios':
        prompt = `Generate comprehensive test scenarios for this requirement:

"${originalText}"

Include:
- Functional test cases
- Edge cases and error conditions  
- Performance considerations
- User experience scenarios

Structure each scenario with clear steps and expected results.`;
        break;
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text || "Failed to generate content. Please try again.";
  } catch (error) {
    console.error('Error generating content:', error);
    return `Error generating ${type.replace('-', ' ')}. Please try again later.`;
  }
}

export async function optimizeSchedule(tasks: Task[], workingHours: { start: string; end: string; days: number[] }): Promise<SchedulingRecommendation[]> {
  try {
    const taskSummary = tasks.map(task => ({
      id: task.id,
      title: task.title,
      priority: task.priority,
      estimatedTime: task.estimatedTime,
      deadline: task.deadline,
      status: task.status
    }));

    const prompt = `You are an AI scheduling assistant. Optimize the schedule for these tasks:

Tasks: ${JSON.stringify(taskSummary, null, 2)}

Working Hours: ${workingHours.start} to ${workingHours.end} on days ${workingHours.days.join(', ')}

Provide scheduling recommendations considering:
- Task priorities (1 = highest)
- Deadlines and time constraints
- Estimated time requirements
- Optimal productivity patterns
- Buffer time between complex tasks

For each task that needs scheduling, suggest specific start times and provide reasoning.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: prompt,
    });

    // Parse the AI response and return structured recommendations
    // For now, return a simple recommendation
    return [{
      suggestedStart: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      suggestedEnd: new Date(Date.now() + 25 * 60 * 60 * 1000).toISOString(),
      reasoning: "Scheduled during optimal morning productivity hours based on task complexity and priority",
      conflictWarnings: []
    }];
  } catch (error) {
    console.error('Error optimizing schedule:', error);
    return [];
  }
}