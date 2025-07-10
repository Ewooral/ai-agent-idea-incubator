
// src/app/validation/page.tsx
"use client";

import type { RefineIdeaInput, RefineIdeaOutput } from '@/ai/flows/refine-idea-with-ai';
import { refineIdea } from '@/ai/flows/refine-idea-with-ai';
import { saveValidatedIdeaAction } from '@/app/actions/ideaActions';
import { translateTextAction } from '@/app/actions/translationActions';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle, Loader2, BarChart3, Tag, Lightbulb, TrendingUp, ShieldCheck, Target, Search, Zap, Save, Image as ImageIcon, Upload, BrainCircuit, X } from 'lucide-react';
import { useState, type ReactNode, useEffect, useMemo, useCallback } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/contexts/language-context';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, type ChartConfig } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import type { AnalyzeImageOutput } from '@/ai/flows/analyze-image-for-insights';
import { Label } from '@/components/ui/label';
import { FormLabel } from '@/components/ui/form';


const validationSchema = z.object({
  idea: z.string().min(10, { message: "Please provide a detailed idea (min 10 characters)." }),
  marketData: z.string().optional().describe("Any relevant market data or trends."),
  focusKeywords: z.string().optional().describe("Specific keywords to guide the AI's focus."),
});

type ValidationFormValues = z.infer<typeof validationSchema>;

const chartConfigBase = {
  score: {
    label: "Score (0-100)",
    color: "hsl(var(--chart-1))", 
  },
} satisfies ChartConfig;

