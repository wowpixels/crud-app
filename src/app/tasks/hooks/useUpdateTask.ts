export function useUpdateTask() {
  return async function updateTask(updatedTask: {
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
  };
}
