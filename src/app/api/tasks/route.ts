import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { validateRequest } from '@/lib/auth'; // Import your Lucia auth validation

export async function GET(request: Request) {
  // Validate the user session
  const { user, session } = await validateRequest();

  if (!user || !session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const user_id = user.id;

  const res = await pool.query('SELECT * FROM tasks WHERE user_id = $1', [
    user_id,
  ]);

  return NextResponse.json(res.rows);
}

// Create a new task
export async function POST(request: Request) {
  const { title, description } = await request.json();

  // Validate the user session
  const { user, session } = await validateRequest();
  if (!user || !session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const user_id = user.id;

  const res = await pool.query(
    'INSERT INTO tasks (title, description, user_id) VALUES ($1, $2, $3) RETURNING *',
    [title, description, user_id]
  );

  return NextResponse.json(res.rows[0]);
}
