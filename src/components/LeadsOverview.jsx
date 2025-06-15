
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

// Fetch leads from API
const fetchLeads = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/leads`);
    if (!response.ok) throw new Error('Failed to fetch leads');
    return await response.json();
  } catch (error) {
    console.error('Error fetching leads:', error);
    // Fallback data for development
    return [
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
  }
};

// Update lead contact status
const updateLeadContact = async (leadId) => {
  const response = await fetch(`${API_BASE_URL}/leads/${leadId}/contact`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) throw new Error('Failed to update lead');
  return response.json();
};

export function LeadsOverview() {
  const [statusFilter, setStatusFilter] = useState("all");
  const queryClient = useQueryClient();

  const { data: leads = [], isLoading } = useQuery({
    queryKey: ['leads'],
    queryFn: fetchLeads,
  });

  const mutation = useMutation({
    mutationFn: updateLeadContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });

  const filteredLeads = statusFilter === "all" 
    ? leads 
    : leads.filter(lead => lead.status === statusFilter);

  const markAsContacted = (id) => {
    mutation.mutate(id);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Hot": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "Warm": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "Cold": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-lg font-semibold dark:text-gray-100">Leads Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white dark:bg-gray-800">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold dark:text-gray-100">Leads Overview</CardTitle>
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
            <div key={lead.id} className="flex items-center justify-between p-4 border dark:border-gray-700 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="font-medium dark:text-gray-100">{lead.name}</h3>
                  <Badge className={getStatusColor(lead.status)}>
                    {lead.status}
                  </Badge>
                  {lead.contacted && (
                    <Badge variant="outline" className="text-green-600 border-green-600 dark:text-green-400 dark:border-green-400">
                      Contacted
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{lead.email}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{lead.phone}</p>
                <p className="text-xs text-gray-500 dark:text-gray-500">Source: {lead.source} • {lead.created_at}</p>
              </div>
              {!lead.contacted && (
                <Button 
                  onClick={() => markAsContacted(lead.id)}
                  size="sm"
                  variant="outline"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? 'Updating...' : 'Mark Contacted'}
                </Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
