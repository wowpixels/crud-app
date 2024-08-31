import { validateRequest } from '@/lib/auth';
import { redirect } from 'next/navigation';
import React from 'react';

export default async function TasksLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { user } = await validateRequest();
  if (!user) {
    return redirect('/login');
  }
  return <>{children}</>;
}
