
"use client";

import { useState, useEffect, useRef, type FormEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Loader2, Send, User, X, MessageSquare } from "lucide-react";
import { askChatbotAction } from '@/app/actions/chatActions';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

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
  const inputRef = useRef<HTMLInputElement>(null);
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
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
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

    const chatHistoryForBackend = messages
      .filter(msg => msg.id !== 'greeting-0') 
      .map(msg => ({
        role: msg.role, 
        content: msg.content,
      }));
    
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
      inputRef.current?.focus();
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 h-14 w-14 sm:bottom-6 sm:right-6 rounded-full shadow-lg bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-2 focus:ring-ring focus:ring-offset-2 z-50"
        aria-label={isOpen ? "Close Chatbot" : "Open Chatbot"}
      >
        {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
      </Button>

      {isOpen && (
        <Card 
          className="fixed bottom-20 right-4 w-[90vw] h-[60vh] sm:bottom-24 sm:right-6 sm:w-full sm:max-w-sm md:max-w-md sm:h-[70vh] max-h-[500px] lg:max-h-[550px] flex flex-col shadow-2xl rounded-xl border bg-card z-40"
        >
          <CardHeader className="flex flex-row items-center justify-between p-3 border-b">
            <div className="flex items-center space-x-2">
              <Bot className="text-primary h-6 w-6" />
              <span className="font-headline text-md text-foreground">Elia - Assistant</span>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} aria-label="Close chat panel">
              <X className="h-5 w-5 text-muted-foreground" />
            </Button>
          </CardHeader>
          
          <ScrollArea ref={scrollAreaRef} className="flex-grow p-3 overflow-y-auto">
            <div className="space-y-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex items-end gap-2",
                    msg.role === 'user' ? "justify-end" : "justify-start"
                  )}
                >
                  {msg.role === 'ai' && (
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary border">
                      <Bot size={18} />
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-[80%] rounded-lg px-3 py-2 text-sm shadow-sm",
                      msg.role === 'user'
                        ? "bg-primary text-primary-foreground rounded-br-none"
                        : "bg-muted text-card-foreground rounded-bl-none border"
                    )}
                  >
                    {msg.content.split('\n').map((line, i, arr) => (
                      <span key={i}>{line}{i < arr.length - 1 && <br/>}</span>
                    ))}
                  </div>
                  {msg.role === 'user' && (
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-accent flex items-center justify-center text-accent-foreground border">
                      <User size={18} />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex items-center justify-start gap-2">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary border">
                      <Bot size={18} />
                  </div>
                  <div className="bg-muted text-muted-foreground rounded-lg px-3 py-2 text-sm shadow-sm flex items-center rounded-bl-none border">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Elia is thinking...
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <CardFooter className="p-3 border-t bg-background/50">
            <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
              <Input
                ref={inputRef}
                type="text"
                placeholder="Ask Elia a question..."
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
          </CardFooter>
        </Card>
      )}
    </>
  );
}
