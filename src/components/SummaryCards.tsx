
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {summaryData.map((item, index) => (
        <Card key={index} className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {item.title}
            </CardTitle>
            <item.icon className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{item.value}</div>
            <p className={`text-xs ${
              item.changeType === "positive" 
                ? "text-green-600" 
                : item.changeType === "negative" 
                ? "text-red-600" 
                : "text-gray-600"
            }`}>
              {item.change} from last month
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
