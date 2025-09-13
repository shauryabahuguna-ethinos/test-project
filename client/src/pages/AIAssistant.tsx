import AIContentGenerator from "@/components/AIContentGenerator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, Sparkles, Zap, Target, Clock, FileText } from "lucide-react";
import type { AIGeneratedContent } from "@shared/schema";

export default function AIAssistant() {
  const handleContentGeneration = (content: Omit<AIGeneratedContent, 'id' | 'createdAt'>) => {
    console.log('AI Content generated:', content);
  };

  //todo: remove mock functionality
  const aiInsights = [
    {
      icon: Target,
      title: "Productivity Optimization",
      description: "Your most productive hours are 9-11 AM. Schedule critical tasks during this window.",
      action: "Optimize Schedule",
      type: "suggestion"
    },
    {
      icon: Clock,
      title: "Time Estimation Accuracy",
      description: "You tend to underestimate design tasks by 25%. I'll adjust future estimates.",
      action: "Update Estimates", 
      type: "learning"
    },
    {
      icon: Zap,
      title: "Task Dependencies",
      description: "3 tasks are blocked waiting for 'API Documentation'. Consider prioritizing it.",
      action: "Reorder Tasks",
      type: "warning"
    }
  ];

  const recentGenerated = [
    {
      type: 'user-story',
      title: 'User authentication flow',
      generatedAt: '2 hours ago'
    },
    {
      type: 'acceptance-criteria', 
      title: 'Dashboard analytics',
      generatedAt: '1 day ago'
    },
    {
      type: 'test-scenarios',
      title: 'Task scheduling algorithm',
      generatedAt: '2 days ago'
    }
  ];

  return (
    <div className="space-y-6" data-testid="ai-assistant-page">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
            <Brain className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
            AI Assistant
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">Get intelligent insights and generate content for your projects.</p>
        </div>
      </div>

      {/* AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {aiInsights.map((insight, index) => (
          <Card key={index} className="hover-elevate">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <insight.icon className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-sm">{insight.title}</h3>
                </div>
                <Badge 
                  variant={insight.type === 'warning' ? 'destructive' : 'outline'}
                  className="text-xs"
                >
                  {insight.type}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">{insight.description}</p>
              <Button 
                size="sm" 
                variant="outline" 
                className="w-full"
                onClick={() => console.log(`Executing: ${insight.action}`)}
                data-testid={`button-${insight.action.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {insight.action}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        {/* Content Generator */}
        <div className="xl:col-span-2">
          <AIContentGenerator onGenerate={handleContentGeneration} />
        </div>

        {/* Recent Activity & Quick Actions */}
        <div className="space-y-4 sm:space-y-6">
          {/* Recent Generated Content */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Recent Generated Content
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentGenerated.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-2 hover-elevate rounded cursor-pointer">
                  <div className="flex-1">
                    <div className="font-medium text-sm capitalize">
                      {item.type.replace('-', ' ')}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {item.title}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {item.generatedAt}
                  </div>
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full mt-3">
                View All Generated Content
              </Button>
            </CardContent>
          </Card>

          {/* Quick AI Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Quick AI Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start gap-2"
                onClick={() => console.log('Optimize schedule triggered')}
                data-testid="button-optimize-schedule"
              >
                <Zap className="w-4 h-4" />
                Optimize Today's Schedule
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start gap-2"
                onClick={() => console.log('Analyze patterns triggered')}
                data-testid="button-analyze-patterns"
              >
                <Brain className="w-4 h-4" />
                Analyze Productivity Patterns
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start gap-2"
                onClick={() => console.log('Generate insights triggered')}
                data-testid="button-generate-insights"
              >
                <Target className="w-4 h-4" />
                Generate Weekly Insights
              </Button>
            </CardContent>
          </Card>

          {/* AI Learning Progress */}
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Brain className="w-4 h-4 text-primary" />
                AI Learning Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Pattern Recognition</span>
                  <span className="font-medium">87%</span>
                </div>
                <div className="w-full bg-primary/20 rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full w-[87%]"></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Personalization</span>
                  <span className="font-medium">73%</span>
                </div>
                <div className="w-full bg-primary/20 rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full w-[73%]"></div>
                </div>
              </div>

              <p className="text-xs text-muted-foreground mt-3">
                The AI continues learning from your task patterns to provide better recommendations.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}