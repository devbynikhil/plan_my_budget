import React from 'react'
import BudgetList from './_components/budgetList'
function budgets() {
  return (
    <div className='p-5'>
      <h1 className='font-bold text-3xl'>
        My Budgets
      </h1>
      <BudgetList />
    </div>
  )
}

export default budgets