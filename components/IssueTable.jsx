'use client';

import UrgencyBadge from './UrgencyBadge';
import { formatDate } from '@/lib/dateUtils';
import { Filter, X, Search, ChevronDown } from 'lucide-react';

const properties = [
  'All',
  'Sunset Apartments',
  'Harbor View Towers',
  'Mountain Heights',
  'Riverfront Suites',
  'Downtown Lofts'
];

const urgencies = ['All', 'Low', 'Medium', 'High'];

const statusColors = {
  'Open': 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400 border-blue-200 dark:border-blue-500/30',
  'In Progress': 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400 border-purple-200 dark:border-purple-500/30',
  'Resolved': 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400 border-green-200 dark:border-green-500/30'
};

export default function IssueTable({ issues, onStatusChange, onFilterChange, filters }) {
  const activeFilters = [];
  if (filters.property) activeFilters.push(`Property: ${filters.property}`);
  if (filters.urgency) activeFilters.push(`Urgency: ${filters.urgency}`);

  return (
    <div className="space-y-8">
      {/* Filters Section */}
      <div className="card-premium p-6 glass border-none shadow-none md:shadow-xl">
        <div className="flex flex-wrap items-end gap-6">
          <div className="flex-1 min-w-[240px] space-y-2">
            <label className="text-xs font-bold uppercase tracking-[2px] text-slate-500 dark:text-slate-400 ml-1">Filter Property</label>
            <div className="relative">
              <select
                value={filters.property}
                onChange={(e) => onFilterChange('property', e.target.value)}
                className="w-full h-14 pl-5 pr-12 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-4 focus:ring-blue-500/20 transition-all appearance-none font-semibold text-slate-800 dark:text-slate-200 outline-none"
              >
                {properties.map(p => (
                  <option key={p} value={p === 'All' ? '' : p}>{p}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
            </div>
          </div>
          
          <div className="flex-1 min-w-[240px] space-y-2">
            <label className="text-xs font-bold uppercase tracking-[2px] text-slate-500 dark:text-slate-400 ml-1">Filter Urgency</label>
            <div className="relative">
              <select
                value={filters.urgency}
                onChange={(e) => onFilterChange('urgency', e.target.value)}
                className="w-full h-14 pl-5 pr-12 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-4 focus:ring-blue-500/20 transition-all appearance-none font-semibold text-slate-800 dark:text-slate-200 outline-none"
              >
                {urgencies.map(u => (
                  <option key={u} value={u === 'All' ? '' : u}>{u}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {activeFilters.length > 0 && (
            <button
              onClick={() => onFilterChange('clear', '')}
              className="h-14 px-6 text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 transition-colors flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Reset Filters
            </button>
          )}
        </div>
      </div>
      
      {/* Table Content */}
      <div className="card-premium overflow-hidden border-none md:shadow-2xl">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-800">
            <thead className="bg-slate-50/50 dark:bg-slate-900/50">
              <tr>
                <th className="px-8 py-5 text-left text-xs font-black uppercase tracking-[2px] text-slate-400">Reference</th>
                <th className="px-8 py-5 text-left text-xs font-black uppercase tracking-[2px] text-slate-400">Property Details</th>
                <th className="px-8 py-5 text-left text-xs font-black uppercase tracking-[2px] text-slate-400">Category</th>
                <th className="px-8 py-5 text-left text-xs font-black uppercase tracking-[2px] text-slate-400">Priority</th>
                <th className="px-8 py-5 text-left text-xs font-black uppercase tracking-[2px] text-slate-400">Timestamp</th>
                <th className="px-8 py-5 text-left text-xs font-black uppercase tracking-[2px] text-slate-400">Current Status</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-50 dark:divide-slate-800/50">
              {issues.map((issue) => (
                <tr key={issue.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-8 py-6 whitespace-nowrap">
                    <span className="font-mono text-sm font-black text-blue-600 bg-blue-500/10 px-3 py-1.5 rounded-xl border border-blue-500/20">
                      {issue.ticket_number}
                    </span>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap text-sm font-bold text-slate-800 dark:text-slate-200">
                    {issue.property_name}
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap text-sm font-semibold">
                    <span className="text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl">
                      {issue.category}
                    </span>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap">
                    <UrgencyBadge urgency={issue.urgency} />
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap text-sm font-semibold text-slate-500 dark:text-slate-500">
                    {formatDate(issue.created_at)}
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap">
                    <div className="relative group/select">
                      <select
                        value={issue.status}
                        onChange={(e) => onStatusChange(issue.id, e.target.value)}
                        className={`pl-4 pr-10 py-2.5 rounded-2xl text-xs font-black uppercase border appearance-none cursor-pointer transition-all outline-none
                          ${statusColors[issue.status]}`}
                      >
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 opacity-60 pointer-events-none" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {issues.length === 0 && (
            <div className="text-center py-24 animate-fade-up">
              <div className="h-20 w-20 bg-slate-100 dark:bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-10 w-10 text-slate-300 dark:text-slate-600" />
              </div>
              <p className="text-xl font-bold text-slate-800 dark:text-slate-200">No issues found</p>
              <p className="text-slate-500 dark:text-slate-500 mt-2 font-medium">Try refining your search or filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
