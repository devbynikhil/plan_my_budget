"use client";
import React, { useEffect, useState } from "react";
import TransactionList from "./_components/TransactionList";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

function Page() {
  const [listofTransactions, setTransactionList] = useState([]);
  const [budgetList, setBudgetList] = useState([]);
  const { user } = useUser();
  const [page, setPage] = useState(1);
  const limit = 10; // transactions per page
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      getBudgets();
      getAllExpenses();
    }
  }, [user, page]);

  /** Get paginated transactions for the current user */
  const getAllExpenses = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const response = await fetch(
        `/api/transactions?email=${user?.primaryEmailAddress?.emailAddress}&page=${page}&limit=${limit}`,
      );
      const data = await response.json();

      if (response.ok) {
        setTransactionList(data.transactions || []);
        setTotalTransactions(data.totalTransactions || 0);
      } else {
        console.error("Error fetching transactions:", data.error);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  /** Get all budgets with total spend and total items */
  const getBudgets = async () => {
    if (!user) return;

    try {
      const response = await fetch(
        `/api/budgets?email=${user?.primaryEmailAddress?.emailAddress}`,
      );
      const data = await response.json();

      if (response.ok) {
        setBudgetList(data.budgets || []);
      } else {
        console.error("Error fetching budgets:", data.error);
      }
    } catch (error) {
      console.error("Error fetching budgets:", error);
    }
  };

  const totalPages = Math.ceil(totalTransactions / limit);

  if (loading) {
    return (
      <div className="p-5 text-sm text-muted-foreground">
        Loading transactions...
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <section className="glass-panel p-5 sm:p-6">
        <h2 className="text-2xl font-bold sm:text-3xl">Transactions</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Review spending history and keep records organized by category.
        </p>
      </section>

      <section className="glass-panel p-4 sm:p-5">
        <h3 className="mb-3 text-lg font-semibold">Latest Transactions</h3>
        <TransactionList
          transactionList={listofTransactions}
          refreshData={() => {
            getBudgets();
            getAllExpenses();
          }}
        />

        <div className="mt-4 flex items-center justify-between">
          <Button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            variant="outline"
          >
            Prev
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {Math.max(totalPages, 1)}
          </span>
          <Button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page >= totalPages || totalPages === 0}
            variant="outline"
          >
            Next
          </Button>
        </div>
      </section>
    </div>
  );
}

export default Page;
