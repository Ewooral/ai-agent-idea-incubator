
// src/components/build-studio-client-page.tsx
"use client";

import { useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { SavedIdea, BuildProject } from '@/lib/db';
import { saveBuildProjectAction, generateDevelopmentGuideAction } from '@/app/actions/buildActions';
import { BuildProjectDataSchema, type BuildProjectFormValues } from '@/app/schemas/build.schemas';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, FileText, Users, Activity, DollarSign, Save, Wand2, AlertTriangle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { MarkdownDisplay } from './markdown-display';


interface BuildStudioClientPageProps {
  ideaId: string;
  initialSavedIdea: SavedIdea;
  initialBuildProject: BuildProject | null;
}

export function BuildStudioClientPage({ ideaId, initialSavedIdea, initialBuildProject }: BuildStudioClientPageProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedGuide, setGeneratedGuide] = useState<string | undefined>(initialBuildProject?.generatedGuideMarkdown);
  const [_, startTransition] = useTransition();


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
      targetPlatform: initialBuildProject?.targetPlatform || '',
      coreFeaturesMVP: initialBuildProject?.coreFeaturesMVP || '',
      techStackSuggestion: initialBuildProject?.techStackSuggestion || '',
    },
  });

  useEffect(() => {
    form.reset({
      ideaId: ideaId,
      valueProposition: initialBuildProject?.valueProposition || '',
      customerSegments: initialBuildProject?.customerSegments || '',
      keyActivities: initialBuildProject?.keyActivities || '',
      revenueStreams: initialBuildProject?.revenueStreams || '',
      notes: initialBuildProject?.notes || '',
      id: initialBuildProject?.id,
      targetPlatform: initialBuildProject?.targetPlatform || '',
      coreFeaturesMVP: initialBuildProject?.coreFeaturesMVP || '',
      techStackSuggestion: initialBuildProject?.techStackSuggestion || '',
    });
    setGeneratedGuide(initialBuildProject?.generatedGuideMarkdown);
  }, [ideaId, initialBuildProject, form]);


  const onSubmit: SubmitHandler<BuildProjectFormValues> = async (data) => {
    setIsSaving(true);
    try {
      const dataToSave = { ...data, ideaId: ideaId, id: form.getValues('id') };
      const result = await saveBuildProjectAction(dataToSave);
      
      if (result.success && result.project) {
        toast({ title: "Success!", description: result.message });
        form.setValue('id', result.project.id);
        form.reset(form.getValues(), { keepValues: true, keepDirty: false, keepDefaultValues: false });

        startTransition(() => {
            router.refresh();
        });
      } else {
        let errorMessage = result.message || "Could not save the project.";
        if (typeof result.message === 'object') {
             errorMessage = Object.values(result.message).flat().join(' ');
        }
        toast({ title: "Save Failed", description: errorMessage, variant: "destructive" });
      }
    } catch (error) {
      console.error("Error saving project:", error);
      toast({ title: "Error", description: "An unexpected error occurred while saving project details.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerateGuide = async () => {
    if (form.formState.isDirty) {
         toast({ title: "Unsaved Changes", description: "Please save the project details before generating the guide.", variant: "destructive" });
         return;
    }
     if (!form.getValues('valueProposition') || !form.getValues('customerSegments') || !form.getValues('coreFeaturesMVP') || !form.getValues('targetPlatform')) {
        toast({ title: "Missing Information", description: "Please fill in Value Proposition, Customer Segments, Core MVP Features, and Target Platform before generating the guide.", variant: "destructive" });
        return;
    }

    setIsGenerating(true);
    setGeneratedGuide(undefined); 
    const guideSection = document.getElementById('ai-guide-section');
    if (guideSection) {
        guideSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    try {
      const result = await generateDevelopmentGuideAction(ideaId);
      if (result.success && result.guideMarkdown) {
        setGeneratedGuide(result.guideMarkdown);
        toast({ title: "Guide Generated!", description: "AI has crafted your development guide." });
         startTransition(() => {
            router.refresh(); 
        });
      } else {
        toast({ title: "Generation Failed", description: result.message || "Could not generate the guide.", variant: "destructive" });
      }
    } catch (error) {
      console.error("Error generating guide:", error);
      toast({ title: "Error", description: "An unexpected error occurred while generating the guide.", variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                  <FormLabel className="text-lg flex items-center"><FileText className="mr-2 h-5 w-5 text-accent" />Value Proposition *</FormLabel>
                  <FormControl>
                  <Textarea placeholder="What unique value do you offer? Why should customers choose you?" {...field} rows={3} />
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
                  <FormLabel className="text-lg flex items-center"><Users className="mr-2 h-5 w-5 text-accent" />Customer Segments *</FormLabel>
                  <FormControl>
                  <Textarea placeholder="Who are your target customers? Describe their key characteristics." {...field} rows={3}/>
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
                  <FormLabel className="text-lg flex items-center"><Activity className="mr-2 h-5 w-5 text-accent" />Key Activities *</FormLabel>
                  <FormControl>
                  <Textarea placeholder="What critical activities must your business perform to deliver its value proposition?" {...field} rows={3}/>
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
                  <FormLabel className="text-lg flex items-center"><DollarSign className="mr-2 h-5 w-5 text-accent" />Revenue Streams *</FormLabel>
                  <FormControl>
                  <Textarea placeholder="How will your business generate revenue? (e.g., sales, subscriptions, ads)" {...field} rows={3}/>
                  </FormControl>
                  <FormDescription>Describe your monetization strategy.</FormDescription>
                  <FormMessage />
              </FormItem>
              )}
          />
          
          <Separator />
          <h3 className="text-xl font-semibold text-foreground pt-4">Details for AI Guide Generation</h3>
          
          <FormField
              control={form.control}
              name="targetPlatform"
              render={({ field }) => (
              <FormItem>
                  <FormLabel className="text-lg">Target Platform *</FormLabel>
                  <FormControl>
                  <Input placeholder="e.g., Web Application, iOS Mobile App, Cross-platform Mobile App" {...field} />
                  </FormControl>
                  <FormDescription>What type of application are you planning to build?</FormDescription>
                  <FormMessage />
              </FormItem>
              )}
          />
          <FormField
              control={form.control}
              name="coreFeaturesMVP"
              render={({ field }) => (
              <FormItem>
                  <FormLabel className="text-lg">Core MVP Features *</FormLabel>
                  <FormControl>
                  <Textarea placeholder="List 3-5 essential features for your Minimum Viable Product. Be concise but clear. e.g., User registration & login, Ability to create posts, Real-time chat functionality" {...field} rows={4}/>
                  </FormControl>
                  <FormDescription>What are the absolute must-have features for the first version?</FormDescription>
                  <FormMessage />
              </FormItem>
              )}
          />
          <FormField
              control={form.control}
              name="techStackSuggestion"
              render={({ field }) => (
              <FormItem>
                  <FormLabel className="text-lg">Tech Stack Preference (Optional)</FormLabel>
                  <FormControl>
                  <Textarea placeholder="e.g., React Native for mobile, Python/Django backend, Firebase for BaaS. If unsure, leave blank and AI will suggest." {...field} rows={3}/>
                  </FormControl>
                  <FormDescription>Any preferred technologies? AI can suggest if you're unsure.</FormDescription>
                  <FormMessage />
              </FormItem>
              )}
          />
          <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
              <FormItem>
                  <FormLabel className="text-lg">Additional Notes for AI (Optional)</FormLabel>
                  <FormControl>
                  <Textarea placeholder="Any other specific context, constraints, or preferences for the AI to consider when generating the guide." {...field} rows={4}/>
                  </FormControl>
                  <FormDescription>More details to help the AI tailor the guide.</FormDescription>
                  <FormMessage />
              </FormItem>
              )}
          />
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <Button type="submit" disabled={isSaving || isGenerating} size="lg">
                {isSaving ? (
                <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Saving Details...
                </>
                ) : (
                <>
                    <Save className="mr-2 h-5 w-5" />
                    Save Project Details
                </>
                )}
            </Button>
            <Button type="button" onClick={handleGenerateGuide} disabled={isSaving || isGenerating || form.formState.isDirty} size="lg" variant="outline">
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating Guide...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-5 w-5" />
                  Generate Development Guide
                </>
              )}
            </Button>
          </div>
           {form.formState.isDirty && (
                <p className="text-sm text-yellow-600 flex items-center"><AlertTriangle className="mr-2 h-4 w-4" />You have unsaved changes. Please save before generating the guide.</p>
            )}
        </form>
      </Form>

      <div id="ai-guide-section">
        {(isGenerating || generatedGuide) && <Separator className="my-12" />}

        {isGenerating && (
          <div className="space-y-4">
              <div className="flex items-center space-x-2">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-lg text-muted-foreground">AI is crafting your development guide, please wait...</p>
              </div>
              <Card className="animate-pulse">
                  <CardHeader><div className="h-6 bg-muted rounded w-1/2"></div></CardHeader>
                  <CardContent className="space-y-3">
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                      <div className="h-4 bg-muted rounded w-full"></div>
                      <div className="h-4 bg-muted rounded w-5/6"></div>
                      <div className="h-4 bg-muted rounded w-full mt-4"></div>
                      <div className="h-4 bg-muted rounded w-1/2"></div>
                  </CardContent>
              </Card>
          </div>
        )}

        {!isGenerating && generatedGuide && (
          <Card className="mt-8 border-primary/70 shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-2xl flex items-center text-primary">
                <Wand2 className="mr-3 h-7 w-7" /> Your AI-Generated Development Guide
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MarkdownDisplay content={generatedGuide} />
              <p className="text-xs text-muted-foreground mt-4">
                This guide is AI-generated. Always review and adapt it to your specific needs and context.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
