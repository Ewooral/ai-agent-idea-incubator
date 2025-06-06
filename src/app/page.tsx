// src/app/page.tsx (Generate Idea Page)
"use client";

import type { GenerateNovelIdeaInput } from '@/ai/flows/generate-novel-idea';
import { generateNovelIdea } from '@/ai/flows/generate-novel-idea';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Lightbulb } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { IdeaDisplayCard } from '@/components/idea-display-card';

const generateIdeaSchema = z.object({
  problemArea: z.string().optional().describe("A specific problem you want to solve or explore."),
  keywords: z.string().optional().describe("Relevant keywords or topics to focus the idea generation."),
});

type GenerateIdeaFormValues = z.infer<typeof generateIdeaSchema>;

export default function GenerateIdeaPage(): ReactNode {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [generatedIdeas, setGeneratedIdeas] = useState<string[]>([]);
  const { toast } = useToast();

  const form = useForm<GenerateIdeaFormValues>({
    resolver: zodResolver(generateIdeaSchema),
    defaultValues: {
      problemArea: "",
      keywords: "",
    },
  });

  const onSubmit: SubmitHandler<GenerateIdeaFormValues> = async (data) => {
    setIsLoading(true);
    setGeneratedIdeas([]);
    try {
      const input: GenerateNovelIdeaInput = {
        problemArea: data.problemArea || undefined,
        keywords: data.keywords || undefined,
      };
      if (!input.problemArea && !input.keywords) {
        toast({
          title: "Input Required",
          description: "Please provide either a problem area or some keywords.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      const result = await generateNovelIdea(input);
      setGeneratedIdeas(result.novelIdeas);
      if (result.novelIdeas.length === 0) {
        toast({
          title: "No Ideas Generated",
          description: "The AI couldn't find novel ideas for your input. Try different terms.",
        });
      } else {
         toast({
          title: "Ideas Generated!",
          description: `Successfully generated ${result.novelIdeas.length} new ideas.`,
        });
      }
    } catch (error) {
      console.error("Error generating ideas:", error);
      toast({
        title: "Error",
        description: "Failed to generate ideas. Please try again.",
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
          <CardTitle className="font-headline text-3xl">Spark Your Next Big Idea</CardTitle>
          <CardDescription>
            Unleash the power of AI to discover truly novel business concepts.
            Input a problem area or some keywords, or leave it open-ended for surprising results.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="problemArea"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Problem Area (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Reducing food waste in urban areas, improving remote team collaboration"
                        {...field}
                        rows={3}
                      />
                    </FormControl>
                    <FormDescription>
                      Describe a challenge or domain you&apos;re interested in.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="keywords"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Keywords/Topics (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Sustainable energy, AI in education, personalized healthcare"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Provide some high-level topics to guide the AI.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Novel Ideas"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse bg-card">
              <CardHeader>
                <div className="h-6 bg-muted rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-muted rounded w-full mb-2"></div>
                <div className="h-4 bg-muted rounded w-5/6"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!isLoading && generatedIdeas.length > 0 && (
        <div>
          <h2 className="font-headline text-2xl mb-6 mt-8">Generated Ideas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {generatedIdeas.map((idea, index) => (
               <IdeaDisplayCard key={index} idea={idea} />
            ))}
          </div>
        </div>
      )}
       {!isLoading && generatedIdeas.length === 0 && !form.formState.isSubmitted && (
        <div className="text-center py-10 text-muted-foreground">
            <Lightbulb size={48} className="mx-auto mb-4" />
            <p>Enter a problem or keywords to start generating ideas.</p>
        </div>
      )}
    </div>
  );
}
