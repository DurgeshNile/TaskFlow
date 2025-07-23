import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: "todo" | "progress" | "review" | "done";
  priority: "low" | "medium" | "high" | "urgent";
  assignee_id: string | null;
  created_by: string;
  due_date: string | null;
  tags: string[];
  created_at: string;
  updated_at: string;
  assignee?: {
    id: string;
    full_name: string | null;
    email: string;
  };
  creator?: {
    id: string;
    full_name: string | null;
    email: string;
  };
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from("tasks")
        .select(`
          *,
          assignee:assignee_id(id, full_name, email),
          creator:created_by(id, full_name, email)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTasks((data || []) as unknown as Task[]);
    } catch (error: any) {
      toast({
        title: "Error loading tasks",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const createTask = async (taskData: {
    title: string;
    description?: string;
    status: "todo" | "progress" | "review" | "done";
    priority: "low" | "medium" | "high" | "urgent";
    assignee_id?: string;
    due_date?: string;
    tags?: string[];
  }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const insertData = {
        ...taskData,
        created_by: user.id
      };

      const { data, error } = await supabase
        .from("tasks")
        .insert([insertData])
        .select(`
          *,
          assignee:assignee_id(id, full_name, email),
          creator:created_by(id, full_name, email)
        `)
        .single();

      if (error) throw error;

      setTasks(prev => [data as unknown as Task, ...prev]);
      toast({
        title: "Task created successfully",
        description: `"${taskData.title}" has been created.`
      });

      return data;
    } catch (error: any) {
      toast({
        title: "Error creating task",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      const { data, error } = await supabase
        .from("tasks")
        .update(updates)
        .eq("id", taskId)
        .select(`
          *,
          assignee:assignee_id(id, full_name, email),
          creator:created_by(id, full_name, email)
        `)
        .single();

      if (error) throw error;

      setTasks(prev => prev.map(task => 
        task.id === taskId ? data as unknown as Task : task
      ));

      toast({
        title: "Task updated successfully",
        description: "Task has been updated."
      });

      return data;
    } catch (error: any) {
      toast({
        title: "Error updating task",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from("tasks")
        .delete()
        .eq("id", taskId);

      if (error) throw error;

      setTasks(prev => prev.filter(task => task.id !== taskId));
      toast({
        title: "Task deleted successfully",
        description: "Task has been removed."
      });
    } catch (error: any) {
      toast({
        title: "Error deleting task",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }
  };

  return {
    tasks,
    loading,
    createTask,
    updateTask,
    deleteTask,
    refetchTasks: fetchTasks
  };
}