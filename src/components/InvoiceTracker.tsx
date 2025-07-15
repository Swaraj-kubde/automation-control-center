
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Invoice = {
  id: number;
  client_name: string;
  amount: number;
  due_date: string;
  status: "Paid" | "Unpaid";
};

const mockInvoices: Invoice[] = [
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

export function InvoiceTracker() {
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);

  const markAsPaid = (id: number) => {
    setInvoices(invoices.map(invoice => 
      invoice.id === id ? { ...invoice, status: "Paid" as const } : invoice
    ));
  };

  const sendFollowUp = (id: number) => {
    console.log(`Sending follow-up for invoice ${id}`);
    // Dummy handler - would integrate with email service
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  return (
    <Card className="bg-white dark:bg-gray-800">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl font-semibold">Smart Invoice Tracker</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3 font-medium text-sm">Client</th>
                <th className="text-left p-3 font-medium text-sm">Amount</th>
                <th className="text-left p-3 font-medium text-sm">Due Date</th>
                <th className="text-left p-3 font-medium text-sm">Status</th>
                <th className="text-left p-3 font-medium text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="p-3 font-medium text-sm">{invoice.client_name}</td>
                  <td className="p-3 text-sm">{formatCurrency(invoice.amount)}</td>
                  <td className="p-3 text-sm">
                    <span className={isOverdue(invoice.due_date) && invoice.status === "Unpaid" ? "text-red-600" : ""}>
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
                          >
                            Mark Paid
                          </Button>
                          <Button 
                            onClick={() => sendFollowUp(invoice.id)}
                            size="sm"
                            variant="outline"
                          >
                            Follow-up
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

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {invoices.map((invoice) => (
            <Card key={invoice.id} className="bg-gray-50 dark:bg-gray-700">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm mb-1">{invoice.client_name}</h3>
                    <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      {formatCurrency(invoice.amount)}
                    </p>
                  </div>
                  <Badge className={
                    invoice.status === "Paid" 
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" 
                      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                  }>
                    {invoice.status}
                  </Badge>
                </div>
                
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  <span className="font-medium">Due: </span>
                  <span className={isOverdue(invoice.due_date) && invoice.status === "Unpaid" ? "text-red-600" : ""}>
                    {invoice.due_date}
                  </span>
                </div>

                {invoice.status === "Unpaid" && (
                  <div className="flex flex-col space-y-2">
                    <Button 
                      onClick={() => markAsPaid(invoice.id)}
                      size="sm"
                      variant="outline"
                      className="w-full"
                    >
                      Mark as Paid
                    </Button>
                    <Button 
                      onClick={() => sendFollowUp(invoice.id)}
                      size="sm"
                      variant="outline"
                      className="w-full"
                    >
                      Send Follow-up
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
