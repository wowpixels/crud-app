import { NextRequest, NextResponse } from 'next/server';
import { verify } from '@node-rs/argon2';
import { lucia } from '@/lib/auth';
import db from '@/lib/db';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const username = formData.get('username') as string | null;

    if (
      typeof username !== 'string' ||
      username.length < 3 ||
      username.length > 30 ||
      !/^[a-z0-9_-]+$/.test(username)
    ) {
      return {
        error: 'Invalid username',
      };
    }
    const password = formData.get('password');
    if (
      typeof password !== 'string' ||
      password.length < 6 ||
      password.length > 255
    ) {
      return {
        error: 'Invalid password',
      };
    }

    // Use raw SQL to query the database
    const result = await db.query('SELECT * FROM "users" WHERE username = $1', [
      username.toLowerCase(),
    ]);

    const existingUser = result.rows[0];

    if (!existingUser) {
      return NextResponse.json({ error: 'Incorrect username or password' });
    }

    const validPassword = await verify(existingUser.password_hash, password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });
    if (!validPassword) {
      return {
        error: 'Incorrect username or password',
      };
    }

    const session = await lucia.createSession(existingUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
    return NextResponse.redirect(new URL('/dashboard', req.url));
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
