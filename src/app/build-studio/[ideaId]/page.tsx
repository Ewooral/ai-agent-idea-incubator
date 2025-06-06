
// src/app/build-studio/[ideaId]/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getSavedIdeaById, getBuildProjectByIdeaId, type SavedIdea, type BuildProject } from '@/lib/db';
import { saveBuildProjectAction, BuildProjectDataSchema, type BuildProjectFormValues } from '@/app/actions/buildActions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input'; // Hidden input for id
import { useToast } from '@/hooks/use-toast';
import { Loader2, Hammer, Lightbulb, FileText, Users, Activity, DollarSign, Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function BuildStudioIdeaPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const ideaId = typeof params.ideaId === 'string' ? params.ideaId : '';

  const [savedIdea, setSavedIdea] = useState<SavedIdea | null>(null);
  const [buildProject, setBuildProject] = useState<BuildProject | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<BuildProjectFormValues>({
    resolver: zodResolver(BuildProjectDataSchema),
    defaultValues: {
      ideaId: ideaId,
      valueProposition: '',
      customerSegments: '',
      keyActivities: '',
      revenueStreams: '',
      notes: '',
      id: undefined, // Important: ID might not exist for new projects
    },
  });

  useEffect(() => {
    if (!ideaId) {
      setIsLoadingData(false);
      toast({ title: "Error", description: "Idea ID is missing.", variant: "destructive" });
      router.push('/dashboard');
      return;
    }

    async function fetchData() {
      setIsLoadingData(true);
      try {
        const fetchedIdea = await getSavedIdeaById(ideaId);
        if (!fetchedIdea) {
          toast({ title: "Error", description: "Saved idea not found.", variant: "destructive" });
          router.push('/dashboard');
          return;
        }
        setSavedIdea(fetchedIdea);

        const fetchedProject = await getBuildProjectByIdeaId(ideaId);
        setBuildProject(fetchedProject);

        // Set form default values once data is fetched
        form.reset({
          ideaId: ideaId,
          valueProposition: fetchedProject?.valueProposition || '',
          customerSegments: fetchedProject?.customerSegments || '',
          keyActivities: fetchedProject?.keyActivities || '',
          revenueStreams: fetchedProject?.revenueStreams || '',
          notes: fetchedProject?.notes || '',
          id: fetchedProject?.id, // Pass existing project ID for updates
        });

      } catch (error) {
        console.error("Error fetching data:", error);
        toast({ title: "Error", description: "Could not load idea or project data.", variant: "destructive" });
      } finally {
        setIsLoadingData(false);
      }
    }
    fetchData();
  }, [ideaId, router, toast, form]);

  const onSubmit: SubmitHandler<BuildProjectFormValues> = async (data) => {
    setIsSaving(true);
    try {
      const result = await saveBuildProjectAction(data);
      if (result.success && result.project) {
        toast({ title: "Success!", description: result.message });
        setBuildProject(result.project); // Update local state with saved project (includes new ID if created)
        form.setValue('id', result.project.id); // Ensure form has the ID for subsequent saves
      } else {
        toast({ title: "Save Failed", description: result.message || "Could not save the project.", variant: "destructive" });
      }
    } catch (error) {
      console.error("Error saving project:", error);
      toast({ title: "Error", description: "An unexpected error occurred.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
        <p className="mt-4 text-lg text-muted-foreground">Loading Build Studio...</p>
      </div>
    );
  }

  if (!savedIdea) {
    // This case should be handled by the redirect in useEffect, but as a fallback:
    return (
        <div className="container mx-auto py-8 px-4 text-center">
            <p className="text-xl text-destructive-foreground">Idea not found. Redirecting to dashboard...</p>
        </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Button variant="outline" asChild className="mb-6">
        <Link href="/dashboard"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard</Link>
      </Button>

      <Card className="mb-8 shadow-xl bg-card border-primary/30">
        <CardHeader>
          <CardTitle className="font-headline text-3xl flex items-center">
            <Hammer className="mr-3 text-primary" size={32} /> Build Studio: Developing Your Idea
          </CardTitle>
          <CardDescription>Flesh out the business model for your validated concept.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="p-4 mb-6 bg-muted/50 rounded-lg border border-primary/20">
                <h3 className="text-lg font-semibold text-primary flex items-center mb-1">
                    <Lightbulb className="mr-2 h-5 w-5" /> Original Refined Idea:
                </h3>
                <p className="text-foreground/90">{savedIdea.refinedIdea}</p>
            </div>

            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Hidden input for project ID, crucial for updates */}
                {form.getValues('id') && (
                  <FormField
                    control={form.control}
                    name="id"
                    render={({ field }) => <Input type="hidden" {...field} />}
                  />
                )}
                <FormField
                  control={form.control}
                  name="ideaId"
                  render={({ field }) => <Input type="hidden" {...field} />}
                />

                <FormField
                    control={form.control}
                    name="valueProposition"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-lg flex items-center"><FileText className="mr-2 h-5 w-5 text-accent" />Value Proposition</FormLabel>
                        <FormControl>
                        <Textarea placeholder="What unique value do you offer? Why should customers choose you?" {...field} rows={4} />
                        </FormControl>
                        <FormDescription>Clearly articulate the core benefit to your users.</FormDescription>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="customerSegments"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-lg flex items-center"><Users className="mr-2 h-5 w-5 text-accent" />Customer Segments</FormLabel>
                        <FormControl>
                        <Textarea placeholder="Who are your target customers? Describe their key characteristics." {...field} rows={4}/>
                        </FormControl>
                        <FormDescription>Define your primary audience.</FormDescription>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="keyActivities"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-lg flex items-center"><Activity className="mr-2 h-5 w-5 text-accent" />Key Activities</FormLabel>
                        <FormControl>
                        <Textarea placeholder="What critical activities must your business perform to deliver its value proposition?" {...field} rows={4}/>
                        </FormControl>
                        <FormDescription>List the most important actions your company undertakes.</FormDescription>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="revenueStreams"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-lg flex items-center"><DollarSign className="mr-2 h-5 w-5 text-accent" />Revenue Streams</FormLabel>
                        <FormControl>
                        <Textarea placeholder="How will your business generate revenue? (e.g., sales, subscriptions, ads)" {...field} rows={4}/>
                        </FormControl>
                        <FormDescription>Describe your monetization strategy.</FormDescription>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-lg">General Notes (Optional)</FormLabel>
                        <FormControl>
                        <Textarea placeholder="Add any other thoughts, research, or to-do items here." {...field} rows={5}/>
                        </FormControl>
                        <FormDescription>A place for your unstructured thoughts and plans.</FormDescription>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <Button type="submit" disabled={isSaving} size="lg" className="w-full sm:w-auto">
                    {isSaving ? (
                    <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Saving Project...
                    </>
                    ) : (
                    <>
                        <Save className="mr-2 h-5 w-5" />
                        Save Build Project
                    </>
                    )}
                </Button>
            </form>
            </Form>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper function (not exported from db.ts to avoid client-side Node dependencies if it were there)
// Note: These db functions (getSavedIdeaById, getBuildProjectByIdeaId) are now directly imported from '@/lib/db'
// and are server-side. To use them on the client for initial data fetching,
// this component runs them in useEffect, which is fine for this prototype.
// For production, you'd typically fetch this data via a Route Handler or Server Component props.
