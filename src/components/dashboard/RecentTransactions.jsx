import { motion } from "framer-motion";
import { format, parseISO } from "date-fns";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

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

export default function RecentTransactions({ transactions }) {
  const recent = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 8);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
      className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm"
    >
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-900">Recent Transactions</h3>
        <p className="text-sm text-slate-500 mt-1">Latest financial activity</p>
      </div>
      
      <div className="space-y-3">
        {recent.map((transaction, index) => (
          <motion.div
            key={transaction.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <div className={cn(
              "p-2 rounded-lg",
              transaction.type === "revenue" ? "bg-emerald-50" : "bg-rose-50"
            )}>
              {transaction.type === "revenue" ? (
                <ArrowUpRight className="w-4 h-4 text-emerald-600" />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-rose-500" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">
                {transaction.description || categoryLabels[transaction.category]}
              </p>
              <p className="text-xs text-slate-500">
                {categoryLabels[transaction.category]} • {format(parseISO(transaction.date), "MMM d, yyyy")}
              </p>
            </div>
            
            <p className={cn(
              "text-sm font-semibold",
              transaction.type === "revenue" ? "text-emerald-600" : "text-rose-500"
            )}>
              {transaction.type === "revenue" ? "+" : "-"}${transaction.amount.toLocaleString()}
            </p>
          </motion.div>
        ))}
        
        {recent.length === 0 && (
          <p className="text-sm text-slate-500 text-center py-8">No transactions yet</p>
        )}
      </div>
    </motion.div>
  );
}