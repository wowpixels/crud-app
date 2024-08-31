import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { validateRequest } from '@/lib/auth'; // Import your Lucia auth instance

// Fetch a single task by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  // Validate the user session
  const { user } = await validateRequest();
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const user_id = user.id;

  const res = await pool.query(
    'SELECT * FROM tasks WHERE id = $1 AND user_id = $2',
    [params.id, user_id]
  );

  if (res.rows.length === 0) {
    return NextResponse.json({ message: 'Task not found' }, { status: 404 });
  }

  return NextResponse.json(res.rows[0]);
}

// Update a task
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { title, description, completed } = await request.json();

  // Validate the user session
  const { user } = await validateRequest();
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const user_id = user.id;

  const res = await pool.query(
    'UPDATE tasks SET title = $1, description = $2, completed = $3 WHERE id = $4 AND user_id = $5 RETURNING *',
    [title, description, completed, params.id, user_id]
  );

  if (res.rows.length === 0) {
    return NextResponse.json(
      { message: 'Task not found or not authorized' },
      { status: 404 }
    );
  }

  return NextResponse.json(res.rows[0]);
}

// Delete a task
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  // Validate the user session
  const { user } = await validateRequest();
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const user_id = user.id;

  const res = await pool.query(
    'DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING *',
    [params.id, user_id]
  );

  if (res.rows.length === 0) {
    return NextResponse.json(
      { message: 'Task not found or not authorized' },
      { status: 404 }
    );
  }

  return NextResponse.json({ message: 'Task deleted successfully' });
}
