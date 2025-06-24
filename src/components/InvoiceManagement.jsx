import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Mail, CheckCircle, XCircle, Search, Users } from "lucide-react";
import { InvoiceForm } from "./InvoiceForm";
import { FollowUpForm } from "./FollowUpForm";
import { InvoiceSearchDialog } from "./InvoiceSearchDialog";
import { ClientSearchDialog } from "./ClientSearchDialog";
import { 
  useInvoicesData, 
  useFollowUpsData, 
  useCreateInvoice, 
  useUpdateInvoice, 
  useDeleteInvoice, 
  useUpdateFollowUp 
} from "@/hooks/useInvoicesData";

export function InvoiceManagement() {
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [showFollowUpForm, setShowFollowUpForm] = useState(false);
  const [showInvoiceSearch, setShowInvoiceSearch] = useState(false);
  const [showClientSearch, setShowClientSearch] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [editingFollowUp, setEditingFollowUp] = useState(null);

  // Queries
  const { data: invoices = [], isLoading: invoicesLoading } = useInvoicesData();
  const { data: followUps = [], isLoading: followUpsLoading } = useFollowUpsData();

  // Mutations
  const createInvoiceMutation = useCreateInvoice();
  const updateInvoiceMutation = useUpdateInvoice();
  const deleteInvoiceMutation = useDeleteInvoice();
  const updateFollowUpMutation = useUpdateFollowUp();

  const handleEditInvoice = (invoice) => {
    setEditingInvoice(invoice);
    setShowInvoiceForm(true);
  };

  const handleEditFollowUp = (followUp) => {
    setEditingFollowUp(followUp);
    setShowFollowUpForm(true);
  };

  const handleMarkFollowUp = (id, followed_up) => {
    updateFollowUpMutation.mutate({
      id,
      followed_up,
      last_follow_up: followed_up ? new Date().toISOString().split('T')[0] : null,
    });
  };

  const handleInvoiceSelect = (invoiceData) => {
    setEditingInvoice(invoiceData);
    setShowInvoiceForm(true);
  };

  const handleClientSelect = (clientData) => {
    console.log('Client selected for invoice:', clientData);
    setEditingInvoice(clientData);
    setShowInvoiceForm(true);
    setShowClientSearch(false);
  };

  const handleCreateInvoice = (data) => {
    // Generate invoice number if not provided
    const invoiceData = {
      ...data,
      invoice_number: data.invoice_number || `INV-${Date.now()}`,
      deal_id: data.client_id || data.deal_id || null
    };
    createInvoiceMutation.mutate(invoiceData);
  };

  const handleUpdateInvoice = (data) => {
    updateInvoiceMutation.mutate({ id: editingInvoice.id, ...data });
  };

  const formatCurrency = (amount) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      paid: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      unpaid: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
    };
    
    return (
      <Badge className={statusColors[status] || statusColors.unpaid}>
        {status}
      </Badge>
    );
  };

  const getFollowUpBadge = (followed_up) => {
    return (
      <Badge className={
        followed_up 
          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" 
          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      }>
        {followed_up ? "Followed Up" : "Pending"}
      </Badge>
    );
  };

  // Helper function to safely display invoice ID
  const formatInvoiceId = (invoice) => {
    if (invoice.invoice_number) {
      return invoice.invoice_number;
    }
    if (invoice.id && typeof invoice.id === 'string') {
      return `${invoice.id.substring(0, 8)}...`;
    }
    return 'N/A';
  };

  if (invoicesLoading || followUpsLoading) {
    return (
      <div className="space-y-6">
        <Card className="bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="text-lg font-semibold dark:text-gray-100">Loading...</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="animate-pulse space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Invoice Management Table */}
      <Card className="bg-white dark:bg-gray-800">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold dark:text-gray-100">Invoice Management</CardTitle>
          <div className="flex gap-2">
            <Button 
              onClick={() => setShowClientSearch(true)} 
              size="sm"
              variant="outline"
            >
              <Users className="w-4 h-4 mr-2" />
              Search Client
            </Button>
            <Button 
              onClick={() => setShowInvoiceSearch(true)} 
              size="sm"
              variant="outline"
            >
              <Search className="w-4 h-4 mr-2" />
              Search Invoice
            </Button>
            <Button onClick={() => setShowInvoiceForm(true)} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Invoice
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b dark:border-gray-700">
                  <th className="text-left p-3 font-medium dark:text-gray-100">Invoice #</th>
                  <th className="text-left p-3 font-medium dark:text-gray-100">Client</th>
                  <th className="text-left p-3 font-medium dark:text-gray-100">Email</th>
                  <th className="text-left p-3 font-medium dark:text-gray-100">Amount</th>
                  <th className="text-left p-3 font-medium dark:text-gray-100">Date</th>
                  <th className="text-left p-3 font-medium dark:text-gray-100">Status</th>
                  <th className="text-left p-3 font-medium dark:text-gray-100">Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="p-3 font-medium dark:text-gray-100">
                      {formatInvoiceId(invoice)}
                    </td>
                    <td className="p-3 font-medium dark:text-gray-100">{invoice.client_name}</td>
                    <td className="p-3 dark:text-gray-100">{invoice.email}</td>
                    <td className="p-3 dark:text-gray-100">{formatCurrency(invoice.amount)}</td>
                    <td className="p-3 dark:text-gray-100">{invoice.invoice_date}</td>
                    <td className="p-3">{getStatusBadge(invoice.status)}</td>
                    <td className="p-3">
                      <div className="flex space-x-2">
                        <Button 
                          onClick={() => handleEditInvoice(invoice)}
                          size="sm"
                          variant="outline"
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button 
                          onClick={() => deleteInvoiceMutation.mutate(invoice.id)}
                          size="sm"
                          variant="outline"
                          disabled={deleteInvoiceMutation.isPending}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Follow-up Management Table */}
      <Card className="bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-lg font-semibold dark:text-gray-100">Follow-up Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b dark:border-gray-700">
                  <th className="text-left p-3 font-medium dark:text-gray-100">Client Name</th>
                  <th className="text-left p-3 font-medium dark:text-gray-100">Email Address</th>
                  <th className="text-left p-3 font-medium dark:text-gray-100">Follow-up Status</th>
                  <th className="text-left p-3 font-medium dark:text-gray-100">Last Follow-up</th>
                  <th className="text-left p-3 font-medium dark:text-gray-100">Actions</th>
                </tr>
              </thead>
              <tbody>
                {followUps.map((followUp) => (
                  <tr key={followUp.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="p-3 font-medium dark:text-gray-100">{followUp.client_name}</td>
                    <td className="p-3 dark:text-gray-100">{followUp.email}</td>
                    <td className="p-3">{getFollowUpBadge(followUp.followed_up)}</td>
                    <td className="p-3 dark:text-gray-100">
                      {followUp.last_follow_up || 'N/A'}
                    </td>
                    <td className="p-3">
                      <div className="flex space-x-2">
                        {!followUp.followed_up ? (
                          <Button 
                            onClick={() => handleMarkFollowUp(followUp.id, true)}
                            size="sm"
                            variant="outline"
                            disabled={updateFollowUpMutation.isPending}
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Mark Done
                          </Button>
                        ) : (
                          <Button 
                            onClick={() => handleMarkFollowUp(followUp.id, false)}
                            size="sm"
                            variant="outline"
                            disabled={updateFollowUpMutation.isPending}
                          >
                            <XCircle className="w-3 h-3 mr-1" />
                            Mark Pending
                          </Button>
                        )}
                        <Button 
                          onClick={() => window.open(`mailto:${followUp.email}`, '_blank')}
                          size="sm"
                          variant="outline"
                        >
                          <Mail className="w-3 h-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Forms and Dialogs */}
      {showInvoiceForm && (
        <InvoiceForm
          invoice={editingInvoice}
          onSubmit={(data) => {
            if (editingInvoice && editingInvoice.id) {
              handleUpdateInvoice(data);
            } else {
              handleCreateInvoice(data);
            }
          }}
          onClose={() => {
            setShowInvoiceForm(false);
            setEditingInvoice(null);
          }}
          isLoading={createInvoiceMutation.isPending || updateInvoiceMutation.isPending}
        />
      )}

      {showFollowUpForm && (
        <FollowUpForm
          followUp={editingFollowUp}
          onSubmit={(data) => {
            updateFollowUpMutation.mutate({ id: editingFollowUp.id, ...data });
          }}
          onClose={() => {
            setShowFollowUpForm(false);
            setEditingFollowUp(null);
          }}
          isLoading={updateFollowUpMutation.isPending}
        />
      )}

      <InvoiceSearchDialog
        open={showInvoiceSearch}
        onClose={() => setShowInvoiceSearch(false)}
        onInvoiceSelect={handleInvoiceSelect}
      />

      <ClientSearchDialog
        open={showClientSearch}
        onClose={() => setShowClientSearch(false)}
        onClientSelect={handleClientSelect}
      />
    </div>
  );
}
