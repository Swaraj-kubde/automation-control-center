
import { useState, useMemo } from 'react';
import type { ClientData } from './useClientsData';

interface Filters {
  dateFrom: string;
  dateTo: string;
  clientInfo: string;
  contact: string;
}

export function useClientTableFilters(clients: ClientData[]) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [filters, setFilters] = useState<Filters>({
    dateFrom: '',
    dateTo: '',
    clientInfo: '',
    contact: ''
  });

  const filteredClients = useMemo(() => {
    return clients.filter(client => {
      // Date filter
      if (filters.dateFrom || filters.dateTo) {
        const clientDate = new Date(client.created_at || '');
        if (filters.dateFrom && clientDate < new Date(filters.dateFrom)) return false;
        if (filters.dateTo && clientDate > new Date(filters.dateTo)) return false;
      }

      // Client info filter (name or business)
      if (filters.clientInfo) {
        const searchTerm = filters.clientInfo.toLowerCase();
        const nameMatch = client.client_name?.toLowerCase().includes(searchTerm);
        const businessMatch = client.business?.toLowerCase().includes(searchTerm);
        if (!nameMatch && !businessMatch) return false;
      }

      // Contact filter (email or phone)
      if (filters.contact) {
        const searchTerm = filters.contact.toLowerCase();
        const emailMatch = client.email_address?.toLowerCase().includes(searchTerm);
        const phoneMatch = client.contacts?.phone?.toLowerCase().includes(searchTerm);
        if (!emailMatch && !phoneMatch) return false;
      }

      return true;
    });
  }, [clients, filters]);

  const paginatedClients = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredClients.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredClients, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);

  const resetFilters = () => {
    setFilters({
      dateFrom: '',
      dateTo: '',
      clientInfo: '',
      contact: ''
    });
    setCurrentPage(1);
  };

  const exportToCSV = () => {
    const headers = [
      'Client ID',
      'Client Name',
      'Email',
      'Phone',
      'Business',
      'Key Challenges',
      'Lead Handling',
      'Status',
      'Submitted Date'
    ];

    const csvData = filteredClients.map(client => [
      client.client_id,
      client.client_name,
      client.email_address || '',
      client.contacts?.phone || '',
      client.business || '',
      client.key_challenges || '',
      client.lead_handlings?.description || '',
      client.status || 'pending',
      new Date(client.created_at || '').toLocaleDateString()
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `client-onboarding-submissions-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return {
    paginatedClients,
    currentPage,
    totalPages,
    setCurrentPage,
    filters,
    setFilters,
    resetFilters,
    exportToCSV,
    filteredCount: filteredClients.length,
    totalCount: clients.length
  };
}
