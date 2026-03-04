import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, FileSpreadsheet, FileText } from "lucide-react";
import { format } from "date-fns";

export default function ExportButton({ transactions, customers, dateRange }) {
  const exportTransactionsCSV = () => {
    const headers = ["Date", "Type", "Category", "Description", "Amount"];
    const rows = transactions.map(t => [
      t.date,
      t.type,
      t.category,
      t.description || "",
      t.amount
    ]);
    
    const csv = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(","))
      .join("\n");
    
    downloadFile(csv, `transactions_${format(new Date(), "yyyy-MM-dd")}.csv`, "text/csv");
  };

  const exportCustomersCSV = () => {
    const headers = ["Name", "Email", "Phone", "Acquired Date", "Status"];
    const rows = customers.map(c => [
      c.name,
      c.email || "",
      c.phone || "",
      c.acquired_date,
      c.status || "active"
    ]);
    
    const csv = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(","))
      .join("\n");
    
    downloadFile(csv, `customers_${format(new Date(), "yyyy-MM-dd")}.csv`, "text/csv");
  };

  const exportSummaryReport = () => {
    const totalRevenue = transactions
      .filter(t => t.type === "revenue")
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
    
    const report = `
BUSINESS SUMMARY REPORT
Generated: ${format(new Date(), "MMMM d, yyyy")}
Period: ${dateRange?.from ? format(dateRange.from, "MMM d, yyyy") : "All time"} - ${dateRange?.to ? format(dateRange.to, "MMM d, yyyy") : "Present"}

FINANCIAL OVERVIEW
==================
Total Revenue: $${totalRevenue.toLocaleString()}
Total Expenses: $${totalExpenses.toLocaleString()}
Net Profit: $${(totalRevenue - totalExpenses).toLocaleString()}
Profit Margin: ${totalRevenue > 0 ? ((totalRevenue - totalExpenses) / totalRevenue * 100).toFixed(1) : 0}%

CUSTOMER METRICS
================
Total Customers: ${customers.length}
Active Customers: ${customers.filter(c => c.status === "active").length}

TRANSACTIONS
============
Total Transactions: ${transactions.length}
Average Transaction: $${transactions.length > 0 ? (transactions.reduce((sum, t) => sum + t.amount, 0) / transactions.length).toFixed(2) : 0}
    `.trim();
    
    downloadFile(report, `summary_report_${format(new Date(), "yyyy-MM-dd")}.txt`, "text/plain");
  };

  const downloadFile = (content, filename, type) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={exportTransactionsCSV} className="gap-2 cursor-pointer">
          <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
          Transactions (CSV)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportCustomersCSV} className="gap-2 cursor-pointer">
          <FileSpreadsheet className="w-4 h-4 text-indigo-600" />
          Customers (CSV)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportSummaryReport} className="gap-2 cursor-pointer">
          <FileText className="w-4 h-4 text-slate-600" />
          Summary Report (TXT)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}