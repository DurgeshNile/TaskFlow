import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ListTodo,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Users,
  Calendar,
  Target
} from "lucide-react";

interface DashboardProps {
  userRole: "admin" | "manager" | "employee";
}

const mockStats = {
  admin: {
    totalTasks: 142,
    activeTasks: 89,
    completedTasks: 53,
    overdueTasks: 12,
    totalTeams: 8,
    activeMembers: 45,
    completionRate: 78
  },
  manager: {
    totalTasks: 35,
    activeTasks: 22,
    completedTasks: 13,
    overdueTasks: 3,
    teamMembers: 12,
    completionRate: 85
  },
  employee: {
    totalTasks: 8,
    activeTasks: 5,
    completedTasks: 3,
    overdueTasks: 1,
    completionRate: 75
  }
};

const mockRecentTasks = [
  {
    id: "1",
    title: "Update user interface design",
    status: "In Progress",
    priority: "High",
    assignee: "Sarah Chen",
    dueDate: "Today"
  },
  {
    id: "2",
    title: "Database optimization",
    status: "Review",
    priority: "Medium",
    assignee: "Mike Johnson",
    dueDate: "Tomorrow"
  },
  {
    id: "3",
    title: "Security audit report",
    status: "Done",
    priority: "High",
    assignee: "Emma Wilson",
    dueDate: "Yesterday"
  }
];

const mockUpcomingDeadlines = [
  { task: "API Documentation", dueDate: "Feb 15", priority: "High" },
  { task: "Mobile App Testing", dueDate: "Feb 18", priority: "Medium" },
  { task: "Performance Review", dueDate: "Feb 20", priority: "Low" }
];

export function Dashboard({ userRole }: DashboardProps) {
  const stats = mockStats[userRole];

  const StatCard = ({ title, value, icon: Icon, trend, color = "primary" }: any) => (
    <Card className="bg-gradient-card border-0 hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className={`h-4 w-4 text-${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        {trend && (
          <p className="text-xs text-muted-foreground">
            <span className="text-success">↗ {trend}%</span> from last month
          </p>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-foreground">
          {userRole === "admin" ? "Admin Dashboard" : 
           userRole === "manager" ? "Manager Dashboard" : 
           "My Dashboard"}
        </h2>
        <p className="text-muted-foreground">
          {userRole === "admin" ? "Overview of all enterprise activities" :
           userRole === "manager" ? "Manage your team and track progress" :
           "Track your tasks and productivity"}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Tasks"
          value={stats.totalTasks}
          icon={ListTodo}
          trend={12}
          color="primary"
        />
        <StatCard
          title="Active Tasks"
          value={stats.activeTasks}
          icon={Clock}
          trend={8}
          color="warning"
        />
        <StatCard
          title="Completed"
          value={stats.completedTasks}
          icon={CheckCircle}
          trend={15}
          color="success"
        />
        <StatCard
          title="Overdue"
          value={stats.overdueTasks}
          icon={AlertTriangle}
          trend={-5}
          color="destructive"
        />
      </div>

      {/* Additional Stats for Admins and Managers */}
      {(userRole === "admin" || userRole === "manager") && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {userRole === "admin" && (
            <>
              <StatCard
                title="Active Teams"
                value={(stats as any).totalTeams}
                icon={Users}
                trend={5}
                color="primary"
              />
              <StatCard
                title="Team Members"
                value={(stats as any).activeMembers}
                icon={Target}
                trend={3}
                color="primary"
              />
            </>
          )}
          {userRole === "manager" && (
            <StatCard
              title="Team Members"
              value={(stats as any).teamMembers}
              icon={Users}
              trend={0}
              color="primary"
            />
          )}
          <Card className="bg-gradient-card border-0">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Completion Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-foreground">
                    {stats.completionRate}%
                  </span>
                  <TrendingUp className="h-4 w-4 text-success" />
                </div>
                <Progress value={stats.completionRate} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  <span className="text-success">↗ 5%</span> from last month
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Content Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Tasks */}
        <Card className="bg-gradient-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ListTodo className="h-5 w-5" />
              Recent Tasks
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockRecentTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div className="space-y-1">
                  <p className="font-medium text-sm text-foreground">{task.title}</p>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={task.status === "Done" ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {task.status}
                    </Badge>
                    <Badge 
                      variant={task.priority === "High" ? "destructive" : "outline"}
                      className="text-xs"
                    >
                      {task.priority}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">{task.assignee}</p>
                  <p className="text-xs text-muted-foreground">{task.dueDate}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Upcoming Deadlines */}
        <Card className="bg-gradient-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Deadlines
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockUpcomingDeadlines.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div className="space-y-1">
                  <p className="font-medium text-sm text-foreground">{item.task}</p>
                  <Badge 
                    variant={item.priority === "High" ? "destructive" : 
                            item.priority === "Medium" ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {item.priority}
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-foreground">{item.dueDate}</p>
                  <p className="text-xs text-muted-foreground">Due date</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Team Performance Chart - Only for Admins and Managers */}
      {(userRole === "admin" || userRole === "manager") && (
        <Card className="bg-gradient-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Team Performance Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-lg bg-primary/5">
                  <div className="text-2xl font-bold text-primary">92%</div>
                  <div className="text-sm text-muted-foreground">On-time Delivery</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-success/5">
                  <div className="text-2xl font-bold text-success">87%</div>
                  <div className="text-sm text-muted-foreground">Quality Score</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-warning/5">
                  <div className="text-2xl font-bold text-warning">4.8</div>
                  <div className="text-sm text-muted-foreground">Team Satisfaction</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}