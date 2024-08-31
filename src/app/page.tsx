import { lucia, validateRequest } from '@/lib/auth';
import { Form } from '../lib/form';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { ActionResult } from '../lib/form';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function Home() {
  return (
    <div className="p-8">
      <h1>HOME</h1>
      <Link className="mt-4 underline" href="/login">
        Sign in
      </Link>
    </div>
  );
}
