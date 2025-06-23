
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useClientsData } from "@/hooks/useClientsData";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function OnboardingTracker() {
  const queryClient = useQueryClient();
  const { data: clients = [], isLoading } = useClientsData();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Show 5 clients per page

  const mutation = useMutation({
    mutationFn: async (clientId) => {
      // Here you would typically send an email, for now we'll just log it
      console.log(`Resending onboarding email for client ${clientId}`);
      
      // Update the onboarding details to track the resend
      const { error } = await supabase
        .from('clients')
        .update({ 
          onboarding_details: `Email resent on ${new Date().toISOString()}`
        })
        .eq('client_id', clientId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });

  // Transform clients data to onboarding format
  const onboardingClients = clients
    .filter(client => client.status !== 'completed')
    .map(client => ({
      id: client.client_id,
      client_name: client.client_name,
      status: client.status === 'completed' ? 'Completed' :
              client.status === 'contacted' ? 'In Progress' : 'Pending',
      sent_at: client.created_at ? new Date(client.created_at).toISOString().split('T')[0] : ''
    }));

  // Calculate pagination
  const totalPages = Math.ceil(onboardingClients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedClients = onboardingClients.slice(startIndex, startIndex + itemsPerPage);

  const resendEmail = (id) => {
    mutation.mutate(id);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed": return "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100";
      case "In Progress": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100";
      case "Pending": return "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-100";
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">Client Onboarding Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">Client Onboarding Status</CardTitle>
          {onboardingClients.length > 0 && (
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, onboardingClients.length)} of {onboardingClients.length}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {paginatedClients.map((client) => (
            <div key={client.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">{client.client_name}</h3>
                  <Badge className={getStatusColor(client.status)}>
                    {client.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Created: {client.sent_at}</p>
              </div>
              {client.status !== "Completed" && (
                <Button 
                  onClick={() => resendEmail(client.id)}
                  size="sm"
                  variant="outline"
                  disabled={mutation.isPending}
                  className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {mutation.isPending ? 'Sending...' : 'Resend Email'}
                </Button>
              )}
            </div>
          ))}
        </div>
        
        {onboardingClients.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No clients in onboarding process.
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    className={`${currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"} text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700`}
                  />
                </PaginationItem>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => setCurrentPage(page)}
                      isActive={currentPage === page}
                      className={`cursor-pointer text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 ${currentPage === page ? 'bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100' : ''}`}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    className={`${currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"} text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700`}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
