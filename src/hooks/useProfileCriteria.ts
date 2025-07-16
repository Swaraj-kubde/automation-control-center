import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useProfileCriteria() {
  const [criteria, setCriteria] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const fetchCriteria = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("profile_criteria")
        .select("criteria")
        .eq("id", 1)
        .single();

      if (error) {
        console.error("Error fetching criteria:", error);
        toast({
          title: "Error",
          description: "Failed to fetch profile criteria",
          variant: "destructive",
        });
        return;
      }

      setCriteria(data?.criteria || "");
    } catch (error) {
      console.error("Error fetching criteria:", error);
      toast({
        title: "Error",
        description: "Failed to fetch profile criteria",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateCriteria = async (newCriteria: string) => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("profile_criteria")
        .update({ criteria: newCriteria })
        .eq("id", 1);

      if (error) {
        console.error("Error updating criteria:", error);
        toast({
          title: "Error",
          description: "Failed to update profile criteria",
          variant: "destructive",
        });
        return false;
      }

      setCriteria(newCriteria);
      toast({
        title: "Success",
        description: "Profile criteria updated successfully",
      });
      return true;
    } catch (error) {
      console.error("Error updating criteria:", error);
      toast({
        title: "Error",
        description: "Failed to update profile criteria",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    fetchCriteria();
  }, []);

  return {
    criteria,
    isLoading,
    isSaving,
    updateCriteria,
    refetch: fetchCriteria,
  };
}