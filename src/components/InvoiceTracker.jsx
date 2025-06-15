
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

// Fetch invoices from API
const fetchInvoices = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/invoices`);
    if (!response.ok) throw new Error('Failed to fetch invoices');
    return await response.json();
  } catch (error) {
    console.error('Error fetching invoices:', error);
    // Fallback data for development
    return [
      {
        id: 1,
        client_name: "Acme Corp",
        amount: 2500,
        due_date: "2024-06-20",
        status: "Paid",
      },
      {
        id: 2,
        client_name: "Tech Solutions LLC",
        amount: 1800,
        due_date: "2024-06-25",
        status: "Unpaid",
      },
      {
        id: 3,
        client_name: "Digital Marketing Co",
        amount: 3200,
        due_date: "2024-06-18",
        status: "Unpaid",
      },
      {
        id: 4,
        client_name: "StartupXYZ",
        amount: 1200,
        due_date: "2024-06-30",
        status: "Paid",
      },
    ];
  }
};

// Update invoice status
const updateInvoiceStatus = async ({ invoiceId, status }) => {
  const response = await fetch(`${API_BASE_URL}/invoices/${invoiceId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) throw new Error('Failed to update invoice');
  return response.json();
};

// Send follow-up email
const sendFollowUpEmail = async (invoiceId) => {
  const response = await fetch(`${API_BASE_URL}/invoices/${invoiceId}/follow-up`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) throw new Error('Failed to send follow-up');
  return response.json();
};

export function InvoiceTracker() {
  const queryClient = useQueryClient();

  const { data: invoices = [], isLoading } = useQuery({
    queryKey: ['invoices'],
    queryFn: fetchInvoices,
  });

  const markPaidMutation = useMutation({
    mutationFn: updateInvoiceStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
  });

  const followUpMutation = useMutation({
    mutationFn: sendFollowUpEmail,
    onSuccess: () => {
      console.log('Follow-up email sent successfully');
    },
  });

  const markAsPaid = (id) => {
    markPaidMutation.mutate({ invoiceId: id, status: "Paid" });
  };

  const sendFollowUp = (id) => {
    console.log(`Sending follow-up for invoice ${id}`);
    followUpMutation.mutate(id);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date();
  };

  if (isLoading) {
    return (
      <Card className="bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-lg font-semibold dark:text-gray-100">Smart Invoice Tracker</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white dark:bg-gray-800">
      <CardHeader>
        <CardTitle className="text-lg font-semibold dark:text-gray-100">Smart Invoice Tracker</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left p-3 font-medium dark:text-gray-100">Client</th>
                <th className="text-left p-3 font-medium dark:text-gray-100">Amount</th>
                <th className="text-left p-3 font-medium dark:text-gray-100">Due Date</th>
                <th className="text-left p-3 font-medium dark:text-gray-100">Status</th>
                <th className="text-left p-3 font-medium dark:text-gray-100">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="p-3 font-medium dark:text-gray-100">{invoice.client_name}</td>
                  <td className="p-3 dark:text-gray-100">{formatCurrency(invoice.amount)}</td>
                  <td className="p-3">
                    <span className={`${
                      isOverdue(invoice.due_date) && invoice.status === "Unpaid" 
                        ? "text-red-600 dark:text-red-400" 
                        : "dark:text-gray-100"
                    }`}>
                      {invoice.due_date}
                    </span>
                  </td>
                  <td className="p-3">
                    <Badge className={
                      invoice.status === "Paid" 
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" 
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                    }>
                      {invoice.status}
                    </Badge>
                  </td>
                  <td className="p-3">
                    <div className="flex space-x-2">
                      {invoice.status === "Unpaid" && (
                        <>
                          <Button 
                            onClick={() => markAsPaid(invoice.id)}
                            size="sm"
                            variant="outline"
                            disabled={markPaidMutation.isPending}
                          >
                            {markPaidMutation.isPending ? 'Updating...' : 'Mark Paid'}
                          </Button>
                          <Button 
                            onClick={() => sendFollowUp(invoice.id)}
                            size="sm"
                            variant="outline"
                            disabled={followUpMutation.isPending}
                          >
                            {followUpMutation.isPending ? 'Sending...' : 'Send Follow-up'}
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
