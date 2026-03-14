"use client";
import React, { useState } from "react";
import CardInfo from "./_components/CardInfo";
import BarchartDash from "./_components/barchartDash";
import CategoryPieChart from "./_components/CategoryPieChart";

import BudgetItem from "./budgets/_components/budgetItem";
import TransactionList from "./transactions/_components/TransactionList";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

function Page() {
  const { user } = useUser();
  const router = useRouter();
  const [page, setPage] = useState(1);
  const limit = 10; // Number of transactions per page

  // Fetch dashboard data from API with pagination
  const fetchDashboard = async (email, page, limit) => {
    const res = await fetch(
      `/api/dashboard?email=${email}&page=${page}&limit=${limit}`,
    );
    if (!res.ok) throw new Error("Failed to fetch dashboard");
    return res.json();
  };

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["dashboard", user?.primaryEmailAddress?.emailAddress, page],
    queryFn: () =>
      fetchDashboard(user?.primaryEmailAddress?.emailAddress, page, limit),
    enabled: !!user,
    keepPreviousData: true,
  });

  const budgets = data?.budgets || [];
  const transactions = data?.transactions || [];
  const categoryAggregation = data?.categoryAggregation || {}; // updated
  const totalTransactions = data?.totalTransactions || 0;

  const goToBudgets = () => router.replace("/dashboard/budgets");
  const totalPages = Math.ceil(totalTransactions / limit);

  if (isLoading)
    return (
      <p className="p-5 text-sm text-muted-foreground">Loading dashboard...</p>
    );
  if (isError)
    return <p className="p-5 text-sm text-red-500">Error: {error.message}</p>;

  return (
    <div className="space-y-6">
      <section className="glass-panel p-5 sm:p-6">
        <h2 className="text-2xl font-bold sm:text-3xl">
          Hi, {user?.firstName || user?.fullName || "there"} 👋
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Here is your financial snapshot with budgets, trends, and recent
          activity.
        </p>
      </section>

      <CardInfo budgetList={budgets} />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="xl:col-span-2 flex flex-col gap-5">
          <BarchartDash budgetList={budgets} />
          <CategoryPieChart categoryAggregation={categoryAggregation || {}} />

          <section className="glass-panel p-4 sm:p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Latest Transactions</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/dashboard/transactions")}
              >
                View all
              </Button>
            </div>
            <TransactionList
              transactionList={transactions}
              refreshData={refetch}
            />

            <div className="mt-4 flex items-center justify-between text-sm">
              <Button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                variant="outline"
              >
                Prev
              </Button>
              <span className="text-muted-foreground">
                Page {page} of {Math.max(totalPages, 1)}
              </span>
              <Button
                onClick={() =>
                  setPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={page >= totalPages || totalPages === 0}
                variant="outline"
              >
                Next
              </Button>
            </div>
          </section>
        </div>

        <aside className="grid gap-4 content-start">
          <div className="glass-panel p-4 sm:p-5">
            <h2 className="text-lg font-semibold">Latest Budgets</h2>
            <p className="mb-4 text-sm text-muted-foreground">
              Monitor balances and jump into budget details.
            </p>
            <div className="grid gap-4">
              {budgets.map((budget, index) => (
                <BudgetItem budget={budget} key={index} />
              ))}
              {!budgets.length && (
                <p className="text-sm text-muted-foreground">
                  Create a budget to get started.
                </p>
              )}
            </div>
          </div>

          <Button onClick={goToBudgets} className="w-full">
            Create New Budget
          </Button>
        </aside>
      </div>
    </div>
  );
}

export default Page;
