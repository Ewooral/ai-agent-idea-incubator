
// src/app/build-studio/[ideaId]/page.tsx
import { getSavedIdeaById, getBuildProjectByIdeaId, type SavedIdea, type BuildProject } from '@/lib/db';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Hammer, Lightbulb, ArrowLeft } from 'lucide-react';
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
    redirect('/build-studio'); 
  }

  const savedIdea: SavedIdea | null = await getSavedIdeaById(ideaId);
  
  if (!savedIdea) {
    notFound(); 
  }

  const buildProject: BuildProject | null = await getBuildProjectByIdeaId(ideaId);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <Button variant="outline" asChild>
          <Link href="/build-studio"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Idea List</Link>
        </Button>
         <Button variant="outline" asChild>
          <Link href="/dashboard"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard</Link>
        </Button>
      </div>
      

      <Card className="mb-8 shadow-xl bg-card border-primary/30">
        <CardHeader>
          <CardTitle className="font-headline text-3xl flex items-center">
            <Hammer className="mr-3 text-primary" size={32} /> AI Development Guide for Your Idea
          </CardTitle>
          <CardDescription>Input key details about your project, then let AI generate a step-by-step development guide.</CardDescription>
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
