
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutDashboard, Lightbulb } from "lucide-react";
import { IdeaDisplayCard } from "@/components/idea-display-card";
import { getSavedIdeas, type SavedIdea } from "@/lib/db";

export default async function DashboardPage() {
  const savedIdeas: SavedIdea[] = await getSavedIdeas();

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="shadow-xl bg-card">
        <CardHeader>
          <CardTitle className="font-headline text-3xl flex items-center">
            <LayoutDashboard className="mr-3 text-primary" size={32} /> My Idea Dashboard
          </CardTitle>
          <CardDescription>
            Track, manage, and develop your saved business ideas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {savedIdeas.length > 0 ? (
            <div className="space-y-6">
              <div>
                <h2 className="font-headline text-2xl mb-4">My Saved Ideas</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {savedIdeas.map((item) => (
                    <IdeaDisplayCard key={item.id} idea={item.refinedIdea} />
                  ))}
                </div>
              </div>
              <div className="mt-8 p-6 border rounded-lg bg-muted/30">
                 <h3 className="text-lg font-semibold mb-2 text-foreground">Dashboard Features</h3>
                 <p className="text-muted-foreground">
                   This dashboard now displays your ideas saved from the validation page. In the future, you could add features like editing notes, tracking validation status, and more detailed views for each idea.
                 </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-10">
              <Lightbulb size={48} className="mx-auto mb-4 text-primary/70" />
              <h3 className="text-xl font-semibold mb-2 text-foreground">No Ideas Saved Yet</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Start by generating some novel ideas. Then, use the "Validate & Refine with AI" feature.
                Once an idea is refined, you can save it to this dashboard.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
