'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { signIn } from 'next-auth/react';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { signInSchema } from '@/schemas/signInSchema';
import { LockKeyhole } from 'lucide-react';

export default function SignInForm() {
  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  });

  const { toast } = useToast();
  
  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    const result = await signIn('credentials', {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });

    if (result?.error) {
      if (result.error === 'CredentialsSignin') {
        toast({
          title: 'Login Failed',
          description: 'Incorrect username or password',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Error',
          description: result.error,
          variant: 'destructive',
        });
      }
    }

    if (result?.url) {
      toast({
        title: 'Login successful',
        description: "Welcome back!",
      });
      router.replace('/');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-950 relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        
        <div className="w-full max-w-md p-8 space-y-8 bg-slate-900/50 backdrop-blur-md rounded-2xl border border-slate-800 shadow-2xl relative z-10">
        <div className="text-center">
            <div className="mx-auto w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-center mb-4">
                <LockKeyhole className="w-6 h-6 text-indigo-400" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
            Welcome Back
            </h1>
            <p className="text-slate-400 text-sm">
                Sign in to continue your anonymous adventures
            </p>
        </div>

        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
                name="identifier"
                control={form.control}
                render={({ field }) => (
                <FormItem>
                    <FormLabel className="text-slate-300">Email or Username</FormLabel>
                    <Input 
                        {...field} 
                        className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-500 focus-visible:ring-indigo-500"
                        placeholder="Enter your identifier"
                    />
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                <FormItem>
                    <FormLabel className="text-slate-300">Password</FormLabel>
                    <Input 
                        type="password" 
                        {...field}
                        className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-500 focus-visible:ring-indigo-500" 
                        placeholder="••••••••"
                    />
                    <FormMessage />
                </FormItem>
                )}
            />
            <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20" type="submit">
                Sign In
            </Button>
            </form>
        </Form>
        <div className="text-center mt-4">
            <p className="text-slate-400 text-sm">
            Not a member yet?{' '}
            <Link href="/signup" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                Sign up
            </Link>
            </p>
        </div>
        </div>
    </div>
  );
}