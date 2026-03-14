"use client";
import React, { useState, useEffect } from "react";
import {
  Menu,
  X,
  LayoutGrid,
  PiggyBank,
  ReceiptText,
  Bell,
  Bot,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";

function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const path = usePathname();

  const { user } = useUser();

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
  ];

  // Add Reminders menu item only for admins
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

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    // Prevent body scroll when menu is open
    if (!isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  };

  const closeMenu = () => {
    setIsOpen(false);
    document.body.style.overflow = "unset";
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <>
      {/* Hamburger Menu Button */}
      <button
        onClick={toggleMenu}
        className="md:hidden rounded-xl border border-border/60 bg-background/80 p-2"
        aria-label="Toggle navigation menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={closeMenu}></div>

          <div className="fixed left-0 top-0 z-50 h-full w-[85%] max-w-xs bg-card p-5 shadow-2xl">
            <div className="flex h-full flex-col">
              <div className="mb-5 flex items-center justify-between">
                <div className="inline-flex items-center gap-2 text-sm font-semibold">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-xs text-primary-foreground">
                    PM
                  </span>
                  Plan My Budget
                </div>
                <button
                  onClick={closeMenu}
                  className="rounded-md p-1 hover:bg-secondary"
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>

              <nav className="space-y-1">
                {menuList.map((menu) => (
                  <Link key={menu.key} href={menu.path} onClick={closeMenu}>
                    <div
                      className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium ${
                        path === menu.path
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      }`}
                    >
                      <menu.icon size={20} />
                      {menu.name}
                    </div>
                  </Link>
                ))}
              </nav>

              <div className="mt-auto rounded-xl border border-border/60 bg-background/60 p-3 text-xs text-muted-foreground">
                {user ? user.primaryEmailAddress?.emailAddress : "Guest mode"}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default MobileNav;
