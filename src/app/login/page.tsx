import { redirect } from 'next/navigation';
import { validateRequest } from '@/lib/auth';
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

export default async function Page() {
  const { user } = await validateRequest();
  if (user) {
    return redirect('/');
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex flex-col items-center">
        <Card className="max-w-2xl w-96 mx-auto">
          <CardHeader className="text-2xl font-bold">Sign in</CardHeader>
          <form action="/api/login" method="POST">
            <CardContent>
              <Label htmlFor="username">Username</Label>
              <Input name="username" id="username" />
              <br />
              <Label htmlFor="password">Password</Label>
              <Input type="password" name="password" id="password" />
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
