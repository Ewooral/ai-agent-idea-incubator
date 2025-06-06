
// src/app/dashboard/page.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutDashboard, Lightbulb } from "lucide-react";
import { IdeaDisplayCard } from "@/components/idea-display-card"; // Assuming this component exists and is suitable

const mockSavedIdeas = [
  { id: "1", idea: "A platform for connecting local artists with small businesses for mural projects." },
  { id: "2", idea: "Subscription box for rare and exotic houseplants, including care guides." },
  { id: "3", idea: "AI-powered personal stylist app that curates outfits from users' existing wardrobes." },
];

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="shadow-xl bg-card">
        <CardHeader>
          <CardTitle className="font-headline text-3xl flex items-center">
            <LayoutDashboard className="mr-3 text-primary" size={32} /> My Idea Dashboard
          </CardTitle>
          <CardDescription>
            Track, manage, and develop your saved business ideas. Here are some examples of what you might save.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {mockSavedIdeas.length > 0 ? (
            <div className="space-y-6">
              <div>
                <h2 className="font-headline text-2xl mb-4">My Saved Ideas</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {mockSavedIdeas.map((item) => (
                    <IdeaDisplayCard key={item.id} idea={item.idea} />
                  ))}
                </div>
              </div>
              {/* Placeholder for future sections like 'Validation Progress' or 'Notes' */}
              <div className="mt-8 p-6 border rounded-lg bg-muted/30">
                 <h3 className="text-lg font-semibold mb-2 text-foreground">More Features Coming Soon</h3>
                 <p className="text-muted-foreground">
                   Soon, you'll be able to truly save ideas from the generation page, add notes, track validation status, and much more right here!
                 </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-10">
              <Lightbulb size={48} className="mx-auto mb-4 text-primary/70" />
              <h3 className="text-xl font-semibold mb-2 text-foreground">No Ideas Saved Yet</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Start by generating some novel ideas. When you find ones you like,
                you'll be able to save them here for future development. (Saving functionality coming soon!)
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
