// src/app/validation/page.tsx
"use client";

import type { RefineIdeaInput, RefineIdeaOutput } from '@/ai/flows/refine-idea-with-ai';
import { refineIdea } from '@/ai/flows/refine-idea-with-ai';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle, Loader2, BarChart3, Tag, Lightbulb, TrendingUp, ShieldCheck, Target, Search, Zap } from 'lucide-react';
import Image from 'next/image';
import { useState, type ReactNode, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const validationSchema = z.object({
  idea: z.string().min(10, { message: "Please provide a detailed idea (min 10 characters)." }),
  marketData: z.string().optional().describe("Any relevant market data or trends."),
  focusKeywords: z.string().optional().describe("Specific keywords to guide the AI's focus."),
});

type ValidationFormValues = z.infer<typeof validationSchema>;

export default function ValidationPage(): ReactNode {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [validationResult, setValidationResult] = useState<RefineIdeaOutput | null>(null);
  const { toast } = useToast();
  const searchParams = useSearchParams();

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


  const onSubmit: SubmitHandler<ValidationFormValues> = async (data) => {
    setIsLoading(true);
    setValidationResult(null);
    // Scroll to results section if it exists
    const resultsSection = document.getElementById('validation-results-section');
    if (resultsSection) {
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

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
  
  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="mb-8 shadow-xl bg-card">
        <CardHeader>
          <CardTitle className="font-headline text-3xl flex items-center">
            <Zap className="mr-3 text-primary" size={32} /> AI Idea Refinement & Validation
          </CardTitle>
          <CardDescription>
            Submit your business idea to our AI for refinement, associated concepts, potential pivots, and a preview of premium market analysis.
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
                        className="text-base"
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
              <Button type="submit" disabled={isLoading} className="w-full sm:w-auto" size="lg">
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
           <Card className="mt-8 animate-pulse bg-card shadow-lg">
              <CardHeader>
                  <div className="h-8 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2 mt-2"></div>
              </CardHeader>
              <CardContent className="space-y-6">
                  <div>
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
                  <div className="h-20 bg-muted rounded-lg w-full"></div>
                  <div className="h-10 bg-muted rounded w-1/3"></div>
              </CardContent>
           </Card>
        )}

        {!isLoading && validationResult && (
          <>
          <Card className="mt-8 shadow-xl bg-card border-primary/50">
            <CardHeader>
              <CardTitle className="font-headline text-2xl flex items-center text-primary">
                <Lightbulb size={28} className="mr-3"/> AI Refinement & Strategic Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2 text-foreground flex items-center"><CheckCircle size={22} className="mr-2 text-green-500"/>Refined Idea:</h3>
                <p className="text-foreground/90 text-base leading-relaxed bg-muted/30 p-4 rounded-md border">{validationResult.refinedIdea}</p>
              </div>
              
              {validationResult.associatedConcepts && validationResult.associatedConcepts.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-foreground flex items-center"><Tag size={20} className="mr-2 text-accent"/>Associated Concepts:</h3>
                  <div className="flex flex-wrap gap-2">
                    {validationResult.associatedConcepts.map((concept, index) => (
                      <Badge key={index} variant="secondary" className="text-sm px-3 py-1">{concept}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {validationResult.potentialPivots && validationResult.potentialPivots.length > 0 && (
                 <div>
                  <h3 className="text-lg font-semibold mb-2 text-foreground flex items-center"><TrendingUp size={20} className="mr-2 text-accent"/>Potential Pivots:</h3>
                   <div className="flex flex-wrap gap-2">
                    {validationResult.potentialPivots.map((pivot, index) => (
                      <Badge key={index} variant="outline" className="text-sm px-3 py-1 bg-accent/10 border-accent text-accent-foreground hover:bg-accent/20">{pivot}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="mt-8 shadow-xl bg-gradient-to-br from-primary/10 via-card to-accent/10 border-accent/50">
            <CardHeader>
                <CardTitle className="font-headline text-2xl flex items-center text-primary">
                    <ShieldCheck size={28} className="mr-3" /> Premium AI Analysis (Preview)
                </CardTitle>
                <CardDescription>Unlock deeper market insights and strategic advantages with our full premium analysis.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                    <Card className="bg-card/80 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center"><Target size={20} className="mr-2 text-primary"/>Market Potential Score</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center space-x-3 mb-2">
                                <Progress value={validationResult.marketPotentialScore} className="w-full h-4" />
                                <span className="font-bold text-2xl text-primary">{validationResult.marketPotentialScore}%</span>
                            </div>
                            <p className="text-xs text-muted-foreground">AI-estimated potential based on current inputs. Full report includes detailed breakdown.</p>
                        </CardContent>
                    </Card>
                     <Card className="bg-card/80 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center"><Zap size={20} className="mr-2 text-primary"/>Key SWOT Snippet</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-foreground/90 text-sm p-3 bg-muted/50 rounded-md border border-dashed">{validationResult.swotSnippet}</p>
                            <p className="text-xs text-muted-foreground mt-2">A glimpse from the AI's SWOT analysis. Full analysis covers all S-W-O-T aspects.</p>
                        </CardContent>
                    </Card>
                </div>
                 <Card className="bg-card/80 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center"><Search size={20} className="mr-2 text-primary"/>Competitor Landscape Teaser</CardTitle>
                    </CardHeader>
                    <CardContent>
                         <p className="text-foreground/90 text-sm p-3 bg-muted/50 rounded-md border border-dashed">{validationResult.competitorTeaser}</p>
                         <p className="text-xs text-muted-foreground mt-2">Initial AI insight. Full report identifies key competitors, their strategies, and market positioning.</p>
                    </CardContent>
                </Card>

                {/* Placeholder for more premium features like mock charts */}
                <div className="border rounded-lg p-4 flex flex-col justify-center items-center bg-muted/30 min-h-[150px] text-center">
                    <BarChart3 size={36} className="text-primary/50 mb-2"/>
                    <h4 className="font-semibold text-muted-foreground">Deeper Market Viability Charts & Trend Analysis</h4>
                    <p className="text-xs text-muted-foreground mt-1">Full premium reports include visualizations of market trends, TAM/SAM/SOM estimates, and more.</p>
                </div>
            </CardContent>
            <CardFooter className="flex-col items-start space-y-2 sm:flex-row sm:justify-between sm:items-center pt-4">
                <p className="text-sm text-muted-foreground max-w-md">
                    This preview demonstrates the power of our advanced AI analytics. 
                </p>
                <Button size="lg" disabled className="w-full sm:w-auto">
                    <Lightbulb className="mr-2 h-5 w-5" /> Upgrade for Full Report (Coming Soon)
                </Button>
            </CardFooter>
          </Card>
          </>
        )}
         {!isLoading && !validationResult && (
          <div className="text-center py-16 text-muted-foreground min-h-[200px] flex flex-col justify-center items-center bg-card shadow-md rounded-lg mt-8">
              <Zap size={48} className="mx-auto mb-4 text-primary/50" />
              <p className="text-lg">Enter your idea above and let our AI provide valuable insights.</p>
              <p className="text-sm">The validation results and premium analysis preview will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
