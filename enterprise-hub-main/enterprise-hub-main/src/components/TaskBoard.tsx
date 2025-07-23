import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, MoreHorizontal, Calendar, User, Flag, Trash2 } from "lucide-react";
import { TaskModal } from "./TaskModal";
import { useTasks, Task } from "@/hooks/useTasks";
import { useAuth } from "@/hooks/useAuth";


const statusConfig = {
  todo: { label: "To Do", color: "bg-muted" },
  progress: { label: "In Progress", color: "bg-primary/10" },
  review: { label: "In Review", color: "bg-warning/10" },
  done: { label: "Done", color: "bg-success/10" }
};

const priorityConfig = {
  low: { label: "Low", color: "bg-muted text-muted-foreground" },
  medium: { label: "Medium", color: "bg-primary/10 text-primary" },
  high: { label: "High", color: "bg-warning/10 text-warning" },
  urgent: { label: "Urgent", color: "bg-destructive/10 text-destructive" }
};

interface TaskBoardProps {
  userRole: "admin" | "manager" | "employee";
}

export function TaskBoard({ userRole }: TaskBoardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<Task["status"]>("todo");
  const { tasks, loading, deleteTask } = useTasks();
  const { profile } = useAuth();

  const getTasksByStatus = (status: Task["status"]) => {
    return tasks.filter(task => task.status === status);
  };

  const handleDeleteTask = async (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this task?")) {
      await deleteTask(taskId);
    }
  };

  const canDeleteTask = (task: Task) => {
    return userRole === "admin" || 
           userRole === "manager" || 
           task.created_by === profile?.id;
  };

  const handleCreateTask = (status: Task["status"]) => {
    setSelectedStatus(status);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Project Board</h2>
          <p className="text-muted-foreground">Manage and track your team's tasks</p>
        </div>
        {(userRole === "admin" || userRole === "manager") && (
          <Button variant="enterprise" onClick={() => handleCreateTask("todo")}>
            <Plus className="h-4 w-4" />
            New Task
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(statusConfig).map(([status, config]) => (
          <div key={status} className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${config.color}`} />
                <h3 className="font-semibold text-foreground">{config.label}</h3>
                <Badge variant="secondary" className="text-xs">
                  {getTasksByStatus(status as Task["status"]).length}
                </Badge>
              </div>
              {(userRole === "admin" || userRole === "manager") && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleCreateTask(status as Task["status"])}
                  className="h-8 w-8"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="space-y-3">
              {getTasksByStatus(status as Task["status"]).map((task) => (
                <Card key={task.id} className="cursor-pointer hover:shadow-md transition-shadow bg-gradient-card border-0">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                  <CardTitle className="text-sm font-medium text-foreground line-clamp-2">
                    {task.title}
                  </CardTitle>
                  <div className="flex gap-1">
                    {canDeleteTask(task) && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 text-destructive hover:text-destructive"
                        onClick={(e) => handleDeleteTask(task.id, e)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {task.description}
                    </p>
                    
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${priorityConfig[task.priority].color}`}
                      >
                        <Flag className="h-3 w-3 mr-1" />
                        {priorityConfig[task.priority].label}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {task.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-2">
                        {task.assignee ? (
                          <>
                            <Avatar className="h-6 w-6">
                              <AvatarImage src="" />
                              <AvatarFallback className="text-xs">
                                {task.assignee.full_name ? 
                                  task.assignee.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) :
                                  task.assignee.email.slice(0, 2).toUpperCase()
                                }
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs text-muted-foreground">
                              {task.assignee.full_name || task.assignee.email}
                            </span>
                          </>
                        ) : (
                          <span className="text-xs text-muted-foreground">Unassigned</span>
                        )}
                      </div>
                      {task.due_date && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {new Date(task.due_date).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      <TaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        defaultStatus={selectedStatus}
        userRole={userRole}
      />
    </div>
  );
}