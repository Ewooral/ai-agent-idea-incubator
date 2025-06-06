
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
  SidebarTrigger,
  SidebarFooter, // Import SidebarFooter
} from "@/components/ui/sidebar";
import { Feather, Lightbulb, LayoutDashboard, CheckCircle, Users, Menu, Hammer } from "lucide-react";
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { LanguageSelector } from '@/components/language-selector'; // Import LanguageSelector

const navItems = [
  { href: "/", label: "Generate Idea", icon: Lightbulb, tooltip: "Generate New Ideas" },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, tooltip: "Your Idea Dashboard" },
  { href: "/validation", label: "Idea Validation", icon: CheckCircle, tooltip: "Validate Your Ideas" },
  { href: "/build-studio", label: "Build Studio", icon: Hammer, tooltip: "Develop Your Ideas" },
  { href: "/community", label: "Community Forum", icon: Users, tooltip: "Connect with Others" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const sidebarNavigation = (
    <>
     <SidebarHeader className="p-4 border-b">
        <div className="flex items-center justify-between">
          <Link href="/" className="block group-data-[state=collapsed]:hidden" onClick={() => isMobileMenuOpen && setIsMobileMenuOpen(false)}>
              <FeatherLogo size={28} />
          </Link>
          <Link href="/" className="hidden group-data-[state=collapsed]:block" onClick={() => isMobileMenuOpen && setIsMobileMenuOpen(false)}>
              <Feather className="text-primary" size={28}/>
          </Link>
        </div>
      </SidebarHeader>
      <ScrollArea className="flex-grow">
        <SidebarContent className="p-2 flex flex-col h-full"> {/* Modified for flex layout */}
          <SidebarMenu className="flex-grow"> {/* Allow menu to take available space */}
            {navItems.map((item) => (
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
            ))}
          </SidebarMenu>
          {/* LanguageSelector is now outside SidebarMenu, directly in SidebarContent or Footer */}
        </SidebarContent>
      </ScrollArea>
      <SidebarFooter className="p-2 border-t"> {/* Use SidebarFooter */}
        <LanguageSelector />
      </SidebarFooter>
    </>
  );

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <Sidebar
        variant="sidebar"
        collapsible="icon"
        className="hidden lg:flex flex-col !bg-card shadow-sm" 
      >
        {sidebarNavigation}
      </Sidebar>

      {/* Mobile Header and Sidebar Sheet */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between p-2 border-b bg-card shadow-sm h-16">
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <Link href="/">
             <FeatherLogo size={24} showText={false} /> 
          </Link>
          <div className="w-8"></div>
          <SheetContent side="left" className="p-0 w-72 !bg-card flex flex-col"> {/* Ensure flex-col for SheetContent too */}
            {sidebarNavigation}
          </SheetContent>
        </Sheet>
      </div>
      
      <div className="fixed top-3 right-4 z-50 px-3 py-1.5 rounded-md shadow-lg bg-card text-accent-foreground text-xs font-medium">
        Developed by bfam, Inc.
      </div>

      <SidebarInset className="flex-1 overflow-y-auto relative"> 
        <main className="p-4 pt-20 lg:pt-6 md:p-6 lg:p-8 max-w-full mx-auto">
          {children}
        </main>
      </SidebarInset>
    </div>
  );
}
