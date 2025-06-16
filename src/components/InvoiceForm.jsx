
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

export function InvoiceForm({ invoice, onSubmit, onClose, isLoading }) {
  const [formData, setFormData] = useState({
    client_name: "",
    email: "",
    invoice_date: "",
    status: "unpaid",
  });

  useEffect(() => {
    if (invoice) {
      setFormData(invoice);
    }
  }, [invoice]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="bg-white dark:bg-gray-800 w-full max-w-md mx-4">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold dark:text-gray-100">
            {invoice ? "Edit Invoice" : "Add New Invoice"}
          </CardTitle>
          <Button onClick={onClose} size="sm" variant="ghost">
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="client_name" className="dark:text-gray-100">Client Name</Label>
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
              <Label htmlFor="email" className="dark:text-gray-100">Email Address</Label>
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
              <Label htmlFor="invoice_date" className="dark:text-gray-100">Invoice Date Sent</Label>
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
              </select>
            </div>

            <div className="flex space-x-2 pt-4">
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? "Saving..." : (invoice ? "Update" : "Create")}
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
