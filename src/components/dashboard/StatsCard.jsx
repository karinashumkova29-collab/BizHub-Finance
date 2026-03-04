import React from 'react';
import { Card } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function StatsCard({ title, value, icon: Icon, trend, trendValue, color = "emerald" }) {
  const colorClasses = {
    emerald: {
      bg: "bg-emerald-50",
      text: "text-emerald-600",
      icon: "bg-emerald-100"
    },
    coral: {
      bg: "bg-red-50",
      text: "text-red-600",
      icon: "bg-red-100"
    },
    indigo: {
      bg: "bg-indigo-50",
      text: "text-indigo-600",
      icon: "bg-indigo-100"
    },
    slate: {
      bg: "bg-slate-50",
      text: "text-slate-700",
      icon: "bg-slate-100"
    }
  };

  const colors = colorClasses[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="relative overflow-hidden border-0 shadow-sm hover:shadow-md transition-all duration-300">
        <div className={`absolute top-0 right-0 w-40 h-40 ${colors.bg} rounded-full blur-3xl opacity-30 -translate-y-1/2 translate-x-1/2`} />
        <div className="relative p-6">
          <div className="flex items-start justify-between mb-4">
            <div className={`p-3 rounded-xl ${colors.icon}`}>
              <Icon className={`w-5 h-5 ${colors.text}`} />
            </div>
            {trend && (
              <div className={`flex items-center gap-1 text-sm font-medium ${trend === 'up' ? 'text-emerald-600' : 'text-red-600'}`}>
                {trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                <span>{trendValue}</span>
              </div>
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
            <h3 className="text-3xl font-bold text-slate-900">{value}</h3>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}