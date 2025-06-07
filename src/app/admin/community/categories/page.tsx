
// src/app/admin/community/categories/page.tsx
"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { addForumCategoryAction } from '@/app/actions/communityActions';
import { Loader2, PlusCircle, ListChecks } from 'lucide-react';
import Link from 'next/link';

const addCategorySchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long.").max(100, "Title is too long."),
  description: z.string().min(10, "Description must be at least 10 characters long.").max(500, "Description is too long."),
  iconName: z.string().min(1, "Lucide icon name is required (e.g., MessageSquare, Lightbulb).").max(50, "Icon name is too long."),
});

type AddCategoryFormValues = z.infer<typeof addCategorySchema>;

export default function AddCommunityCategoryPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AddCategoryFormValues>({
    resolver: zodResolver(addCategorySchema),
    defaultValues: {
      title: "",
      description: "",
      iconName: "",
    },
  });

  const onSubmit: SubmitHandler<AddCategoryFormValues> = async (data) => {
    setIsSubmitting(true);
    try {
      const result = await addForumCategoryAction(data);
      if (result.success) {
        toast({
          title: "Category Added!",
          description: result.message,
        });
        form.reset(); // Reset form after successful submission
      } else {
        let errorMessage = result.message || "Failed to add category.";
        if (result.errors) {
            errorMessage = result.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(' ');
        }
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Submission Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
       <Button variant="outline" asChild className="mb-6">
          <Link href="/community"><ListChecks className="mr-2 h-4 w-4" /> Back to Community Page</Link>
        </Button>
      <Card className="max-w-2xl mx-auto shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline text-xl sm:text-2xl flex items-center">
            <PlusCircle className="mr-2 text-primary" /> Add New Forum Category
          </CardTitle>
          <CardDescription>
            Create a new category for the community forum. This page is for administrative purposes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., General Discussion" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="A brief description of what this category is about."
                        {...field}
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="iconName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lucide Icon Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., MessageSquare, Lightbulb, Rocket" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter the exact name of a Lucide React icon. Refer to <a href="https://lucide.dev/icons/" target="_blank" rel="noopener noreferrer" className="underline text-primary">lucide.dev/icons</a> for names.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding Category...
                  </>
                ) : (
                  "Add Category"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
