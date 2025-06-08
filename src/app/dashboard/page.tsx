
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutDashboard, Lightbulb, Sparkles } from "lucide-react";
import { IdeaDisplayCard } from "@/components/idea-display-card";
import { getSavedIdeas, type SavedIdea } from "@/lib/db";
import { Separator } from "@/components/ui/separator";

export default async function DashboardPage() {
  const savedIdeas: SavedIdea[] = await getSavedIdeas();

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="shadow-xl bg-card">
        <CardHeader>
          <CardTitle className="font-headline text-2xl sm:text-3xl flex items-center">
            <LayoutDashboard className="mr-3 text-primary" size={32} /> My Idea Dashboard
          </CardTitle>
          <CardDescription>
            Track, manage, and develop your saved business ideas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-6 mb-8 bg-gradient-to-r from-primary/10 via-accent/5 to-secondary/10 rounded-lg border border-primary/20 shadow-inner">
            <div className="flex items-center mb-3">
              <Sparkles className="text-primary mr-3 h-8 w-8" />
              <h2 className="text-xl sm:text-2xl font-headline text-primary">Welcome to Idea Incubator!</h2>
            </div>
            <p className="text-sm sm:text-base text-foreground/90 leading-relaxed">
              Your space to spark, refine, and develop groundbreaking business ideas with the power of AI. 
              Here on your dashboard, you can see all the brilliant concepts you've saved after AI validation.
            </p>
            <p className="text-sm sm:text-base text-foreground/90 leading-relaxed mt-2">
              Ready to take the next step? Choose an idea below to re-validate it with fresh insights or head to the Build Studio to generate a detailed development guide. Let's innovate together!
            </p>
          </div>

          <Separator className="my-8" />

          {savedIdeas.length > 0 ? (
            <div className="space-y-6">
              <div>
                <h2 className="font-headline text-xl sm:text-2xl mb-4">My Saved Ideas</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {savedIdeas.map((item) => (
                    <IdeaDisplayCard key={item.id} savedIdea={item} />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-10">
              <Lightbulb size={48} className="mx-auto mb-4 text-primary/70" />
              <h3 className="text-xl font-semibold mb-2 text-foreground">No Ideas Saved Yet</h3>
              <p className="text-muted-foreground max-w-md mx-auto text-sm sm:text-base">
                Start by generating some novel ideas on the "Generate Idea" page. 
                Then, use the "Idea Validation" page to refine and save your concepts.
                They will appear here once saved.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
