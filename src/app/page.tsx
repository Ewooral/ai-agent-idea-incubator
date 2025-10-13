
// src/app/page.tsx (Generate Research Proposal Page)
"use client";

import type { GenerateNovelIdeaInput, GenerateNovelIdeaOutput } from '@/ai/flows/generate-novel-idea';
import { generateNovelIdea } from '@/ai/flows/generate-novel-idea';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Loader2,
  Lightbulb,
  Sparkles,
  TestTubeDiagonal,
  BrainCircuit,
  ShieldCheck,
  Scale,
  Users,
  Eye,
  BotMessageSquare,
  Network
} from 'lucide-react';
import { useState, type ReactNode, type ElementType, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { IdeaDisplayCard } from '@/components/idea-display-card';
import { useLanguage } from '@/contexts/language-context';
import { translateTextAction } from '@/app/actions/translationActions';

const generateIdeaSchema = z.object({
  problemArea: z.string().optional().describe("A specific problem you want to solve."),
  keywords: z.string().optional().describe("Relevant keywords or topics to focus the idea generation."),
});

type GenerateIdeaFormValues = z.infer<typeof generateIdeaSchema>;

interface TopicCardProps {
  title: string;
  Icon: ElementType;
  keywords?: string;
  problemArea?: string;
  description: string;
}

// Type for the items in generatedIdeas and ideasToDisplay
interface DisplayableIdea {
  idea: string;
  noveltyScore: number;
}

const topicCardsData: TopicCardProps[] = [
  { title: "Scalable Oversight", Icon: Eye, keywords: "scalable oversight, weak-to-strong generalization, recursive oversight, debate, amplification", problemArea: "ensuring we can supervise AI systems that are smarter than us", description: "Supervising superintelligence." },
  { title: "Interpretability", Icon: BrainCircuit, keywords: "mechanistic interpretability, dictionary learning, probing, circuit analysis, representation engineering", problemArea: "understanding the internal workings of black-box neural networks", description: "Reverse-engineering neural networks." },
  { title: "LLM Deception", Icon: BotMessageSquare, keywords: "deception, sycophancy, sandbagging, instrumental alignment, emergent goals", problemArea: "detecting and preventing deceptive behavior in large language models", description: "Finding the lie in the model." },
  { title: "Multi-Agent Systems", Icon: Users, keywords: "multi-agent collusion, emergent cooperation, game theory, AI diplomacy, principal-agent problems", problemArea: "managing risks from multiple interacting advanced AIs", description: "Cooperation or collusion?" },
  { title: "Theory of Alignment", Icon: Scale, keywords: "RLHF, inner vs outer alignment, goal misgeneralization, power-seeking, corrigibility, shard theory", problemArea: "developing a robust theoretical foundation for AI alignment", description: "Formalizing AI safety." },
  { title: "Capability Evaluations", Icon: TestTubeDiagonal, keywords: "capability evals, dangerous capabilities, situational awareness, red teaming, scaffolding", problemArea: "evaluating and predicting potentially dangerous AI capabilities before they arise", description: "What can this AI *really* do?" },
  { title: "AI Control", Icon: ShieldCheck, keywords: "AI control, shutdown problem, tripwires, boxing, anomaly detection", problemArea: "maintaining meaningful human control over autonomous AI systems", description: "Keeping humans in the loop." },
  { title: "Automated Interpretability", Icon: Network, keywords: "automated circuit discovery, sparse autoencoders, mechanistic anomaly detection", problemArea: "scaling up interpretability research using AI itself", description: "Using AI to understand AI." },
];


export default function GenerateIdeaPage(): ReactNode {
  const [isGeneratingAiIdeas, setIsLoadingAiIdeas] = useState<boolean>(false);
  const [generatedIdeas, setGeneratedIdeas] = useState<DisplayableIdea[]>([]); // Stores original English ideas with scores
  const [translatedGeneratedIdeas, setTranslatedGeneratedIdeas] = useState<DisplayableIdea[] | null>(null);
  const [isTranslatingIdeas, setIsTranslatingIdeas] = useState<boolean>(false);
  const { toast } = useToast();
  const { selectedLanguage, getLanguageName } = useLanguage();

  const form = useForm<GenerateIdeaFormValues>({
    resolver: zodResolver(generateIdeaSchema),
    defaultValues: {
      problemArea: "",
      keywords: "",
    },
  });

  // Effect for translating generated ideas
  useEffect(() => {
    if (selectedLanguage === 'en' || generatedIdeas.length === 0) {
      setTranslatedGeneratedIdeas(null);
      return;
    }

    const translateIdeas = async () => {
      setIsTranslatingIdeas(true);
      try {
        const languageName = getLanguageName(selectedLanguage);
        if (!languageName) throw new Error("Invalid language selected");

        const translationPromises = generatedIdeas.map(item =>
          translateTextAction({ textToTranslate: item.idea, targetLanguage: languageName })
        );
        const results = await Promise.all(translationPromises);

        const successfullyTranslatedItems = results.map((result, index) => {
          const originalItem = generatedIdeas[index];
          if (result.success && result.translatedText) {
            return { idea: result.translatedText, noveltyScore: originalItem.noveltyScore };
          }
          toast({ title: `Translation Warning`, description: `Could not translate one of the ideas to ${languageName}. Showing original.`, variant: "default" });
          return { idea: originalItem.idea, noveltyScore: originalItem.noveltyScore }; // Keep original idea if translation fails
        });

        setTranslatedGeneratedIdeas(successfullyTranslatedItems);
        toast({ title: `Ideas Translated!`, description: `Generated ideas translated to ${languageName}.` });

      } catch (error: any) {
        console.error("Error translating ideas array:", error);
        setTranslatedGeneratedIdeas(null); 
        toast({ title: "Translation Error", description: `Could not translate ideas. ${error.message}`, variant: "destructive" });
      } finally {
        setIsTranslatingIdeas(false);
      }
    };

    translateIdeas();
  }, [selectedLanguage, generatedIdeas, getLanguageName, toast]);


  const processIdeaGeneration = async (input: GenerateNovelIdeaInput) => {
    setIsLoadingAiIdeas(true);
    setGeneratedIdeas([]);
    setTranslatedGeneratedIdeas(null);
    
    setTimeout(() => {
      const resultsSection = document.getElementById('results-section');
      if (resultsSection) {
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 0);


    try {
      if (!input.problemArea && !input.keywords) {
        toast({
          title: "Input Required",
          description: "Please provide either a problem area or some keywords.",
          variant: "destructive",
        });
        setIsLoadingAiIdeas(false);
        return;
      }
      const result: GenerateNovelIdeaOutput = await generateNovelIdea(input);
      // The result.novelIdeas is already Array<{ idea: string; noveltyScore: number; }>
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
      setIsLoadingAiIdeas(false);
    }
  }

  const onSubmit: SubmitHandler<GenerateIdeaFormValues> = async (data) => {
    const input: GenerateNovelIdeaInput = {
      problemArea: data.problemArea || undefined,
      keywords: data.keywords || undefined,
    };
    processIdeaGeneration(input);
  };

  const handleTopicCardClick = (topic: TopicCardProps) => {
    form.reset(); 
    form.setValue('problemArea', topic.problemArea || ""); 
    form.setValue('keywords', topic.keywords || "");
    const input: GenerateNovelIdeaInput = {
      problemArea: topic.problemArea || undefined,
      keywords: topic.keywords || undefined,
    };
    processIdeaGeneration(input);
  };
  
  const ideasToDisplay: DisplayableIdea[] = selectedLanguage !== 'en' && translatedGeneratedIdeas ? translatedGeneratedIdeas : generatedIdeas;
  const isLoading = isGeneratingAiIdeas || isTranslatingIdeas;

  return (
    <div className="mx-auto flex flex-col justify-center items-center max-w-7xl py-8 px-4">
      <Card className="mb-8 shadow-xl bg-card">
        <CardHeader>
          <CardTitle className="font-headline text-2xl sm:text-3xl flex items-center">
            <Sparkles className="mr-2 text-primary" />
            Generate a Novel Idea
          </CardTitle>
          <CardDescription>
            Generate novel business ideas or research questions. Input a problem area or keywords, or select a topic below to discover new directions.
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
                        placeholder="e.g., How to make language model reasoning more transparent and auditable."
                        {...field}
                        rows={3}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormDescription>
                      Describe a specific challenge you're interested in, for business or research.
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
                        placeholder="e.g., Mechanistic interpretability, scalable oversight, deceptive alignment"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormDescription>
                      Provide some high-level topics to guide the AI.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading || (form.formState.isSubmitting && isGeneratingAiIdeas)} className="w-full sm:w-auto">
                {isLoading && form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating from form...
                  </>
                ) : (
                  "Generate With My Input"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="mb-12">
        <h2 className="font-headline text-xl sm:text-2xl mb-2 text-center">Or, Explore Ideas by Topic (Great for Researchers)</h2>
        <p className="text-muted-foreground text-center mb-6 text-sm sm:text-base">Click a card to generate ideas for a specific theme.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {topicCardsData.map((topic) => (
            <Card
              key={topic.title}
              className={`shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card flex flex-col text-center group ${isLoading ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
              onClick={() => !isLoading && handleTopicCardClick(topic)}
              role="button"
              tabIndex={isLoading ? -1 : 0}
              onKeyDown={(e) => { if ((e.key === 'Enter' || e.key === ' ') && !isLoading) handleTopicCardClick(topic)}}
              aria-disabled={isLoading}
            >
              <CardHeader className="items-center pb-2">
                <topic.Icon size={36} className="mb-2 text-primary group-hover:scale-110 transition-transform" />
                <CardTitle className="font-headline text-lg">{topic.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow pb-3">
                <p className="text-xs sm:text-sm text-muted-foreground">{topic.description}</p>
              </CardContent>
               {isLoading && (form.getValues().keywords === topic.keywords || form.getValues().problemArea === topic.problemArea) && !form.formState.isSubmitting ? (
                 <CardFooter className="pt-0 pb-4 justify-center">
                    <Button variant="outline" size="sm" disabled className="w-full text-xs">
                      <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                      Generating...
                    </Button>
                 </CardFooter>
               ) : (
                 <CardFooter className="pt-0 pb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button variant="outline" size="sm" className="w-full text-xs" disabled={isLoading}>
                      Generate Ideas
                    </Button>
                 </CardFooter>
               )}
            </Card>
          ))}
        </div>
      </div>

      <div id="results-section">
        {isLoading && (
          <div className="min-h-[70vh] flex flex-col justify-center items-center mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
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
          </div>
        )}

        {!isLoading && ideasToDisplay.length > 0 && (
          <div>
            <h2 className="font-headline text-xl sm:text-2xl mb-6 mt-8">
              Generated Ideas {selectedLanguage !== 'en' && getLanguageName(selectedLanguage) ? `(Translated to ${getLanguageName(selectedLanguage)})` : ''}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {ideasToDisplay.map((item, index) => ( // item is now { idea: string, noveltyScore: number }
                 <IdeaDisplayCard
                    key={index}
                    idea={item.idea} // Pass the idea string
                    noveltyScore={item.noveltyScore} // Pass the novelty score
                    originalIdeaForQuery={generatedIdeas[index]?.idea} // Pass the original English idea string for the query
                  />
              ))}
            </div>
          </div>
        )}
         {!isLoading && ideasToDisplay.length === 0 && (!form.formState.isSubmitted && !topicCardsData.some(topic => form.getValues().keywords === topic.keywords || form.getValues().problemArea === topic.problemArea)) && (
          <div className="text-center py-10 text-muted-foreground min-h-[200px] flex flex-col justify-center items-center">
              <Lightbulb size={48} className="mx-auto mb-4 text-primary/70" />
              <p className="text-sm sm:text-base">Enter a problem area or keywords, or select a topic to start generating ideas.</p>
          </div>
        )}
      </div>
    </div>
  );
}
