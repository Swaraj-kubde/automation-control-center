
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit, Trash2, Mail, CheckCircle, XCircle } from "lucide-react";
import { InvoiceForm } from "./InvoiceForm";
import { FollowUpForm } from "./FollowUpForm";

// API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

// Fetch invoices from API
const fetchInvoices = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/invoices-management`);
    if (!response.ok) throw new Error('Failed to fetch invoices');
    return await response.json();
  } catch (error) {
    console.error('Error fetching invoices:', error);
    // Fallback data for development
    return [
      {
        id: 1,
        client_name: "Acme Corp",
        email: "john@acmecorp.com",
        invoice_date: "2024-06-15",
        status: "paid",
      },
      {
        id: 2,
        client_name: "Tech Solutions LLC",
        email: "sarah@techsolutions.com",
        invoice_date: "2024-06-12",
        status: "unpaid",
      },
    ];
  }
};

// Fetch follow-ups from API
const fetchFollowUps = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/follow-ups`);
    if (!response.ok) throw new Error('Failed to fetch follow-ups');
    return await response.json();
  } catch (error) {
    console.error('Error fetching follow-ups:', error);
    // Fallback data for development
    return [
      {
        id: 1,
        client_name: "Tech Solutions LLC",
        email: "sarah@techsolutions.com",
        followed_up: false,
        last_follow_up: null,
      },
      {
        id: 2,
        client_name: "Digital Marketing Co",
        email: "mike@digitalmarketing.co",
        followed_up: true,
        last_follow_up: "2024-06-14",
      },
    ];
  }
};

// CRUD operations for invoices
const createInvoice = async (invoiceData) => {
  const response = await fetch(`${API_BASE_URL}/invoices-management`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(invoiceData),
  });
  if (!response.ok) throw new Error('Failed to create invoice');
  return response.json();
};

const updateInvoice = async ({ id, ...invoiceData }) => {
  const response = await fetch(`${API_BASE_URL}/invoices-management/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(invoiceData),
  });
  if (!response.ok) throw new Error('Failed to update invoice');
  return response.json();
};

const deleteInvoice = async (id) => {
  const response = await fetch(`${API_BASE_URL}/invoices-management/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete invoice');
  return response.json();
};

// CRUD operations for follow-ups
const updateFollowUp = async ({ id, ...followUpData }) => {
  const response = await fetch(`${API_BASE_URL}/follow-ups/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(followUpData),
  });
  if (!response.ok) throw new Error('Failed to update follow-up');
  return response.json();
};

export function InvoiceManagement() {
  const queryClient = useQueryClient();
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [showFollowUpForm, setShowFollowUpForm] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [editingFollowUp, setEditingFollowUp] = useState(null);

  // Queries
  const { data: invoices = [], isLoading: invoicesLoading } = useQuery({
    queryKey: ['invoices-management'],
    queryFn: fetchInvoices,
  });

  const { data: followUps = [], isLoading: followUpsLoading } = useQuery({
    queryKey: ['follow-ups'],
    queryFn: fetchFollowUps,
  });

  // Mutations for invoices
  const createInvoiceMutation = useMutation({
    mutationFn: createInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices-management'] });
      setShowInvoiceForm(false);
    },
  });

  const updateInvoiceMutation = useMutation({
    mutationFn: updateInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices-management'] });
      setEditingInvoice(null);
      setShowInvoiceForm(false);
    },
  });

  const deleteInvoiceMutation = useMutation({
    mutationFn: deleteInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices-management'] });
    },
  });

  // Mutations for follow-ups
  const updateFollowUpMutation = useMutation({
    mutationFn: updateFollowUp,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['follow-ups'] });
      setEditingFollowUp(null);
      setShowFollowUpForm(false);
    },
  });

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

  const getStatusBadge = (status) => {
    return (
      <Badge className={
        status === "paid" 
          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" 
          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      }>
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
          <Button onClick={() => setShowInvoiceForm(true)} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Invoice
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b dark:border-gray-700">
                  <th className="text-left p-3 font-medium dark:text-gray-100">Client</th>
                  <th className="text-left p-3 font-medium dark:text-gray-100">Email Address</th>
                  <th className="text-left p-3 font-medium dark:text-gray-100">Invoice Date Sent</th>
                  <th className="text-left p-3 font-medium dark:text-gray-100">Status</th>
                  <th className="text-left p-3 font-medium dark:text-gray-100">Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="p-3 font-medium dark:text-gray-100">{invoice.client_name}</td>
                    <td className="p-3 dark:text-gray-100">{invoice.email}</td>
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

      {/* Forms */}
      {showInvoiceForm && (
        <InvoiceForm
          invoice={editingInvoice}
          onSubmit={(data) => {
            if (editingInvoice) {
              updateInvoiceMutation.mutate({ id: editingInvoice.id, ...data });
            } else {
              createInvoiceMutation.mutate(data);
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
    </div>
  );
}
