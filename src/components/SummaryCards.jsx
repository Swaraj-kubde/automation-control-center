
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, DollarSign, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

// API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

// Fetch summary data from API
const fetchSummaryData = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/summary`);
    if (!response.ok) throw new Error('Failed to fetch summary data');
    return await response.json();
  } catch (error) {
    console.error('Error fetching summary data:', error);
    // Fallback data for development
    return {
      totalLeads: 42,
      clientsOnboarded: 18,
      paymentsReceived: 24500,
      invoicesPending: 7
    };
  }
};

export function SummaryCards() {
  const { data: summaryData, isLoading, error } = useQuery({
    queryKey: ['summaryData'],
    queryFn: fetchSummaryData,
  });

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
      value: summaryData?.clientsOnboarded?.toString() || "0",
      icon: UserCheck,
      change: "+8%",
      changeType: "positive",
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
