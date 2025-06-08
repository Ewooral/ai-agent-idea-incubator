
// src/components/layout/app-shell.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FeatherLogo } from "@/components/icons/feather-logo";
import {
  Sidebar,
  SidebarHeader, 
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarFooter,
  SidebarTrigger, // Import SidebarTrigger
} from "@/components/ui/sidebar";
import { Feather, Lightbulb, LayoutDashboard, CheckCircle, Users, Menu, Hammer, Settings as SettingsIcon, HelpCircle, LogIn, UserPlus } from "lucide-react";
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LanguageSelector } from '@/components/language-selector';
import { ThemeToggleButton } from '@/components/theme-toggle-button';
import { ChatbotDialog } from '@/components/chatbot/chatbot-dialog';

const mainNavItems = [
  { href: "/", label: "Generate Idea", icon: Lightbulb, tooltip: "Generate New Ideas" },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, tooltip: "Your Idea Dashboard" },
  { href: "/validation", label: "Idea Validation", icon: CheckCircle, tooltip: "Validate Your Ideas" },
  { href: "/build-studio", label: "Build Studio", icon: Hammer, tooltip: "Develop Your Ideas" },
  { href: "/community", label: "Community Forum", icon: Users, tooltip: "Connect with Others" },
];

const authNavItems = [
  { href: "/login", label: "Login", icon: LogIn, tooltip: "Login to Your Account" },
  { href: "/register", label: "Register", icon: UserPlus, tooltip: "Create an Account" },
];

const utilityNavItems = [
  { href: "/settings", label: "Settings", icon: SettingsIcon, tooltip: "Application Settings" },
  { href: "/help", label: "Help Guide", icon: HelpCircle, tooltip: "Application Help" },
];


export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const renderNavItems = (items: typeof mainNavItems) => {
    return items.map((item) => (
      <SidebarMenuItem key={item.href} className="p-0">
        <Link href={item.href} passHref legacyBehavior>
          <SidebarMenuButton
            isActive={pathname === item.href}
            className="w-full justify-start text-sm"
            variant="ghost"
            size="default"
            tooltip={{ children: item.tooltip, side: 'right', align: 'center' }}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </SidebarMenuButton>
        </Link>
      </SidebarMenuItem>
    ));
  };

  // Content for the sidebar (used by both desktop Sidebar and mobile Sheet via Sidebar component's internal logic)
  const sidebarFullContent = (
    <>
      <SidebarHeader className="p-4 border-b">
        <div className="flex items-center justify-between">
          {/* For expanded desktop sidebar and mobile menu header */}
          <Link href="/" className="block group-data-[state=expanded]:hidden group-data-[mobile=true]:block">
              <FeatherLogo size={28} />
          </Link>
           {/* For collapsed desktop sidebar */}
          <Link href="/" className="hidden group-data-[state=collapsed]:block group-data-[mobile=true]:hidden">
              <Feather className="text-primary" size={28}/>
          </Link>
          {/* Mobile menu trigger - shown by Sidebar component on mobile */}
           <div className="lg:hidden group-data-[mobile=true]:block"> {/* This trigger is part of ui/sidebar for mobile */}
             {/* The Sidebar component itself handles its open/close trigger on mobile via its props/context */}
           </div>
        </div>
      </SidebarHeader>
      <ScrollArea className="flex-grow">
        <SidebarContent className="p-2 flex flex-col h-full">
          <SidebarMenu className="flex-grow">
            {renderNavItems(mainNavItems)}
            {renderNavItems(authNavItems)} 
            {renderNavItems(utilityNavItems)} 
          </SidebarMenu>
        </SidebarContent>
      </ScrollArea>
      <SidebarFooter className="p-2 border-t flex flex-col gap-2">
        <ThemeToggleButton />
        <LanguageSelector />
      </SidebarFooter>
    </>
  );


  return (
    <div>
      <div className="flex min-h-screen bg-background">
        <Sidebar
          variant="sidebar" // Default variant
          collapsible="icon" // Default collapsible behavior
          className="hidden lg:flex flex-col !bg-card shadow-sm"
        >
          {sidebarFullContent}
        </Sidebar>

        <SidebarInset className="flex-1 overflow-y-auto relative">
          {/* Mobile Top Bar */}
          <div className="lg:hidden sticky top-0 z-20 h-16 bg-card border-b shadow-sm flex items-center px-4 justify-between">
            <SidebarTrigger> {/* This uses the SidebarTrigger from ui/sidebar to control the mobile sheet */}
              <Menu className="h-6 w-6" />
              <span className="sr-only">Open menu</span>
            </SidebarTrigger>
            <Link href="/">
              <FeatherLogo size={28} />
            </Link>
            <div className="w-6"></div> {/* Spacer for balance */}
          </div>
          
           <div className="px-4 pt-6 md:px-6 lg:px-8 pb-6 w-full max-w-7xl mx-auto">
              {children}
          </div>
        </SidebarInset>
      </div>
      <ChatbotDialog />
    </div>
  );
}
