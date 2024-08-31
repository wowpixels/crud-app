'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formSchema } from '@/app/tasks/schema';

import { useToast } from '@/components/ui/use-toast';
import { z } from 'zod';
import { Skeleton } from '@/components/ui/skeleton';
import { useAddTask } from './hooks/useAddTask';
import { useGetTasks } from './hooks/useGetTasks';
import { useDeleteTask } from './hooks/useDeleteTask';
import { useUpdateTask } from './hooks/useUpdateTask';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';

export default function TasksPage() {
  const queryClient = useQueryClient();
  const [newTask, setNewTask] = useState<{
    title: string;
    description: string;
    id?: number;
  }>({ title: '', description: '' });
  const { toast } = useToast();

  // Mutations hooks
  const addTask = useAddTask();
  const fetchTasks = useGetTasks();
  const deleteTask = useDeleteTask();
  const updateTask = useUpdateTask();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  });

  const {
    data: tasks,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ['taskList'],
    queryFn: fetchTasks,
  });

  const addMutation = useMutation({
    mutationFn: addTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskList'] });
      toast({
        title: 'Success!',
        description: 'Task added successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error!',
        description: `Failed to add task: ${error.message}`,
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskList'] });
      toast({
        title: 'Deleted!',
        description: 'Task deleted successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error!',
        description: `Failed to delete task: ${error.message}`,
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskList'] });
      toast({
        title: 'Updated!',
        description: 'Task updated successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error!',
        description: `Failed to update task: ${error.message}`,
      });
    },
  });

  const onEdit = (task: { id: number; title: string; description: string }) => {
    form.setValue('title', task.title);
    form.setValue('description', task.description);
    setNewTask({
      id: task.id,
      title: task.title,
      description: task.description,
    });
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (newTask.id) {
      // Update existing task
      await updateMutation.mutateAsync({
        ...values,
        id: newTask.id,
        completed: false,
      });
    } else {
      // Add new task
      await addMutation.mutateAsync(values);
    }
    setNewTask({ title: '', description: '', id: undefined });
    form.reset();
  };

  const onRemove = async (idToRemove: number) => {
    await deleteMutation.mutateAsync(idToRemove);
  };

  const onToggleCompleted = async (task: {
    id: number;
    title: string;
    description: string;
    completed: boolean;
  }) => {
    await updateMutation.mutateAsync({
      id: task.id,
      title: task.title,
      description: task.description,
      completed: !task.completed, // Toggle the completed status
    });
  };

  if (isLoading)
    return (
      <div className="p-10 max-w-lg mx-auto flex space-y-3 flex-col">
        <Skeleton className="w-full h-[325px] rounded-medium" />
        <Skeleton className="w-48 h-[40px] rounded-2xl" />
        <Skeleton className="w-full h-[100px] rounded-2xl" />
      </div>
    );

  return (
    <div className="p-10 max-w-lg mx-auto">
      <TaskForm form={form} onSubmit={onSubmit} newTask={newTask} />
      <TaskList
        tasks={tasks}
        onToggleCompleted={onToggleCompleted}
        onRemove={onRemove}
        onEdit={onEdit}
      />

      <TaskList
        tasks={tasks}
        onToggleCompleted={onToggleCompleted}
        onRemove={onRemove}
        onEdit={onEdit}
        isCompleted
      />
    </div>
  );
}
