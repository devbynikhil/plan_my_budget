import { PiggyBank, ReceiptText, Wallet } from "lucide-react";
import React, { useEffect, useState } from "react";

function CardInfo({ budgetList }) {
  const [totalBudget, setTotalBudget] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);

  const calculateCardInfo = () => {
    let totalBudget_ = 0;
    let totalSpent_ = 0;
    budgetList.forEach((element) => {
      totalBudget_ = totalBudget_ + Number(element.amount);
      totalSpent_ = totalSpent_ + element.totalSpend;
    });
    setTotalBudget(totalBudget_);
    setTotalSpent(totalSpent_);
  };

  useEffect(() => {
    budgetList && calculateCardInfo();
  }, [budgetList]);
  return (
    <div>
      {budgetList?.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <div className="glass-panel p-5 sm:p-6 flex items-center justify-between">
            <div>
              <h2 className="text-xs uppercase tracking-wide text-muted-foreground">
                Total Budgets:
              </h2>
              <h2 className="mt-1 font-bold text-2xl">₹{totalBudget}/-</h2>
            </div>
            <PiggyBank className="h-11 w-11 rounded-full bg-primary p-2.5 text-primary-foreground" />
          </div>
          <div className="glass-panel p-5 sm:p-6 flex items-center justify-between">
            <div>
              <h2 className="text-xs uppercase tracking-wide text-muted-foreground">
                Total Spent:
              </h2>
              <h2 className="mt-1 font-bold text-2xl">₹{totalSpent}/-</h2>
            </div>
            <ReceiptText className="h-11 w-11 rounded-full bg-primary p-2.5 text-primary-foreground" />
          </div>
          <div className="glass-panel p-5 sm:p-6 flex items-center justify-between">
            <div>
              <h2 className="text-xs uppercase tracking-wide text-muted-foreground">
                No of Budgets:
              </h2>
              <h2 className="mt-1 font-bold text-2xl">{budgetList.length}</h2>
            </div>
            <Wallet className="h-11 w-11 rounded-full bg-primary p-2.5 text-primary-foreground" />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((item, index) => (
            <div
              key={index}
              className="h-[120px] w-full rounded-lg bg-slate-200/70 animate-pulse dark:bg-slate-700/70"
            ></div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CardInfo;
