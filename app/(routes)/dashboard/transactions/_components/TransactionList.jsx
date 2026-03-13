import { toast } from '@/components/ui/use-toast'
import { Trash } from 'lucide-react'
import React from 'react'
import moment from 'moment';

function TransactionList({ transactionList, refreshData }) {

    const deleteTransaction = async (transaction) => {
        try {
            const response = await fetch(`/api/transactions/${transaction.id}`, {
                method: 'DELETE',
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
            console.error('Error deleting transaction:', error);
            toast({
                title: "Error",
                description: "Failed to delete transaction",
                variant: "destructive",
            });
        }
    }

    // Group transactions by category and recurring
    const groupedTransactions = transactionList.reduce((acc, t) => {
        const key = `${t.category || 'Uncategorized'}|${t.recurring || 'none'}`;
        if(!acc[key]) acc[key] = [];
        acc[key].push(t);
        return acc;
    }, {})

    return (
        <div className='mt-3'>
            {Object.entries(groupedTransactions).map(([key, transactions], idx) => {
                const [category, recurring] = key.split('|');
                const totalAmount = transactions.reduce((sum, t) => sum + Number(t.amount), 0);
                return (
                    <div key={idx} className='mb-5 border rounded-lg p-3 bg-slate-50'>
                        <div className='flex justify-between items-center mb-2'>
                            <h2 className='font-bold'>{category} ({recurring})</h2>
                            <h2 className='font-bold text-primary'>₹{totalAmount}</h2>
                        </div>
                        {transactions.map((t, i) => (
                            <div key={i} className='grid grid-cols-4 p-2 border-b last:border-b-0'>
                                <h2>{t.name}</h2>
                                <h2>₹{t.amount}</h2>
                               <h2>{moment(t.createdAt).format('DD/MM/YYYY')}</h2>

                                <h2 className='pl-10'>
                                    <Trash className='text-red-600 cursor-pointer' onClick={()=>deleteTransaction(t)}/>    
                                </h2>
                            </div>
                        ))}
                    </div>
                )
            })}
        </div>
    )
}

export default TransactionList
