
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Lightbulb, Hammer, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { SavedIdea } from "@/lib/db";

interface IdeaDisplayCardProps {
  savedIdea?: SavedIdea;
  idea?: string; // For display (could be original or translated)
  originalIdeaForQuery?: string; // Always the original English idea for query params
}

export function IdeaDisplayCard({ savedIdea, idea, originalIdeaForQuery }: IdeaDisplayCardProps) {
  if (!savedIdea && !idea) {
    return null;
  }

  if (savedIdea) {
    // Render for a SavedIdea object (typically on Dashboard or similar pages)
    // For saved ideas, originalIdeaForQuery is derived from savedIdea.originalIdea for the re-validate link
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
          <p className="text-sm text-foreground/90 leading-relaxed">{savedIdea.refinedIdea}</p>
        </CardContent>
        <CardFooter className="pt-2 pb-4 flex flex-col sm:flex-row gap-2">
          <Button variant="outline" size="sm" className="w-full" asChild>
            <Link href={{ pathname: '/validation', query: linkToValidationQuery }}>
              Re-Validate Idea
            </Link>
          </Button>
          <Button variant="default" size="sm" className="w-full" asChild>
            <Link href={`/build-studio/${savedIdea.id}`}>
              <Hammer className="mr-2 h-4 w-4" /> Develop Idea
            </Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  if (idea) {
    // Render for a raw idea string (typically on the Generate Idea page)
    // The link to validation should use originalIdeaForQuery if provided, otherwise fallback to 'idea'
    const linkToValidationQuery = { idea: originalIdeaForQuery || idea };
    return (
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card flex flex-col">
        <CardHeader className="pb-2">
          <CardTitle className="font-headline text-lg flex items-start">
            <Lightbulb className="text-accent mr-2 mt-1 shrink-0" size={20} />
            <span className="flex-grow">Newly Generated Idea</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-sm text-foreground/90 leading-relaxed">{idea}</p>
        </CardContent>
        <CardFooter className="pt-2 pb-4">
          <Button variant="default" size="sm" className="w-full" asChild>
            <Link href={{ pathname: '/validation', query: linkToValidationQuery }}>
              <CheckCircle className="mr-2 h-4 w-4" /> Validate & Refine
            </Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return null;
}

    