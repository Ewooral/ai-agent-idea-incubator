// src/app/dashboard/page.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutDashboard } from "lucide-react";
import Image from "next/image";

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="shadow-xl bg-card">
        <CardHeader>
          <CardTitle className="font-headline text-3xl flex items-center">
            <LayoutDashboard className="mr-3 text-primary" size={32} /> Your Idea Dashboard
          </CardTitle>
          <CardDescription>
            This is your personal space to manage, track, and grow your generated ideas.
            Currently, this section is a glimpse of what&apos;s to come.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-10">
            <Image 
              src="https://placehold.co/600x400.png" 
              alt="Dashboard placeholder illustration" 
              width={600} 
              height={400} 
              className="mx-auto mb-6 rounded-lg shadow-md"
              data-ai-hint="ideas board"
            />
            <h3 className="text-xl font-semibold mb-2 text-foreground">Feature Coming Soon!</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Soon, you&apos;ll be able to save your favorite ideas here, categorize them,
              track their validation progress, and much more.
            </p>
            <p className="text-muted-foreground mt-2 max-w-md mx-auto">
              For now, head over to &quot;Generate Idea&quot; to spark some new concepts!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
