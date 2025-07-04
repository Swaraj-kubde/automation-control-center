import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { useClientsData } from "@/hooks/useClientsData";

export function InvoiceForm({ invoice, onSubmit, onClose, isLoading }) {
  const { data: clients = [] } = useClientsData();
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
  const [errors, setErrors] = useState({});

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
    }
    setErrors({});
  }, [invoice]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.client_name.trim()) {
      newErrors.client_name = "Client name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!formData.amount.trim()) {
      newErrors.amount = "Amount is required";
    } else if (isNaN(parseFloat(formData.amount)) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Please enter a valid amount";
    }
    
    if (!formData.invoice_date) {
      newErrors.invoice_date = "Invoice date is required";
    }
    
    if (!formData.due_date) {
      newErrors.due_date = "Due date is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const submitData = {
      ...formData,
      amount: formData.amount ? parseFloat(formData.amount) : null,
      deal_id: formData.deal_id ? parseInt(formData.deal_id) : null,
    };
    onSubmit(submitData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleClientSelect = (e) => {
    const clientId = e.target.value;
    if (clientId) {
      const selectedClient = clients.find(c => c.client_id.toString() === clientId);
      if (selectedClient) {
        setFormData(prev => ({
          ...prev,
          deal_id: selectedClient.client_id,
          client_name: selectedClient.client_name,
          email: selectedClient.email_address || "",
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        deal_id: null,
        client_name: "",
        email: "",
      }));
    }
  };

  const handleCancel = () => {
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
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="bg-white dark:bg-gray-800 w-full max-w-md mx-auto max-h-[95vh] flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between flex-shrink-0">
          <CardTitle className="text-lg font-semibold dark:text-gray-100">
            {invoice && invoice.id ? "Edit Invoice" : "Add New Invoice"}
          </CardTitle>
          <Button onClick={handleCancel} size="sm" variant="ghost">
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="client_select" className="dark:text-gray-100">Select Client (Optional)</Label>
              <select
                id="client_select"
                onChange={handleClientSelect}
                value={formData.deal_id || ""}
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
                className={`dark:bg-gray-700 dark:text-gray-100 ${errors.client_name ? 'border-red-500' : ''}`}
              />
              {errors.client_name && <p className="text-red-500 text-sm">{errors.client_name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="dark:text-gray-100">Email Address *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={`dark:bg-gray-700 dark:text-gray-100 ${errors.email ? 'border-red-500' : ''}`}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
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
              <Label htmlFor="amount" className="dark:text-gray-100">Amount *</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0.00"
                className={`dark:bg-gray-700 dark:text-gray-100 ${errors.amount ? 'border-red-500' : ''}`}
              />
              {errors.amount && <p className="text-red-500 text-sm">{errors.amount}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="invoice_date" className="dark:text-gray-100">Invoice Date *</Label>
              <Input
                id="invoice_date"
                name="invoice_date"
                type="date"
                value={formData.invoice_date}
                onChange={handleChange}
                className={`dark:bg-gray-700 dark:text-gray-100 ${errors.invoice_date ? 'border-red-500' : ''}`}
              />
              {errors.invoice_date && <p className="text-red-500 text-sm">{errors.invoice_date}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="due_date" className="dark:text-gray-100">Due Date *</Label>
              <Input
                id="due_date"
                name="due_date"
                type="date"
                value={formData.due_date}
                onChange={handleChange}
                className={`dark:bg-gray-700 dark:text-gray-100 ${errors.due_date ? 'border-red-500' : ''}`}
              />
              {errors.due_date && <p className="text-red-500 text-sm">{errors.due_date}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status" className="dark:text-gray-100">Status</Label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
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

            <div className="flex justify-between space-x-3 pt-4 sticky bottom-0 bg-white dark:bg-gray-800 pb-2">
              <Button 
                type="button" 
                onClick={handleCancel} 
                variant="outline" 
                className="flex-1 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading} 
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                {isLoading ? "Saving..." : (invoice && invoice.id ? "Update Invoice" : "Add Invoice")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
