
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, DollarSign, Clock } from "lucide-react";
import { useClientStats } from "@/hooks/useClientsData";
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';



export function SummaryCards() {
  const { data: summaryData, isLoading, error } = useClientStats();
  const [clientCount, setClientCount] = useState(0);
  const [clientGrowth, setClientGrowth] = useState({
    thisMonth: 0,
    lastMonth: 0,
    percentChange: "0%",
    changeType: "neutral",
  });

  useEffect(() => {
    const getClientCounts = async () => {
      const now = new Date();
      const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

      const { count: thisMonthCount } = await supabase
        .from("clients")
        .select("*", { count: "exact", head: true })
        .gte("created_at", startOfThisMonth.toISOString());

      const { count: lastMonthCount } = await supabase
        .from("clients")
        .select("*", { count: "exact", head: true })
        .gte("created_at", startOfLastMonth.toISOString())
        .lte("created_at", endOfLastMonth.toISOString());

      let percentChange = "0%";
      let changeType = "neutral";

      if (!lastMonthCount || lastMonthCount === 0) {
        if (thisMonthCount && thisMonthCount > 0) {
          percentChange = "New data";
          changeType = "positive";
        } else {
          percentChange = "0%";
          changeType = "neutral";
        }
      } else {
        const diff = thisMonthCount - lastMonthCount;
        const percent = Math.round((diff / lastMonthCount) * 100);
        percentChange = `${percent >= 0 ? "+" : ""}${percent}%`;
        changeType = percent > 0 ? "positive" : percent < 0 ? "negative" : "neutral";
      }

      setClientGrowth({
        thisMonth: thisMonthCount || 0,
        lastMonth: lastMonthCount || 0,
        percentChange,
        changeType,
      });

      setClientCount(thisMonthCount || 0); // optional if clientCount used separately
    };

    getClientCounts();
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="bg-white dark:bg-gray-800 animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const summaryItems = [
    {
      title: "Total Leads This Month",
      value: summaryData?.totalLeads?.toString() || "0",
      icon: Users,
      change: "+12%",
      changeType: "positive",
    },
    {
      title: "Clients Onboarded",
      value: clientCount.toString() || "0",
      icon: UserCheck,
      change: clientGrowth.percentChange,
      changeType: clientGrowth.changeType,
    },
    {
      title: "Payments Received",
      value: `$${summaryData?.paymentsReceived?.toLocaleString() || "0"}`,
      icon: DollarSign,
      change: "+15%",
      changeType: "positive",
    },
    {
      title: "Invoices Pending",
      value: summaryData?.invoicesPending?.toString() || "0",
      icon: Clock,
      change: "-3",
      changeType: "neutral",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {summaryItems.map((item, index) => (
        <Card key={index} className="bg-white dark:bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {item.title}
            </CardTitle>
            <item.icon className="h-4 w-4 text-gray-400 dark:text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{item.value}</div>
            <p className={`text-xs ${
              item.changeType === "positive"
                ? "text-green-600 dark:text-green-400"
                : item.changeType === "negative"
                ? "text-red-600 dark:text-red-400"
                : "text-gray-600 dark:text-gray-400"
            }`}>
              {item.change} from last month
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

