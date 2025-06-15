
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type OnboardingClient = {
  id: number;
  client_name: string;
  status: "Pending" | "In Progress" | "Completed";
  sent_at: string;
};

const mockOnboarding: OnboardingClient[] = [
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

export function OnboardingTracker() {
  const [clients, setClients] = useState<OnboardingClient[]>(mockOnboarding);

  const resendEmail = (id: number) => {
    console.log(`Resending onboarding email for client ${id}`);
    // Dummy handler - would integrate with email service
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "bg-green-100 text-green-800";
      case "In Progress": return "bg-yellow-100 text-yellow-800";
      case "Pending": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Client Onboarding Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {clients.map((client) => (
            <div key={client.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="font-medium">{client.client_name}</h3>
                  <Badge className={getStatusColor(client.status)}>
                    {client.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">Email sent: {client.sent_at}</p>
              </div>
              {client.status !== "Completed" && (
                <Button 
                  onClick={() => resendEmail(client.id)}
                  size="sm"
                  variant="outline"
                >
                  Resend Email
                </Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
