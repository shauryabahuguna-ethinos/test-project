import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader
} from "@/components/ui/sidebar";
import { 
  Calendar,
  BarChart3,
  Plus,
  CheckSquare,
  Sparkles,
  Settings,
  User,
  Brain
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface AppSidebarProps {
  currentPage?: string;
  onNavigate?: (page: string) => void;
  onCreateTask?: () => void;
}

export default function AppSidebar({ 
  currentPage = "dashboard", 
  onNavigate,
  onCreateTask 
}: AppSidebarProps) {
  const menuItems = [
    {
      title: "Dashboard",
      url: "dashboard",
      icon: BarChart3,
      badge: null
    },
    {
      title: "Tasks",
      url: "tasks",
      icon: CheckSquare,
      badge: "23"
    },
    {
      title: "Calendar",
      url: "calendar",
      icon: Calendar,
      badge: null
    },
    {
      title: "AI Assistant",
      url: "ai",
      icon: Brain,
      badge: "New"
    }
  ];

  const bottomMenuItems = [
    {
      title: "Settings",
      url: "settings",
      icon: Settings
    },
    {
      title: "Profile",
      url: "profile", 
      icon: User
    }
  ];

  const handleNavigation = (page: string) => {
    onNavigate?.(page);
    console.log(`Navigating to ${page}`);
  };

  return (
    <Sidebar data-testid="app-sidebar">
      <SidebarHeader className="p-4 border-b">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-semibold text-sm">TaskMaster AI</h2>
            <p className="text-xs text-muted-foreground">Smart Productivity</p>
          </div>
        </div>
        <Button 
          onClick={onCreateTask}
          className="w-full gap-2"
          data-testid="button-create-task"
        >
          <Plus className="w-4 h-4" />
          New Task
        </Button>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    onClick={() => handleNavigation(item.url)}
                    className={`gap-2 ${currentPage === item.url ? 'bg-sidebar-accent' : ''}`}
                    data-testid={`nav-${item.url}`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.title}</span>
                    {item.badge && (
                      <Badge 
                        variant="secondary" 
                        className="ml-auto text-xs px-1.5 py-0"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              {bottomMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    onClick={() => handleNavigation(item.url)}
                    className={`gap-2 ${currentPage === item.url ? 'bg-sidebar-accent' : ''}`}
                    data-testid={`nav-${item.url}`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}