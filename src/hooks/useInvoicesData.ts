
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Invoice {
  id: string;
  deal_id?: number;
  client_name: string;
  email: string;
  invoice_date: string;
  amount?: number;
  due_date?: string;
  status: 'paid' | 'unpaid' | 'pending';
  invoice_number?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface FollowUp {
  id: string;
  invoice_id: string;
  client_name: string;
  email: string;
  followed_up: boolean;
  last_follow_up?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// Fetch invoices from Supabase
export const useInvoicesData = () => {
  return useQuery({
    queryKey: ['invoices'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching invoices:', error);
        throw error;
      }
      
      return data as Invoice[];
    },
  });
};

// Fetch follow-ups from Supabase
export const useFollowUpsData = () => {
  return useQuery({
    queryKey: ['follow-ups'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('follow_ups')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching follow-ups:', error);
        throw error;
      }
      
      return data as FollowUp[];
    },
  });
};

// Search invoice by ID or invoice number
export const useSearchInvoice = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (searchTerm: string) => {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .or(`id.eq.${searchTerm},invoice_number.eq.${searchTerm}`)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error searching invoice:', error);
        throw error;
      }
      
      return data as Invoice | null;
    },
  });
};

// Create invoice
export const useCreateInvoice = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (invoiceData: Omit<Invoice, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('invoices')
        .insert([invoiceData])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating invoice:', error);
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['follow-ups'] });
    },
  });
};

// Update invoice
export const useUpdateInvoice = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...invoiceData }: Partial<Invoice> & { id: string }) => {
      const { data, error } = await supabase
        .from('invoices')
        .update(invoiceData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating invoice:', error);
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['follow-ups'] });
    },
  });
};

// Delete invoice
export const useDeleteInvoice = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('invoices')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting invoice:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['follow-ups'] });
    },
  });
};

// Update follow-up
export const useUpdateFollowUp = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...followUpData }: Partial<FollowUp> & { id: string }) => {
      const { data, error } = await supabase
        .from('follow_ups')
        .update(followUpData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating follow-up:', error);
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['follow-ups'] });
    },
  });
};
