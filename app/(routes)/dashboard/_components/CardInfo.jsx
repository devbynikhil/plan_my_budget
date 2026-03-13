
import { PiggyBank, ReceiptText, Wallet } from 'lucide-react'
import React, { useEffect, useState } from 'react'

function CardInfo({ budgetList }) {

    const [totalBudget, setTotalBudget] = useState(0);
    const [totalSpent, setTotalSpent] = useState(0);

    const calculateCardInfo = () => {
        
        let totalBudget_ = 0;
        let totalSpent_ = 0;
        budgetList.forEach(element => {
                totalBudget_ = totalBudget_ +Number(element.amount) ;            
                totalSpent_ = totalSpent_+element.totalSpend;
        });
        setTotalBudget(totalBudget_);
        setTotalSpent(totalSpent_);
    }

    useEffect(() => {
        budgetList&&calculateCardInfo();
    },[budgetList])
    return (
    <div>

        
      {budgetList?.length>0? <div className='mt-7 grid grid-col-1 md:grid-col-2 lg:grid-cols-3 gap-5'>
            <div className='p-7 border rounded-lg flex items-center justify-between'> 
                <div>
                    <h2 className='text-sm'>
                        Total Budgets:
                    </h2>
                    <h2 className='font-bold text-2xl'>
                        ₹{totalBudget}/-
                    </h2>
                </div>
                <PiggyBank className='bg-primary rounded-full p-3 h-12 w-12 text-white '/>

            </div>
            <div className='p-7 border rounded-lg flex items-center justify-between'> 
                <div>
                    <h2 className='text-sm'>
                        Total Spent:
                    </h2>
                    <h2 className='font-bold text-2xl'>
                    ₹{totalSpent}/-
                    </h2>
                </div>
                <ReceiptText className='bg-primary rounded-full p-3 h-12 w-12 text-white '/>

            </div>
            <div className='p-7 border rounded-lg flex items-center justify-between'> 
                <div>
                    <h2 className='text-sm'>
                        No of Budgets:
                    </h2>
                    <h2 className='font-bold text-2xl'>
                        {budgetList.length}
                    </h2>
                </div>
                <Wallet className='bg-primary rounded-full p-3 h-12 w-12 text-white '/>

            </div>
        </div>
      :
      <div className='mt-7 grid grid-col-1 md:grid-col-2 lg:grid-cols-3 gap-5'>
           { [1,2,3].map((item, index) => (
            <div key={index} className='h-[120px] w-full bg-slate-200 rounded-lg animate-pulse'></div>
           ))}
      </div>
      }
        </div>
    )
}

export default CardInfo