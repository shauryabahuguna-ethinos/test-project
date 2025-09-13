import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Filter, 
  SortAsc, 
  LayoutGrid, 
  List,
  Plus
} from "lucide-react";
import TaskCard from "./TaskCard";
import type { Task } from "@shared/schema";

interface TaskListProps {
  tasks?: Task[];
  onTaskEdit?: (task: Task) => void;
  onTaskDelete?: (taskId: string) => void;
  onTaskStatusChange?: (taskId: string, status: Task['status']) => void;
  onCreateTask?: () => void;
}

export default function TaskList({
  tasks = [],
  onTaskEdit,
  onTaskDelete,
  onTaskStatusChange,
  onCreateTask
}: TaskListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | Task['status']>("all");
  const [filterPriority, setFilterPriority] = useState<"all" | "1" | "2" | "3" | "4" | "5">("all");
  const [sortBy, setSortBy] = useState<"priority" | "deadline" | "created" | "progress">("priority");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "in-progress" | "completed">("all");

  //todo: remove mock functionality
  const mockTasks: Task[] = tasks.length > 0 ? tasks : [
    {
      id: "1",
      title: "Implement AI-powered task scheduling",
      description: "Create intelligent scheduling algorithm with machine learning capabilities",
      priority: 1,
      estimatedTime: 240,
      actualTime: 180,
      deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      progress: 65,
      status: 'in-progress',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      updatedAt: new Date()
    },
    {
      id: "2", 
      title: "Design calendar integration interface",
      description: "Create user-friendly calendar view with drag-and-drop functionality",
      priority: 2,
      estimatedTime: 180,
      deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      progress: 30,
      status: 'pending',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      updatedAt: new Date()
    },
    {
      id: "3",
      title: "Set up analytics dashboard", 
      description: "Build comprehensive analytics with task completion metrics",
      priority: 3,
      estimatedTime: 120,
      progress: 100,
      status: 'completed',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      updatedAt: new Date()
    },
    {
      id: "4",
      title: "Write API documentation",
      description: "Document all endpoints and integration procedures",
      priority: 4,
      estimatedTime: 90,
      deadline: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      progress: 15,
      status: 'overdue',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      updatedAt: new Date()
    }
  ];

  const filteredTasks = mockTasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = activeTab === "all" || task.status === activeTab;
    const matchesPriority = filterPriority === "all" || task.priority.toString() === filterPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    switch (sortBy) {
      case "priority":
        return a.priority - b.priority;
      case "deadline":
        if (!a.deadline && !b.deadline) return 0;
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return a.deadline.getTime() - b.deadline.getTime();
      case "created":
        return b.createdAt.getTime() - a.createdAt.getTime();
      case "progress":
        return b.progress - a.progress;
      default:
        return 0;
    }
  });

  const getTaskCountByStatus = (status: string) => {
    if (status === "all") return mockTasks.length;
    return mockTasks.filter(task => task.status === status).length;
  };

  return (
    <div className="space-y-4" data-testid="task-list">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Tasks</h2>
        <Button onClick={onCreateTask} data-testid="button-create-task-list" className="gap-2">
          <Plus className="w-4 h-4" />
          New Task
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  data-testid="input-search-tasks"
                />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Select value={filterPriority} onValueChange={(value) => setFilterPriority(value as any)}>
                <SelectTrigger className="w-full sm:w-32" data-testid="select-filter-priority">
                  <Filter className="w-4 h-4 mr-1" />
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="1">Critical</SelectItem>
                  <SelectItem value="2">High</SelectItem>
                  <SelectItem value="3">Medium</SelectItem>
                  <SelectItem value="4">Low</SelectItem>
                  <SelectItem value="5">Minimal</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
                <SelectTrigger className="w-full sm:w-32" data-testid="select-sort-by">
                  <SortAsc className="w-4 h-4 mr-1" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="priority">Priority</SelectItem>
                  <SelectItem value="deadline">Deadline</SelectItem>
                  <SelectItem value="created">Created</SelectItem>
                  <SelectItem value="progress">Progress</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                  data-testid="button-view-grid"
                  className="rounded-none rounded-l-md"
                >
                  <LayoutGrid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                  data-testid="button-view-list"
                  className="rounded-none rounded-r-md"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Task Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all" data-testid="tab-all-tasks" className="gap-2">
            All <Badge variant="secondary">{getTaskCountByStatus("all")}</Badge>
          </TabsTrigger>
          <TabsTrigger value="pending" data-testid="tab-pending-tasks" className="gap-2">
            Pending <Badge variant="secondary">{getTaskCountByStatus("pending")}</Badge>
          </TabsTrigger>
          <TabsTrigger value="in-progress" data-testid="tab-progress-tasks" className="gap-2">
            In Progress <Badge variant="secondary">{getTaskCountByStatus("in-progress")}</Badge>
          </TabsTrigger>
          <TabsTrigger value="completed" data-testid="tab-completed-tasks" className="gap-2">
            Completed <Badge variant="secondary">{getTaskCountByStatus("completed")}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          {sortedTasks.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="text-muted-foreground mb-4">
                  {searchQuery ? "No tasks found matching your search." : "No tasks found."}
                </div>
                {onCreateTask && (
                  <Button onClick={onCreateTask} data-testid="button-create-first-task">
                    Create your first task
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className={
              viewMode === "grid" 
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4"
                : "space-y-3"
            }>
              {sortedTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={onTaskEdit}
                  onDelete={onTaskDelete}
                  onStatusChange={onTaskStatusChange}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}