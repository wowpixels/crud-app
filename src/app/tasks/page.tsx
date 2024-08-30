'use client';

import { Button } from '@/components/ui/button';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formSchema } from '@/app/tasks/schema';
import dayjs from 'dayjs'; // Import dayjs
import { FaRegTrashCan, FaPencil } from 'react-icons/fa6';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { z } from 'zod';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';

type Task = {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  created_at: string;
};

async function fetchTasks() {
  const res = await fetch('/api/tasks');
  if (!res.ok) {
    throw new Error('Failed to fetch tasks');
  }
  return res.json();
}

async function addTask(newTask: { title: string; description: string }) {
  const res = await fetch('/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newTask),
  });
  return res.json();
}

async function deleteTask(taskId: number) {
  const res = await fetch(`/api/tasks/${taskId}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    throw new Error('Failed to delete task');
  }

  return res.json();
}

async function updateTask(updatedTask: {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}) {
  const res = await fetch(`/api/tasks/${updatedTask.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedTask),
  });

  if (!res.ok) {
    throw new Error('Failed to update task');
  }

  return res.json();
}

export default function TasksPage() {
  const queryClient = useQueryClient();
  const [newTask, setNewTask] = useState<{
    title: string;
    description: string;
    id?: number;
  }>({ title: '', description: '' });
  const { toast } = useToast();

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
      <Card className="mb-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <h1 className="text-3xl font-bold">Start planning</h1>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Supermarket" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Task Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Buy milk..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit">
                {newTask.id ? 'Update Task' : 'Add Task'}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
      {tasks.find((tasks: Task) => !tasks?.completed) && (
        <>
          <h2 className="text-2xl font-bold mt-8 mb-4">Unfinished tasks</h2>

          <ul className="flex flex-col gap-4">
            {tasks
              ?.filter((task: Task) => !task.completed)
              .map((task: Task) => (
                <Card key={task.id} className="p-4">
                  <li className="flex justify-between items-center">
                    <div className="flex gap-4 items-center">
                      <Checkbox
                        checked={task.completed}
                        onCheckedChange={() => onToggleCompleted(task)}
                      />
                      <div>
                        <p
                          className={
                            task.completed
                              ? 'line-through text-gray-400'
                              : 'text-lg font-bold'
                          }
                        >
                          {task.title}
                        </p>
                        <p
                          className={
                            task.completed ? 'line-through text-gray-400' : ''
                          }
                        >
                          {task.description}
                        </p>
                        <p className="text-gray-400 text-sm">
                          {dayjs(task.created_at).format('DD-MM-YYYY')}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        onClick={(e) => onRemove(task.id)}
                      >
                        <FaRegTrashCan />
                      </Button>
                      <Button variant="secondary" onClick={(e) => onEdit(task)}>
                        <FaPencil />
                      </Button>
                    </div>
                  </li>
                </Card>
              ))}
          </ul>
        </>
      )}
      {tasks.find((tasks: Task) => tasks?.completed) && (
        <>
          <h2 className="text-2xl font-bold mt-8 mb-4">Completed tasks</h2>
          <ul className="flex flex-col gap-4">
            {tasks
              ?.filter((task: Task) => task.completed)
              .map((task: Task) => (
                <Card key={task.id} className="p-4">
                  <li className="flex justify-between items-center">
                    <div className="flex gap-4 items-center">
                      <Checkbox
                        checked={task.completed}
                        onCheckedChange={() => onToggleCompleted(task)}
                      />
                      <div>
                        <p className="line-through text-gray-400">
                          {task.title}
                        </p>
                        <p className="line-through text-gray-400">
                          {task.description}
                        </p>
                        <p className="text-gray-400 text-sm">
                          {dayjs(task.created_at).format('DD-MM-YYYY')}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        onClick={(e) => onRemove(task.id)}
                      >
                        <FaRegTrashCan />
                      </Button>
                    </div>
                  </li>
                </Card>
              ))}
          </ul>
        </>
      )}
    </div>
  );
}
