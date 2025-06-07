
// src/app/help/page.tsx
import { helpTopics } from '@/data/help-guide-topics';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MarkdownDisplay } from '@/components/markdown-display';
import { HelpCircle, type Icon as LucideIcon } from 'lucide-react';

export default function HelpPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="shadow-xl bg-card">
        <CardHeader>
          <CardTitle className="font-headline text-2xl sm:text-3xl flex items-center">
            <HelpCircle className="mr-3 text-primary" size={32} />
            Application Help Guide
          </CardTitle>
          <CardDescription>
            Find answers to your questions about using Idea Incubator. Click a topic to learn more.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[calc(100vh-20rem)] sm:h-[calc(100vh-22rem)]"> {/* Adjust height as needed */}
            <Accordion type="single" collapsible className="w-full">
              {helpTopics.map((topic) => {
                const IconComponent = topic.icon as LucideIcon;
                return (
                  <AccordionItem value={topic.id} key={topic.id}>
                    <AccordionTrigger className="text-sm sm:text-base hover:no-underline py-3 text-left">
                      <div className="flex items-center">
                        {IconComponent && <IconComponent className="mr-3 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />}
                        <span>{topic.title}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="prose-sm dark:prose-invert max-w-none pb-4">
                      <MarkdownDisplay content={topic.content} className="text-xs sm:text-sm" />
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
