"use client";
import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Colors for categories
const COLORS = [
  "#2563EB",
  "#16A34A",
  "#DC2626",
  "#F59E0B",
  "#9333EA",
  "#0EA5E9",
];

function CategoryPieChart({ categoryAggregation = {} }) {
  // Transform categoryAggregation into array for Recharts
  const data = Object.entries(categoryAggregation).map(([name, value]) => ({
    name,
    value,
  }));

  if (data.length === 0) {
    return (
      <div className="glass-panel p-5">
        <h2 className="mb-2 text-lg font-semibold">Spending by Category</h2>
        <p className="text-sm text-muted-foreground">
          No category data available yet.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-panel p-4 sm:p-5">
      <h2 className="mb-3 text-lg font-semibold">Spending by Category</h2>
      <ResponsiveContainer width="100%" height={350}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) =>
              `${name}: ${(percent * 100).toFixed(0)}%`
            }
            outerRadius={110}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(val) => `₹${val}`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default CategoryPieChart;
