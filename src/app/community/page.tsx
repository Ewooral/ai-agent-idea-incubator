
// src/app/community/page.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, MessageSquare, Lightbulb, Users2, Rocket } from "lucide-react";
import Link from "next/link";

const forumCategories = [
  { 
    title: "General Discussion", 
    description: "Talk about anything related to innovation and entrepreneurship.", 
    icon: MessageSquare,
    postCount: 125,
    lastActivity: "2 hours ago"
  },
  { 
    title: "Idea Feedback", 
    description: "Share your ideas and get constructive feedback from the community.", 
    icon: Lightbulb,
    postCount: 78,
    lastActivity: "5 hours ago"
  },
  { 
    title: "Find Collaborators", 
    description: "Looking for a co-founder or team members? Post here!", 
    icon: Users2,
    postCount: 42,
    lastActivity: "1 day ago"
  },
  { 
    title: "Showcase & Success Stories", 
    description: "Share your progress, launches, and success stories.", 
    icon: Rocket,
    postCount: 30,
    lastActivity: "3 days ago"
  },
];

export default function CommunityPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="shadow-xl bg-card">
        <CardHeader>
          <CardTitle className="font-headline text-3xl flex items-center">
            <Users className="mr-3 text-primary" size={32} /> Idea Exchange Community
          </CardTitle>
          <CardDescription>
            Connect with fellow innovators, share ideas, provide feedback, and collaborate. 
            (Full forum functionality coming soon!)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div>
            <h2 className="font-headline text-2xl mb-6">Discussion Forums</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {forumCategories.map((category) => {
                const Icon = category.icon;
                return (
                  <Card key={category.title} className="hover:shadow-lg transition-shadow bg-card">
                    <CardHeader>
                      <CardTitle className="flex items-center text-xl">
                        <Icon className="mr-3 text-accent" size={24} />
                        {category.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">{category.description}</p>
                      <div className="text-xs text-muted-foreground flex justify-between">
                        <span>{category.postCount} posts</span>
                        <span>Last post: {category.lastActivity}</span>
                      </div>
                    </CardContent>
                    <CardContent className="pt-2 pb-4">
                      <Button variant="outline" className="w-full" disabled>
                        View Forum (Coming Soon)
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
          
          <div className="text-center py-10 border-t mt-10">
            <h3 className="text-xl font-semibold mb-2 text-foreground">Ready to Build the Real Thing?</h3>
            <p className="text-muted-foreground max-w-lg mx-auto mb-6">
              This is a glimpse of how our community forum could look. 
              Integrating a full forum requires backend development for user accounts, posts, and real-time interactions.
            </p>
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
