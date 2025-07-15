
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Lead = {
  id: number;
  name: string;
  email: string;
  phone: string;
  source: string;
  status: "Hot" | "Warm" | "Cold";
  created_at: string;
  contacted: boolean;
};

const mockLeads: Lead[] = [
  {
    id: 1,
    name: "John Smith",
    email: "john@example.com",
    phone: "(555) 123-4567",
    source: "Website",
    status: "Hot",
    created_at: "2024-06-14",
    contacted: false,
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah@example.com",
    phone: "(555) 987-6543",
    source: "Referral",
    status: "Warm",
    created_at: "2024-06-13",
    contacted: true,
  },
  {
    id: 3,
    name: "Mike Davis",
    email: "mike@example.com",
    phone: "(555) 456-7890",
    source: "Social Media",
    status: "Cold",
    created_at: "2024-06-12",
    contacted: false,
  },
];

export function LeadsOverview() {
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredLeads = statusFilter === "all" 
    ? leads 
    : leads.filter(lead => lead.status === statusFilter);

  const markAsContacted = (id: number) => {
    setLeads(leads.map(lead => 
      lead.id === id ? { ...lead, contacted: true } : lead
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Hot": return "bg-red-100 text-red-800";
      case "Warm": return "bg-yellow-100 text-yellow-800";
      case "Cold": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="bg-white dark:bg-gray-800">
      <CardHeader className="flex flex-col space-y-3 md:flex-row md:items-center md:justify-between md:space-y-0">
        <CardTitle className="text-lg md:text-xl font-semibold">Leads Overview</CardTitle>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-32">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="Hot">Hot</SelectItem>
            <SelectItem value="Warm">Warm</SelectItem>
            <SelectItem value="Cold">Cold</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 md:space-y-4">
          {filteredLeads.map((lead) => (
            <div key={lead.id} className="flex flex-col md:flex-row md:items-center md:justify-between p-4 border rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
              <div className="flex-1 mb-3 md:mb-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h3 className="font-medium text-sm md:text-base">{lead.name}</h3>
                  <Badge className={getStatusColor(lead.status)}>
                    {lead.status}
                  </Badge>
                  {lead.contacted && (
                    <Badge variant="outline" className="text-green-600 border-green-600 dark:text-green-400 dark:border-green-400">
                      Contacted
                    </Badge>
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-600 dark:text-gray-300">{lead.email}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{lead.phone}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Source: {lead.source} • {lead.created_at}
                  </p>
                </div>
              </div>
              {!lead.contacted && (
                <Button 
                  onClick={() => markAsContacted(lead.id)}
                  size="sm"
                  variant="outline"
                  className="w-full md:w-auto"
                >
                  Mark Contacted
                </Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
