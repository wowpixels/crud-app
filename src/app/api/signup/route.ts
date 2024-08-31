import { NextRequest, NextResponse } from 'next/server';
import { hash } from '@node-rs/argon2';
import db from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const username = formData.get('username') as string | null;
    const password = formData.get('password') as string | null;

    if (!username || typeof username !== 'string') {
      return NextResponse.json({ error: 'Invalid username' }, { status: 400 });
    }

    const existingUser = await db.query(
      'SELECT * FROM "user" WHERE username = $1 LIMIT 1',
      [username]
    );
    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        { error: 'Username already taken' },
        { status: 400 }
      );
    }

    const passwordHash = await hash(password!, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    const userId = `user_${Date.now()}`;

    await db.query(
      'INSERT INTO "user" (id, username, password_hash) VALUES ($1, $2, $3)',
      [userId, username, passwordHash]
    );

    console.log('User inserted with ID:', userId);

    return NextResponse.json({ success: true, userId });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
