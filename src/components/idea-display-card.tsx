import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface IdeaDisplayCardProps {
  idea: string;
}

export function IdeaDisplayCard({ idea }: IdeaDisplayCardProps) {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="font-headline text-lg flex items-start">
          <Lightbulb className="text-accent mr-2 mt-1 shrink-0" size={20} />
          <span className="flex-grow">Novel Idea</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-foreground/90 leading-relaxed">{idea}</p>
      </CardContent>
      <CardContent className="pt-2 pb-4">
         <Button variant="outline" size="sm" className="w-full" asChild>
           <Link href={{ pathname: '/validation', query: { idea: idea } }}>
            Validate This Idea
           </Link>
         </Button>
      </CardContent>
    </Card>
  );
}
