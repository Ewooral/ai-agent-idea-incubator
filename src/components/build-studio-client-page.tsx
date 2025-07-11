// src/components/build-studio-client-page.tsx
"use client";

import { useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { SavedIdea, BuildProject } from '@/lib/db';
import { saveBuildProjectAction, generateDevelopmentGuideAction, generateBusinessProposalAction } from '@/app/actions/buildActions';
import { BuildProjectDataSchema, type BuildProjectFormValues } from '@/app/schemas/build.schemas';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, FileText, Users, Activity, DollarSign, Save, Wand2, AlertTriangle, Briefcase, Printer, FileDown } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { MarkdownDisplay } from './markdown-display';
import { useLanguage } from '@/contexts/language-context'; 
import { translateTextAction } from '@/app/actions/translationActions'; 


interface BuildStudioClientPageProps {
  ideaId: string;
  initialSavedIdea: SavedIdea;
  initialBuildProject: BuildProject | null;
}

export function BuildStudioClientPage({ ideaId, initialSavedIdea, initialBuildProject }: BuildStudioClientPageProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingGuide, setIsGeneratingGuide] = useState(false);
  const [isGeneratingProposal, setIsGeneratingProposal] = useState(false);
  const [generatedGuide, setGeneratedGuide] = useState<string | undefined>(initialBuildProject?.generatedGuideMarkdown);
  const [generatedProposal, setGeneratedProposal] = useState<string | undefined>(initialBuildProject?.generatedBusinessProposalMarkdown);
  const [_, startTransition] = useTransition();

  const { selectedLanguage, getLanguageName } = useLanguage();
  const [translatedGuideMarkdown, setTranslatedGuideMarkdown] = useState<string | null>(null);
  const [isTranslatingGuide, setIsTranslatingGuide] = useState<boolean>(false);
  const [translatedProposalMarkdown, setTranslatedProposalMarkdown] = useState<string | null>(null);
  const [isTranslatingProposal, setIsTranslatingProposal] = useState<boolean>(false);


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
      generatedGuideMarkdown: initialBuildProject?.generatedGuideMarkdown,
      generatedBusinessProposalMarkdown: initialBuildProject?.generatedBusinessProposalMarkdown,
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
      generatedGuideMarkdown: initialBuildProject?.generatedGuideMarkdown,
      generatedBusinessProposalMarkdown: initialBuildProject?.generatedBusinessProposalMarkdown,
    });
    setGeneratedGuide(initialBuildProject?.generatedGuideMarkdown);
    setGeneratedProposal(initialBuildProject?.generatedBusinessProposalMarkdown);
  }, [ideaId, initialBuildProject, form]);

  // Effect for translating Development Guide
  useEffect(() => {
    if (!generatedGuide) {
      setTranslatedGuideMarkdown(null);
      return;
    }
    if (selectedLanguage === 'en') {
      setTranslatedGuideMarkdown(null); 
      return;
    }
    const translate = async () => {
      setIsTranslatingGuide(true);
      try {
        const langName = getLanguageName(selectedLanguage);
        if (!langName) throw new Error("Invalid language for guide.");
        const res = await translateTextAction({ textToTranslate: generatedGuide, targetLanguage: langName });
        if (res.success && res.translatedText) setTranslatedGuideMarkdown(res.translatedText);
        else throw new Error(res.message || "Guide translation failed.");
      } catch (e: any) { setTranslatedGuideMarkdown(null); toast({ title: "Guide Translation Error", description: e.message, variant: "destructive" }); }
      finally { setIsTranslatingGuide(false); }
    };
    translate();
  }, [selectedLanguage, generatedGuide, getLanguageName, toast]);

  // Effect for translating Business Proposal
  useEffect(() => {
    if (!generatedProposal) {
      setTranslatedProposalMarkdown(null);
      return;
    }
    if (selectedLanguage === 'en') {
      setTranslatedProposalMarkdown(null);
      return;
    }
    const translate = async () => {
      setIsTranslatingProposal(true);
      try {
        const langName = getLanguageName(selectedLanguage);
        if (!langName) throw new Error("Invalid language for proposal.");
        const res = await translateTextAction({ textToTranslate: generatedProposal, targetLanguage: langName });
        if (res.success && res.translatedText) setTranslatedProposalMarkdown(res.translatedText);
        else throw new Error(res.message || "Proposal translation failed.");
      } catch (e: any) { setTranslatedProposalMarkdown(null); toast({ title: "Proposal Translation Error", description: e.message, variant: "destructive" }); }
      finally { setIsTranslatingProposal(false); }
    };
    translate();
  }, [selectedLanguage, generatedProposal, getLanguageName, toast]);


  const onSubmit: SubmitHandler<BuildProjectFormValues> = async (data) => {
    setIsSaving(true);
    try {
      const dataToSave = { ...data, ideaId: ideaId, id: form.getValues('id') };
      const result = await saveBuildProjectAction(dataToSave);
      
      if (result.success && result.project) {
        toast({ title: "Success!", description: result.message });
        form.setValue('id', result.project.id);
        // Update form with potentially new markdown fields if they were part of dataToSave
        form.reset({
            ...form.getValues(), // keep current form values
            id: result.project.id, // ensure ID is updated
            generatedGuideMarkdown: result.project.generatedGuideMarkdown,
            generatedBusinessProposalMarkdown: result.project.generatedBusinessProposalMarkdown,
        }, { keepValues: true, keepDirty: false, keepDefaultValues: false });


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

    setIsGeneratingGuide(true);
    setGeneratedGuide(undefined); 
    setTranslatedGuideMarkdown(null); 
    
    setTimeout(() => {
      document.getElementById('ai-guide-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);

    try {
      const result = await generateDevelopmentGuideAction(ideaId);
      if (result.success && result.guideMarkdown) {
        setGeneratedGuide(result.guideMarkdown); 
        form.setValue('generatedGuideMarkdown', result.guideMarkdown);
        toast({ title: "Guide Generated!", description: "AI has crafted your development guide." });
         startTransition(() => { router.refresh(); });
      } else {
        toast({ title: "Generation Failed", description: result.message || "Could not generate the guide.", variant: "destructive" });
      }
    } catch (error) {
      console.error("Error generating guide:", error);
      toast({ title: "Error", description: "An unexpected error occurred while generating the guide.", variant: "destructive" });
    } finally {
      setIsGeneratingGuide(false);
    }
  };

  const handleGenerateProposal = async () => {
    if (form.formState.isDirty) {
         toast({ title: "Unsaved Changes", description: "Please save project details before generating the proposal.", variant: "destructive" });
         return;
    }
    const requiredFields = ['valueProposition', 'customerSegments', 'keyActivities', 'revenueStreams'];
    const missingFields = requiredFields.filter(field => !form.getValues(field as keyof BuildProjectFormValues));
    if (missingFields.length > 0) {
        toast({ title: "Missing Information", description: `Please fill in: ${missingFields.join(', ')} before generating the proposal.`, variant: "destructive" });
        return;
    }

    setIsGeneratingProposal(true);
    setGeneratedProposal(undefined);
    setTranslatedProposalMarkdown(null);

    setTimeout(() => {
      document.getElementById('ai-proposal-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);

    try {
      const result = await generateBusinessProposalAction(ideaId);
      if (result.success && result.proposalMarkdown) {
        setGeneratedProposal(result.proposalMarkdown);
        form.setValue('generatedBusinessProposalMarkdown', result.proposalMarkdown);
        toast({ title: "Proposal Generated!", description: "AI has crafted your business proposal." });
        startTransition(() => { router.refresh(); });
      } else {
        toast({ title: "Generation Failed", description: result.message || "Could not generate the proposal.", variant: "destructive" });
      }
    } catch (error) {
      console.error("Error generating proposal:", error);
      toast({ title: "Error", description: "An unexpected error occurred while generating the proposal.", variant: "destructive" });
    } finally {
      setIsGeneratingProposal(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };
  
  const displayedGuideContent = selectedLanguage !== 'en' && translatedGuideMarkdown ? translatedGuideMarkdown : generatedGuide;
  const guideCardTitle = `Your AI-Generated Development Guide ${selectedLanguage !== 'en' && getLanguageName(selectedLanguage) ? `(Translated to ${getLanguageName(selectedLanguage)})` : ''}`;
  
  const displayedProposalContent = selectedLanguage !== 'en' && translatedProposalMarkdown ? translatedProposalMarkdown : generatedProposal;
  const proposalCardTitle = `Your AI-Generated Business Proposal ${selectedLanguage !== 'en' && getLanguageName(selectedLanguage) ? `(Translated to ${getLanguageName(selectedLanguage)})` : ''}`;

  const isBusy = isSaving || isGeneratingGuide || isTranslatingGuide || isGeneratingProposal || isTranslatingProposal;

  return (
    <div className="printable-area">
      <div className="no-print">
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
                    <FormLabel className="text-base sm:text-lg flex items-center"><FileText className="mr-2 h-5 w-5 text-accent" />Value Proposition *</FormLabel>
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
                    <FormLabel className="text-base sm:text-lg flex items-center"><Users className="mr-2 h-5 w-5 text-accent" />Customer Segments *</FormLabel>
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
                    <FormLabel className="text-base sm:text-lg flex items-center"><Activity className="mr-2 h-5 w-5 text-accent" />Key Activities *</FormLabel>
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
                    <FormLabel className="text-base sm:text-lg flex items-center"><DollarSign className="mr-2 h-5 w-5 text-accent" />Revenue Streams *</FormLabel>
                    <FormControl>
                    <Textarea placeholder="How will your business generate revenue? (e.g., sales, subscriptions, ads)" {...field} rows={3}/>
                    </FormControl>
                    <FormDescription>Describe your monetization strategy.</FormDescription>
                    <FormMessage />
                </FormItem>
                )}
            />
            
            <Separator />
            <h3 className="text-lg sm:text-xl font-semibold text-foreground pt-4">Details for AI Document Generation</h3>
            
            <FormField
                control={form.control}
                name="targetPlatform"
                render={({ field }) => (
                <FormItem>
                    <FormLabel className="text-base sm:text-lg">Target Platform (Required for Dev Guide)</FormLabel>
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
                    <FormLabel className="text-base sm:text-lg">Core MVP Features (Required for Dev Guide)</FormLabel>
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
                    <FormLabel className="text-base sm:text-lg">Tech Stack Preference (Optional for Dev Guide)</FormLabel>
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
                    <FormLabel className="text-base sm:text-lg">Additional Notes for AI (Optional for all Docs)</FormLabel>
                    <FormControl>
                    <Textarea placeholder="Any other specific context, constraints, or preferences for the AI to consider when generating the guide." {...field} rows={4}/>
                    </FormControl>
                    <FormDescription>More details to help the AI tailor the documents.</FormDescription>
                    <FormMessage />
                </FormItem>
                )}
            />
            <div className="flex flex-col sm:flex-row gap-4 items-center flex-wrap">
              <Button type="submit" disabled={isBusy} size="lg" className="w-full sm:w-auto">
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
              <Button type="button" onClick={handleGenerateGuide} disabled={isBusy || form.formState.isDirty} size="lg" variant="outline" className="w-full sm:w-auto">
                {isGeneratingGuide ? (
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
              <Button type="button" onClick={handleGenerateProposal} disabled={isBusy || form.formState.isDirty} size="lg" variant="outline" className="w-full sm:w-auto">
                {isGeneratingProposal ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Generating Proposal...
                  </>
                ) : (
                  <>
                    <Briefcase className="mr-2 h-5 w-5" />
                    Generate Business Proposal
                  </>
                )}
              </Button>
            </div>
            {form.formState.isDirty && (
                  <p className="text-sm text-yellow-600 flex items-center"><AlertTriangle className="mr-2 h-4 w-4" />You have unsaved changes. Please save before generating documents.</p>
              )}
          </form>
        </Form>
      </div>

      <div id="ai-guide-section" className="print-only">
        {(isGeneratingGuide || generatedGuide || isTranslatingGuide) && <Separator className="my-12 no-print" />}

        {(isGeneratingGuide || isTranslatingGuide) && !generatedGuide && ( 
          <div className="space-y-4 min-h-[70vh] flex flex-col justify-center no-print">
              <div className="flex items-center space-x-2 self-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-lg text-muted-foreground">
                    {isGeneratingGuide ? "AI is crafting your development guide..." : "Translating guide..."}
                  </p>
              </div>
              <Card className="animate-pulse bg-muted/50">
                  <CardHeader><div className="h-6 bg-muted rounded w-1/2"></div></CardHeader>
                  <CardContent className="space-y-3">
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                      <div className="h-4 bg-muted rounded w-full"></div>
                  </CardContent>
              </Card>
          </div>
        )}

        {displayedGuideContent && !isGeneratingGuide && ( 
          <Card className="mt-8 border-primary/70 shadow-lg bg-card print:shadow-none print:border-none">
            <CardHeader className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div>
                <CardTitle className="font-headline text-xl sm:text-2xl flex items-center text-primary">
                  <Wand2 className="mr-3 h-7 w-7" /> {guideCardTitle}
                </CardTitle>
                <CardDescription className="no-print">AI-generated step-by-step guide to build your project. Review and adapt as needed.</CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto no-print">
                  <Button variant="outline" onClick={handlePrint} className="w-full">
                      <FileDown className="mr-2 h-4 w-4" /> Export as PDF
                  </Button>
                  <Button variant="outline" onClick={handlePrint} className="w-full">
                      <Printer className="mr-2 h-4 w-4" /> Print Guide
                  </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isTranslatingGuide && ( 
                <div className="flex items-center space-x-2 my-4 min-h-[30vh] justify-center no-print">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <p className="text-md text-muted-foreground">Translating guide...</p>
                </div>
              )}
              {!isTranslatingGuide && <MarkdownDisplay content={displayedGuideContent} />}
            </CardContent>
          </Card>
        )}
      </div>

      <div id="ai-proposal-section" className="no-print">
        {(isGeneratingProposal || generatedProposal || isTranslatingProposal) && <Separator className="my-12" />}

        {(isGeneratingProposal || isTranslatingProposal) && !generatedProposal && ( 
          <div className="space-y-4 min-h-[70vh] flex flex-col justify-center">
              <div className="flex items-center space-x-2 self-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-lg text-muted-foreground">
                     {isGeneratingProposal ? "AI is crafting your business proposal..." : "Translating proposal..."}
                  </p>
              </div>
               <Card className="animate-pulse bg-muted/50">
                  <CardHeader><div className="h-6 bg-muted rounded w-1/2"></div></CardHeader>
                  <CardContent className="space-y-3">
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                      <div className="h-4 bg-muted rounded w-full"></div>
                  </CardContent>
              </Card>
          </div>
        )}

        {displayedProposalContent && !isGeneratingProposal && ( 
          <Card className="mt-8 border-accent/70 shadow-xl bg-card">
            <CardHeader>
              <CardTitle className="font-headline text-xl sm:text-2xl flex items-center text-primary">
                <Briefcase className="mr-3 h-7 w-7" /> {proposalCardTitle}
              </CardTitle>
              <CardDescription>AI-generated business proposal. Use as a starting point for investor discussions.</CardDescription>
            </CardHeader>
            <CardContent>
               {isTranslatingProposal && ( 
                <div className="flex items-center space-x-2 my-4 min-h-[30vh] justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <p className="text-md text-muted-foreground">Translating proposal...</p>
                </div>
              )}
              {!isTranslatingProposal && <MarkdownDisplay content={displayedProposalContent} />}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
