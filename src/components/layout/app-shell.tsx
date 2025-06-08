
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
} from "@/components/ui/sidebar";
import { Feather, Lightbulb, LayoutDashboard, CheckCircle, Users, Menu, Hammer, Settings as SettingsIcon, HelpCircle, LogIn, UserPlus } from "lucide-react";
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader as UISheetHeader, SheetTitle as UISheetTitle, SheetTrigger } from "@/components/ui/sheet"; 
import { LanguageSelector } from '@/components/language-selector';
import { ThemeToggleButton } from '@/components/theme-toggle-button';

const mainNavItems = [
  { href: "/", label: "Generate Idea", icon: Lightbulb, tooltip: "Generate New Ideas" },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, tooltip: "Your Idea Dashboard" },
  { href: "/validation", label: "Idea Validation", icon: CheckCircle, tooltip: "Validate Your Ideas" },
  { href: "/build-studio", label: "Build Studio", icon: Hammer, tooltip: "Develop Your Ideas" },
  { href: "/community", label: "Community Forum", icon: Users, tooltip: "Connect with Others" },
];

// These will be used for the mobile menu
const allAuthNavItems = [
  { href: "/login", label: "Login", icon: LogIn, tooltip: "Login to Your Account" },
  { href: "/register", label: "Register", icon: UserPlus, tooltip: "Create an Account" },
];

const allUtilityNavItems = [
  { href: "/settings", label: "Settings", icon: SettingsIcon, tooltip: "Application Settings" },
  { href: "/help", label: "Help Guide", icon: HelpCircle, tooltip: "Application Help" },
];

// Filtered lists for the desktop sidebar
const desktopUtilityNavItems = allUtilityNavItems.filter(item => item.href !== "/settings");


export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const renderNavItems = (items: typeof mainNavItems, forDesktopSidebar: boolean = false) => {
    let itemsToRender = items;
    if (forDesktopSidebar) {
      if (items === allAuthNavItems) { // Assuming allAuthNavItems is passed for auth section
        itemsToRender = []; // Login/Register moved to top header for desktop
      } else if (items === allUtilityNavItems) { // Assuming allUtilityNavItems is passed for utility section
        itemsToRender = items.filter(item => item.href !== "/settings");
      }
    }

    return itemsToRender.map((item) => (
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


  // This definition is for the mobile sheet, so it includes all items.
  const sidebarNavigationForMobileSheet = (
    <>
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
            {renderNavItems(mainNavItems)}
            {renderNavItems(allAuthNavItems)} 
            {renderNavItems(allUtilityNavItems)} 
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
      {/* New Top Header */}
      <header className="fixed top-0 left-0 right-0 z-30 h-16 bg-card border-b shadow-sm">
        <div className="container mx-auto px-4 h-full flex items-center justify-between max-w-7xl">
          {/* Left Side: Mobile Menu Trigger + Logo */}
          <div className="flex items-center">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden mr-2">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-72 !bg-card flex flex-col">
                <UISheetHeader className="sr-only">
                  <UISheetTitle>Main Menu</UISheetTitle>
                </UISheetHeader>
                {sidebarNavigationForMobileSheet}
              </SheetContent>
            </Sheet>
            <Link href="/">
              <FeatherLogo size={28} />
            </Link>
          </div>

          {/* Right Side: Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            <Button variant="ghost" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/register">Register</Link>
            </Button>
            <Button variant="ghost" size="icon" asChild title="Settings" className="ml-2">
              <Link href="/settings">
                <SettingsIcon size={20} />
                 <span className="sr-only">Settings</span>
              </Link>
            </Button>
          </nav>
        </div>
      </header>
      
      {/* <div className="fixed top-3 right-4 z-50 px-3 py-1.5 rounded-md shadow-lg bg-card text-card-foreground text-xs font-medium">
        Developed by bfam, Inc.
      </div> */}

      <div className="flex min-h-screen bg-background pt-16"> {/* pt-16 for fixed header */}
        <Sidebar
          variant="sidebar"
          collapsible="icon"
          className="hidden lg:flex flex-col !bg-card shadow-sm"
        >
          {/* Desktop Sidebar specific content */}
          <SidebarHeader className="p-4 border-b">
            <div className="flex items-center justify-between">
              <Link href="/" className="block group-data-[state=expanded]:hidden">
                  <FeatherLogo size={28} />
              </Link>
              <Link href="/" className="hidden group-data-[state=collapsed]:block">
                  <Feather className="text-primary" size={28}/>
              </Link>
            </div>
          </SidebarHeader>
          <ScrollArea className="flex-grow">
            <SidebarContent className="p-2 flex flex-col h-full">
              <SidebarMenu className="flex-grow">
                {renderNavItems(mainNavItems, true)}
                {/* Auth items are removed for desktop sidebar, handled in top header */}
                {renderNavItems(desktopUtilityNavItems, true)} {/* Render only Help for desktop */}
              </SidebarMenu>
            </SidebarContent>
          </ScrollArea>
          <SidebarFooter className="p-2 border-t flex flex-col gap-2">
            <ThemeToggleButton />
            <LanguageSelector />
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="flex-1 overflow-y-auto relative">
           <div className="p-4 pt-6 md:p-6 lg:p-8 max-w-7xl mx-auto w-full"> {/* Adjusted pt-6 as SidebarInset already starts below header due to parent's pt-16 */}
              {children}
          </div>
        </SidebarInset>
      </div>
    </div>
  );
}
