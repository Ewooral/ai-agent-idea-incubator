
// src/components/layout/app-shell.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FeatherLogo } from "@/components/icons/feather-logo";
import {
  Sidebar,
  SidebarHeader, // This is from @/components/ui/sidebar
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  // SidebarTrigger, // SidebarTrigger is part of @/components/ui/sidebar, not directly used here for the Sheet
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Feather, Lightbulb, LayoutDashboard, CheckCircle, Users, Menu, Hammer, Settings as SettingsIcon, HelpCircle, LogIn, UserPlus } from "lucide-react";
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader as UISheetHeader, SheetTitle as UISheetTitle, SheetTrigger } from "@/components/ui/sheet"; // Aliasing for clarity
import { LanguageSelector } from '@/components/language-selector';
import { ThemeToggleButton } from '@/components/theme-toggle-button';

const navItems = [
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const renderNavItems = (items: typeof navItems) => {
    return items.map((item) => (
      <SidebarMenuItem key={item.href} className="p-0">
        <Link href={item.href} passHref legacyBehavior>
          <SidebarMenuButton
            isActive={pathname === item.href}
            className="w-full justify-start text-sm"
            variant="ghost"
            size="default"
            tooltip={{ children: item.tooltip, side: 'right', align: 'center' }}
            onClick={() => isMobileMenuOpen && setIsMobileMenuOpen(false)}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </SidebarMenuButton>
        </Link>
      </SidebarMenuItem>
    ));
  };


  const sidebarNavigation = (
    <>
     {/* This SidebarHeader is for the visual structure of the sidebar content (desktop and inside mobile sheet) */}
     {/* It should NOT contain a UISheetHeader or UISheetTitle meant for a Sheet component. */}
     <SidebarHeader className="p-4 border-b">
        <div className="flex items-center justify-between">
          <Link href="/" className="block group-data-[state=expanded]:hidden" onClick={() => isMobileMenuOpen && setIsMobileMenuOpen(false)}>
              <FeatherLogo size={28} />
          </Link>
          <Link href="/" className="hidden group-data-[state=collapsed]:block" onClick={() => isMobileMenuOpen && setIsMobileMenuOpen(false)}>
              <Feather className="text-primary" size={28}/>
          </Link>
        </div>
      </SidebarHeader>
      <ScrollArea className="flex-grow">
        <SidebarContent className="p-2 flex flex-col h-full">
          <SidebarMenu className="flex-grow">
            {renderNavItems(navItems)}
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
    <div className="flex min-h-screen bg-background">
      <Sidebar
        variant="sidebar"
        collapsible="icon"
        className="hidden lg:flex flex-col !bg-card shadow-sm"
      >
        {sidebarNavigation}
      </Sidebar>

      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between p-2 border-b bg-card shadow-sm h-16">
         <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72 !bg-card flex flex-col">
            {/* This UISheetHeader and UISheetTitle are for the mobile Sheet's accessibility */}
            <UISheetHeader className="sr-only">
              <UISheetTitle>Main Menu</UISheetTitle>
            </UISheetHeader>
            {sidebarNavigation}
          </SheetContent>
        </Sheet>

        <Link href="/">
            <FeatherLogo size={24} showText={false} />
        </Link>

        <div className="w-10 h-10"></div>
      </div>

      <div className="fixed top-3 right-4 z-50 px-3 py-1.5 rounded-md shadow-lg bg-card text-card-foreground text-xs font-medium">
        Developed by bfam, Inc.
      </div>

      <SidebarInset className="flex-1 overflow-y-auto relative">
         <div className="p-4 pt-20 lg:pt-6 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
            {children}
        </div>
      </SidebarInset>
    </div>
  );
}
