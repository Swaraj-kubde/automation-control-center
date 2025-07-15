
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, DollarSign, Clock } from "lucide-react";

const summaryData = [
  {
    title: "Total Leads This Month",
    value: "42",
    icon: Users,
    change: "+12%",
    changeType: "positive",
  },
  {
    title: "Clients Onboarded",
    value: "18",
    icon: UserCheck,
    change: "+8%",
    changeType: "positive",
  },
  {
    title: "Payments Received",
    value: "$24,500",
    icon: DollarSign,
    change: "+15%",
    changeType: "positive",
  },
  {
    title: "Invoices Pending",
    value: "7",
    icon: Clock,
    change: "-3",
    changeType: "neutral",
  },
];

export function SummaryCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
      {summaryData.map((item, index) => (
        <Card key={index} className="bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 md:p-6">
            <CardTitle className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-300 leading-tight">
              {item.title}
            </CardTitle>
            <item.icon className="h-4 w-4 md:h-5 md:w-5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
          </CardHeader>
          <CardContent className="p-4 md:p-6 pt-0">
            <div className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
              {item.value}
            </div>
            <p className={`text-xs md:text-sm ${
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
