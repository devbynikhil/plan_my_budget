import Link from "next/link";
import React from "react";

function BudgetItem({ budget, showCategory = false }) {
  // Calculate spending progress
  const calculateProgress = () => {
    const perc = (budget.totalSpend / budget.amount) * 100;
    return Math.min(100, Math.max(0, perc.toFixed(2)));
  };

  return (
    <Link href={"/dashboard/transactions/" + budget?.id}>
      <div className="glass-panel h-full min-h-[170px] p-4 transition-shadow hover:shadow-md sm:p-5">
        <div className="flex gap-2 items-center justify-between">
          <div className="flex gap-2 items-center">
            <h2 className="rounded-full bg-secondary p-3 text-2xl">
              {budget?.icon}
            </h2>
            <div>
              <h5 className="font-bold">{budget?.name}</h5>

              {/* Show category if enabled */}
              {showCategory && budget?.category && (
                <h5 className="text-xs text-chart-2">
                  Category: {budget?.category}
                </h5>
              )}

              <h5 className="text-xs text-muted-foreground">
                {budget?.totalItem} Items
              </h5>
              <h5 className="text-xs text-chart-3">
                Recurring: ₹{budget?.recurringTotal || 0}
              </h5>
            </div>
          </div>
          <h5 className="text-xs font-bold text-primary">₹{budget?.amount}</h5>
        </div>

        <div className="mt-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xs text-muted-foreground">
              ₹{budget?.totalSpend ? budget?.totalSpend : 0} Spent
            </h2>
            <h2
              className={`text-xs ${budget?.amount - budget?.totalSpend >= 0 ? "text-muted-foreground" : "text-red-600"}`}
            >
              {budget?.amount - budget?.totalSpend >= 0
                ? `₹${budget?.amount - budget?.totalSpend} Remaining`
                : `Exceeded budget by ₹${Math.abs(budget?.amount - budget?.totalSpend)}`}
            </h2>
          </div>
          <div className="h-2 w-full rounded-full bg-secondary">
            <div
              className="bg-primary h-2 rounded-full"
              style={{ width: `${calculateProgress()}%` }}
            ></div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default BudgetItem;
