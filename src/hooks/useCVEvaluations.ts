
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useCVEvaluations = () => {
  return useQuery({
    queryKey: ["cv-evaluations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cv_evaluations")
        .select("*")
        .order("evaluation_date", { ascending: false });

      if (error) {
        console.error("Error fetching CV evaluations:", error);
        throw error;
      }

      return data;
    },
    refetchInterval: 30000, // Auto-refresh every 30 seconds
  });
};
