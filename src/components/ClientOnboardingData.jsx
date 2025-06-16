
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Eye, Mail, Phone, Globe } from "lucide-react";

// API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

// Fetch client onboarding data from API
const fetchClientOnboardingData = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/client-onboarding`);
    if (!response.ok) throw new Error('Failed to fetch client onboarding data');
    return await response.json();
  } catch (error) {
    console.error('Error fetching client onboarding data:', error);
    // Fallback data for development
    return [
      {
        id: 1,
        full_name: "John Smith",
        email: "john.smith@techcorp.com",
        contact_number: "+1-555-0123",
        business_name: "TechCorp Solutions",
        key_challenges: "Struggling with lead qualification and follow-up automation. Need better conversion tracking.",
        lead_handling: "Currently using basic CRM with manual follow-ups. No automation in place.",
        created_at: "2024-06-10T10:30:00Z",
        status: "pending"
      },
      {
        id: 2,
        full_name: "Sarah Johnson",
        email: "sarah@digitalmarketing.co",
        contact_number: "+1-555-0456",
        business_name: "Digital Marketing Co",
        key_challenges: "High lead volume but low conversion rates. Need AI-powered lead scoring.",
        lead_handling: "Using multiple spreadsheets and email campaigns. Very manual process.",
        created_at: "2024-06-12T14:15:00Z",
        status: "reviewed"
      },
      {
        id: 3,
        full_name: "Mike Rodriguez",
        email: "mike.r@consulting.biz",
        contact_number: "+1-555-0789",
        business_name: "Rodriguez Consulting",
        key_challenges: "Inconsistent lead quality and difficulty in tracking ROI from different channels.",
        lead_handling: "Email-based system with some CRM integration. Looking for better automation.",
        created_at: "2024-06-14T09:45:00Z",
        status: "contacted"
      }
    ];
  }
};

export function ClientOnboardingData() {
  const { data: clients = [], isLoading } = useQuery({
    queryKey: ['client-onboarding'],
    queryFn: fetchClientOnboardingData,
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "contacted": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "reviewed": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "pending": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateText = (text, maxLength = 50) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (isLoading) {
    return (
      <Card className="bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-lg font-semibold dark:text-gray-100">Client Onboarding Submissions</CardTitle>
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
        <CardTitle className="text-lg font-semibold dark:text-gray-100 flex items-center gap-2">
          <Eye className="w-5 h-5" />
          Client Onboarding Submissions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px]">Client Info</TableHead>
                <TableHead className="w-[200px]">Contact</TableHead>
                <TableHead className="w-[180px]">Business</TableHead>
                <TableHead className="w-[250px]">Key Challenges</TableHead>
                <TableHead className="w-[200px]">Lead Handling</TableHead>
                <TableHead className="w-[120px]">Submitted</TableHead>
                <TableHead className="w-[100px]">Status</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((client) => (
                <TableRow key={client.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <TableCell>
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {client.full_name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                        <Mail className="w-3 h-3" />
                        <span className="truncate max-w-[150px]">{client.email}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                        <Phone className="w-3 h-3" />
                        <span>{client.contact_number}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Globe className="w-3 h-3 text-gray-400" />
                      <span className="font-medium truncate max-w-[150px]" title={client.business_name}>
                        {client.business_name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-600 dark:text-gray-400" title={client.key_challenges}>
                      {truncateText(client.key_challenges, 60)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-600 dark:text-gray-400" title={client.lead_handling}>
                      {truncateText(client.lead_handling, 50)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {formatDate(client.created_at)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(client.status)}>
                      {client.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => window.open(`mailto:${client.email}`, '_blank')}
                      >
                        <Mail className="w-3 h-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => console.log('View details for client:', client.id)}
                      >
                        <Eye className="w-3 h-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {clients.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No client onboarding submissions found.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
