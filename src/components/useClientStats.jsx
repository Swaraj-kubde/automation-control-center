import { useEffect, useState } from "react";
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(
  'https://lhotzltrakfnmbjsxlif.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxob3R6bHRyYWtmbm1ianN4bGlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwNTU1MzksImV4cCI6MjA2NTYzMTUzOX0.Ao95MYjZLeFTFfZ5oDAUk1OzMwAxyvf04KxEDVDhdHc'
);

export function useClientStats() {
  const [data, setData] = useState({
    totalLeads: 0,
    paymentsReceived: 0,
    invoicesPending: 0,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get total leads
        const { count: leadsCount } = await supabase
          .from("leads")
          .select("*", { count: "exact", head: true });

        // Get all payments (assume there's an amount field)
        const { data: paymentsData } = await supabase
          .from("payments")
          .select("amount");

        const totalPayments = paymentsData?.reduce(
          (sum, p) => sum + (p.amount || 0),
          0
        );

        // Get pending invoices (assume status field exists)
        const { data: invoicesData } = await supabase
          .from("invoices")
          .select("status");

        const pendingInvoices = invoicesData?.filter(
          (invoice) => invoice.status === "pending"
        ).length;

        setData({
          totalLeads: leadsCount || 0,
          paymentsReceived: totalPayments || 0,
          invoicesPending: pendingInvoices || 0,
        });
      } catch (err) {
        console.error("Error fetching client stats:", err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { data, isLoading, error };
}