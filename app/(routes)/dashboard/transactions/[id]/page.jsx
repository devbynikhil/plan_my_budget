"use client";
import { useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import BudgetItem from "../../budgets/_components/budgetItem";
import AddExpense from "../_components/AddExpense";
import TransactionList from "../_components/TransactionList";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trash } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import EditBudget from "../_components/EditBudget";

function Expenses({ params }) {
  const { user } = useUser();
  const [budgetInfo, setBudgetInfo] = useState(null);
  const [transactionList, setTransactionList] = useState([]);
  const [loading, setLoading] = useState(true);
  const route = useRouter();

  useEffect(() => {
    if (user) getBudgetInfo();
  }, [user]);

  /** Delete budget along with its transactions */
  const deleteBudget = async () => {
    if (!params.id) return;

    try {
      const response = await fetch(`/api/budgets/${params.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Budget Deletion",
          description: "Success!",
        });
        route.replace("/dashboard/budgets");
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to delete budget",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting budget:", error);
      toast({
        title: "Error",
        description: "Failed to delete budget",
        variant: "destructive",
      });
    }
  };

  /** Fetch budget info with transactions */
  const getBudgetInfo = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const response = await fetch(
        `/api/budgets/${params.id}?email=${user?.primaryEmailAddress?.emailAddress}`,
      );
      const data = await response.json();

      if (response.ok) {
        setBudgetInfo(data.budget || null);
        setTransactionList(data.transactions || []);
      } else {
        console.error("Error fetching budget info:", data.error);
      }
    } catch (error) {
      console.error("Error fetching budget info:", error);
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    route.replace("/dashboard/budgets");
  };

  if (loading) {
    return (
      <div className="p-5 text-sm text-muted-foreground">
        Loading budget details...
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <section className="glass-panel p-5 sm:p-6">
        <div className="flex items-center gap-2">
          <ArrowLeft onClick={goBack} className="cursor-pointer" />
          <h2 className="text-2xl font-bold">Budget Transactions</h2>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage transactions and adjust budget details from one view.
        </p>
      </section>

      <section className="flex flex-wrap gap-2">
        <EditBudget budgetInfo={budgetInfo} refreshData={getBudgetInfo} />
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="flex gap-2">
              <Trash />
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete this
                budget and remove its transaction data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={deleteBudget}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </section>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        {budgetInfo ? (
          <BudgetItem budget={budgetInfo} showCategory={true} />
        ) : (
          <div className="h-[150px] w-full rounded-lg bg-slate-200/70 animate-pulse dark:bg-slate-700/70">
            Loading...
          </div>
        )}
        <AddExpense
          budgetId={params.id}
          user={user}
          refreshData={getBudgetInfo}
        />
      </div>

      <section className="glass-panel p-4 sm:p-5">
        <h2 className="mb-3 text-lg font-semibold">Latest Transactions</h2>
        <TransactionList
          transactionList={transactionList}
          refreshData={getBudgetInfo}
        />
      </section>
    </div>
  );
}

export default Expenses;
