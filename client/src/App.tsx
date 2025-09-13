import { useState } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import ThemeToggle from "@/components/ThemeToggle";
import NotFound from "@/pages/not-found";

// Import pages
import Dashboard from "@/pages/Dashboard";
import Tasks from "@/pages/Tasks";
import Calendar from "@/pages/Calendar";
import AIAssistant from "@/pages/AIAssistant";

function Router({ currentPage, onNavigate, onCreateTask }: {
  currentPage: string;
  onNavigate: (page: string) => void;
  onCreateTask: () => void;
}) {
  return (
    <Switch>
      <Route path="/" component={() => <Dashboard onCreateTask={onCreateTask} onNavigate={onNavigate} />} />
      <Route path="/dashboard" component={() => <Dashboard onCreateTask={onCreateTask} onNavigate={onNavigate} />} />
      <Route path="/tasks" component={() => <Tasks />} />
      <Route path="/calendar" component={() => <Calendar />} />
      <Route path="/ai" component={() => <AIAssistant />} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [currentPage, setCurrentPage] = useState("dashboard");

  const handleNavigation = (page: string) => {
    setCurrentPage(page);
    // Update URL without page reload
    window.history.pushState({}, '', `/${page === 'dashboard' ? '' : page}`);
  };

  const handleCreateTask = () => {
    setCurrentPage("tasks");
    window.history.pushState({}, '', '/tasks');
    console.log('Navigating to tasks for creation');
  };

  // Custom sidebar width for the task management app
  const sidebarStyle = {
    "--sidebar-width": "20rem",       // 320px for better content organization
    "--sidebar-width-icon": "4rem",   // default icon width
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SidebarProvider style={sidebarStyle as React.CSSProperties}>
          <div className="flex h-screen w-full">
            <AppSidebar 
              currentPage={currentPage}
              onNavigate={handleNavigation}
              onCreateTask={handleCreateTask}
            />
            <div className="flex flex-col flex-1">
              {/* Header */}
              <header className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <SidebarTrigger data-testid="button-sidebar-toggle" />
                <div className="flex items-center gap-2">
                  <ThemeToggle />
                </div>
              </header>
              
              {/* Main Content */}
              <main className="flex-1 overflow-auto p-6 bg-background">
                <Router 
                  currentPage={currentPage} 
                  onNavigate={handleNavigation}
                  onCreateTask={handleCreateTask}
                />
              </main>
            </div>
          </div>
        </SidebarProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;