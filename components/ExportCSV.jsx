'use client';

import { useState } from 'react';
import { Download, FileSpreadsheet, CheckCircle } from 'lucide-react';

export default function ExportCSV({ data, filename = 'maintenance-issues' }) {
  const [exporting, setExporting] = useState(false);
  const [exported, setExported] = useState(false);

  const exportToCSV = () => {
    if (!data || data.length === 0) return;
    
    setExporting(true);
    
    setTimeout(() => {
      // Define headers
      const headers = ['Ticket #', 'Property', 'Category', 'Urgency', 'Description', 'Status', 'Date Submitted', 'Photo URL'];
      
      // Convert data to CSV rows
      const rows = data.map(item => [
        item.ticket_number,
        item.property_name,
        item.category,
        item.urgency,
        item.description?.replace(/,/g, ' ').replace(/\n/g, ' '),
        item.status,
        new Date(item.created_at).toLocaleDateString(),
        item.photo_url || ''
      ]);
      
      // Create CSV content
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell || ''}"`).join(','))
      ].join('\n');
      
      // Add UTF-8 BOM for proper encoding
      const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${filename}-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setExporting(false);
      setExported(true);
      setTimeout(() => setExported(false), 2000);
    }, 500);
  };

  return (
    <button
      onClick={exportToCSV}
      disabled={exporting || data.length === 0}
      className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all transform hover:scale-[1.02] shadow-sm"
    >
      {exporting ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
          Exporting...
        </>
      ) : exported ? (
        <>
          <CheckCircle className="h-4 w-4" />
          Exported!
        </>
      ) : (
        <>
          <FileSpreadsheet className="h-4 w-4" />
          Export to CSV
        </>
      )}
    </button>
  );
}
