
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Plus, X } from "lucide-react";
import { useSearchInvoice } from "@/hooks/useInvoicesData";

export function InvoiceSearchDialog({ open, onClose, onInvoiceSelect }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const searchMutation = useSearchInvoice();

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setHasSearched(true);
    try {
      const result = await searchMutation.mutateAsync(searchTerm.trim());
      setSearchResult(result);
    } catch (error) {
      setSearchResult(null);
    }
  };

  const handleSelectInvoice = () => {
    if (searchResult) {
      onInvoiceSelect(searchResult);
      handleClose();
    }
  };

  const handleClose = () => {
    setSearchTerm("");
    setSearchResult(null);
    setHasSearched(false);
    onClose();
  };

  const formatCurrency = (amount) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Search Invoice
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="searchTerm">Invoice ID or Number</Label>
              <Input
                id="searchTerm"
                type="text"
                placeholder="Enter invoice ID or number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <div className="flex items-end">
              <Button 
                onClick={handleSearch} 
                size="default"
                disabled={searchMutation.isPending}
              >
                {searchMutation.isPending ? "..." : <Search className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {hasSearched && !searchResult && !searchMutation.isPending && (
            <div className="text-center py-4 text-gray-500">
              No invoice found with: {searchTerm}
            </div>
          )}

          {searchResult && (
            <Card className="border-green-200">
              <CardContent className="pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{searchResult.client_name}</h3>
                      <p className="text-sm text-gray-600">
                        ID: {searchResult.id.substring(0, 8)}...
                      </p>
                      {searchResult.invoice_number && (
                        <p className="text-sm text-gray-600">
                          Number: {searchResult.invoice_number}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-2 text-sm">
                    <div>
                      <span className="font-medium">Email:</span> {searchResult.email}
                    </div>
                    <div>
                      <span className="font-medium">Amount:</span> {formatCurrency(searchResult.amount)}
                    </div>
                    <div>
                      <span className="font-medium">Status:</span> {searchResult.status}
                    </div>
                    <div>
                      <span className="font-medium">Date:</span> {searchResult.invoice_date}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-3">
                    <Button 
                      onClick={handleSelectInvoice}
                      className="flex-1"
                      size="sm"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Edit Invoice
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
