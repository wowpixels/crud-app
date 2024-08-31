import { Checkbox } from '@/components/ui/checkbox';
import { Task } from '../types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FaPencil, FaRegTrashCan } from 'react-icons/fa6';
import dayjs from 'dayjs';

type TaskListProps = {
  tasks: Task[];
  onToggleCompleted: (task: Task) => void;
  onRemove: (id: number) => void;
  onEdit: (task: Task) => void;
  isCompleted?: boolean;
};

const TaskList = ({
  tasks,
  onToggleCompleted,
  onRemove,
  onEdit,
  isCompleted = false,
}: TaskListProps) => {
  return (
    <>
      {tasks.find((task: Task) =>
        isCompleted ? task?.completed : !task?.completed
      ) && (
        <>
          <h2 className="text-2xl font-bold mt-8 mb-4">
            {isCompleted ? 'Completed' : 'Uncompleted'} tasks
          </h2>
          <ul className="flex flex-col gap-4">
            {tasks
              ?.filter((task: Task) =>
                isCompleted ? task?.completed : !task?.completed
              )
              .map((task: Task) => (
                <Card key={task.id} className="p-4">
                  <li className="flex justify-between items-center">
                    <div className="flex gap-4 items-center">
                      <Checkbox
                        id={`taskCompleted-${task.id}`}
                        checked={task.completed}
                        onCheckedChange={() => onToggleCompleted(task)}
                      />
                      <label
                        htmlFor={`taskCompleted-${task.id}`}
                        className="hover:cursor-pointer"
                      >
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
                      </label>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        onClick={(e) => onRemove(task.id)}
                      >
                        <FaRegTrashCan />
                      </Button>
                      {!isCompleted && (
                        <Button
                          variant="secondary"
                          onClick={(e) => onEdit(task)}
                        >
                          <FaPencil />
                        </Button>
                      )}
                    </div>
                  </li>
                </Card>
              ))}
          </ul>
        </>
      )}
    </>
  );
};

export default TaskList;
