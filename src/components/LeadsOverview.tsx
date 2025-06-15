
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
    <Card className="bg-white">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Leads Overview</CardTitle>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-32">
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
        <div className="space-y-4">
          {filteredLeads.map((lead) => (
            <div key={lead.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="font-medium">{lead.name}</h3>
                  <Badge className={getStatusColor(lead.status)}>
                    {lead.status}
                  </Badge>
                  {lead.contacted && (
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      Contacted
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600">{lead.email}</p>
                <p className="text-sm text-gray-600">{lead.phone}</p>
                <p className="text-xs text-gray-500">Source: {lead.source} • {lead.created_at}</p>
              </div>
              {!lead.contacted && (
                <Button 
                  onClick={() => markAsContacted(lead.id)}
                  size="sm"
                  variant="outline"
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
