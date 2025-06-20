
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ClientData {
  id: number;
  client_name: string;
  email_address: string | null;
  business: string | null;
  status: string | null;
  created_at: string | null;
  key_challenges: string | null;
  contacts: any;
  lead_handlings: any;
  invoice_details: any;
  onboarding_details: string | null;
  conversation: string | null;
  invoice_files: string[] | null;
}

export const useClientsData = () => {
  return useQuery({
    queryKey: ['clients'],
    queryFn: async (): Promise<ClientData[]> => {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching clients:', error);
        throw error;
      }

      return data || [];
    },
  });
};

export const useClientStats = () => {
  return useQuery({
    queryKey: ['client-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('status, created_at, invoice_details');

      if (error) {
        console.error('Error fetching client stats:', error);
        throw error;
      }

      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      const thisMonthClients = data?.filter(client => {
        if (!client.created_at) return false;
        const clientDate = new Date(client.created_at);
        return clientDate.getMonth() === currentMonth && clientDate.getFullYear() === currentYear;
      }) || [];

      const onboardedClients = data?.filter(client => 
        client.status === 'onboarded' || client.status === 'completed'
      ) || [];

      const paymentsReceived = data?.reduce((total, client) => {
        if (client.invoice_details && typeof client.invoice_details === 'object') {
          const invoiceData = client.invoice_details as any;
          if (invoiceData.amount && invoiceData.status === 'paid') {
            return total + Number(invoiceData.amount);
          }
        }
        return total;
      }, 0) || 0;

      const pendingInvoices = data?.filter(client => {
        if (client.invoice_details && typeof client.invoice_details === 'object') {
          const invoiceData = client.invoice_details as any;
          return invoiceData.status === 'pending' || invoiceData.status === 'unpaid';
        }
        return false;
      }).length || 0;

      return {
        totalLeads: thisMonthClients.length,
        clientsOnboarded: onboardedClients.length,
        paymentsReceived,
        invoicesPending: pendingInvoices
      };
    },
  });
};
