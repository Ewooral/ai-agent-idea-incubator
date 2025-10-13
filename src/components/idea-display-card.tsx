
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Lightbulb, Hammer, CheckCircle, Sparkles, TestTube } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { SavedIdea } from "@/lib/db";

interface IdeaDisplayCardProps {
  savedIdea?: SavedIdea;
  idea?: string; // For display (could be original or translated)
  originalIdeaForQuery?: string; // Always the original English idea for query params
  noveltyScore?: number; // For newly generated ideas
}

export function IdeaDisplayCard({ savedIdea, idea, originalIdeaForQuery, noveltyScore }: IdeaDisplayCardProps) {
  if (!savedIdea && !idea) {
    return null;
  }

  if (savedIdea) {
    // Render for a SavedIdea object (typically on Dashboard or similar pages)
    const linkToValidationQuery = { idea: savedIdea.originalIdea };
    return (
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card flex flex-col">
        <CardHeader className="pb-2">
          <CardTitle className="font-headline text-lg flex items-start">
            <Lightbulb className="text-accent mr-2 mt-1 shrink-0" size={20} />
            <span className="flex-grow">Refined Idea</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow">
          {savedIdea.conceptualImageUrl && (
            <div className="mb-4 overflow-hidden rounded-md border shadow-sm">
              <img 
                src={savedIdea.conceptualImageUrl} 
                alt="Conceptual diagram for the idea" 
                className="w-full h-40 object-cover" 
                data-ai-hint="diagram abstract concept"
              />
            </div>
          )}
          <p className="text-sm text-foreground/90 leading-relaxed">{savedIdea.refinedIdea}</p>
          {savedIdea.marketPotentialScore !== undefined && (
             <div className="mt-3 flex items-center">
                <Sparkles className="mr-1.5 h-4 w-4 text-primary" />
                <p className="text-xs text-muted-foreground">
                Potential Impact: <span className="font-semibold text-foreground">{savedIdea.marketPotentialScore}</span>/100
                </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="pt-2 pb-4 flex flex-col sm:flex-row gap-2">
          <Button variant="outline" size="sm" className="w-full" asChild>
            <Link href={{ pathname: '/validation', query: linkToValidationQuery }}>
              Re-Analyze
            </Link>
          </Button>
          <Button variant="default" size="sm" className="w-full" asChild>
            <Link href={`/build-studio/${savedIdea.id}`}>
              <Hammer className="mr-2 h-4 w-4" /> Develop Plan
            </Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  if (idea) {
    // Render for a raw idea string (typically on the Generate Idea page)
    const linkToValidationQuery = { idea: originalIdeaForQuery || idea };
    return (
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card flex flex-col">
        <CardHeader className="pb-2">
          <CardTitle className="font-headline text-lg flex items-start">
            <TestTube className="text-accent mr-2 mt-1 shrink-0" size={20} />
            <span className="flex-grow">New Idea/Concept</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-sm text-foreground/90 leading-relaxed">{idea}</p>
          {noveltyScore !== undefined && (
            <div className="mt-3 flex items-center">
                <Sparkles className="mr-1.5 h-4 w-4 text-yellow-500" />
                <p className="text-xs text-muted-foreground">
                Novelty Score: <span className="font-semibold text-foreground">{noveltyScore}</span>/10
                </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="pt-2 pb-4">
          <Button variant="default" size="sm" className="w-full" asChild>
            <Link href={{ pathname: '/validation', query: linkToValidationQuery }}>
              <CheckCircle className="mr-2 h-4 w-4" /> Analyze & Refine
            </Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return null;
}
