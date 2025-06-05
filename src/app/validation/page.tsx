// src/app/validation/page.tsx
"use client";

import type { RefineIdeaInput, RefineIdeaOutput } from '@/ai/flows/refine-idea-with-ai';
import { refineIdea } from '@/ai/flows/refine-idea-with-ai';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle, Loader2, BarChart3, Tag } from 'lucide-react';
import Image from 'next/image';
import { useState, type ReactNode } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

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

  const form = useForm<ValidationFormValues>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      idea: "",
      marketData: "",
      focusKeywords: "",
    },
  });

  const onSubmit: SubmitHandler<ValidationFormValues> = async (data) => {
    setIsLoading(true);
    setValidationResult(null);
    try {
      const input: RefineIdeaInput = {
        idea: data.idea,
        marketData: data.marketData || undefined,
        focusKeywords: data.focusKeywords || undefined,
      };
      const result = await refineIdea(input);
      setValidationResult(result);
      toast({
        title: "Idea Refined!",
        description: "AI has provided insights on your idea.",
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
  
  // Mock validation score based on result content
  const calculateMockScore = (result: RefineIdeaOutput | null) => {
    if (!result) return 0;
    let score = 50; // Base score
    if (result.refinedIdea && result.refinedIdea.length > 50) score += 15;
    if (result.associatedConcepts && result.associatedConcepts.length > 2) score += 15;
    if (result.potentialPivots && result.potentialPivots.length > 1) score += 20;
    return Math.min(score, 95); // Cap at 95
  };
  const mockScore = calculateMockScore(validationResult);


  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="mb-8 shadow-xl bg-card">
        <CardHeader>
          <CardTitle className="font-headline text-3xl flex items-center">
            <CheckCircle className="mr-3 text-primary" size={32} /> Idea Validation
          </CardTitle>
          <CardDescription>
            Refine your business idea with AI. Get insights on associated concepts,
            potential pivots, and a preliminary market viability check.
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
                    <FormLabel>Your Idea</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your business idea in detail..."
                        {...field}
                        rows={5}
                      />
                    </FormControl>
                    <FormDescription>
                      The core concept you want to validate and refine.
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
                      <FormLabel>Market Data (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Target audience demographics, competitor analysis"
                          {...field}
                        />
                      </FormControl>
                       <FormDescription>
                        Contextual information about the market.
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
                          placeholder="e.g., Sustainability, B2B, AI-driven"
                          {...field}
                        />
                      </FormControl>
                       <FormDescription>
                        Keywords to narrow down the AI's refinement.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  "Validate & Refine Idea"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
         <Card className="mt-8 animate-pulse bg-card">
            <CardHeader>
                <div className="h-8 bg-muted rounded w-1/2"></div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="h-6 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-5/6"></div>
                <div className="h-20 bg-muted rounded w-full"></div>
            </CardContent>
         </Card>
      )}

      {!isLoading && validationResult && (
        <Card className="mt-8 shadow-lg bg-card">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Validation Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2 text-primary">Refined Idea:</h3>
              <p className="text-foreground">{validationResult.refinedIdea}</p>
            </div>
            
            {validationResult.associatedConcepts && validationResult.associatedConcepts.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2 text-primary flex items-center"><Tag size={20} className="mr-2"/>Associated Concepts:</h3>
                <div className="flex flex-wrap gap-2">
                  {validationResult.associatedConcepts.map((concept, index) => (
                    <Badge key={index} variant="secondary" className="text-sm">{concept}</Badge>
                  ))}
                </div>
              </div>
            )}

            {validationResult.potentialPivots && validationResult.potentialPivots.length > 0 && (
               <div>
                <h3 className="text-lg font-semibold mb-2 text-primary flex items-center"><Tag size={20} className="mr-2"/>Potential Pivots:</h3>
                 <div className="flex flex-wrap gap-2">
                  {validationResult.potentialPivots.map((pivot, index) => (
                    <Badge key={index} variant="outline" className="text-sm bg-accent/30 border-accent text-accent-foreground">{pivot}</Badge>
                  ))}
                </div>
              </div>
            )}
            
            <Card className="bg-muted/50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2 text-primary">Market Entry Practicality (Mock Score):</h3>
              <div className="flex items-center space-x-2">
                <div className="w-full bg-secondary rounded-full h-2.5">
                  <div 
                    className="bg-primary h-2.5 rounded-full transition-all duration-500 ease-out" 
                    style={{ width: `${mockScore}%`}}
                  ></div>
                </div>
                <span className="font-bold text-primary">{mockScore}/100</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">This is an illustrative score based on AI analysis depth.</p>
            </Card>

            <div>
              <h3 className="text-lg font-semibold mb-2 text-primary flex items-center">
                <BarChart3 size={20} className="mr-2"/>Market Viability (Visualization Placeholder):
              </h3>
              <div className="border rounded-lg p-4 flex justify-center items-center bg-secondary/30 min-h-[200px]">
                <Image 
                  src="https://placehold.co/400x200.png" 
                  alt="Market Viability Chart Placeholder" 
                  width={400} 
                  height={200} 
                  className="rounded shadow"
                  data-ai-hint="market analysis chart"
                />
              </div>
               <p className="text-xs text-muted-foreground mt-1 text-center">Detailed charts and market data visualizations coming soon.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
