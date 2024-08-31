export function useDeleteTask() {
  return async function deleteTask(taskId: number) {
    const res = await fetch(`/api/tasks/${taskId}`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      throw new Error('Failed to delete task');
    }

    return res.json();
  };
}
