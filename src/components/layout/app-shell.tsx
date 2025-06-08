
// src/components/layout/app-shell.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FeatherLogo } from "@/components/icons/feather-logo";
import {
  Sidebar, // Used for desktop sidebar
  SidebarHeader as UISidebarHeader, // Renamed to avoid conflict with SheetHeader
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader, // Added for mobile sheet title
  SheetTitle,   // Added for mobile sheet title
} from "@/components/ui/sheet"; // For explicit mobile sheet
import { Feather, Lightbulb, LayoutDashboard, CheckCircle, Users, Menu, Hammer, Settings as SettingsIcon, HelpCircle, LogIn, UserPlus, X } from "lucide-react";
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LanguageSelector } from '@/components/language-selector';
import { ThemeToggleButton } from '@/components/theme-toggle-button';
import { ChatbotDialog } from '@/components/chatbot/chatbot-dialog';
import { Button } from "@/components/ui/button";
import { useSidebar as useSidebarContextHook } from "@/components/ui/sidebar"; // renamed to avoid conflict

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

// For desktop sidebar
const desktopSidebarNavItems = [
  ...mainNavItems,
  utilityNavItems.find(item => item.href === "/help")!, // Only Help
];

// For mobile sheet
const mobileSheetNavItems = [
  ...mainNavItems,
  ...authNavItems,
  ...utilityNavItems,
];


export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileSheetOpen, setIsMobileSheetOpen] = React.useState(false);
  const { isMobile } = useSidebarContextHook(); // from ui/sidebar for its internal logic

  const renderNavItemsForSheet = (items: typeof mobileSheetNavItems) => {
    return items.map((item) => (
      <SidebarMenuItem key={item.href} className="p-0">
        <Link href={item.href} passHref legacyBehavior>
          <SidebarMenuButton
            isActive={pathname === item.href}
            className="w-full justify-start text-sm"
            variant="ghost"
            size="default"
            onClick={() => setIsMobileSheetOpen(false)} // Close sheet on click
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </SidebarMenuButton>
        </Link>
      </SidebarMenuItem>
    ));
  };
  
  const renderNavItemsForDesktopSidebar = (items: typeof desktopSidebarNavItems) => {
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


  const TopHeader = () => (
    <header className="fixed top-0 left-0 right-0 h-16 bg-card border-b shadow-sm z-30">
      <div className="container mx-auto px-4 h-full flex items-center justify-between max-w-7xl">
        <div className="flex items-center gap-4">
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsMobileSheetOpen(true)}>
              <Menu className="h-6 w-6" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <Link href="/" className="flex items-center">
            <FeatherLogo size={28} />
          </Link>
        </div>
        <nav className="hidden lg:flex items-center gap-1">
          {authNavItems.map(item => (
            <Button key={item.href} variant="ghost" asChild size="sm">
              <Link href={item.href}>
                <item.icon className="mr-1.5 h-4 w-4" /> {item.label}
              </Link>
            </Button>
          ))}
          <Button variant="ghost" size="icon" asChild>
            <Link href="/settings" aria-label="Settings">
              <SettingsIcon className="h-5 w-5" />
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );

  const mobileSheetContent = (
    <>
      <SheetHeader className="p-4 border-b">
        <SheetTitle>
          <Link href="/" onClick={() => setIsMobileSheetOpen(false)} className="flex items-center">
            <FeatherLogo size={28} />
          </Link>
        </SheetTitle>
      </SheetHeader>
      <ScrollArea className="flex-grow">
        <SidebarContent className="p-2 flex flex-col h-full">
          <SidebarMenu className="flex-grow">
            {renderNavItemsForSheet(mobileSheetNavItems)}
          </SidebarMenu>
        </SidebarContent>
      </ScrollArea>
      <SidebarFooter className="p-2 border-t flex flex-col gap-2">
        <ThemeToggleButton />
        <LanguageSelector />
      </SidebarFooter>
    </>
  );
  
  const desktopSidebarContent = (
     <>
      <UISidebarHeader className="p-4 border-b"> {/* Changed to UISidebarHeader */}
        <Link href="/" className="block group-data-[state=expanded]:hidden group-data-[mobile=true]:block">
            <FeatherLogo size={28} />
        </Link>
        <Link href="/" className="hidden group-data-[state=collapsed]:block group-data-[mobile=true]:hidden">
            <Feather className="text-primary" size={28}/>
        </Link>
      </UISidebarHeader>
      <ScrollArea className="flex-grow">
        <SidebarContent className="p-2 flex flex-col h-full">
          <SidebarMenu className="flex-grow">
            {renderNavItemsForDesktopSidebar(desktopSidebarNavItems)}
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
      <Sheet open={isMobileSheetOpen} onOpenChange={setIsMobileSheetOpen}>
        <TopHeader /> {/* Contains SheetTrigger for mobile */}
        <SheetContent 
            side="left" 
            className="p-0 w-[var(--sidebar-width-mobile)] flex flex-col !bg-card lg:hidden" // Ensures it's hidden on lg+
            style={{ "--sidebar-width-mobile": "18rem" } as React.CSSProperties}
        >
            {mobileSheetContent}
        </SheetContent>
      </Sheet>

      <div className="flex min-h-screen pt-16 bg-background"> {/* pt-16 for the fixed header */}
        <Sidebar
          variant="sidebar"
          collapsible="icon"
          className="hidden lg:flex flex-col !bg-card shadow-sm" // Only visible on lg+
        >
          {desktopSidebarContent}
        </Sidebar>

        <SidebarInset className="flex-1 overflow-y-auto relative">
           <div className="px-4 pt-6 md:pt-6 lg:pt-8 pb-6 w-full max-w-7xl mx-auto">
              {children}
          </div>
        </SidebarInset>
      </div>
      <ChatbotDialog />
    </div>
  );
}

