// Example usage within a Next.js page
import { Button } from '@/components/ui/button';
import { UserButton, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import React from 'react';
import MobileNav from './MobileNav';

function DashboardHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const isDashboard = pathname === '/dashboard';
  
  let user = null;
  try {
    const userHook = useUser();
    user = userHook.user;
  } catch (error) {
    // Clerk not available (build time or missing keys)
    console.warn('Clerk not available in DashboardHeader:', error.message);
  }

  console.log(router?.pathname);
  const gotoDash = () => {
    router.push('/dashboard');
  };

  return (
    <div className='p-5 shadow-md border-b flex items-center justify-between'>
      <div className="flex items-center gap-4">
        <MobileNav />
        {!isDashboard && <Button onClick={gotoDash}>Go to Dashboard</Button>}
      </div>
      <div>
        {user ? (
          <UserButton />
        ) : (
          <div className='w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center'>
            <span className='text-sm'>U</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardHeader;
