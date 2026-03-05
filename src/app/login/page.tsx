"use client"

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { useStore } from '@/lib/store';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { login } = useStore();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, we'd validate against a DB
    login(email, email.split('@')[0]);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-secondary/30">
      <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </Link>

      <Card className="w-full max-w-md shadow-2xl border-none">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-primary-foreground mb-4">
            <Sparkles className="w-7 h-7" />
          </div>
          <CardTitle className="text-3xl font-headline">Welcome Back</CardTitle>
          <CardDescription>Enter your credentials to access your memories.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="name@example.com" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full h-12 text-lg btn-hover-effect mt-2">Log In</Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 text-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account? <Link href="/signup" className="text-primary font-medium hover:underline">Sign Up</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
