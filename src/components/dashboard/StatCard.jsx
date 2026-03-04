import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function StatCard({ title, value, subtitle, icon: Icon, trend, trendUp, className }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <p className="text-sm font-medium text-slate-500 tracking-wide uppercase">{title}</p>
          <p className="text-3xl font-semibold text-slate-900 tracking-tight">{value}</p>
          {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
        </div>
        {Icon && (
          <div className="p-3 rounded-xl bg-slate-50">
            <Icon className="w-5 h-5 text-slate-600" />
          </div>
        )}
      </div>
      {trend && (
        <div className="mt-4 pt-4 border-t border-slate-100">
          <span className={cn(
            "text-sm font-medium",
            trendUp ? "text-emerald-600" : "text-rose-500"
          )}>
            {trendUp ? "↑" : "↓"} {trend}
          </span>
          <span className="text-sm text-slate-500 ml-1">vs last period</span>
        </div>
      )}
    </motion.div>
  );
}