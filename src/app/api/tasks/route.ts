import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// Create a new task
export async function POST(request: Request) {
  const { title, description } = await request.json();
  const res = await pool.query(
    'INSERT INTO tasks (title, description) VALUES ($1, $2) RETURNING *',
    [title, description]
  );

  return NextResponse.json(res.rows[0]);
}

// Fetch all tasks
export async function GET() {
  const res = await pool.query('SELECT * FROM tasks');

  return NextResponse.json(res.rows);
}
