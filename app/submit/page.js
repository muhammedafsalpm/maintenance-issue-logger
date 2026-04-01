'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { validateIssue } from '@/lib/validation';
import FileUpload from '@/components/FileUpload';
import Toast from '@/components/Toast';
import { AlertCircle, CheckCircle, ArrowLeft, Wrench, Mail } from 'lucide-react';

const properties = [
  'Sunset Apartments',
  'Harbor View Towers',
  'Mountain Heights',
  'Riverfront Suites',
  'Downtown Lofts'
];

const categories = [
  'Plumbing',
  'Electrical',
  'AC/HVAC',
  'Furniture',
  'Cleaning',
  'Other'
];

const urgencies = ['Low', 'Medium', 'High'];

const urgencyDescriptions = {
  Low: 'Non-urgent, can be scheduled for regular maintenance',
  Medium: 'Needs attention within 48 hours',
  High: 'Emergency - requires immediate attention'
};

export default function SubmitIssue() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    propertyName: '',
    category: '',
    urgency: '',
    description: '',
    email: '',
    receiveUpdates: true
  });
  const [photoData, setPhotoData] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [ticketNumber, setTicketNumber] = useState(null);
  const [submitError, setSubmitError] = useState('');
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateIssue(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      showToast('Please fix the errors in the form', 'error');
      return;
    }
    
    setSubmitting(true);
    setSubmitError('');
    
    try {
      let photoUrl = null;
      if (photoData) {
        photoUrl = photoData.url;
      }
      
      const response = await fetch('/api/issues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          photoUrl,
        }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Submission failed');
      }
      
      setTicketNumber(result.data.ticketNumber);
      
      // Send confirmation email if user provided email and wants updates
      if (formData.email && formData.receiveUpdates) {
        fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            ticketNumber: result.data.ticketNumber,
            propertyName: formData.propertyName,
            category: formData.category,
            urgency: formData.urgency,
            description: formData.description,
          })
        }).catch(err => console.error('Email error:', err));
      }
      
      showToast(`Issue submitted! Ticket: ${result.data.ticketNumber}`);
      
      setFormData({
        propertyName: '',
        category: '',
        urgency: '',
        description: '',
        email: '',
        receiveUpdates: true
      });
      setPhotoData(null);
      
    } catch (error) {
      setSubmitError(error.message);
      showToast(error.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (ticketNumber) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md text-center animate-fade-up">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
            <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Issue Submitted!</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Your maintenance request has been received</p>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Ticket Number</p>
            <p className="text-2xl font-mono font-bold text-blue-600 dark:text-blue-400">{ticketNumber}</p>
          </div>
          {formData.email && (
            <div className="flex items-center justify-center gap-2 text-sm text-green-600 dark:text-green-400 mb-4">
              <Mail className="h-4 w-4" />
              <span>Confirmation sent to {formData.email}</span>
            </div>
          )}
          <div className="space-y-3">
            <button
              onClick={() => router.push('/')}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Go to Dashboard
            </button>
            <button
              onClick={() => setTicketNumber(null)}
              className="w-full text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition"
            >
              Submit Another Issue
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Toast Notifications */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-800 dark:to-blue-900 text-white">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-white hover:text-blue-100 transition">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <Wrench className="h-6 w-6" />
            <h1 className="text-xl font-semibold">Report Maintenance Issue</h1>
          </div>
        </div>
      </div>
      
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transition-colors">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-800 px-6 py-5 border-b border-blue-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Maintenance Request Form</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Please provide details about the issue</p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {submitError && (
              <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-4 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <p className="text-sm text-red-700 dark:text-red-400">{submitError}</p>
                </div>
              </div>
            )}
            
            {/* Property Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Property Name <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.propertyName}
                onChange={(e) => setFormData({...formData, propertyName: e.target.value})}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                  ${errors.propertyName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600'}`}
              >
                <option value="">Select a property</option>
                {properties.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              {errors.propertyName && <p className="text-red-500 text-sm mt-1">{errors.propertyName}</p>}
            </div>
            
            {/* Issue Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Issue Category <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                  ${errors.category ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600'}`}
              >
                <option value="">Select category</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
            </div>
            
            {/* Urgency */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Urgency Level <span className="text-red-500">*</span>
              </label>
              <div className="space-y-3">
                {urgencies.map(u => (
                  <label key={u} className={`flex items-start p-3 border rounded-lg cursor-pointer transition-all
                    ${formData.urgency === u ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                  >
                    <input
                      type="radio"
                      name="urgency"
                      value={u}
                      checked={formData.urgency === u}
                      onChange={(e) => setFormData({...formData, urgency: e.target.value})}
                      className="mt-0.5 mr-3"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 dark:text-white">{u}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{urgencyDescriptions[u]}</div>
                    </div>
                  </label>
                ))}
              </div>
              {errors.urgency && <p className="text-red-500 text-sm mt-1">{errors.urgency}</p>}
            </div>
            
            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                  ${errors.description ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                placeholder="Please describe the issue in detail..."
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {formData.description.length}/1000 characters
              </p>
            </div>
            
            {/* Email for Updates */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Email for Updates <span className="text-gray-500 text-xs">(optional)</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="you@example.com"
              />
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="checkbox"
                  id="receiveUpdates"
                  checked={formData.receiveUpdates}
                  onChange={(e) => setFormData({...formData, receiveUpdates: e.target.checked})}
                  className="rounded"
                />
                <label htmlFor="receiveUpdates" className="text-sm text-gray-600 dark:text-gray-400">
                  Receive email confirmation and status updates
                </label>
              </div>
            </div>
            
            {/* Photo Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Photo (Optional)
              </label>
              <FileUpload 
                onFileSelect={setPhotoData}
                accept="image/*,.pdf"
                maxSize={10 * 1024 * 1024}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Upload photos of the issue to help us respond faster
              </p>
            </div>
            
            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 text-white py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-[1.02] font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  Submitting...
                </div>
              ) : (
                'Submit Maintenance Request'
              )}
            </button>
          </form>
        </div>
        
        {/* Footer */}
        <div className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
          <p>© 2025 Deluxe Stays. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
