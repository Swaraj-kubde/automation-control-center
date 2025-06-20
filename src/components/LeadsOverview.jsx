
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useClientsData } from "@/hooks/useClientsData";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function LeadsOverview() {
  const [statusFilter, setStatusFilter] = useState("all");
  const queryClient = useQueryClient();

  const { data: clients = [], isLoading } = useClientsData();

  const mutation = useMutation({
    mutationFn: async (clientId) => {
      const { error } = await supabase
        .from('clients')
        .update({ status: 'contacted' })
        .eq('client_id', clientId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });

  // Transform clients data to leads format
  const leads = clients.map(client => ({
    id: client.client_id,
    name: client.client_name,
    email: client.email_address || 'No email provided',
    phone: client.contacts?.phone || 'No phone provided',
    source: client.contacts?.source || 'Unknown',
    status: client.status === 'contacted' ? 'Hot' : 
            client.status === 'pending' ? 'Warm' : 'Cold',
    created_at: client.created_at ? new Date(client.created_at).toISOString().split('T')[0] : '',
    contacted: client.status === 'contacted'
  }));

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
        {filteredLeads.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No leads found for the selected filter.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
