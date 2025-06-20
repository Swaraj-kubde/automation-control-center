
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useClientsData } from "@/hooks/useClientsData";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function OnboardingTracker() {
  const queryClient = useQueryClient();
  const { data: clients = [], isLoading } = useClientsData();

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

  const resendEmail = (id) => {
    mutation.mutate(id);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "In Progress": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "Pending": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-lg font-semibold dark:text-gray-100">Client Onboarding Status</CardTitle>
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
    <Card className="bg-white dark:bg-gray-800">
      <CardHeader>
        <CardTitle className="text-lg font-semibold dark:text-gray-100">Client Onboarding Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {onboardingClients.map((client) => (
            <div key={client.id} className="flex items-center justify-between p-4 border dark:border-gray-700 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="font-medium dark:text-gray-100">{client.client_name}</h3>
                  <Badge className={getStatusColor(client.status)}>
                    {client.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Created: {client.sent_at}</p>
              </div>
              {client.status !== "Completed" && (
                <Button 
                  onClick={() => resendEmail(client.id)}
                  size="sm"
                  variant="outline"
                  disabled={mutation.isPending}
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
      </CardContent>
    </Card>
  );
}
