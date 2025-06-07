
// src/components/help-guide.tsx
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { HelpCircle } from 'lucide-react';
import { helpTopics } from '@/data/help-guide-topics';
import { MarkdownDisplay } from './markdown-display';
import type { Icon as LucideIcon } from 'lucide-react';

export function HelpGuide() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-auto group-data-[collapsible=icon]:h-auto group-data-[collapsible=icon]:p-2 w-full"
        aria-label="Open help guide"
        title="Open Help Guide"
      >
        <HelpCircle className="h-[1.2rem] w-[1.2rem] group-data-[collapsible=icon]:mr-0 mr-2" />
        <span className="group-data-[collapsible=icon]:hidden">Help</span>
      </Button>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="w-full sm:max-w-md md:max-w-lg p-0 flex flex-col" side="right">
          <SheetHeader className="p-4 sm:p-6 pb-2 border-b">
            <SheetTitle className="text-lg sm:text-xl flex items-center">
              <HelpCircle className="mr-2 text-primary h-5 w-5 sm:h-6 sm:w-6" />
              Application Help Guide
            </SheetTitle>
            <SheetDescription className="text-xs sm:text-sm">
              Find answers to your questions about using Idea Incubator. Click a topic to learn more.
            </SheetDescription>
          </SheetHeader>
          <ScrollArea className="flex-grow">
            <Accordion type="single" collapsible className="w-full px-4 sm:px-6 py-2">
              {helpTopics.map((topic) => {
                const IconComponent = topic.icon as LucideIcon; // Cast to LucideIcon
                return (
                  <AccordionItem value={topic.id} key={topic.id}>
                    <AccordionTrigger className="text-sm sm:text-base hover:no-underline py-3">
                      <div className="flex items-center">
                        {IconComponent && <IconComponent className="mr-3 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />}
                        <span className="text-left">{topic.title}</span>
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
          <SheetFooter className="p-4 sm:p-6 pt-3 border-t">
            <SheetClose asChild>
              <Button type="button" variant="outline" className="w-full">Close</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}

    