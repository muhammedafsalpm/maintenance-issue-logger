'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import IssueTable from '@/components/IssueTable';
import DarkModeToggle from '@/components/DarkModeToggle';
import ExportCSV from '@/components/ExportCSV';
import Toast from '@/components/Toast';
import { Wrench, PlusCircle, Clock, CheckCircle2 } from 'lucide-react';

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
        showToast(`Status updated to ${newStatus}`);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      showToast('Update failed', 'error');
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
    <div className="min-h-screen transition-all duration-500 pb-20">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        {/* Refined Header */}
        <header className="py-10 md:py-12 animate-fade-up">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-0.5 bg-blue-600/10 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase tracking-wider rounded-full border border-blue-600/10">
                  Property Suite
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2">
                Maintenance <span className="text-blue-600">Logger</span>
              </h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-sm max-w-md">
                Streamlined tracking and reporting for all Deluxe Stays properties.
              </p>
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto">
              <ExportCSV data={issues} />
              <Link href="/submit" className="btn-primary flex-1 md:flex-none">
                <PlusCircle className="h-4 w-4" />
                <span>New Request</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Stats Grid - Smaller & Clean */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { label: 'Active Tasks', value: stats.open, icon: Clock, color: 'blue' },
            { label: 'In Repair', value: stats.inProgress, icon: Wrench, color: 'purple' },
            { label: 'Completed', value: stats.resolved, icon: CheckCircle2, color: 'green' }
          ].map((stat, i) => (
            <div key={stat.label} className="card-premium p-6 py-8 animate-fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">{stat.label}</h3>
                  <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-2xl bg-${stat.color}-500/10 text-${stat.color}-600 dark:text-${stat.color}-500`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Table Section */}
        <div className="animate-fade-up" style={{ animationDelay: '0.3s' }}>
          {loading ? (
            <div className="card-premium p-20 flex flex-col items-center justify-center">
              <div className="h-8 w-8 rounded-full border-2 border-slate-200 dark:border-slate-800 border-t-blue-600 animate-spin"></div>
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
      </div>
      
      <DarkModeToggle />
    </div>
  );
}
