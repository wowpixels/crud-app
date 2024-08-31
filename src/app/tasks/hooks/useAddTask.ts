export function useAddTask() {
  return async function addTask(newTask: {
    title: string;
    description: string;
  }) {
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTask),
    });
    return res.json();
  };
}
