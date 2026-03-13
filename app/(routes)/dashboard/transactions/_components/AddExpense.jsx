"use client";
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { Loader } from 'lucide-react';

function AddExpense({ budgetId, user, refreshData }) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [recurring, setRecurring] = useState('none');
  const [loading, setLoading] = useState(false);

  const addNewTransaction = async () => {
    if (!name || !amount) return;

    setLoading(true);

    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          amount: Number(amount),
          budgetId,
          category,
          recurring,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setName('');
        setAmount('');
        setCategory('');
        setRecurring('none');

        toast({
          title: "Transaction Added",
          description: "Success!",
        });
        refreshData();
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to add transaction",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Transaction insert error:", err);
      toast({
        title: "Error",
        description: "Failed to add transaction. Check console for details.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className='border p-5 rounded-lg'>
      <h2 className='font-bold text-lg'>Add Transaction</h2>

      <div className='mt-2'>
        <h2 className='text-black bold'>Transaction Name</h2>
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. First Semester" />
      </div>

      <div className='mt-2'>
        <h2 className='text-black bold'>Transaction Amount</h2>
        <Input value={amount} type="number" onChange={(e) => setAmount(e.target.value)} placeholder="e.g. 200000" />
      </div>

      <div className='mt-2'>
        <h2 className='text-black bold'>Category</h2>
        <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. Education, Food, Travel" />
      </div>

      <div className='mt-2'>
        <h2 className='text-black bold'>Recurring</h2>
        <select
          value={recurring}
          onChange={(e) => setRecurring(e.target.value)}
          className="w-full border rounded p-2"
        >
          <option value="none">None</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>

      <Button onClick={addNewTransaction} disabled={!(name && amount)} className="mt-3 w-full">
        {loading ? <Loader className='animate-spin' /> : "Add Transaction"}
      </Button>
    </div>
  );
}

export default AddExpense;
