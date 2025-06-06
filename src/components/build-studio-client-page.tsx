// src/components/build-studio-client-page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { SavedIdea, BuildProject } from '@/lib/db';
import { saveBuildProjectAction, BuildProjectDataSchema, type BuildProjectFormValues } from '@/app/actions/buildActions';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, FileText, Users, Activity, DollarSign, Save } from 'lucide-react';

interface BuildStudioClientPageProps {
  ideaId: string;
  initialSavedIdea: SavedIdea; // Assuming idea will always be found by server component
  initialBuildProject: BuildProject | null;
}

export function BuildStudioClientPage({ ideaId, initialSavedIdea, initialBuildProject }: BuildStudioClientPageProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<BuildProjectFormValues>({
    resolver: zodResolver(BuildProjectDataSchema),
    defaultValues: {
      ideaId: ideaId,
      valueProposition: initialBuildProject?.valueProposition || '',
      customerSegments: initialBuildProject?.customerSegments || '',
      keyActivities: initialBuildProject?.keyActivities || '',
      revenueStreams: initialBuildProject?.revenueStreams || '',
      notes: initialBuildProject?.notes || '',
      id: initialBuildProject?.id || undefined,
    },
  });

  // Reset form if initial data changes (e.g., after save and new props are passed, though revalidation handles this mostly)
  useEffect(() => {
    form.reset({
      ideaId: ideaId,
      valueProposition: initialBuildProject?.valueProposition || '',
      customerSegments: initialBuildProject?.customerSegments || '',
      keyActivities: initialBuildProject?.keyActivities || '',
      revenueStreams: initialBuildProject?.revenueStreams || '',
      notes: initialBuildProject?.notes || '',
      id: initialBuildProject?.id,
    });
  }, [ideaId, initialBuildProject, form]);


  const onSubmit: SubmitHandler<BuildProjectFormValues> = async (data) => {
    setIsSaving(true);
    try {
      // Ensure the ideaId is part of the data being submitted
      const dataToSave = { ...data, ideaId: ideaId, id: form.getValues('id') };
      const result = await saveBuildProjectAction(dataToSave);
      
      if (result.success && result.project) {
        toast({ title: "Success!", description: result.message });
        // Update form with the new project ID if it was created
        form.setValue('id', result.project.id); 
        // Optionally, could update initialBuildProject state if we managed it here,
        // but revalidation should handle fetching fresh data on next navigation or if this page becomes dynamic again.
      } else {
        let errorMessage = result.message || "Could not save the project.";
        if (typeof result.message === 'object') {
             errorMessage = Object.values(result.message).flat().join(' ');
        }
        toast({ title: "Save Failed", description: errorMessage, variant: "destructive" });
      }
    } catch (error) {
      console.error("Error saving project:", error);
      toast({ title: "Error", description: "An unexpected error occurred.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
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
          // defaultValue={ideaId} // Handled in useForm defaultValues
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
  );
}