
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { useClientsData } from "@/hooks/useClientsData";
import { useToast } from "@/hooks/use-toast";
import  "../styles/inovicedeco.css" // Ensure to import your custom styles for the invoicer

export function InvoiceForm({ invoice, onSubmit, onClose, isLoading }) {
  const { data: clients = [] } = useClientsData();
  const { toast } = useToast();
  const [selectedClientId, setSelectedClientId] = useState("");
  const [formData, setFormData] = useState({
    deal_id: null,
    client_name: "",
    email: "",
    invoice_date: "",
    amount: "",
    due_date: "",
    status: "unpaid",
    invoice_number: "",
    notes: "",
  });

  useEffect(() => {
    if (invoice) {
      setFormData({
        deal_id: invoice.deal_id || invoice.client_id || null,
        client_name: invoice.client_name || "",
        email: invoice.email || "",
        invoice_date: invoice.invoice_date || "",
        amount: invoice.amount ? invoice.amount.toString() : "",
        due_date: invoice.due_date || "",
        status: invoice.status || "unpaid",
        invoice_number: invoice.invoice_number || "",
        notes: invoice.notes || "",
      });
      // Set selected client ID for editing
      if (invoice.deal_id || invoice.client_id) {
        setSelectedClientId((invoice.deal_id || invoice.client_id).toString());
      }
    } else {
      // Reset form for new invoice
      setFormData({
        deal_id: null,
        client_name: "",
        email: "",
        invoice_date: new Date().toISOString().split('T')[0],
        amount: "",
        due_date: "",
        status: "unpaid",
        invoice_number: "",
        notes: "",
      });
      setSelectedClientId("");
    }
  }, [invoice]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.client_name.trim()) {
      toast({
        title: "Validation Error",
        description: "Client name is required",
        variant: "destructive",
      });
      return;
    }

    if (!formData.email.trim()) {
      toast({
        title: "Validation Error",
        description: "Email is required",
        variant: "destructive",
      });
      return;
    }

    if (!formData.invoice_date) {
      toast({
        title: "Validation Error",
        description: "Invoice date is required",
        variant: "destructive",
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    try {
      const submitData = {
        ...formData,
        amount: formData.amount ? parseFloat(formData.amount) : null,
        deal_id: formData.deal_id ? parseInt(formData.deal_id) : null,
        // Set due_date to null if empty to avoid date format errors
        due_date: formData.due_date ? formData.due_date : null,
      };

      console.log('Submitting invoice data:', submitData);
      
      await onSubmit(submitData);
      
      toast({
        title: "Success",
        description: invoice && invoice.id ? "Invoice updated successfully!" : "Invoice created successfully!",
      });
      
      onClose();
    } catch (error) {
      console.error('Error submitting invoice:', error);
      toast({
        title: "Error",
        description: "Failed to save invoice. Please check all fields and try again.",
        variant: "destructive",
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleClientSelect = (e) => {
    const clientId = e.target.value;
    setSelectedClientId(clientId);
    
    if (clientId) {
      const selectedClient = clients.find(c => c.client_id.toString() === clientId);
      if (selectedClient) {
        console.log('Selected client:', selectedClient);
        // Update form data immediately with client information
        setFormData(prev => ({
          ...prev,
          deal_id: selectedClient.client_id,
          client_name: selectedClient.client_name || "",
          email: selectedClient.email_address || "",
        }));
      }
    } else {
      // Clear client-related fields when no client is selected
      setFormData(prev => ({
        ...prev,
        deal_id: null,
        client_name: "",
        email: "",
      }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="bg-white dark:bg-gray-800 invoicer overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold dark:text-gray-100">
            {invoice && invoice.id ? "Edit Invoice" : "Add New Invoice"}
          </CardTitle>
          <Button onClick={onClose} size="sm" variant="ghost">
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="client_select" className="dark:text-gray-100">Select Client (Optional)</Label>
              <select
                id="client_select"
                onChange={handleClientSelect}
                value={selectedClientId}
                className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
              >
                <option value="">-- Select Client --</option>
                {clients.map((client) => (
                  <option key={client.client_id} value={client.client_id}>
                    {client.client_name} ({client.client_id})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="client_name" className="dark:text-gray-100">Client Name *</Label>
              <Input
                id="client_name"
                name="client_name"
                type="text"
                value={formData.client_name}
                onChange={handleChange}
                required
                className="dark:bg-gray-700 dark:text-gray-100"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="dark:text-gray-100">Email Address *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="dark:bg-gray-700 dark:text-gray-100"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="invoice_number" className="dark:text-gray-100">Invoice Number</Label>
              <Input
                id="invoice_number"
                name="invoice_number"
                type="text"
                value={formData.invoice_number}
                onChange={handleChange}
                placeholder="Leave empty for auto-generation"
                className="dark:bg-gray-700 dark:text-gray-100"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount" className="dark:text-gray-100">Amount</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0.00"
                className="dark:bg-gray-700 dark:text-gray-100"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="invoice_date" className="dark:text-gray-100">Invoice Date *</Label>
              <Input
                id="invoice_date"
                name="invoice_date"
                type="date"
                value={formData.invoice_date}
                onChange={handleChange}
                required
                className="dark:bg-gray-700 dark:text-gray-100"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="due_date" className="dark:text-gray-100">Due Date</Label>
              <Input
                id="due_date"
                name="due_date"
                type="date"
                value={formData.due_date}
                onChange={handleChange}
                className="dark:bg-gray-700 dark:text-gray-100"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status" className="dark:text-gray-100">Status</Label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                required
              >
                <option value="unpaid">Unpaid</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes" className="dark:text-gray-100">Notes</Label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                placeholder="Additional notes..."
              />
            </div>

            <div className="flex space-x-2 pt-4">
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? "Saving..." : (invoice && invoice.id ? "Update Invoice" : "Create Invoice")}
              </Button>
              <Button type="button" onClick={onClose} variant="outline" className="flex-1">
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
