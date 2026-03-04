import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format, parseISO, eachMonthOfInterval, startOfYear } from "date-fns";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-4">
        <p className="text-sm font-medium text-slate-900 mb-2">{label}</p>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-indigo-500" />
            <span className="text-sm text-slate-600">New:</span>
            <span className="text-sm font-semibold text-slate-900">{payload[0]?.value}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-slate-400" />
            <span className="text-sm text-slate-600">Total:</span>
            <span className="text-sm font-semibold text-slate-900">{payload[1]?.value}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default function CustomerGrowthChart({ customers }) {
  const getChartData = () => {
    const startDate = startOfYear(new Date());
    const months = eachMonthOfInterval({ start: startDate, end: new Date() });
    
    let runningTotal = customers.filter(c => 
      parseISO(c.acquired_date) < startDate
    ).length;
    
    return months.map(month => {
      const monthKey = format(month, "yyyy-MM");
      const newCustomers = customers.filter(c => 
        format(parseISO(c.acquired_date), "yyyy-MM") === monthKey
      ).length;
      
      runningTotal += newCustomers;
      
      return {
        month: format(month, "MMM"),
        new: newCustomers,
        total: runningTotal
      };
    });
  };

  const chartData = getChartData();
  const totalNew = chartData.reduce((sum, d) => sum + d.new, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm"
    >
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Customer Growth</h3>
          <p className="text-sm text-slate-500 mt-1">Year to date performance</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-slate-900">+{totalNew}</p>
          <p className="text-xs text-slate-500">new this year</p>
        </div>
      </div>
      
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis 
              dataKey="month" 
              axisLine={false} 
              tickLine={false}
              tick={{ fontSize: 12, fill: '#64748b' }}
              tickMargin={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false}
              tick={{ fontSize: 12, fill: '#64748b' }}
              tickMargin={10}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="new" 
              stroke="#6366f1" 
              strokeWidth={2}
              dot={{ fill: '#6366f1', strokeWidth: 0, r: 4 }}
              activeDot={{ r: 6, fill: '#6366f1' }}
            />
            <Line 
              type="monotone" 
              dataKey="total" 
              stroke="#94a3b8" 
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex justify-center gap-6 mt-4 pt-4 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-indigo-500" />
          <span className="text-sm text-slate-600">New Customers</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-0.5 bg-slate-400" style={{ borderStyle: 'dashed' }} />
          <span className="text-sm text-slate-600">Cumulative</span>
        </div>
      </div>
    </motion.div>
  );
}