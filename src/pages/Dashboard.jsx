import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { appClient } from "@/api/appClient";
import { useAuth } from "@/lib/AuthContext";
import { motion } from "framer-motion";
import { subDays, parseISO, isWithinInterval } from "date-fns";
import { DollarSign, TrendingUp, Users, Plus, Loader2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

import StatCard from "@/components/dashboard/StatCard";
import DateFilter from "@/components/dashboard/DateFilter";
import RevenueChart from "@/components/dashboard/RevenueChart";
import CategoryBreakdown from "@/components/dashboard/CategoryBreakdown";
import CustomerGrowthChart from "@/components/dashboard/CustomerGrowthChart";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import ExportButton from "@/components/dashboard/ExportButton";
import AddTransactionModal from "@/components/dashboard/AddTransactionModal";
import AddCustomerModal from "@/components/dashboard/AddCustomerModal";

export default function Dashboard() {
  const [dateRange, setDateRange] = useState({
    from: subDays(new Date(), 30),
    to: new Date()
  });
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [showAddCustomer, setShowAddCustomer] = useState(false);

  const { user, logout } = useAuth();
  const queryClient = useQueryClient();

  const { data: allTransactions = [], isLoading: loadingTransactions } = useQuery({
    queryKey: ["transactions", user?.id],
    queryFn: async () => {
      const { data, error } = await appClient
        .from("transactions")
        .select("*")
        .eq("user_id", user.id)          // Only this user's transactions
        .order("date", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user
  });

  const { data: allCustomers = [], isLoading: loadingCustomers } = useQuery({
    queryKey: ["customers", user?.id],
    queryFn: async () => {
      const { data, error } = await appClient
        .from("customers")
        .select("*")
        .eq("user_id", user.id)          // Only this user's customers
        .order("acquired_date", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user
  });

  const createTransactionMutation = useMutation({
    mutationFn: async (data) => {
      const { error } = await appClient
        .from("transactions")
        .insert([{ ...data, user_id: user.id }]);  // Save with user_id
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["transactions", user?.id] })
  });

  const createCustomerMutation = useMutation({
    mutationFn: async (data) => {
      const { error } = await appClient
        .from("customers")
        .insert([{ ...data, user_id: user.id }]);  // Save with user_id
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["customers", user?.id] })
  });

  // Filter transactions by date range
  const transactions = allTransactions.filter(t => {
    if (!dateRange?.from || !dateRange?.to) return true;
    const date = parseISO(t.date);
    return isWithinInterval(date, { start: dateRange.from, end: dateRange.to });
  });

  // Calculate metrics
  const totalRevenue = transactions
    .filter(t => t.type === "revenue")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const netProfit = totalRevenue - totalExpenses;
  const profitMargin = totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) : 0;

  const activeCustomers = allCustomers.filter(c => c.status === "active").length;

  const isLoading = loadingTransactions || loadingCustomers;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
          <p className="text-sm text-slate-500">Loading BizHub Finance...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">BizHub Finance</h1>
            <p className="text-sm text-slate-500 mt-1">Monitor your business performance</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <DateFilter dateRange={dateRange} onDateRangeChange={setDateRange} />
            <ExportButton
              transactions={transactions}
              customers={allCustomers}
              dateRange={dateRange}
            />
            <button
              onClick={logout}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign out
            </button>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <div className="flex gap-3 mb-8">
          <Button
            onClick={() => setShowAddTransaction(true)}
            className="bg-slate-900 hover:bg-slate-800 gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Transaction
          </Button>
          <Button
            onClick={() => setShowAddCustomer(true)}
            variant="outline"
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Customer
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Total Revenue"
            value={`$${totalRevenue.toLocaleString()}`}
            icon={DollarSign}
            trend={transactions.length > 0 ? `${profitMargin}% margin` : undefined}
            trendUp={netProfit > 0}
          />
          <StatCard
            title="Total Expenses"
            value={`$${totalExpenses.toLocaleString()}`}
            icon={TrendingUp}
          />
          <StatCard
            title="Net Profit"
            value={`$${netProfit.toLocaleString()}`}
            icon={TrendingUp}
            trend={netProfit > 0 ? "Profitable" : "Loss"}
            trendUp={netProfit > 0}
          />
          <StatCard
            title="Active Customers"
            value={activeCustomers.toLocaleString()}
            icon={Users}
            subtitle={`${allCustomers.length} total customers`}
          />
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <RevenueChart transactions={transactions} dateRange={dateRange} />
          </div>
          <CategoryBreakdown transactions={transactions} />
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CustomerGrowthChart customers={allCustomers} />
          <RecentTransactions transactions={allTransactions} />
        </div>
      </div>

      {/* Modals */}
      <AddTransactionModal
        open={showAddTransaction}
        onOpenChange={setShowAddTransaction}
        onSubmit={(data) => createTransactionMutation.mutateAsync(data)}
      />
      <AddCustomerModal
        open={showAddCustomer}
        onOpenChange={setShowAddCustomer}
        onSubmit={(data) => createCustomerMutation.mutateAsync(data)}
      />
    </div>
  );
}