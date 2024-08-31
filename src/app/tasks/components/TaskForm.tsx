import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { SubmitHandler, UseFormReturn } from 'react-hook-form';
import { formSchema } from '@/app/tasks/schema';
import { z } from 'zod';

type TaskFormProps = {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  onSubmit: SubmitHandler<z.infer<typeof formSchema>>;
  newTask: {
    title: string;
    description: string;
    id?: number;
  };
};

const TaskForm: React.FC<TaskFormProps> = ({ form, onSubmit, newTask }) => {
  return (
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
                  <FormLabel>Description</FormLabel>
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
  );
};

export default TaskForm;
