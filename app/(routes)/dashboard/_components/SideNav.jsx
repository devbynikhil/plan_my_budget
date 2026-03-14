"use client";
import React from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import { LayoutGrid, PiggyBank, ReceiptText, Bell, Bot } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import ThemeToggle from "@/app/_components/ThemeToggle";

function SideNav() {
  const { user } = useUser();

  const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(",") || [
    "mailalantest@gmail.com",
  ];
  const isAdmin =
    user?.primaryEmailAddress?.emailAddress &&
    adminEmails.includes(user.primaryEmailAddress.emailAddress);

  const baseMenuList = [
    {
      key: 1,
      name: "Dashboard",
      icon: LayoutGrid,
      path: "/dashboard",
    },
    {
      key: 2,
      name: "Budgets",
      icon: PiggyBank,
      path: "/dashboard/budgets",
    },
    {
      key: 3,
      name: "Transactions",
      icon: ReceiptText,
      path: "/dashboard/transactions",
    },
    {
      key: 4,
      name: "AI Advisor",
      icon: Bot,
      path: "/dashboard/ai-advisor",
    },
  ];

  const menuList = isAdmin
    ? [
        ...baseMenuList.slice(0, 4),
        {
          key: 5,
          name: "Reminders",
          icon: Bell,
          path: "/dashboard/reminders",
        },
      ]
    : baseMenuList;

  const path = usePathname();

  return (
    <aside className="flex h-screen flex-col border-r border-border/70 bg-card/75 p-4 backdrop-blur">
      <div className="mb-6 flex items-center justify-between">
        <Link href="/" className="inline-flex items-center gap-2">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground">
            PM
          </span>
          <h1 className="text-sm font-semibold">Plan My Budget</h1>
        </Link>
        <ThemeToggle />
      </div>

      <nav className="space-y-1">
        {menuList.map((menu) => (
          <Link key={menu.key} href={menu.path}>
            <div
              className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                path === menu.path
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <menu.icon size={18} />
              {menu.name}
            </div>
          </Link>
        ))}
      </nav>

      <div className="mt-auto rounded-xl border border-border/60 bg-background/70 p-3">
        {user ? (
          <div className="flex items-center gap-2">
            <UserButton />
            <div className="min-w-0">
              <p className="truncate text-xs font-medium">
                {user.fullName || "Your profile"}
              </p>
              <p className="truncate text-[11px] text-muted-foreground">
                {user.primaryEmailAddress?.emailAddress}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">
            Sign in to manage your profile.
          </p>
        )}
      </div>
    </aside>
  );
}

export default SideNav;
