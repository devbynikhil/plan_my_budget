"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

function header() {
  const { isSignedIn } = useUser();

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="app-shell flex h-16 items-center justify-between gap-3">
        <Link href="/" className="inline-flex items-center gap-2">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground">
            PM
          </span>
          <span className="text-sm font-semibold tracking-tight sm:text-base">
            Plan My Budget
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          <Link href="/#features" className="hover:text-foreground">
            Features
          </Link>
          <Link href="/#how-it-works" className="hover:text-foreground">
            How It Works
          </Link>
          <Link href="/#faq" className="hover:text-foreground">
            FAQ
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {isSignedIn ? (
            <div className="inline-flex items-center gap-2">
              <Link href="/dashboard">
                <Button size="sm">Open Dashboard</Button>
              </Link>
              <UserButton />
            </div>
          ) : (
            <div className="inline-flex items-center gap-2">
              <Link href="/sign-in">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button size="sm">Create Account</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default header;
