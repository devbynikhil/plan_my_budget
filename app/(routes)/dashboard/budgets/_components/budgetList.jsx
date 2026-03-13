"use client";   
import React, { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs';
import CreateBudget from './createBudget';
import BudgetItem from './budgetItem';

function budgetList() {
  const [budgetList, setBudgetList] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => { 
    if (user) getBudgets();
  }, [user]);

  /**
   * Get all budgets with total spend and total items
   */
  const getBudgets = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/budgets?email=${user?.primaryEmailAddress?.emailAddress}`);
      const data = await response.json();
      
      if (response.ok) {
        setBudgetList(data.budgets || []);
      } else {
        console.error('Error fetching budgets:', data.error);
      }
    } catch (error) {
      console.error('Error fetching budgets:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='mt-7'>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
        <CreateBudget refreshData={() => getBudgets()} />
        {loading ? [1,2,3,4,5].map((item,index) => (
          <div key={index} className='w-full bg-slate-200 rounded-lg h-[150px] animate-pulse'></div>
        )) : budgetList?.length > 0 ? budgetList.map((budget, index) => (
          <BudgetItem key={index} budget={budget} />
        )) : (
          <div className='text-gray-500'>No budgets found</div>
        )}
      </div>
    </div>
  )
}

export default budgetList;
