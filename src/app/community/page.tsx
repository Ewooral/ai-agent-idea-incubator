
// src/app/community/page.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, MessageSquare, Lightbulb, Users2, Rocket, type Icon as LucideIcon, AlertTriangle, PlusCircle, ArrowRight } from "lucide-react";
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
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
                <CardTitle className="font-headline text-2xl sm:text-3xl flex items-center">
                    <Users className="mr-3 text-primary" size={32} /> Idea Exchange Community
                </CardTitle>
                <CardDescription>
                    Connect with fellow innovators, share ideas, provide feedback, and collaborate.
                    (Full forum functionality is being built incrementally!)
                </CardDescription>
            </div>
            <Button asChild variant="outline" className="w-full sm:w-auto">
                <Link href="/admin/community/categories">
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Category (Admin)
                </Link>
            </Button>
        </CardHeader>
        <CardContent className="space-y-8">
          <div>
            <h2 className="font-headline text-xl sm:text-2xl mb-6">Discussion Categories</h2>
            {categories.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {categories.map((category) => {
                  const IconComponent = getIconComponent(category.iconName);
                  return (
                    <Card key={category.id} className="hover:shadow-lg transition-shadow bg-card flex flex-col">
                      <CardHeader>
                        <CardTitle className="flex items-center text-lg sm:text-xl">
                          <IconComponent className="mr-3 text-accent" size={24} />
                          {category.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <p className="text-xs sm:text-sm text-muted-foreground mb-3">{category.description}</p>
                      </CardContent>
                      <CardFooter className="pt-2 pb-4">
                        <Button asChild variant="outline" className="w-full">
                          <Link href={`/community/${category.id}`}>
                            View Category <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            ) : (
                <div className="text-center py-10 border rounded-lg bg-muted/20">
                    <Users size={48} className="mx-auto mb-4 text-primary/50" />
                    <h3 className="text-lg sm:text-xl font-semibold mb-2 text-foreground">No Categories Yet</h3>
                    <p className="text-muted-foreground max-w-md mx-auto mb-6 text-sm sm:text-base">
                        It looks like there are no forum categories. An administrator can add some.
                    </p>
                     <Button asChild className="w-full sm:w-auto">
                        <Link href="/admin/community/categories">
                            <PlusCircle className="mr-2 h-5 w-5" /> Add First Category (Admin)
                        </Link>
                    </Button>
                </div>
            )}
          </div>
          
          <div className="text-center py-10 border-t mt-10">
            <h3 className="text-lg sm:text-xl font-semibold mb-2 text-foreground">Building Our Community Features</h3>
            <p className="text-muted-foreground max-w-lg mx-auto mb-6 text-sm sm:text-base">
              We're actively developing full forum functionality, including user accounts, posts, and real-time interactions.
              Stay tuned for more updates!
            </p>
            <Button asChild size="lg" className="w-full sm:w-auto">
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
