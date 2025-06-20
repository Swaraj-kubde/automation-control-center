
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Mail, Phone, Globe } from "lucide-react";
import { useClientsData } from "@/hooks/useClientsData";

export function ClientOnboardingData() {
  const { data: clients = [], isLoading } = useClientsData();

  const getStatusColor = (status) => {
    switch (status) {
      case "contacted": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "pending": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "completed": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const truncateText = (text, maxLength = 50) => {
    if (!text || text.length <= maxLength) return text || 'N/A';
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
                <TableRow key={client.client_id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <TableCell>
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {client.client_name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                        <Mail className="w-3 h-3" />
                        <span className="truncate max-w-[150px]">{client.email_address || 'No email'}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                        <Phone className="w-3 h-3" />
                        <span>{client.contacts?.phone || 'No phone'}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Globe className="w-3 h-3 text-gray-400" />
                      <span className="font-medium truncate max-w-[150px]" title={client.business}>
                        {client.business || 'No business info'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-600 dark:text-gray-400" title={client.key_challenges}>
                      {truncateText(client.key_challenges, 60)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-600 dark:text-gray-400" title={JSON.stringify(client.lead_handlings)}>
                      {truncateText(client.lead_handlings?.description || 'No lead handling info', 50)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {formatDate(client.created_at)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(client.status)}>
                      {client.status || 'pending'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => window.open(`mailto:${client.email_address}`, '_blank')}
                        disabled={!client.email_address}
                      >
                        <Mail className="w-3 h-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => console.log('View details for client:', client.client_id)}
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
