
"use client";

import { useState, useEffect, useRef, type FormEvent } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Loader2, Send, User, X } from "lucide-react";
import { askChatbotAction, type ChatbotActionFrontendInput } from '@/app/actions/chatActions';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
}

export function ChatbotDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const initialGreeting: Message = {
    id: 'greeting-0',
    role: 'ai',
    content: "Hello! I'm Elia, your Idea Incubator assistant. How can I help you today?",
  };

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([initialGreeting]);
    }
  }, [isOpen]);

  useEffect(() => {
    // Scroll to bottom when new messages are added
    if (scrollAreaRef.current) {
      const scrollViewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (scrollViewport) {
        scrollViewport.scrollTop = scrollViewport.scrollHeight;
      }
    }
  }, [messages]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const newUserMessage: Message = { id: `msg-${Date.now()}`, role: 'user', content: inputValue.trim() };
    setMessages(prev => [...prev, newUserMessage]);
    setInputValue("");
    setIsLoading(true);

    // Prepare chat history for the backend (needs role 'user' or 'model')
    const chatHistoryForBackend = messages
      .filter(msg => msg.id !== 'greeting-0') // Exclude initial greeting
      .map(msg => ({
        role: msg.role, // 'user' or 'ai'
        content: msg.content,
      }));
    
    // Add current user message to history for backend
     chatHistoryForBackend.push({role: 'user', content: newUserMessage.content});


    try {
      const result = await askChatbotAction({
        userQuery: newUserMessage.content,
        chatHistory: chatHistoryForBackend,
      });

      if (result.success && result.aiResponse) {
        const aiMessage: Message = { id: `msg-${Date.now()}-ai`, role: 'ai', content: result.aiResponse };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        toast({
          title: "Chatbot Error",
          description: result.message || "Sorry, I couldn't get a response. Please try again.",
          variant: "destructive",
        });
         const errorMessage: Message = { id: `err-${Date.now()}`, role: 'ai', content: "Sorry, I encountered an issue. Please try again." };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error("Chatbot submission error:", error);
      toast({
        title: "Unexpected Error",
        description: "Something went wrong with the chatbot.",
        variant: "destructive",
      });
      const errorMessage: Message = { id: `err-${Date.now()}`, role: 'ai', content: "Sorry, an unexpected error occurred." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-2 focus:ring-ring focus:ring-offset-2 z-50"
          aria-label="Open Chatbot"
        >
          <Bot size={28} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] md:max-w-[550px] lg:max-w-[600px] p-0 flex flex-col h-[80vh] max-h-[700px] bg-card">
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="flex items-center font-headline text-lg">
            <Bot className="mr-2 text-primary" /> Idea Incubator Assistant
          </DialogTitle>
          <DialogDescription className="text-xs">
            Ask Elia anything about using the app.
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea ref={scrollAreaRef} className="flex-grow p-4 overflow-y-auto">
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex items-end gap-2",
                  msg.role === 'user' ? "justify-end" : "justify-start"
                )}
              >
                {msg.role === 'ai' && (
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                    <Bot size={18} />
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-[75%] rounded-lg px-3 py-2 text-sm shadow",
                    msg.role === 'user'
                      ? "bg-primary text-primary-foreground rounded-br-none"
                      : "bg-muted text-muted-foreground rounded-bl-none border"
                  )}
                >
                  {/* Basic handling for newlines, can be improved with MarkdownDisplay if AI returns markdown */}
                  {msg.content.split('\n').map((line, i) => (
                    <span key={i}>{line}<br/></span>
                  ))}
                </div>
                 {msg.role === 'user' && (
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-accent flex items-center justify-center text-accent-foreground">
                    <User size={18} />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center justify-start gap-2">
                 <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                    <Bot size={18} />
                  </div>
                <div className="bg-muted text-muted-foreground rounded-lg px-3 py-2 text-sm shadow flex items-center rounded-bl-none border">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Elia is thinking...
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="p-4 border-t bg-background">
          <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
            <Input
              type="text"
              placeholder="Ask about Idea Incubator..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isLoading}
              className="flex-1"
              aria-label="Chat message input"
            />
            <Button type="submit" size="icon" disabled={isLoading || !inputValue.trim()} aria-label="Send message">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
