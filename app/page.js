'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import IssueTable from '@/components/IssueTable';
import DarkModeToggle from '@/components/DarkModeToggle';
import ExportCSV from '@/components/ExportCSV';
import Toast from '@/components/Toast';
import { Wrench, PlusCircle, BarChart3, RefreshCw } from 'lucide-react';

export default function Dashboard() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ property: '', urgency: '' });
  const [stats, setStats] = useState({ open: 0, inProgress: 0, resolved: 0 });
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const fetchIssues = async () => {
    setLoading(true);
    try {
      let url = '/api/issues?';
      if (filters.property) url += `property=${encodeURIComponent(filters.property)}&`;
      if (filters.urgency) url += `urgency=${encodeURIComponent(filters.urgency)}&`;
      
      const response = await fetch(url);
      const result = await response.json();
      if (result.success) {
        setIssues(result.data);
        
        const open = result.data.filter(i => i.status === 'Open').length;
        const inProgress = result.data.filter(i => i.status === 'In Progress').length;
        const resolved = result.data.filter(i => i.status === 'Resolved').length;
        setStats({ open, inProgress, resolved });
      }
    } catch (error) {
      console.error('Error fetching issues:', error);
      showToast('Failed to load issues', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, [filters]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await fetch('/api/update-status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      
      if (response.ok) {
        fetchIssues();
        showToast(`Status updated to ${newStatus}`, 'success');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      showToast('Failed to update status', 'error');
    }
  };

  const handleFilterChange = (type, value) => {
    if (type === 'clear') {
      setFilters({ property: '', urgency: '' });
    } else {
      setFilters(prev => ({ ...prev, [type]: value }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-800 dark:to-blue-900 text-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Wrench className="h-8 w-8" />
                <h1 className="text-2xl font-bold">Maintenance Issue Logger</h1>
              </div>
              <p className="text-blue-100 dark:text-blue-200">Track and manage property maintenance requests</p>
            </div>
            <div className="flex gap-3">
              <ExportCSV data={issues} filename="maintenance-issues" />
              <Link
                href="/submit"
                className="flex items-center gap-2 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 px-5 py-2.5 rounded-lg font-medium hover:bg-blue-50 dark:hover:bg-gray-700 transition shadow-lg"
              >
                <PlusCircle className="h-5 w-5" />
                Report New Issue
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="max-w-6xl mx-auto px-4 -mt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border-l-4 border-blue-500 animate-fade-up">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Open Issues</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.open}</p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border-l-4 border-purple-500 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">In Progress</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.inProgress}</p>
              </div>
              <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full">
                <Wrench className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border-l-4 border-green-500 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Resolved</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.resolved}</p>
              </div>
              <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
                <RefreshCw className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 pb-12">
        {loading ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto"></div>
            <p className="mt-4 text-gray-500 dark:text-gray-400">Loading issues...</p>
          </div>
        ) : (
          <IssueTable
            issues={issues}
            onStatusChange={handleStatusChange}
            onFilterChange={handleFilterChange}
            filters={filters}
          />
        )}
      </div>
      
      <DarkModeToggle />
    </div>
  );
}
