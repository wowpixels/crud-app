import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// Fetch a single task by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const res = await pool.query('SELECT * FROM tasks WHERE id = $1', [
    params.id,
  ]);
  return NextResponse.json(res.rows[0]);
}

// Update a task
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { title, description, completed } = await request.json();

  const res = await pool.query(
    'UPDATE tasks SET title = $1, description = $2, completed = $3 WHERE id = $4 RETURNING *',
    [title, description, completed, params.id]
  );

  return NextResponse.json(res.rows[0]);
}

// Delete a task
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  await pool.query('DELETE FROM tasks WHERE id = $1', [params.id]);
  return NextResponse.json({ message: 'Task deleted successfully' });
}
