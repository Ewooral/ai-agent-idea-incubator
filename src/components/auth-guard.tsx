
"use client";

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';
import { useAuth } from '@/contexts/auth-context';
import Loading from '@/app/loading';

// Define routes that are public (accessible without authentication)
const PUBLIC_ROUTES = ['/dashboard', '/login', '/register'];

// Define routes that are accessible only to unauthenticated users
const UNAUTHENTICATED_ONLY_ROUTES = ['/login', '/register'];

export default function AuthGuard({ children }: { children: ReactNode }) {
  const { user, isLoading, token } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) {
      return; // Do nothing while loading auth state
    }

    const isAuthenticated = !!user && !!token;
    const isPublicRoute = PUBLIC_ROUTES.some(route => pathname.startsWith(route));
    const isUnauthenticatedOnlyRoute = UNAUTHENTICATED_ONLY_ROUTES.some(route => pathname.startsWith(route));

    if (isAuthenticated && isUnauthenticatedOnlyRoute) {
      // If user is authenticated and tries to access login/register, redirect to home
      router.push('/');
    } else if (!isAuthenticated && !isPublicRoute) {
      // If user is not authenticated and tries to access a protected route, redirect to login
      router.push('/login');
    }
  }, [user, isLoading, token, pathname, router]);

  if (isLoading) {
    return <Loading />;
  }

  // Allow access if conditions are met
  const isAuthenticated = !!user && !!token;
  const isPublicRoute = PUBLIC_ROUTES.some(route => pathname.startsWith(route));
  
  if (!isAuthenticated && !isPublicRoute) {
      // While redirecting, show a loading state
      return <Loading />;
  }

  return <>{children}</>;
}
