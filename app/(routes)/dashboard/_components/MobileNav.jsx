"use client";
import React, { useState, useEffect } from "react";
import {
  Menu,
  X,
  LayoutGrid,
  PiggyBank,
  ReceiptText,
  ShieldCheck,
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

  let user = null;
  try {
    const userHook = useUser();
    user = userHook.user;
  } catch (error) {
    console.warn("Clerk not available in MobileNav:", error.message);
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
        ...baseMenuList.slice(0, 4),
        {
          key: 5,
          name: "Reminders",
          icon: Bell,
          path: "/dashboard/reminders",
        },
        ...baseMenuList.slice(4),
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
        className="md:hidden p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
        aria-label="Toggle navigation menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={closeMenu}
          ></div>

          {/* Menu Panel */}
          <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50">
            <div className="p-5">
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center text-primary font-bold">
                  <Image src="/logo.svg" alt="logo" width={40} height={40} />
                  <h1 className="ml-2">Plan_My_Budget</h1>
                </div>
                <button
                  onClick={closeMenu}
                  className="p-1 rounded-md hover:bg-gray-100"
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="space-y-2">
                {menuList.map((menu) => (
                  <Link key={menu.key} href={menu.path} onClick={closeMenu}>
                    <div
                      className={`flex gap-3 items-center text-gray-500 font-medium p-3 cursor-pointer rounded-md 
                                            hover:text-primary hover:bg-rose-100 transition-colors duration-200
                                            ${path === menu.path && "text-primary bg-rose-100"}`}
                    >
                      <menu.icon size={20} />
                      {menu.name}
                    </div>
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default MobileNav;
