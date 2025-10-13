
// src/components/layout/app-shell.tsx
"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FeatherLogo } from "@/components/icons/feather-logo";
import {
  Sidebar,
  SidebarContent,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarHeader as UISidebarHeader,
} from "@/components/ui/sidebar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Feather,
  Lightbulb,
  LayoutDashboard,
  CheckCircle,
  Users,
  Menu,
  Hammer,
  Settings as SettingsIcon,
  HelpCircle,
  LogIn,
  UserPlus,
  LogOut,
  User as UserIcon,
  TestTube,
} from "lucide-react";
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LanguageSelector } from '@/components/language-selector';
import { ThemeToggleButton } from '@/components/theme-toggle-button';
import { ChatbotDialog } from '@/components/chatbot/chatbot-dialog';
import { Button } from "@/components/ui/button";
import { useSidebar as useSidebarContextHook } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/auth-context";


const mainNavItems = [
  { href: "/", label: "Generate Proposal", icon: Lightbulb, tooltip: "Generate Research Proposals", auth: true },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, tooltip: "Your Proposal Dashboard", auth: false },
  { href: "/validation", label: "Analyze Proposal", icon: CheckCircle, tooltip: "Analyze a Proposal", auth: true },
  { href: "/build-studio", label: "Experiment Plan", icon: Hammer, tooltip: "Develop Experiment Plans", auth: true },
  { href: "/community", label: "Community Forum", icon: Users, tooltip: "Connect with Researchers", auth: true },
];

const authNavItems = [
  { href: "/login", label: "Login", icon: LogIn, tooltip: "Login to Your Account" },
  { href: "/register", label: "Register", icon: UserPlus, tooltip: "Create an Account" },
];

const utilityNavItems = [
  { href: "/settings", label: "Settings", icon: SettingsIcon, tooltip: "Application Settings", auth: true },
  { href: "/help", label: "Help Guide", icon: HelpCircle, tooltip: "Application Help", auth: false },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileSheetOpen, setIsMobileSheetOpen] = React.useState(false);
  const { isMobile } = useSidebarContextHook();
  const { user, logout } = useAuth();
  const router = useRouter();


  const handleLogout = () => {
    logout();
    setIsMobileSheetOpen(false);
    router.push('/login');
  };

  const allNavItems = [
    ...mainNavItems,
    ...utilityNavItems,
  ];

  const renderNavItemsForSheet = () => {
    return (
      <>
        {allNavItems.map((item) => (
          <SidebarMenuItem key={item.href} className="p-0">
            <Link href={item.href} passHref legacyBehavior>
              <SidebarMenuButton
                isActive={pathname === item.href}
                className="w-full justify-start text-sm"
                variant="ghost"
                size="default"
                onClick={() => setIsMobileSheetOpen(false)}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        ))}
        <div className="mt-auto pt-4">
          {user ? (
            <SidebarMenuItem className="p-0">
              <SidebarMenuButton
                className="w-full justify-start text-sm"
                variant="ghost"
                size="default"
                onClick={handleLogout}
              >
                <LogOut size={20} />
                <span>Logout</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ) : (
            authNavItems.map(item => (
              <SidebarMenuItem key={item.href} className="p-0">
                <Link href={item.href} passHref legacyBehavior>
                  <SidebarMenuButton
                    isActive={pathname === item.href}
                    className="w-full justify-start text-sm"
                    variant="ghost"
                    size="default"
                    onClick={() => setIsMobileSheetOpen(false)}
                  >
                    <item.icon size={20} />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))
          )}
        </div>
      </>
    );
  };
  
  const renderNavItemsForDesktopSidebar = () => {
    return allNavItems.map((item) => (
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
          {user ? (
            <>
              <Button variant="ghost" size="sm">
                <UserIcon className="mr-1.5 h-4 w-4" /> {user.full_name || user.email}
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="mr-1.5 h-4 w-4" /> Logout
              </Button>
            </>
          ) : (
            authNavItems.map(item => (
              <Button key={item.href} variant="ghost" asChild size="sm">
                <Link href={item.href}>
                  <item.icon className="mr-1.5 h-4 w-4" /> {item.label}
                </Link>
              </Button>
            ))
          )}
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
          <SidebarMenu className="flex-grow flex flex-col">
            {renderNavItemsForSheet()}
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
      <UISidebarHeader className="p-4 border-b">
        <Link href="/" className="block group-data-[state=expanded]:hidden group-data-[mobile=true]:block">
            <FeatherLogo size={28} />
        </Link>
        <Link href="/" className="hidden group-data-[state=collapsed]:block group-data-[mobile=true]:hidden">
            <TestTube className="text-primary" size={28}/>
        </Link>
      </UISidebarHeader>
      <ScrollArea className="flex-grow">
        <SidebarContent className="p-2 flex flex-col h-full">
          <SidebarMenu className="flex-grow">
            {renderNavItemsForDesktopSidebar()}
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
        <TopHeader />
        <SheetContent 
            side="left" 
            className="p-0 w-[var(--sidebar-width-mobile)] flex flex-col !bg-card lg:hidden"
            style={{ "--sidebar-width-mobile": "18rem" } as React.CSSProperties}
        >
            {mobileSheetContent}
        </SheetContent>
      </Sheet>

      <div className="flex min-h-screen pt-16 bg-background">
        <Sidebar
          variant="sidebar"
          collapsible="icon"
          className="hidden lg:flex flex-col !bg-card shadow-sm"
        >
          {desktopSidebarContent}
        </Sidebar>

        <main className="flex-1 flex flex-col">
          <div className="flex-1 flex items-start justify-center">
            <div className="px-4 pt-6 md:pt-6 lg:pt-8 pb-6 w-full max-w-7xl">
              {children}
            </div>
          </div>
        </main>
      </div>
      <ChatbotDialog />
    </div>
  );
}
