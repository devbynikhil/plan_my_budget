"use client";
import React, { useEffect } from 'react'
import SideNav from './_components/SideNav'
import DashboardHeader from './_components/DashboardHeader'
import { useUser } from '@clerk/nextjs';
import {useRouter} from 'next/navigation';

function Dashlayout({children}) {
  let user = null;
  let isLoaded = false;
  
  try {
    const userHook = useUser();
    user = userHook.user;
    isLoaded = userHook.isLoaded;
  } catch (error) {
    // Clerk not available (build time or missing keys)
    console.warn('Clerk not available:', error.message);
    isLoaded = true; // Assume loaded to prevent infinite loading
  }
  
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to sign-in if no user and Clerk is available
    if (isLoaded && !user && typeof window !== 'undefined') {
      router.push('/sign-in');
      return;
    }
    
    user && checkUserBudgets();
  }, [user, isLoaded, router])

  const checkUserBudgets = async () =>{ 
    try {
      const response = await fetch(`/api/user/budgets/check?email=${user?.primaryEmailAddress?.emailAddress}`);
      const data = await response.json();
      
      if (!data.hasBudgets) {
        router.replace('/dashboard/budgets');
      }
    } catch (error) {
      console.error('Error checking user budgets:', error);
    }
  }

  // Show loading state while authentication is being checked
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // If no user after loading, the useEffect will redirect to sign-in
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">Redirecting to sign in...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <div className='fixed md:w-64 hidden md:block z-30'>
        <SideNav/>
      </div>

      {/* Main Content */}
      <div className='md:ml-64'>
        <DashboardHeader/>
        <main className='min-h-screen bg-gray-50'>
          {children}
        </main>
      </div>
    </>
  )
}

export default Dashlayout