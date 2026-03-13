"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { UserButton, useUser } from "@clerk/nextjs";
import {
  LayoutGrid,
  PiggyBank,
  ReceiptText,
  ShieldCheck,
  Bell,
  Bot,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

function SideNav() {
  let user = null;

  try {
    const userHook = useUser();
    user = userHook.user;
  } catch (error) {
    // Clerk not available (build time or missing keys)
    console.warn("Clerk not available in SideNav:", error.message);
  }

  // Check if user is admin
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
    {
      key: 6,
      name: "Buy me a Coffee",
      icon: ShieldCheck,
      path: "/dashboard/upgrade",
    },
  ];

  // Add Reminders menu item only for admins
  const menuList = isAdmin
    ? [
        ...baseMenuList.slice(0, 4), // Dashboard, Budgets, Transactions, AI Advisor
        {
          key: 5,
          name: "Reminders",
          icon: Bell,
          path: "/dashboard/reminders",
        },
        ...baseMenuList.slice(4), // Buy me a Coffee
      ]
    : baseMenuList;

  const path = usePathname();

  useEffect(() => {
    // console.log(path); // Removed for cleaner test output
  }, [path]);

  return (
    <div className="h-screen p-5 border shadow-md">
      <div className="flex items-center text-primary font-bold">
        <Image src="/logo.svg" alt="logo" width={100} height={100} />
        <h1>Plan_My_Budget</h1>
      </div>
      <div className="mt-5">
        {menuList.map((menu) => (
          <Link key={menu.key} href={menu.path}>
            <h2
              key={menu.key}
              className={`flex gap-2 items-center text-gray-500 font-medium mb-2 p-5 cursor-pointer rounded-md 
                        hover:text-primary hover:bg-rose-100 ${path == menu.path && "text-primary bg-rose-100"}`}
            >
              <menu.icon />
              {menu.name}
            </h2>
          </Link>
        ))}
      </div>
      <div className="fixed bottom-10 p-5 flex gap-2 items-center">
        {user ? (
          <>
            <UserButton />
            Profile
          </>
        ) : (
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-sm">U</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default SideNav;
