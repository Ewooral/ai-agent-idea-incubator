// src/app/build-studio/[ideaId]/page.tsx
import { getSavedIdeaById, getBuildProjectByIdeaId, type SavedIdea, type BuildProject } from '@/lib/db';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Hammer, Lightbulb, ArrowLeft, FileText, Users, Activity, DollarSign } from 'lucide-react';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { BuildStudioClientPage } from '@/components/build-studio-client-page';

interface BuildStudioIdeaPageProps {
  params: {
    ideaId: string;
  };
}

export default async function BuildStudioIdeaServerPage({ params }: BuildStudioIdeaPageProps) {
  const { ideaId } = params;

  if (!ideaId) {
    // This case should ideally be caught by routing or a higher-level check
    // but as a safeguard, redirect or show error.
    redirect('/dashboard'); 
  }

  const savedIdea: SavedIdea | null = await getSavedIdeaById(ideaId);
  
  if (!savedIdea) {
    notFound(); // Triggers the not-found.js file or a default Next.js 404 page
  }

  const buildProject: BuildProject | null = await getBuildProjectByIdeaId(ideaId);

  return (
    <div className="container mx-auto py-8 px-4">
      <Button variant="outline" asChild className="mb-6">
        <Link href="/dashboard"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard</Link>
      </Button>

      <Card className="mb-8 shadow-xl bg-card border-primary/30">
        <CardHeader>
          <CardTitle className="font-headline text-3xl flex items-center">
            <Hammer className="mr-3 text-primary" size={32} /> Build Studio: Developing Your Idea
          </CardTitle>
          <CardDescription>Flesh out the business model for your validated concept.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="p-4 mb-6 bg-muted/50 rounded-lg border border-primary/20">
                <h3 className="text-lg font-semibold text-primary flex items-center mb-1">
                    <Lightbulb className="mr-2 h-5 w-5" /> Original Refined Idea:
                </h3>
                <p className="text-foreground/90">{savedIdea.refinedIdea}</p>
            </div>
            <BuildStudioClientPage 
              ideaId={ideaId} 
              initialSavedIdea={savedIdea} 
              initialBuildProject={buildProject} 
            />
        </CardContent>
      </Card>
    </div>
  );
}