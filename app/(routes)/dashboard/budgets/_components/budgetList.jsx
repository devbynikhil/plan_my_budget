"use client";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import CreateBudget from "./createBudget";
import BudgetItem from "./budgetItem";

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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <CreateBudget refreshData={() => getBudgets()} />
        {loading ? (
          [1, 2, 3, 4, 5].map((item, index) => (
            <div
              key={index}
              className="h-[160px] w-full rounded-2xl bg-slate-200/70 animate-pulse dark:bg-slate-700/70"
            ></div>
          ))
        ) : budgetList?.length > 0 ? (
          budgetList.map((budget, index) => (
            <BudgetItem key={index} budget={budget} />
          ))
        ) : (
          <div className="glass-panel p-5 text-sm text-muted-foreground">
            No budgets found. Create your first budget to begin.
          </div>
        )}
      </div>
    </div>
  );
}

export default budgetList;
