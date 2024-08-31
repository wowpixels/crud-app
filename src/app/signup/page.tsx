'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { useState } from 'react';
import z from 'zod';

export default function Page() {
  const [error, setError] = useState<string | null>(null);

  // Define the Zod schema
  const signUpSchema = z.object({
    username: z
      .string()
      .min(3, 'Username is required')
      .max(30, 'Username is too long')
      .transform((val) => val.toLowerCase()),
    password: z.string().min(1, 'Password is required'),
  });

  const signUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const username = formData.get('username');
    const password = formData.get('password');

    // Validate the form data using the Zod schema
    const validation = signUpSchema.safeParse({ username, password });

    if (!validation.success) {
      setError(validation.error.errors[0]?.message || 'Invalid input');
      return;
    }

    // If validation is successful, extract the validated data
    const { username: validatedUsername, password: validatedPassword } =
      validation.data;

    // Prepare the data for the POST request
    const body = new FormData();
    body.append('username', validatedUsername);
    body.append('password', validatedPassword);

    // Make a POST request to the API
    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const result = await response.json();
        setError(result.error || 'Something went wrong');
      } else {
        // Redirect or handle success
        window.location.href = '/';
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError('Internal server error');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex flex-col items-center">
        <Card className="max-w-2xl w-96 mx-auto">
          <CardHeader className="text-2xl font-bold">
            Create an account
          </CardHeader>
          <form onSubmit={signUp}>
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
        <Link className="mt-4 underline" href="/login">
          Sign in
        </Link>
      </div>
    </div>
  );
}
