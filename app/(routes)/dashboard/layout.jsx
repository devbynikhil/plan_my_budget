"use client";
import React, { useEffect } from "react";
import SideNav from "./_components/SideNav";
import DashboardHeader from "./_components/DashboardHeader";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

function Dashlayout({ children }) {
  const { user, isLoaded } = useUser();

  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !user) {
      router.replace("/sign-in");
      return;
    }

    if (user?.primaryEmailAddress?.emailAddress) {
      checkUserBudgets();
    }
  }, [user, isLoaded, router]);

  const checkUserBudgets = async () => {
    try {
      const response = await fetch(
        `/api/user/budgets/check?email=${user?.primaryEmailAddress?.emailAddress}`,
      );
      const data = await response.json();

      if (!data.hasBudgets) {
        router.replace("/dashboard/budgets");
      }
    } catch (error) {
      console.error("Error checking user budgets:", error);
    }
  };

  // Show loading state while authentication is being checked
  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Redirecting to sign in...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen md:grid md:grid-cols-[256px_1fr]">
      <div className="fixed left-0 top-0 z-30 hidden h-screen w-64 md:block">
        <SideNav />
      </div>

      <div className="md:col-start-2 md:ml-0">
        <DashboardHeader />
        <main className="min-h-[calc(100vh-64px)]">
          <div className="app-shell py-5 sm:py-6">{children}</div>
        </main>
      </div>
    </div>
  );
}

export default Dashlayout;
