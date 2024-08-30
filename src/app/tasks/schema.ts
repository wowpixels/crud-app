'use client';

import { z } from 'zod';

export const formSchema = z.object({
  title: z.string().min(2).max(50),
  description: z.string().min(2).max(50),
});
