import { Button } from "@/components/ui/button";
import { UserButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import React from "react";
import MobileNav from "./MobileNav";
import ThemeToggle from "@/app/_components/ThemeToggle";
import { Plus } from "lucide-react";

function DashboardHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const isDashboard = pathname === "/dashboard";

  const { user } = useUser();

  const gotoDash = () => {
    router.push("/dashboard");
  };

  return (
    <header className="sticky top-0 z-20 border-b border-border/70 bg-background/85 backdrop-blur">
      <div className="app-shell flex h-16 items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <MobileNav />
          {!isDashboard && (
            <Button onClick={gotoDash} variant="outline">
              Go to Dashboard
            </Button>
          )}
          <Button
            onClick={() => router.push("/dashboard/budgets")}
            className="hidden gap-2 sm:inline-flex"
          >
            <Plus className="h-4 w-4" />
            New Budget
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {user ? (
            <UserButton />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary">
              <span className="text-xs">U</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default DashboardHeader;