// Image Analysis Component
function ImageAnalysisSection() {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageDataUri, setImageDataUri] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<AnalyzeImageOutput | null>(null);
    const [analysisError, setAnalysisError] = useState<string | null>(null);
    const { toast } = useToast();

    const handleFileChange = (file: File) => {
        if (file) {
            if (file.size > 4 * 1024 * 1024) { // 4MB limit
                toast({ title: "Image too large", description: "Please upload an image smaller than 4MB.", variant: "destructive" });
                return;
            }
            const reader = new FileReader();
            reader.onload = (e) => {
                const dataUri = e.target?.result as string;
                setImagePreview(dataUri);
                setImageDataUri(dataUri);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const onDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();
    const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file) handleFileChange(file);
    };

    const handleAnalyzeClick = async () => {
        if (!imageDataUri) {
            toast({ title: "No image selected", description: "Please upload an image to analyze.", variant: "destructive" });
            return;
        }
        setIsAnalyzing(true);
        setAnalysisResult(null);
        setAnalysisError(null);

        try {
            const response = await fetch('/api/image-analysis', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ photoDataUri: imageDataUri }),
            });

            if (!response.ok) {
                // Try to get error details from the JSON response, but handle cases where it's not JSON
                let errorDetails = 'Failed to analyze image due to a server error.';
                try {
                    const errorResult = await response.json();
                    errorDetails = errorResult.details || errorResult.error || errorDetails;
                } catch (jsonError) {
                    // The error response wasn't JSON. Use the status text.
                    errorDetails = response.statusText;
                }
                throw new Error(errorDetails);
            }

            const result = await response.json();
            setAnalysisResult(result);
            toast({ title: "Analysis Complete!", description: "AI has provided insights on the image." });
        } catch (error: any) {
            setAnalysisError(error.message);
            toast({ title: "Analysis Error", description: error.message, variant: "destructive" });
        } finally {
            setIsAnalyzing(false);
        }
    };
    
    const clearImage = () => {
        setImagePreview(null);
        setImageDataUri(null);
        setAnalysisResult(null);
        setAnalysisError(null);
    };

    return (
        <Card className="mt-8 shadow-xl bg-card border-secondary/50">
            <CardHeader>
                <CardTitle className="font-headline text-xl sm:text-2xl flex items-center text-secondary-foreground">
                    <ImageIcon size={28} className="mr-3 text-primary"/> Visual Competitive Analysis (SaaS Feature)
                </CardTitle>
                <CardDescription>Upload a competitor's screenshot or product image to get AI-powered UI/UX and branding insights.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    <div>
                        <Label htmlFor="image-upload-input" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Upload Image</Label>
                        {!imagePreview ? (
                            <div 
                                onDragOver={onDragOver}
                                onDrop={onDrop}
                                className="mt-2 flex justify-center items-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                                onClick={() => document.getElementById('image-upload-input')?.click()}
                            >
                                <div className="text-center">
                                    <Upload className="mx-auto h-10 w-10 text-muted-foreground" />
                                    <p className="mt-2 text-sm text-muted-foreground">
                                      <span className="font-semibold text-primary">Click to upload</span> or drag and drop
                                    </p>
                                    <p className="text-xs text-muted-foreground">PNG, JPG, or WEBP (MAX. 4MB)</p>
                                </div>
                                <Input 
                                    id="image-upload-input" 
                                    type="file" 
                                    className="hidden" 
                                    accept="image/png, image/jpeg, image/webp"
                                    onChange={(e) => e.target.files && handleFileChange(e.target.files[0])}
                                />
                            </div>
                        ) : (
                            <div className="mt-2 relative">
                                <img src={imagePreview} alt="Image preview" className="w-full h-48 object-contain rounded-lg border bg-muted/20" />
                                <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={clearImage}>
                                    <X className="h-4 w-4" />
                                    <span className="sr-only">Remove image</span>
                                </Button>
                            </div>
                        )}
                        <div className="mt-4">
                            <Button onClick={handleAnalyzeClick} disabled={!imagePreview || isAnalyzing} className="w-full">
                                {isAnalyzing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Analyzing...</> : <><BrainCircuit className="mr-2 h-4 w-4"/>Analyze Image with AI</>}
                            </Button>
                        </div>
                    </div>

                    <div>
                        <Label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">AI Insights</Label>
                        <div className="mt-2 min-h-48">
                            {isAnalyzing && (
                                <div className="flex flex-col items-center justify-center h-full space-y-2 text-muted-foreground">
                                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                    <p>AI is analyzing the image...</p>
                                </div>
                            )}
                            {analysisError && <p className="text-destructive text-sm">{analysisError}</p>}
                            {analysisResult && !isAnalyzing && (
                                <div className="space-y-4 text-sm">
                                    <div>
                                        <h4 className="font-semibold text-foreground">UI/UX Analysis</h4>
                                        <p className="text-muted-foreground">{analysisResult.uiUxAnalysis}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-foreground">Branding & Marketing</h4>
                                        <p className="text-muted-foreground">{analysisResult.brandAndMarketingAnalysis}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-foreground">Identified Features</h4>
                                        <ul className="list-disc list-inside text-muted-foreground">
                                            {analysisResult.featureIdentification.map((f, i) => <li key={i}>{f}</li>)}
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-foreground">Potential Improvements</h4>
                                        <ul className="list-disc list-inside text-muted-foreground">
                                            {analysisResult.potentialImprovements.map((p, i) => <li key={i}>{p}</li>)}
                                        </ul>
                                    </div>
                                </div>
                            )}
                            {!isAnalyzing && !analysisResult && !analysisError && (
                                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                                    <BrainCircuit className="h-8 w-8 mb-2" />
                                    <p className="text-sm">Analysis results will appear here.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}


export default function ValidationPage(): ReactNode {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [validationResult, setValidationResult] = useState<RefineIdeaOutput | null>(null);
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const { selectedLanguage, getLanguageName } = useLanguage();
  const [translatedRefinedIdea, setTranslatedRefinedIdea] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState<boolean>(false);

  const form = useForm<ValidationFormValues>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      idea: searchParams.get('idea') || "",
      marketData: "",
      focusKeywords: "",
    },
  });

 useEffect(() => {
    const ideaFromQuery = searchParams.get('idea');
    if (ideaFromQuery && !form.getValues('idea')) {
      form.setValue('idea', ideaFromQuery);
    }
  }, [searchParams, form]);

  useEffect(() => {
    if (selectedLanguage === 'en' || !validationResult?.refinedIdea) {
      setTranslatedRefinedIdea(null); 
      return;
    }

    const translate = async () => {
      setIsTranslating(true);
      try {
        const languageName = getLanguageName(selectedLanguage);
        if (!languageName) {
          throw new Error("Invalid language selected for translation.");
        }
        const translationInput = {
          textToTranslate: validationResult.refinedIdea,
          targetLanguage: languageName, 
        };
        const result = await translateTextAction(translationInput);
        if (result.success && result.translatedText) {
          setTranslatedRefinedIdea(result.translatedText);
          toast({
            title: `Idea translated to ${languageName}!`,
          });
        } else {
          throw new Error(result.message || "Translation failed.");
        }
      } catch (error: any) {
        console.error("Translation error:", error);
        setTranslatedRefinedIdea(null); 
        toast({
          title: "Translation Error",
          description: error.message || "Could not translate the refined idea.",
          variant: "destructive",
        });
      } finally {
        setIsTranslating(false);
      }
    };

    translate();
  }, [selectedLanguage, validationResult, getLanguageName, toast]);


  const onSubmit: SubmitHandler<ValidationFormValues> = async (data) => {
    setIsLoading(true);
    setValidationResult(null);
    setTranslatedRefinedIdea(null); 
    
    setTimeout(() => {
      const resultsSection = document.getElementById('validation-results-section');
      if (resultsSection) {
          resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 0);


    try {
      const input: RefineIdeaInput = {
        idea: data.idea,
        marketData: data.marketData || undefined,
        focusKeywords: data.focusKeywords || undefined,
      };
      const result = await refineIdea(input);
      setValidationResult(result);
      toast({
        title: "Idea Refined & Analyzed!",
        description: "AI has provided insights and a premium analysis preview for your idea.",
      });
    } catch (error) {
      console.error("Error validating idea:", error);
      toast({
        title: "Error",
        description: "Failed to validate idea. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveIdea = async () => {
    if (!validationResult || !form.getValues('idea')) {
      toast({
        title: "Cannot Save",
        description: "No idea or validation result to save.",
        variant: "destructive",
      });
      return;
    }
    setIsSaving(true);
    try {
      const result = await saveValidatedIdeaAction(form.getValues('idea'), validationResult);
      if (result.success) {
        toast({
          title: "Idea Saved!",
          description: result.message || "Your idea has been saved to the dashboard.",
        });
      } else {
        toast({
          title: "Save Failed",
          description: result.message || "Could not save the idea.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error saving idea via action:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while saving.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const displayedRefinedIdea = selectedLanguage !== 'en' && translatedRefinedIdea ? translatedRefinedIdea : validationResult?.refinedIdea;

  const dynamicChartConfig = useMemo(() => {
    if (!validationResult?.viabilityFactorsChartData) return chartConfigBase;

    const config: ChartConfig = { ...chartConfigBase };
    return config;
  }, [validationResult]);

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="mb-8 shadow-xl bg-card">
        <CardHeader>
          <CardTitle className="font-headline text-2xl sm:text-3xl flex items-center">
            <Zap className="mr-3 text-primary" size={32} /> AI Idea Refinement & Validation
          </CardTitle>
          <CardDescription>
            Submit your business idea to our AI for refinement, associated concepts, potential pivots, and a preview of premium market analysis. Select a language from the sidebar to translate the refined idea.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="idea"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Core Idea</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your business idea in detail... What problem does it solve? Who is it for?"
                        {...field}
                        rows={5}
                      />
                    </FormControl>
                    <FormDescription>
                      The more detail you provide, the better the AI's analysis will be.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="marketData"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Market Context (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Target audience insights, existing solutions, market trends"
                          {...field}
                        />
                      </FormControl>
                       <FormDescription>
                        Any specific market information you have.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="focusKeywords"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Focus Keywords (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Sustainability, B2B SaaS, AI-driven, EdTech"
                          {...field}
                        />
                      </FormControl>
                       <FormDescription>
                        Keywords to guide the AI's refinement focus.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" disabled={isLoading || isSaving} className="w-full sm:w-auto" size="lg">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Analyzing Your Idea...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-5 w-5" />
                    Validate & Refine with AI
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div id="validation-results-section">
        {isLoading && (
           <Card className="mt-8 animate-pulse bg-card shadow-lg min-h-[70vh] flex flex-col justify-center">
              <CardHeader>
                  <div className="h-8 bg-muted rounded w-3/4 mx-auto sm:mx-0"></div>
                  <div className="h-4 bg-muted rounded w-1/2 mt-2 mx-auto sm:mx-0"></div>
              </CardHeader>
              <CardContent className="space-y-6">
                  <div className="pt-4">
                    <div className="h-6 bg-muted rounded w-1/4 mb-2"></div>
                    <div className="h-4 bg-muted rounded w-full"></div>
                    <div className="h-4 bg-muted rounded w-5/6 mt-1"></div>
                  </div>
                  <div>
                    <div className="h-6 bg-muted rounded w-1/3 mb-2"></div>
                    <div className="flex flex-wrap gap-2">
                        <div className="h-8 bg-muted rounded-full w-24"></div>
                        <div className="h-8 bg-muted rounded-full w-32"></div>
                        <div className="h-8 bg-muted rounded-full w-28"></div>
                    </div>
                  </div>
                  <div className="h-40 bg-muted rounded-lg w-full"></div> 
                  <div className="h-10 bg-muted rounded w-1/3 mt-4"></div>
              </CardContent>
           </Card>
        )}

        {!isLoading && validationResult && (
          <>
          <Card className="mt-8 shadow-xl bg-card border-primary/50">
            <CardHeader className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div>
                <CardTitle className="font-headline text-xl sm:text-2xl flex items-center text-primary">
                  <Lightbulb size={28} className="mr-3"/> AI Refinement & Strategic Insights
                </CardTitle>
                <CardDescription>Review the AI's analysis of your idea below. Use the language selector in the sidebar to translate the refined idea.</CardDescription>
              </div>
              <Button onClick={handleSaveIdea} disabled={isSaving || isLoading} size="lg" className="w-full sm:w-auto">
                {isSaving ? (
                  <><Loader2 className="mr-2 h-5 w-5 animate-spin" />Saving...</>
                ) : (
                  <><Save className="mr-2 h-5 w-5" />Save to Dashboard</>
                )}
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 text-foreground flex items-center">
                  <CheckCircle size={22} className="mr-2 text-green-500"/>
                  Refined Idea {selectedLanguage !== 'en' && getLanguageName(selectedLanguage) ? `(Translated to ${getLanguageName(selectedLanguage)})` : ''}:
                </h3>
                {isTranslating ? (
                  <div className="flex items-center space-x-2 bg-muted/30 p-4 rounded-md border">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    <p>Translating...</p>
                  </div>
                ) : (
                  <p className="text-foreground/90 text-base leading-relaxed bg-muted/30 p-4 rounded-md border">
                    {displayedRefinedIdea || "Enter an idea above to see the refined version here."}
                  </p>
                )}
              </div>
              
              {validationResult.associatedConcepts && validationResult.associatedConcepts.length > 0 && (
                <div>
                  <h3 className="text-base sm:text-lg font-semibold mb-2 text-foreground flex items-center"><Tag size={20} className="mr-2 text-accent"/>Associated Concepts:</h3>
                  <div className="flex flex-wrap gap-2">
                    {validationResult.associatedConcepts.map((concept, index) => (
                      <Badge key={index} variant="secondary" className="text-xs sm:text-sm px-2 sm:px-3 py-1">{concept}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {validationResult.potentialPivots && validationResult.potentialPivots.length > 0 && (
                 <div>
                  <h3 className="text-base sm:text-lg font-semibold mb-2 text-foreground flex items-center"><TrendingUp size={20} className="mr-2 text-accent"/>Potential Pivots:</h3>
                   <div className="flex flex-wrap gap-2">
                    {validationResult.potentialPivots.map((pivot, index) => (
                      <Badge key={index} variant="outline" className="text-xs sm:text-sm px-2 sm:px-3 py-1 bg-accent/10 border-accent text-accent-foreground hover:bg-accent/20">{pivot}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          <ImageAnalysisSection />

          <Card className="mt-8 shadow-xl bg-gradient-to-br from-primary/10 via-card to-accent/10 border-accent/50">
            <CardHeader>
                <CardTitle className="font-headline text-xl sm:text-2xl flex items-center text-primary">
                    <ShieldCheck size={28} className="mr-3" /> AI-Generated Analysis
                </CardTitle>
                <CardDescription>AI-driven market insights and strategic advantages for your idea.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                    <Card className="bg-card/80 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="text-base sm:text-lg flex items-center"><Target size={20} className="mr-2 text-primary"/>Overall Market Potential Score</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center space-x-3 mb-2">
                                <Progress value={validationResult.marketPotentialScore} className="w-full h-3 sm:h-4" />
                                <span className="font-bold text-xl sm:text-2xl text-primary">{validationResult.marketPotentialScore}%</span>
                            </div>
                            <p className="text-xs text-muted-foreground">AI-estimated overall potential based on current inputs.</p>
                        </CardContent>
                    </Card>
                     <Card className="bg-card/80 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="text-base sm:text-lg flex items-center"><Zap size={20} className="mr-2 text-primary"/>Key SWOT Snippet</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-foreground/90 text-sm p-3 bg-muted/50 rounded-md border border-dashed">{validationResult.swotSnippet}</p>
                            <p className="text-xs text-muted-foreground mt-2">A key insight from the AI's SWOT analysis.</p>
                        </CardContent>
                    </Card>
                </div>
                 <Card className="bg-card/80 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-base sm:text-lg flex items-center"><Search size={20} className="mr-2 text-primary"/>Competitor Landscape Teaser</CardTitle>
                    </CardHeader>
                    <CardContent>
                         <p className="text-foreground/90 text-sm p-3 bg-muted/50 rounded-md border border-dashed">{validationResult.competitorTeaser}</p>
                         <p className="text-xs text-muted-foreground mt-2">Initial AI insight into the competitive space.</p>
                    </CardContent>
                </Card>

                {validationResult.conceptualImageUrl && (
                  <Card className="bg-card/80 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-base sm:text-lg flex items-center"><ImageIcon size={20} className="mr-2 text-primary"/>Conceptual Image</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <img 
                        src={validationResult.conceptualImageUrl} 
                        alt="AI-generated conceptual image for the idea" 
                        className="w-full h-auto max-h-80 object-contain rounded-lg border bg-muted/20 shadow-sm"
                        data-ai-hint="business concept abstract"
                      />
                       <p className="text-xs text-muted-foreground mt-2">An AI-generated visual representation of the refined idea.</p>
                    </CardContent>
                  </Card>
                )}

                {validationResult.viabilityFactorsChartData && validationResult.viabilityFactorsChartData.length > 0 ? (
                  <Card className="bg-card/80 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-base sm:text-lg flex items-center"><BarChart3 size={20} className="mr-2 text-primary"/>AI-Generated Market Viability Factors</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <div className="h-64 sm:h-80 w-full rounded-lg bg-muted/30 border border-dashed p-4">
                        <ChartContainer config={dynamicChartConfig} className="min-h-[200px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart accessibilityLayer data={validationResult.viabilityFactorsChartData} margin={{ top: 5, right: 20, left: -20, bottom: 20 }}>
                                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                                <XAxis
                                  dataKey="name"
                                  tickLine={false}
                                  tickMargin={10}
                                  axisLine={false}
                                  angle={-30}
                                  textAnchor="end"
                                  height={50}
                                  interval={0}
                                  tickFormatter={(value) => value.length > 12 ? `${value.substring(0,10)}...` : value}
                                  className="text-xs"
                                />
                                <YAxis 
                                  tickLine={false}
                                  axisLine={false}
                                  tickMargin={10}
                                  domain={[0, 100]}
                                  className="text-xs"
                                />
                                <ChartTooltip
                                  cursor={false}
                                  content={<ChartTooltipContent />}
                                />
                                <ChartLegend content={<ChartLegendContent wrapperStyle={{ fontSize: '0.75rem' }} />} />
                                <Bar dataKey="score" fill="var(--color-score)" radius={window.innerWidth < 640 ? 4 : 8} />
                              </BarChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        This chart displays AI-estimated scores for key viability factors related to your idea.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="bg-card/80 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-base sm:text-lg flex items-center"><BarChart3 size={20} className="mr-2 text-primary"/>Market Viability Factors</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">Detailed chart data for viability factors was not generated for this idea. Try refining your input.</p>
                    </CardContent>
                  </Card>
                )}
            </CardContent>
            <CardFooter className="pt-4">
                 <p className="text-sm text-muted-foreground max-w-md">
                    The AI has analyzed your idea based on the provided inputs.
                </p>
            </CardFooter>
          </Card>
          </>
        )}
         {!isLoading && !validationResult && (
          <div className="text-center py-16 text-muted-foreground min-h-[70vh] flex flex-col justify-center items-center bg-card shadow-md rounded-lg mt-8">
              <Zap size={48} className="mx-auto mb-4 text-primary/50" />
              <p className="text-base sm:text-lg">Enter your idea above and let our AI provide valuable insights.</p>
              <p className="text-xs sm:text-sm">The validation results and AI-driven analysis will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}

    
