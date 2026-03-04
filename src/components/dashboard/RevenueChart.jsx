import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format, parseISO, eachDayOfInterval, eachMonthOfInterval, differenceInDays } from "date-fns";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-4">
        <p className="text-sm font-medium text-slate-900 mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-sm text-slate-600">{entry.name}:</span>
            <span className="text-sm font-semibold text-slate-900">
              ${entry.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function RevenueChart({ transactions, dateRange }) {
  const daysDiff = dateRange?.from && dateRange?.to 
    ? differenceInDays(dateRange.to, dateRange.from) 
    : 30;
  
  const useMonthly = daysDiff > 60;
  
  const getChartData = () => {
    if (!dateRange?.from || !dateRange?.to) return [];
    
    const intervals = useMonthly 
      ? eachMonthOfInterval({ start: dateRange.from, end: dateRange.to })
      : eachDayOfInterval({ start: dateRange.from, end: dateRange.to });
    
    return intervals.map(date => {
      const dateKey = useMonthly ? format(date, "yyyy-MM") : format(date, "yyyy-MM-dd");
      const relevantTransactions = transactions.filter(t => {
        const tDate = useMonthly ? format(parseISO(t.date), "yyyy-MM") : t.date;
        return tDate === dateKey;
      });
      
      const revenue = relevantTransactions
        .filter(t => t.type === "revenue")
        .reduce((sum, t) => sum + t.amount, 0);
      const expenses = relevantTransactions
        .filter(t => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);
      
      return {
        date: useMonthly ? format(date, "MMM yyyy") : format(date, "MMM d"),
        revenue,
        expenses,
        profit: revenue - expenses
      };
    });
  };

  const chartData = getChartData();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm"
    >
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-900">Revenue vs Expenses</h3>
        <p className="text-sm text-slate-500 mt-1">Track your cash flow over time</p>
      </div>
      
      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: '#64748b' }}
              tickMargin={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: '#64748b' }}
              tickFormatter={(value) => `$${value >= 1000 ? `${(value/1000).toFixed(0)}k` : value}`}
              tickMargin={10}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="revenue" 
              name="Revenue"
              stroke="#10b981" 
              strokeWidth={2}
              fill="url(#revenueGradient)" 
            />
            <Area 
              type="monotone" 
              dataKey="expenses" 
              name="Expenses"
              stroke="#f43f5e" 
              strokeWidth={2}
              fill="url(#expenseGradient)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex justify-center gap-6 mt-4 pt-4 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
          <span className="text-sm text-slate-600">Revenue</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-rose-500" />
          <span className="text-sm text-slate-600">Expenses</span>
        </div>
      </div>
    </motion.div>
  );
}