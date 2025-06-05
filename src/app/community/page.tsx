// src/app/community/page.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, MessageSquare } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function CommunityPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="shadow-xl bg-card">
        <CardHeader>
          <CardTitle className="font-headline text-3xl flex items-center">
            <Users className="mr-3 text-primary" size={32} /> Idea Exchange Forum
          </CardTitle>
          <CardDescription>
            Connect with fellow innovators, share your brilliant ideas, provide feedback,
            and collaborate on the next big thing.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-10">
            <Image 
              src="https://placehold.co/600x400.png" 
              alt="Community forum placeholder illustration" 
              width={600} 
              height={400} 
              className="mx-auto mb-6 rounded-lg shadow-md"
              data-ai-hint="community discussion"
            />
            <h3 className="text-xl font-semibold mb-2 text-foreground">Community Forum: Coming Soon!</h3>
            <p className="text-muted-foreground max-w-lg mx-auto">
              We&apos;re building a vibrant space for you to discuss, refine, and get valuable feedback on your ideas.
              Moderated discussions, themed channels, and collaboration tools are on the way.
            </p>
            <div className="mt-8">
              <p className="text-muted-foreground mb-4">In the meantime, why not generate some new ideas to share later?</p>
              <Button asChild size="lg">
                <Link href="/">
                  <MessageSquare className="mr-2 h-5 w-5" /> Generate Ideas
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
