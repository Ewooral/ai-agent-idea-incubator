
// src/app/settings/page.tsx
"use client";

import { useState, useTransition } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Settings, Trash2, AlertTriangle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { clearApplicationDataAction } from '@/app/actions/settingsActions';
import { useRouter } from 'next/navigation';


export default function SettingsPage() {
  const { toast } = useToast();
  const [isClearing, setIsClearing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleClearData = async () => {
    setIsClearing(true);
    try {
      const result = await clearApplicationDataAction();
      if (result.success) {
        toast({
          title: "Data Cleared",
          description: result.message,
        });
        startTransition(() => {
          router.push('/'); 
        });
      } else {
        toast({
          title: "Error Clearing Data",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Operation Failed",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="shadow-xl bg-card">
        <CardHeader>
          <CardTitle className="font-headline text-2xl sm:text-3xl flex items-center">
            <Settings className="mr-3 text-primary" size={32} /> Application Settings
          </CardTitle>
          <CardDescription>
            Manage your application settings and data.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <Card className="border-destructive/50 bg-destructive/5">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl flex items-center text-destructive">
                <AlertTriangle className="mr-2" /> Danger Zone
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-destructive-foreground mb-1">
                This action will permanently delete all saved ideas and project development plans from the application.
              </p>
              <p className="text-sm text-destructive-foreground mb-4">
                This operation is irreversible. Please be absolutely sure before proceeding.
              </p>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" disabled={isClearing || isPending} className="w-full sm:w-auto">
                    {isClearing || isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="mr-2 h-4 w-4" />
                    )}
                    Clear All Application Data
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete all your
                      saved ideas and project development plans.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel disabled={isClearing || isPending}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleClearData}
                      disabled={isClearing || isPending}
                      className={buttonVariants({ variant: "destructive" })}
                    >
                      {isClearing || isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : null}
                      Yes, Clear All Data
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
            <CardFooter>
                <p className="text-xs text-muted-foreground">
                    Proceed with extreme caution.
                </p>
            </CardFooter>
          </Card>

          <div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2 text-foreground">Data Storage Information</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              This application currently stores data in a local JSON file (`src/data/db.json`). 
              While suitable for prototyping, personal use, and demonstration purposes, for production environments 
              or handling larger datasets, migrating to a dedicated database solution (e.g., PostgreSQL, MongoDB, Firebase Firestore) 
              is strongly recommended for scalability, performance, and data integrity.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed mt-2">
              You can manually clear all current application data (saved ideas and project plans) using the
              button in the &quot;Danger Zone&quot; section above. This action is irreversible.
            </p>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}

const buttonVariants = ({ variant }: { variant?: string }) => {
  if (variant === "destructive") {
    return "bg-destructive text-destructive-foreground hover:bg-destructive/90";
  }
  return "";
};
