'use client';

import UrgencyBadge from './UrgencyBadge';
import StatusBadge from './StatusBadge';
import { formatDate } from '@/lib/dateUtils';
import { Search, Filter, X } from 'lucide-react';

const properties = [
  'All',
  'Sunset Apartments',
  'Harbor View Towers',
  'Mountain Heights',
  'Riverfront Suites',
  'Downtown Lofts'
];

const urgencies = ['All', 'Low', 'Medium', 'High'];

export default function IssueTable({ issues, onStatusChange, onFilterChange, filters }) {
  const activeFilters = [];
  if (filters.property) activeFilters.push(`Property: ${filters.property}`);
  if (filters.urgency) activeFilters.push(`Urgency: ${filters.urgency}`);

  return (
    <div className="space-y-6">
      {/* Filters Section */}
      <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-5 w-5 text-gray-500" />
          <h3 className="font-semibold text-gray-700">Filter Issues</h3>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Property</label>
            <select
              value={filters.property}
              onChange={(e) => onFilterChange('property', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {properties.map(p => (
                <option key={p} value={p === 'All' ? '' : p}>{p}</option>
              ))}
            </select>
          </div>
          
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Urgency</label>
            <select
              value={filters.urgency}
              onChange={(e) => onFilterChange('urgency', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {urgencies.map(u => (
                <option key={u} value={u === 'All' ? '' : u}>{u}</option>
              ))}
            </select>
          </div>
        </div>
        
        {activeFilters.length > 0 && (
          <div className="mt-4 flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-500">Active filters:</span>
            {activeFilters.map(filter => (
              <span key={filter} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs">
                {filter}
                <button
                  onClick={() => onFilterChange('clear', '')}
                  className="hover:text-blue-900"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            <button
              onClick={() => onFilterChange('clear', '')}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Clear all
            </button>
          </div>
        )}
      </div>
      
      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Ticket #</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Property</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Urgency</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date Submitted</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {issues.map((issue, index) => (
                <tr key={issue.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-mono text-sm font-medium text-blue-600">
                      {issue.ticket_number}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {issue.property_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                      {issue.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <UrgencyBadge urgency={issue.urgency} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(issue.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={issue.status}
                      onChange={(e) => onStatusChange(issue.id, e.target.value)}
                      className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white cursor-pointer hover:bg-gray-50 transition"
                    >
                      <option value="Open">📋 Open</option>
                      <option value="In Progress">⚙️ In Progress</option>
                      <option value="Resolved">✅ Resolved</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {issues.length === 0 && (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-500">No issues found</p>
              <p className="text-sm text-gray-400 mt-1">Try adjusting your filters or submit a new issue</p>
            </div>
          )}
        </div>
        
        {issues.length > 0 && (
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Showing <span className="font-medium">{issues.length}</span> issues
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
