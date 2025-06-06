
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Lightbulb, Hammer } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SavedIdea } from "@/lib/db"; // Import SavedIdea type

interface IdeaDisplayCardProps {
  savedIdea: SavedIdea; // Use the full SavedIdea object
}

export function IdeaDisplayCard({ savedIdea }: IdeaDisplayCardProps) {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="font-headline text-lg flex items-start">
          <Lightbulb className="text-accent mr-2 mt-1 shrink-0" size={20} />
          <span className="flex-grow">Refined Idea</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-foreground/90 leading-relaxed">{savedIdea.refinedIdea}</p>
      </CardContent>
      <CardFooter className="pt-2 pb-4 flex flex-col sm:flex-row gap-2">
         <Button variant="outline" size="sm" className="w-full" asChild>
           <Link href={{ pathname: '/validation', query: { idea: savedIdea.originalIdea } }}>
            Re-Validate Idea
           </Link>
         </Button>
         <Button variant="default" size="sm" className="w-full" asChild>
           <Link href={`/build-studio/${savedIdea.id}`}>
            <Hammer className="mr-2 h-4 w-4" /> Develop Idea
           </Link>
         </Button>
      </CardFooter>
    </Card>
  );
}
