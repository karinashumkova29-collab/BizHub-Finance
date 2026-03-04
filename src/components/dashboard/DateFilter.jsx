import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, ChevronDown } from "lucide-react";
import { format, subDays, startOfMonth, endOfMonth, subMonths, startOfYear } from "date-fns";
import { cn } from "@/lib/utils";

const presets = [
  { label: "Last 7 days", getValue: () => ({ from: subDays(new Date(), 7), to: new Date() }) },
  { label: "Last 30 days", getValue: () => ({ from: subDays(new Date(), 30), to: new Date() }) },
  { label: "This month", getValue: () => ({ from: startOfMonth(new Date()), to: endOfMonth(new Date()) }) },
  { label: "Last month", getValue: () => ({ from: startOfMonth(subMonths(new Date(), 1)), to: endOfMonth(subMonths(new Date(), 1)) }) },
  { label: "This year", getValue: () => ({ from: startOfYear(new Date()), to: new Date() }) },
];

export default function DateFilter({ dateRange, onDateRangeChange }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
        {presets.slice(0, 3).map((preset) => (
          <Button
            key={preset.label}
            variant="ghost"
            size="sm"
            onClick={() => onDateRangeChange(preset.getValue())}
            className={cn(
              "text-xs font-medium rounded-md px-3 hover:bg-white hover:text-slate-900",
              dateRange?.from?.getTime() === preset.getValue().from.getTime() && 
              "bg-white text-slate-900 shadow-sm"
            )}
          >
            {preset.label}
          </Button>
        ))}
      </div>
      
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2 text-xs font-medium">
            <CalendarIcon className="w-3.5 h-3.5" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, "MMM d")} - {format(dateRange.to, "MMM d, yyyy")}
                </>
              ) : (
                format(dateRange.from, "MMM d, yyyy")
              )
            ) : (
              "Custom range"
            )}
            <ChevronDown className="w-3 h-3" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <div className="p-3 border-b">
            <p className="text-sm font-medium text-slate-900">Select date range</p>
          </div>
          <div className="flex">
            <div className="border-r p-2 space-y-1">
              {presets.map((preset) => (
                <Button
                  key={preset.label}
                  variant="ghost"
                  size="sm"
                  onClick={() => onDateRangeChange(preset.getValue())}
                  className="w-full justify-start text-xs"
                >
                  {preset.label}
                </Button>
              ))}
            </div>
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={onDateRangeChange}
              numberOfMonths={2}
              className="p-3"
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}