'use client';

import Link from 'next/link';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import z from 'zod';

export default function Page() {
  const [error, setError] = useState<string | null>(null);

  // Define the Zod schema
  const loginSchema = z.object({
    username: z
      .string()
      .min(3, 'Username is required')
      .max(30, 'Username is too long')
      .refine((val) => val === val.toLowerCase(), {
        message: 'Username must be in lowercase',
      }),
    password: z.string().min(1, 'Password is required'),
  });

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const username = formData.get('username');
    const password = formData.get('password');

    // Validate the form data using the Zod schema
    const validation = loginSchema.safeParse({ username, password });

    if (!validation.success) {
      setError(validation.error.errors[0]?.message || 'Invalid input');
      return;
    }

    // Make a POST request to the API
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const result = await response.json();
        setError(result.error || 'Something went wrong');
      } else {
        // Redirect or handle success
        window.location.href = '/dashboard';
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Internal server error');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex flex-col items-center">
        <Card className="max-w-2xl w-96 mx-auto">
          <CardHeader className="text-2xl font-bold">Sign in</CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent>
              <Label htmlFor="username">Username</Label>
              <Input name="username" id="username" />
              <br />
              <Label htmlFor="password">Password</Label>
              <Input type="password" name="password" id="password" />
              {error && <p style={{ color: 'red' }}>{error}</p>}
            </CardContent>
            <CardFooter>
              <Button type="submit">Continue</Button>
            </CardFooter>
          </form>
        </Card>
        <div className="mt-4">or</div>
        <Link className="mt-4 underline" href="/signup">
          Create an account
        </Link>
      </div>
    </div>
  );
}
