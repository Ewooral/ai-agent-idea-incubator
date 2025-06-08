
// src/app/page.tsx (Generate Idea Page)
"use client";

import type { GenerateNovelIdeaInput } from '@/ai/flows/generate-novel-idea';
import { generateNovelIdea } from '@/ai/flows/generate-novel-idea';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Loader2,
  Lightbulb,
  HeartPulse,
  Leaf,
  Zap,
  BookOpenText,
  Users,
  Home,
  ChefHat,
  Laptop,
  Landmark,
  Paintbrush,
  Sparkles,
  Award,
  Music
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
  problemArea: z.string().optional().describe("A specific problem you want to solve or explore."),
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

const topicCardsData: TopicCardProps[] = [
  { title: "Health & Wellness", Icon: HeartPulse, keywords: "mental health, physical fitness, well-being, preventative care, mindfulness apps, personalized nutrition", problemArea: "improving daily well-being and access to healthcare", description: "Innovate for healthier lifestyles." },
  { title: "Sustainable Living", Icon: Leaf, keywords: "eco-friendly products, renewable energy solutions, waste reduction tech, conservation efforts, circular economy", problemArea: "creating a more environmentally conscious future", description: "Ideas for a greener planet." },
  { title: "Personal Productivity", Icon: Zap, keywords: "time management tools, focus techniques, efficiency software, goal setting platforms, workflow automation", problemArea: "helping individuals achieve more with less stress", description: "Boost efficiency and focus." },
  { title: "Education & Learning", Icon: BookOpenText, keywords: "online learning platforms, skill development apps, lifelong learning resources, AI tutors, immersive education", problemArea: "making education more accessible and engaging", description: "Shape the future of learning." },
  { title: "Community Building", Icon: Users, keywords: "social connection apps, local event platforms, volunteer coordination, neighborhood improvement initiatives, digital communities", problemArea: "fostering stronger communities and connections", description: "Connect and engage people." },
  { title: "Smart Home Tech", Icon: Home, keywords: "home automation systems, IoT devices, energy-efficient appliances, smart security, connected living", problemArea: "enhancing comfort, security, and efficiency in homes", description: "Revolutionize home living." },
  { title: "Future of Food", Icon: ChefHat, keywords: "sustainable agriculture, food tech innovations, personalized nutrition plans, alternative protein sources, urban farming", problemArea: "addressing food security and sustainability", description: "Reimagine food production & consumption." },
  { title: "Remote Work Solutions", Icon: Laptop, keywords: "work-from-home tools, virtual collaboration software, distributed team management, freelance platforms, digital nomad support", problemArea: "optimizing the remote work experience", description: "Empower the modern workforce." },
  { title: "Personal Finance", Icon: Landmark, keywords: "budgeting apps, investment tools, financial literacy platforms, savings strategies, micro-lending", problemArea: "improving financial well-being and accessibility", description: "Innovate in financial management." },
  { title: "Creative Hobbies", Icon: Paintbrush, keywords: "DIY project platforms, arts and crafts marketplaces, skill-sharing apps, creative expression tools, hobbyist communities", problemArea: "enabling creative pursuits and skill development", description: "Inspire creativity and new skills." },
  { title: "Sports & Fan Engagement", Icon: Award, keywords: "sports tech, fan experiences, athlete performance, sports media, esports, fantasy sports, memorabilia, community leagues", problemArea: "enhancing fan interaction and modernizing sports participation", description: "Innovate in the world of sports." },
  { title: "Music & Audio Innovation", Icon: Music, keywords: "music creation tools, streaming platforms, live event tech, artist discovery, audio production, sound therapy, AI music generation", problemArea: "transforming how music is created, consumed, and experienced", description: "Ideas for the future of sound." },
  { title: "Faith & Spiritual Connection", Icon: Users, keywords: "faith-based community platforms, digital ministry tools, religious education resources, virtual congregations, charity & outreach tech, spiritual wellness apps, interfaith dialogue", problemArea: "leveraging technology to support spiritual practice and community connection", description: "Tech for faith and community." },
];


export default function GenerateIdeaPage(): ReactNode {
  const [isGeneratingAiIdeas, setIsLoadingAiIdeas] = useState<boolean>(false);
  const [generatedIdeas, setGeneratedIdeas] = useState<string[]>([]); // Stores original English ideas
  const [translatedGeneratedIdeas, setTranslatedGeneratedIdeas] = useState<string[] | null>(null);
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

        const translationPromises = generatedIdeas.map(idea =>
          translateTextAction({ textToTranslate: idea, targetLanguage: languageName })
        );
        const results = await Promise.all(translationPromises);

        const successfullyTranslatedIdeas = results.map((result, index) => {
          if (result.success && result.translatedText) {
            return result.translatedText;
          }
          toast({ title: `Translation Warning`, description: `Could not translate one of the ideas to ${languageName}. Showing original.`, variant: "default" });
          return generatedIdeas[index];
        });

        setTranslatedGeneratedIdeas(successfullyTranslatedIdeas);
        toast({ title: `Ideas Translated!`, description: `Ideas translated to ${languageName}.` });

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
  
  const ideasToDisplay = selectedLanguage !== 'en' && translatedGeneratedIdeas ? translatedGeneratedIdeas : generatedIdeas;
  const isLoading = isGeneratingAiIdeas || isTranslatingIdeas;

  return (
    <div className="mx-auto flex flex-col justify-center items-center max-w-7xl py-8 px-4">
      <Card className="mb-8 shadow-xl bg-card">
        <CardHeader>
          <CardTitle className="font-headline text-2xl sm:text-3xl flex items-center">
            <Sparkles className="mr-2 text-primary" />
            Spark Your Next Big Idea
          </CardTitle>
          <CardDescription>
            Unleash the power of AI. Input a problem area or keywords, or select a topic below to discover novel business concepts. Use the language selector in the sidebar to translate generated ideas.
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
                        disabled={isLoading}
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
        <h2 className="font-headline text-xl sm:text-2xl mb-2 text-center">Or, Explore Ideas by Topic</h2>
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
              {ideasToDisplay.map((displayIdea, index) => (
                 <IdeaDisplayCard
                    key={index}
                    idea={displayIdea} 
                    originalIdeaForQuery={generatedIdeas[index]} 
                  />
              ))}
            </div>
          </div>
        )}
         {!isLoading && ideasToDisplay.length === 0 && (!form.formState.isSubmitted && !topicCardsData.some(topic => form.getValues().keywords === topic.keywords || form.getValues().problemArea === topic.problemArea)) && (
          <div className="text-center py-10 text-muted-foreground min-h-[200px] flex flex-col justify-center items-center">
              <Lightbulb size={48} className="mx-auto mb-4 text-primary/70" />
              <p className="text-sm sm:text-base">Enter a problem or keywords above, or select a topic to start generating ideas.</p>
          </div>
        )}
      </div>
    </div>
  );
}
