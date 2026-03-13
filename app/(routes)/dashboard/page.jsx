"use client";
import React, { useState } from 'react';
import CardInfo from './_components/CardInfo';
import BarchartDash from './_components/barchartDash';
import CategoryPieChart from './_components/CategoryPieChart';

import BudgetItem from './budgets/_components/budgetItem';
import TransactionList from './transactions/_components/TransactionList';
import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

function Page() {
  const { user } = useUser();
  const router = useRouter();
  const [page, setPage] = useState(1);
  const limit = 10; // Number of transactions per page

  // Fetch dashboard data from API with pagination
  const fetchDashboard = async (email, page, limit) => {
    const res = await fetch(`/api/dashboard?email=${email}&page=${page}&limit=${limit}`);
    if (!res.ok) throw new Error("Failed to fetch dashboard");
    return res.json();
  };

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['dashboard', user?.primaryEmailAddress?.emailAddress, page],
    queryFn: () => fetchDashboard(user?.primaryEmailAddress?.emailAddress, page, limit),
    enabled: !!user,
    keepPreviousData: true,
  });

  const budgets = data?.budgets || [];
  const transactions = data?.transactions || [];
  const categoryAggregation = data?.categoryAggregation || {}; // updated
  const totalTransactions = data?.totalTransactions || 0;

  const goToBudgets = () => router.replace('/dashboard/budgets');
  const totalPages = Math.ceil(totalTransactions / limit);

  if (isLoading) return <p className="p-5">Loading dashboard...</p>;
  if (isError) return <p className="p-5 text-red-500">Error: {error.message}</p>;

  return (
    <div className="p-5">
      <h2 className="font-bold text-3xl">Hi, {user?.fullName} 👋</h2>
      <p className="text-gray-500 mb-5">Here is your dashboard, visualize your budgets and transactions here.</p>

      {/* Summary Cards */}
      <CardInfo budgetList={budgets} />

      <div className="grid grid-cols-1 md:grid-cols-3 mt-6 gap-5">
        {/* Left Side */}
        <div className="col-span-2 flex flex-col gap-5">
          {/* Charts */}
          <BarchartDash budgetList={budgets} />
         <CategoryPieChart categoryAggregation={categoryAggregation || {}} />
          
          {/* Transactions */}
          <h2 className="font-bold text-lg mt-5">Latest Transactions</h2>
          <TransactionList transactionList={transactions} refreshData={refetch} />

          {/* Pagination */}
          <div className="flex justify-between mt-3 items-center">
            <Button onClick={() => setPage(prev => Math.max(prev - 1, 1))} disabled={page === 1}>
              Prev
            </Button>
            <span>Page {page} of {totalPages}</span>
            <Button onClick={() => setPage(prev => Math.min(prev + 1, totalPages))} disabled={page >= totalPages}>
              Next
            </Button>
          </div>
        </div>

        {/* Right Side */}
        <div className="grid gap-5">
          <h2 className="font-bold text-lg">Latest Budgets</h2>
          {budgets.map((budget, index) => (
            <BudgetItem budget={budget} key={index} />
          ))}
        </div>
      </div>

      {/* Mobile "Create New Budget" button */}
      <div className="mt-6 md:hidden flex justify-center">
        <Button 
          onClick={goToBudgets} 
          className="bg-primary text-white py-2 px-4 rounded shadow-md"
        >
          Create New Budget
        </Button>
      </div>
    </div>
  );
}

export default Page;
