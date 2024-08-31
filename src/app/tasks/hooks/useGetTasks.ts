export function useGetTasks() {
  return async function fetchTasks() {
    const res = await fetch('/api/tasks');
    if (!res.ok) {
      throw new Error('Failed to fetch tasks');
    }
    return res.json();
  };
}
