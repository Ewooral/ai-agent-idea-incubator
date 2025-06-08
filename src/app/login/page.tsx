
// src/app/login/page.tsx
"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, LogIn, UserPlus } from 'lucide-react';
import { FeatherLogo } from '@/components/icons/feather-logo';

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
    setIsSubmitting(true);
    // Placeholder for actual login logic
    console.log("Login data:", data);
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call

    toast({
      title: "Login Submitted (Placeholder)",
      description: "Authentication is not yet implemented. Check console for data.",
    });
    setIsSubmitting(false);
    // form.reset(); // Optionally reset form
  };

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-10rem)] items-center justify-center py-8 px-4">
      <Card className="w-full max-w-md shadow-xl bg-card">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-fit">
            <FeatherLogo size={36} showText={false} />
          </div>
          <CardTitle className="font-headline text-2xl sm:text-3xl flex items-center justify-center">
            <LogIn className="mr-2 text-primary" /> Welcome Back
          </CardTitle>
          <CardDescription>
            Login to access your Idea Incubator dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging In...
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col items-center justify-center text-sm">
          <p className="text-muted-foreground">Don't have an account?</p>
          <Button variant="link" asChild className="text-primary">
            <Link href="/register">
              <UserPlus className="mr-1 h-4 w-4" /> Register Here
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
