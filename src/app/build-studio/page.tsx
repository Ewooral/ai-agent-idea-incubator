// src/app/build-studio/page.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Hammer, Lightbulb, Construction } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function BuildStudioPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="shadow-xl bg-card">
        <CardHeader>
          <CardTitle className="font-headline text-3xl flex items-center">
            <Hammer className="mr-3 text-primary" size={32} /> Idea Build Studio
          </CardTitle>
          <CardDescription>
            Transform your validated concepts into actionable plans. This is where your ideas take shape! (Full features coming soon)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          
          <div className="text-center py-10 border-t mt-6">
            <Construction size={64} className="mx-auto mb-6 text-primary/70" />
            <h3 className="text-2xl font-semibold mb-3 text-foreground">Under Construction!</h3>
            <p className="text-muted-foreground max-w-lg mx-auto mb-6">
              The Build Studio is where you'll be able to develop your ideas further. 
              Imagine tools for business model canvassing, feature planning, milestone tracking, and more. 
              We're working hard to bring these features to you!
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8 max-w-3xl mx-auto">
              <Card className="bg-muted/30">
                <CardHeader>
                  <CardTitle className="text-lg">Example: Business Model Canvas</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Outline key partners, activities, value propositions, customer relationships, and more.</p>
                  <Image 
                    src="https://placehold.co/600x400.png" 
                    alt="Placeholder Business Model Canvas" 
                    width={600} 
                    height={400} 
                    className="mt-4 rounded-md shadow-md"
                    data-ai-hint="business model canvas"
                  />
                </CardContent>
              </Card>
              <Card className="bg-muted/30">
                <CardHeader>
                  <CardTitle className="text-lg">Example: Feature Prioritization</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">List, prioritize, and manage the features for your minimum viable product (MVP).</p>
                  <Image 
                    src="https://placehold.co/600x400.png" 
                    alt="Placeholder Feature List" 
                    width={600} 
                    height={400} 
                    className="mt-4 rounded-md shadow-md"
                    data-ai-hint="feature list planning"
                  />
                </CardContent>
              </Card>
            </div>
            <Button asChild size="lg">
              <Link href="/">
                <Lightbulb className="mr-2 h-5 w-5" /> Back to Idea Generation
              </Link>
            </Button>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
