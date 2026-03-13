import React from 'react';
import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';

function BarchartDash({ budgetList }) {
  // Calculate spending percentage for tooltip
  const data = budgetList.map(budget => ({
    ...budget,
    percentSpent: ((budget.totalSpend / budget.amount) * 100).toFixed(1),
  }));

  return (
    <div className="border rounded-lg p-5 shadow-md">
      <h2 className="font-bold text-lg mb-3">Budget vs Spending</h2>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 10, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip
            formatter={(value, name, props) => {
              if (name === "amount") return [`₹${value}`, "Budget"];
              if (name === "totalSpend") return [`₹${value}`, "Spent"];
              if (name === "percentSpent") return [`${value}%`, "% Spent"];
              return [value, name];
            }}
          />
          <Legend />
          <Bar dataKey="amount" name="Budget" fill="#16A34A" radius={[6, 6, 0, 0]} />
          <Bar dataKey="totalSpend" name="Spent" fill="#DC2626" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default BarchartDash;
