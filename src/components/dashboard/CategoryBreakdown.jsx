import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

const categoryLabels = {
  sales: "Sales",
  services: "Services",
  subscriptions: "Subscriptions",
  other_income: "Other Income",
  rent: "Rent",
  utilities: "Utilities",
  salaries: "Salaries",
  marketing: "Marketing",
  supplies: "Supplies",
  software: "Software",
  travel: "Travel",
  other_expense: "Other"
};

const revenueColors = ["#10b981", "#34d399", "#6ee7b7", "#a7f3d0"];
const expenseColors = ["#f43f5e", "#fb7185", "#fda4af", "#fecdd3", "#fecaca", "#fed7aa", "#fde68a", "#d9f99d"];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-3">
        <p className="text-sm font-medium text-slate-900">{payload[0].name}</p>
        <p className="text-sm text-slate-600">${payload[0].value.toLocaleString()}</p>
        <p className="text-xs text-slate-500">{payload[0].payload.percentage}%</p>
      </div>
    );
  }
  return null;
};

export default function CategoryBreakdown({ transactions }) {
  const [activeTab, setActiveTab] = useState("revenue");
  
  const getData = (type) => {
    const filtered = transactions.filter(t => t.type === type);
    const byCategory = {};
    
    filtered.forEach(t => {
      byCategory[t.category] = (byCategory[t.category] || 0) + t.amount;
    });
    
    const total = Object.values(byCategory).reduce((sum, val) => sum + val, 0);
    
    return Object.entries(byCategory)
      .map(([category, amount]) => ({
        name: categoryLabels[category] || category,
        value: amount,
        percentage: total > 0 ? ((amount / total) * 100).toFixed(1) : 0
      }))
      .sort((a, b) => b.value - a.value);
  };

  const data = getData(activeTab);
  const colors = activeTab === "revenue" ? revenueColors : expenseColors;
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Category Breakdown</h3>
          <p className="text-sm text-slate-500 mt-1">Where your money flows</p>
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-slate-100">
            <TabsTrigger value="revenue" className="text-xs">Revenue</TabsTrigger>
            <TabsTrigger value="expense" className="text-xs">Expenses</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="w-48 h-48 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <p className="text-2xl font-bold text-slate-900">${total >= 1000 ? `${(total/1000).toFixed(1)}k` : total.toLocaleString()}</p>
            <p className="text-xs text-slate-500">Total</p>
          </div>
        </div>
        
        <div className="flex-1 space-y-3 max-h-48 overflow-y-auto">
          {data.map((item, index) => (
            <div key={item.name} className="flex items-center gap-3">
              <div 
                className="w-3 h-3 rounded-full flex-shrink-0" 
                style={{ backgroundColor: colors[index % colors.length] }} 
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-700 truncate">{item.name}</span>
                  <span className="text-sm font-medium text-slate-900 ml-2">
                    ${item.value.toLocaleString()}
                  </span>
                </div>
                <div className="mt-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500"
                    style={{ 
                      width: `${item.percentage}%`,
                      backgroundColor: colors[index % colors.length]
                    }} 
                  />
                </div>
              </div>
            </div>
          ))}
          {data.length === 0 && (
            <p className="text-sm text-slate-500 text-center py-8">No data for this period</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}