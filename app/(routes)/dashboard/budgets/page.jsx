import React from "react";
import BudgetList from "./_components/budgetList";
function budgets() {
  return (
    <div className="space-y-4">
      <div className="glass-panel p-5 sm:p-6">
        <h1 className="text-2xl font-bold sm:text-3xl">My Budgets</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Create, organize, and monitor your budget categories in one place.
        </p>
      </div>
      <BudgetList />
    </div>
  );
}

export default budgets;
