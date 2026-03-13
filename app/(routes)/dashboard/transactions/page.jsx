"use client";   
import React, { useEffect, useState } from 'react';
import TransactionList from './_components/TransactionList';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';

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
      const response = await fetch(`/api/transactions?email=${user?.primaryEmailAddress?.emailAddress}&page=${page}&limit=${limit}`);
      const data = await response.json();

      if (response.ok) {
        setTransactionList(data.transactions || []);
        setTotalTransactions(data.totalTransactions || 0);
      } else {
        console.error('Error fetching transactions:', data.error);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  /** Get all budgets with total spend and total items */
  const getBudgets = async () => {
    if (!user) return;

    try {
      const response = await fetch(`/api/budgets?email=${user?.primaryEmailAddress?.emailAddress}`);
      const data = await response.json();

      if (response.ok) {
        setBudgetList(data.budgets || []);
      } else {
        console.error('Error fetching budgets:', data.error);
      }
    } catch (error) {
      console.error('Error fetching budgets:', error);
    }
  };

  const totalPages = Math.ceil(totalTransactions / limit);

  if (loading) {
    return <div className="p-5">Loading transactions...</div>;
  }

  return (
    <div className='p-5'>
      <h2 className='font-bold text-lg'>Latest Transactions</h2>
      <TransactionList 
        transactionList={listofTransactions} 
        refreshData={() => { getBudgets(); getAllExpenses(); }}
      />

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
  );
}

export default Page;
