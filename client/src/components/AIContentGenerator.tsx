import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Copy, RefreshCw, FileText, List, TestTube } from "lucide-react";
import type { AIGeneratedContent } from "@shared/types";

interface AIContentGeneratorProps {
  onGenerate?: (content: Omit<AIGeneratedContent, 'id' | 'createdAt'>) => void;
}

export default function AIContentGenerator({ onGenerate }: AIContentGeneratorProps) {
  const [inputText, setInputText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'user-story' | 'acceptance-criteria' | 'test-scenarios'>('user-story');
  const [generatedContent, setGeneratedContent] = useState<{[key: string]: string}>({});

  const contentTypes = [
    {
      id: 'user-story' as const,
      label: 'User Stories',
      icon: FileText,
      description: 'Generate user stories from requirements'
    },
    {
      id: 'acceptance-criteria' as const,
      label: 'Acceptance Criteria',
      icon: List,
      description: 'Create detailed acceptance criteria'
    },
    {
      id: 'test-scenarios' as const,
      label: 'Test Scenarios',
      icon: TestTube,
      description: 'Generate comprehensive test cases'
    }
  ];

  const handleGenerate = async (type: typeof activeTab) => {
    if (!inputText.trim()) return;
    
    setIsGenerating(true);
    console.log(`Generating ${type} content for:`, inputText);
    
    // Simulate AI generation
    setTimeout(() => {
      const mockContent = generateMockContent(type, inputText);
      setGeneratedContent(prev => ({
        ...prev,
        [type]: mockContent
      }));
      
      onGenerate?.({
        type,
        originalText: inputText,
        generatedContent: mockContent
      });
      
      setIsGenerating(false);
    }, 2000);
  };

  const generateMockContent = (type: typeof activeTab, input: string): string => {
    //todo: remove mock functionality
    switch (type) {
      case 'user-story':
        return `As a productivity-focused user, I want to ${input.toLowerCase()} so that I can manage my tasks more efficiently and meet my deadlines consistently.

**Background:**
Users need an intelligent system that understands their work patterns and optimizes their task scheduling automatically.

**Value Proposition:**
This feature will reduce manual planning time by 70% and improve task completion rates through AI-driven prioritization.`;

      case 'acceptance-criteria':
        return `**Given** that I have tasks requiring ${input.toLowerCase()}
**When** I interact with the AI-powered scheduling system
**Then** the following criteria must be met:

✅ The system analyzes task complexity and suggests realistic time estimates
✅ Priority levels are automatically assigned based on deadlines and dependencies
✅ Calendar integration allows drag-and-drop scheduling
✅ Progress tracking updates in real-time with visual indicators
✅ AI provides optimization suggestions when workload exceeds capacity
✅ All changes are saved automatically with rollback capabilities`;

      case 'test-scenarios':
        return `**Test Scenario 1: Basic Functionality**
- Input: "${input}"
- Expected: System processes request within 3 seconds
- Verify: Appropriate UI feedback is displayed

**Test Scenario 2: Edge Cases**
- Test with empty input
- Test with maximum character limit
- Test with special characters

**Test Scenario 3: Error Handling**  
- Network connection failure
- AI service unavailable
- Invalid response format

**Test Scenario 4: Performance**
- Load testing with 100+ concurrent requests
- Response time under 5 seconds
- Memory usage remains stable`;

      default:
        return 'Generated content will appear here...';
    }
  };

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    console.log('Content copied to clipboard');
  };

  return (
    <Card className="w-full" data-testid="ai-content-generator">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          AI Content Generator
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Input Text or Requirements</label>
          <Textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter your requirements, user needs, or feature description..."
            rows={4}
            data-testid="input-ai-content"
          />
        </div>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)}>
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 h-auto">
            {contentTypes.map((type) => (
              <TabsTrigger 
                key={type.id} 
                value={type.id}
                data-testid={`tab-${type.id}`}
                className="text-xs py-2 px-3 gap-1"
              >
                <type.icon className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">{type.label}</span>
                <span className="sm:hidden">{type.label.split(' ')[0]}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {contentTypes.map((type) => (
            <TabsContent key={type.id} value={type.id} className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{type.label}</h3>
                  <p className="text-sm text-muted-foreground">{type.description}</p>
                </div>
                <Button
                  onClick={() => handleGenerate(type.id)}
                  disabled={!inputText.trim() || isGenerating}
                  data-testid={`button-generate-${type.id}`}
                  className="gap-2"
                >
                  {isGenerating ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                  Generate
                </Button>
              </div>

              {generatedContent[type.id] && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="gap-1">
                      <type.icon className="w-3 h-3" />
                      Generated
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(generatedContent[type.id])}
                      data-testid={`button-copy-${type.id}`}
                      className="gap-1"
                    >
                      <Copy className="w-3 h-3" />
                      Copy
                    </Button>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-md border">
                    <pre className="text-sm whitespace-pre-wrap font-sans">
                      {generatedContent[type.id]}
                    </pre>
                  </div>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}