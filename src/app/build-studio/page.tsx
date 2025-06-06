
// src/app/build-studio/page.tsx (Main Build Studio Landing Page)
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Hammer, Lightbulb, ListChecks, ArrowRight } from "lucide-react";
import Link from "next/link";
import { getSavedIdeas, type SavedIdea } from "@/lib/db";

export default async function BuildStudioLandingPage() {
  const savedIdeas: SavedIdea[] = await getSavedIdeas();

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="shadow-xl bg-card">
        <CardHeader>
          <CardTitle className="font-headline text-3xl flex items-center">
            <Hammer className="mr-3 text-primary" size={32} /> Idea Development Guides
          </CardTitle>
          <CardDescription>
            Select one of your saved ideas to begin planning its development and generate an AI-powered step-by-step guide.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {savedIdeas.length > 0 ? (
            <div className="space-y-4">
              <h2 className="font-headline text-2xl">Your Saved Ideas</h2>
              {savedIdeas.map((idea) => (
                <Card key={idea.id} className="bg-muted/30 hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center">
                      <Lightbulb className="mr-2 h-5 w-5 text-accent" />
                      {idea.refinedIdea.length > 100 ? `${idea.refinedIdea.substring(0, 100)}...` : idea.refinedIdea}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <p className="text-sm text-muted-foreground">
                      Original: {idea.originalIdea.length > 150 ? `${idea.originalIdea.substring(0, 150)}...` : idea.originalIdea}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button asChild>
                      <Link href={`/build-studio/${idea.id}`}>
                        Develop Guide <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 border rounded-lg bg-muted/20">
              <ListChecks size={48} className="mx-auto mb-4 text-primary/50" />
              <h3 className="text-xl font-semibold mb-2 text-foreground">No Saved Ideas Yet</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                You need to save some ideas from the validation page before you can develop guides for them.
              </p>
              <Button asChild>
                <Link href="/">
                  <Lightbulb className="mr-2 h-5 w-5" /> Generate & Validate Ideas
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
