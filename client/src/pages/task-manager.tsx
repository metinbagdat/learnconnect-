import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { apiRequest, queryClient } from '@/lib/queryClient';

export default function TaskManager() {
  const [newTask, setNewTask] = useState({ title: '', subject: '', priority: 'medium' });

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['/api/tasks'],
  });

  const createTaskMutation = useMutation({
    mutationFn: (task) => apiRequest('POST', '/api/tasks', task),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
      setNewTask({ title: '', subject: '', priority: 'medium' });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: (id: string) => apiRequest('DELETE', `/api/tasks/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
    },
  });

  const completedTasks = tasks.filter((t: any) => t.completed);
  const pendingTasks = tasks.filter((t: any) => !t.completed);

  if (isLoading) {
    return <div className="flex items-center justify-center h-96"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-4">📋 Task Manager</h1>

        {/* Add Task */}
        <Card className="p-4 mb-6">
          <div className="flex gap-2">
            <Input
              placeholder="Task title..."
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              className="flex-1"
            />
            <select
              value={newTask.priority}
              onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
              className="px-2 border rounded"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <Button
              onClick={() => createTaskMutation.mutate(newTask)}
              disabled={!newTask.title || createTaskMutation.isPending}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </Card>

        {/* Tasks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pending */}
          <Card className="p-4">
            <h3 className="font-bold mb-3">📌 Pending ({pendingTasks.length})</h3>
            <div className="space-y-2">
              {pendingTasks.map((task: any) => (
                <div key={task.id} className="p-2 bg-slate-50 dark:bg-slate-900 rounded flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">{task.title}</p>
                    <Badge variant="outline" className="mt-1 text-xs">
                      {task.priority}
                    </Badge>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteTaskMutation.mutate(task.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </Card>

          {/* Completed */}
          <Card className="p-4">
            <h3 className="font-bold mb-3">✅ Completed ({completedTasks.length})</h3>
            <div className="space-y-2">
              {completedTasks.slice(0, 5).map((task: any) => (
                <div key={task.id} className="p-2 bg-green-50 dark:bg-green-950 rounded text-sm line-through">
                  {task.title}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
