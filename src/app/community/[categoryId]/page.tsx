
// src/app/community/[categoryId]/page.tsx
import { getForumCategoryById, type ForumCategory } from '@/lib/db';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MessageSquare, PlusCircle, AlertTriangle, type Icon as LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';

interface CategoryPageProps {
  params: {
    categoryId: string;
  };
}

// Minimal Icon mapping for this page - could share with community/page.tsx if more complex
const iconMap: { [key: string]: LucideIcon } = {
  MessageSquare,
  Lightbulb: AlertTriangle, // Example if Lightbulb was directly used
  Users2: AlertTriangle,
  Rocket: AlertTriangle,
  AlertTriangle,
};

function getIconComponent(iconName: string): LucideIcon {
  const Icon = iconMap[iconName];
  if (Icon) {
    return Icon;
  }
  // Fallback for icons not explicitly mapped here but that might be valid Lucide icons
  const LucideAny = AlertTriangle as any; // Use a known icon as fallback base
  if (LucideAny[iconName]) return LucideAny[iconName];
  
  console.warn(`Icon "${iconName}" not found in simplified iconMap for category page. Falling back to AlertTriangle.`);
  return AlertTriangle;
}


export default async function CategoryPage({ params }: CategoryPageProps) {
  const { categoryId } = params;
  const category: ForumCategory | null = await getForumCategoryById(categoryId);

  if (!category) {
    notFound();
  }

  const IconComponent = getIconComponent(category.iconName);

  return (
    <div className="container mx-auto py-8 px-4">
      <Button variant="outline" asChild className="mb-6">
        <Link href="/community"><ArrowLeft className="mr-2 h-4 w-4" /> Back to All Categories</Link>
      </Button>

      <Card className="shadow-xl bg-card">
        <CardHeader>
          <CardTitle className="font-headline text-3xl flex items-center">
            <IconComponent className="mr-3 text-primary" size={32} />
            {category.title}
          </CardTitle>
          <CardDescription>{category.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-end">
            <Button disabled>
              <PlusCircle className="mr-2 h-5 w-5" /> Create New Thread (Coming Soon)
            </Button>
          </div>
          
          <div className="text-center py-12 border rounded-lg bg-muted/20">
            <MessageSquare size={48} className="mx-auto mb-4 text-primary/50" />
            <h3 className="text-xl font-semibold mb-2 text-foreground">No Threads Yet</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              No discussions have started in this category. Be the first to post a new thread!
            </p>
          </div>
          {/* Placeholder for thread list - to be implemented later */}
          {/* 
            <div className="space-y-4">
              {[1,2,3].map(i => (
                <Card key={i} className="bg-muted/30">
                  <CardHeader><CardTitle className="text-lg">Placeholder Thread Title {i}</CardTitle></CardHeader>
                  <CardContent><p className="text-sm text-muted-foreground">Posted by User - 2 hours ago</p></CardContent>
                  <CardFooter><Button variant="link" size="sm">Read More</Button></CardFooter>
                </Card>
              ))}
            </div>
          */}
        </CardContent>
        <CardFooter>
            <p className="text-xs text-muted-foreground">
                Thread functionality is under development. Stay tuned!
            </p>
        </CardFooter>
      </Card>
    </div>
  );
}
