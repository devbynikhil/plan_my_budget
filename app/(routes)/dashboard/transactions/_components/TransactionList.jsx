import { toast } from "@/components/ui/use-toast";
import { Trash } from "lucide-react";
import React from "react";
import moment from "moment";

function TransactionList({ transactionList, refreshData }) {
  const deleteTransaction = async (transaction) => {
    try {
      const response = await fetch(`/api/transactions/${transaction.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Delete Transaction",
          description: "Success!",
        });
        refreshData();
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to delete transaction",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting transaction:", error);
      toast({
        title: "Error",
        description: "Failed to delete transaction",
        variant: "destructive",
      });
    }
  };

  // Group transactions by category and recurring
  const groupedTransactions = transactionList.reduce((acc, t) => {
    const key = `${t.category || "Uncategorized"}|${t.recurring || "none"}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(t);
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      {Object.entries(groupedTransactions).map(([key, transactions], idx) => {
        const [category, recurring] = key.split("|");
        const totalAmount = transactions.reduce(
          (sum, t) => sum + Number(t.amount),
          0,
        );
        return (
          <div
            key={idx}
            className="rounded-xl border border-border/70 bg-background/70 p-3 sm:p-4"
          >
            <div className="mb-2 flex items-center justify-between gap-2">
              <h2 className="text-sm font-semibold sm:text-base">
                {category} ({recurring})
              </h2>
              <h2 className="text-sm font-bold text-primary sm:text-base">
                ₹{totalAmount}
              </h2>
            </div>
            {transactions.map((t, i) => (
              <div
                key={i}
                className="grid grid-cols-2 items-center gap-2 border-b border-border/50 py-2 text-sm last:border-b-0 sm:grid-cols-4"
              >
                <h2 className="font-medium">{t.name}</h2>
                <h2>₹{t.amount}</h2>
                <h2 className="text-muted-foreground">
                  {moment(t.createdAt).format("DD/MM/YYYY")}
                </h2>
                <h2 className="flex justify-end sm:justify-start">
                  <Trash
                    className="text-red-600 cursor-pointer"
                    onClick={() => deleteTransaction(t)}
                  />
                </h2>
              </div>
            ))}
          </div>
        );
      })}
      {!transactionList.length && (
        <p className="text-sm text-muted-foreground">
          No transactions found for this page.
        </p>
      )}
    </div>
  );
}

export default TransactionList;
