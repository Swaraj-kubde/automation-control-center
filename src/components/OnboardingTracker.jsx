
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

// Fetch onboarding data from API
const fetchOnboardingData = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/onboarding`);
    if (!response.ok) throw new Error('Failed to fetch onboarding data');
    return await response.json();
  } catch (error) {
    console.error('Error fetching onboarding data:', error);
    // Fallback data for development
    return [
      {
        id: 1,
        client_name: "Acme Corp",
        status: "Completed",
        sent_at: "2024-06-10",
      },
      {
        id: 2,
        client_name: "Tech Solutions LLC",
        status: "In Progress",
        sent_at: "2024-06-12",
      },
      {
        id: 3,
        client_name: "Digital Marketing Co",
        status: "Pending",
        sent_at: "2024-06-14",
      },
    ];
  }
};

// Resend onboarding email
const resendOnboardingEmail = async (clientId) => {
  const response = await fetch(`${API_BASE_URL}/onboarding/${clientId}/resend`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) throw new Error('Failed to resend email');
  return response.json();
};

export function OnboardingTracker() {
  const queryClient = useQueryClient();

  const { data: clients = [], isLoading } = useQuery({
    queryKey: ['onboarding'],
    queryFn: fetchOnboardingData,
  });

  const mutation = useMutation({
    mutationFn: resendOnboardingEmail,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['onboarding'] });
    },
  });

  const resendEmail = (id) => {
    console.log(`Resending onboarding email for client ${id}`);
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
          {clients.map((client) => (
            <div key={client.id} className="flex items-center justify-between p-4 border dark:border-gray-700 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="font-medium dark:text-gray-100">{client.client_name}</h3>
                  <Badge className={getStatusColor(client.status)}>
                    {client.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Email sent: {client.sent_at}</p>
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
      </CardContent>
    </Card>
  );
}
