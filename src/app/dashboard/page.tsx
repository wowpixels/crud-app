import { lucia, validateRequest } from '@/lib/auth';
import { Form } from '@/lib/form';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { ActionResult } from '@/lib/form';
import { Button } from '@/components/ui/button';

export default async function Home() {
  const { user } = await validateRequest();
  if (!user) {
    return redirect('/login');
  }
  return (
    <div className="p-8">
      <h1 className="text-2xl capitalize">Hi, {user.username}!</h1>
      <p className="py-8">Your user ID is {user.id}.</p>
      <Form action={logout}>
        <Button>Sign out</Button>
      </Form>
    </div>
  );
}

async function logout(): Promise<ActionResult> {
  'use server';
  const { session } = await validateRequest();
  if (!session) {
    return {
      error: 'Unauthorized',
    };
  }

  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
  return redirect('/login');
}
