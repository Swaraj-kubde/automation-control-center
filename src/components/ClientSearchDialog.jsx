
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Plus, X } from "lucide-react";
import { useClientsData } from "@/hooks/useClientsData";

export function ClientSearchDialog({ open, onClose, onClientSelect }) {
  const [searchId, setSearchId] = useState("");
  const [selectedClient, setSelectedClient] = useState(null);
  const { data: clients = [] } = useClientsData();

  const handleSearch = () => {
    if (!searchId.trim()) return;
    
    const client = clients.find(c => c.client_id.toString() === searchId.trim());
    setSelectedClient(client || null);
  };

  const handleAddClient = () => {
    if (selectedClient) {
      console.log('Adding client to invoice:', selectedClient);
      // Map client data to invoice format
      const invoiceData = {
        client_name: selectedClient.client_name,
        email: selectedClient.email_address || "",
        invoice_date: new Date().toISOString().split('T')[0],
        status: "unpaid",
        client_id: selectedClient.client_id,
        deal_id: selectedClient.client_id
      };
      console.log('Mapped invoice data:', invoiceData);
      onClientSelect(invoiceData);
      handleClose();
    }
  };

  const handleClose = () => {
    setSearchId("");
    setSelectedClient(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Search Client by ID
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="clientId">Client ID</Label>
              <Input
                id="clientId"
                type="number"
                placeholder="Enter client ID..."
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleSearch} size="default">
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {searchId && !selectedClient && (
            <div className="text-center py-4 text-gray-500">
              No client found with ID: {searchId}
            </div>
          )}

          {selectedClient && (
            <Card className="border-green-200 bg-green-50">
              <CardContent className="pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg text-green-800">{selectedClient.client_name}</h3>
                      <p className="text-sm text-green-600">ID: {selectedClient.client_id}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-2 text-sm">
                    <div>
                      <span className="font-medium">Email:</span> {selectedClient.email_address || 'N/A'}
                    </div>
                    <div>
                      <span className="font-medium">Business:</span> {selectedClient.business || 'N/A'}
                    </div>
                    <div>
                      <span className="font-medium">Status:</span> {selectedClient.status || 'N/A'}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-3">
                    <Button 
                      onClick={handleAddClient}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      size="sm"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add to Invoice
                    </Button>
                    <Button 
                      onClick={handleClose}
                      variant="outline"
                      size="sm"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
