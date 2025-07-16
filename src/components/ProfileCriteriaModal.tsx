import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface ProfileCriteriaModalProps {
  isOpen: boolean;
  onClose: () => void;
  criteria: string;
  onSave: (newCriteria: string) => Promise<boolean>;
  isSaving: boolean;
}

export function ProfileCriteriaModal({
  isOpen,
  onClose,
  criteria,
  onSave,
  isSaving,
}: ProfileCriteriaModalProps) {
  const [editedCriteria, setEditedCriteria] = useState(criteria);

  const handleSave = async () => {
    if (editedCriteria.trim() === "") {
      return;
    }

    const success = await onSave(editedCriteria.trim());
    if (success) {
      onClose();
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setEditedCriteria(criteria); // Reset to original value when closing
      onClose();
    }
  };

  // Update local state when criteria prop changes
  useEffect(() => {
    setEditedCriteria(criteria);
  }, [criteria]);

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Set Profile Criteria</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="criteria">
              Profile Criteria Description
            </Label>
            <Textarea
              id="criteria"
              placeholder="Describe the ideal profile..."
              value={editedCriteria}
              onChange={(e) => setEditedCriteria(e.target.value)}
              className="min-h-[120px] resize-none"
              disabled={isSaving}
            />
          </div>
          
          <p className="text-sm text-muted-foreground">
            This criteria will be used automatically when evaluating CVs through the AI system.
          </p>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving || editedCriteria.trim() === ""}
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}