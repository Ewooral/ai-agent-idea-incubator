
// src/app/community/page.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, MessageSquare, Lightbulb, Users2, Rocket, type Icon as LucideIcon, AlertTriangle, PlusCircle } from "lucide-react";
import Link from "next/link";
import { getForumCategories, type ForumCategory } from "@/lib/db";

// Icon mapping
interface IconMap {
  [key: string]: LucideIcon;
}

const iconMap: IconMap = {
  MessageSquare,
  Lightbulb,
  Users2,
  Rocket,
  // Add more icons here if needed for new categories
  // Default or fallback icon
  AlertTriangle, 
};

function getIconComponent(iconName: string): LucideIcon {
  const Icon = iconMap[iconName];
  if (Icon) {
    return Icon;
  }
  console.warn(`Icon "${iconName}" not found in iconMap. Falling back to AlertTriangle.`);
  return AlertTriangle; // Fallback icon
}


export default async function CommunityPage() {
  const categories: ForumCategory[] = await getForumCategories();

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="shadow-xl bg-card">
        <CardHeader className="flex flex-row justify-between items-start">
            <div>
                <CardTitle className="font-headline text-3xl flex items-center">
                    <Users className="mr-3 text-primary" size={32} /> Idea Exchange Community
                </CardTitle>
                <CardDescription>
                    Connect with fellow innovators, share ideas, provide feedback, and collaborate.
                    (Full forum functionality is being built incrementally!)
                </CardDescription>
            </div>
            <Button asChild variant="outline">
                <Link href="/admin/community/categories">
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Category (Admin)
                </Link>
            </Button>
        </CardHeader>
        <CardContent className="space-y-8">
          <div>
            <h2 className="font-headline text-2xl mb-6">Discussion Categories</h2>
            {categories.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {categories.map((category) => {
                  const IconComponent = getIconComponent(category.iconName);
                  return (
                    <Card key={category.id} className="hover:shadow-lg transition-shadow bg-card">
                      <CardHeader>
                        <CardTitle className="flex items-center text-xl">
                          <IconComponent className="mr-3 text-accent" size={24} />
                          {category.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-3">{category.description}</p>
                        {/* Placeholder for post count and last activity - to be implemented later */}
                        {/* <div className="text-xs text-muted-foreground flex justify-between">
                          <span>0 posts</span>
                          <span>No activity yet</span>
                        </div> */}
                      </CardContent>
                      <CardContent className="pt-2 pb-4">
                        <Button variant="outline" className="w-full" disabled>
                          View Category (Coming Soon)
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
                <div className="text-center py-10 border rounded-lg bg-muted/20">
                    <Users size={48} className="mx-auto mb-4 text-primary/50" />
                    <h3 className="text-xl font-semibold mb-2 text-foreground">No Categories Yet</h3>
                    <p className="text-muted-foreground max-w-md mx-auto mb-6">
                        It looks like there are no forum categories. An administrator can add some.
                    </p>
                     <Button asChild>
                        <Link href="/admin/community/categories">
                            <PlusCircle className="mr-2 h-5 w-5" /> Add First Category (Admin)
                        </Link>
                    </Button>
                </div>
            )}
          </div>
          
          <div className="text-center py-10 border-t mt-10">
            <h3 className="text-xl font-semibold mb-2 text-foreground">Building Our Community Features</h3>
            <p className="text-muted-foreground max-w-lg mx-auto mb-6">
              We're actively developing full forum functionality, including user accounts, posts, and real-time interactions.
              This page currently showcases dynamically managed categories. Stay tuned for more updates!
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
