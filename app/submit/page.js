'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { validateIssue } from '@/lib/validation';
import FileUpload from '@/components/FileUpload';
import Toast from '@/components/Toast';
import { AlertCircle, CheckCircle, ArrowLeft, Wrench, Mail, Building2, Tag, Clock } from 'lucide-react';

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateIssue(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setToast({ message: 'Correct the fields to continue', type: 'error' });
      return;
    }
    
    setSubmitting(true);
    setSubmitError('');
    
    try {
      const response = await fetch('/api/issues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          photoUrl: photoData?.url || null,
        }),
      });
      
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Submission failed');
      
      setTicketNumber(result.data.ticketNumber);
      
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
        }).catch(console.error);
      }
    } catch (error) {
      setSubmitError(error.message);
      setToast({ message: error.message, type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  if (ticketNumber) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 pb-20">
        <div className="card-premium p-8 md:p-10 max-w-md w-full text-center animate-fade-up">
          <div className="h-16 w-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
          <h2 className="text-2xl font-extrabold mb-2 text-slate-900 dark:text-white">Submission Confirmed</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium text-sm leading-relaxed">
            Your maintenance request has been logged. Our technical team has been notified.
          </p>
          
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 mb-8 border border-slate-100 dark:border-slate-800">
            <p className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1 text-center font-black">Reference ID</p>
            <p className="text-2xl font-extrabold text-blue-600 tracking-tight">{ticketNumber}</p>
          </div>
          
          <div className="flex flex-col gap-3">
            <button onClick={() => router.push('/')} className="btn-primary w-full py-3 text-base">
              Back to Dashboard
            </button>
            <button onClick={() => setTicketNumber(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 font-bold uppercase text-[10px] tracking-widest transition-colors">
              New Report
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 px-4">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <div className="max-w-2xl mx-auto">
        <div className="flex flex-col items-center mb-12 text-center animate-fade-up">
          <Link href="/" className="mb-6 text-slate-400 hover:text-blue-600 transition-colors flex items-center gap-2 font-bold uppercase text-[10px] tracking-widest">
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Link>
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">Post an <span className="text-blue-600">Issue</span></h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">Provide the details below to request maintenance.</p>
        </div>

        <form onSubmit={handleSubmit} className="card-premium p-8 md:p-10 space-y-8 animate-fade-up" style={{ animationDelay: '0.1s' }}>
          {submitError && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-600 dark:text-red-400 text-sm font-bold">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <p>{submitError}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest ml-1 text-slate-400 dark:text-slate-500 flex items-center gap-2">
                <Building2 className="h-3 w-3" />
                Property
              </label>
              <select
                value={formData.propertyName}
                onChange={(e) => setFormData({...formData, propertyName: e.target.value})}
                className={`w-full bg-slate-50 dark:bg-slate-800/30 border rounded-xl px-4 py-3 font-semibold transition-all appearance-none outline-none text-sm
                  ${errors.propertyName ? 'border-red-500/50' : 'border-slate-100 dark:border-slate-800 focus:border-blue-500/30'}`}
              >
                <option value="">Select Property</option>
                {properties.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest ml-1 text-slate-400 dark:text-slate-500 flex items-center gap-2">
                <Tag className="h-3 w-3" />
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className={`w-full bg-slate-50 dark:bg-slate-800/30 border rounded-xl px-4 py-3 font-semibold transition-all appearance-none outline-none text-sm
                  ${errors.category ? 'border-red-500/50' : 'border-slate-100 dark:border-slate-800 focus:border-blue-500/30'}`}
              >
                <option value="">Select Category</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-widest ml-1 text-slate-400 dark:text-slate-500 flex items-center gap-2">
              <Clock className="h-3 w-3" />
              Urgency
            </label>
            <div className="grid grid-cols-3 gap-3">
              {urgencies.map(u => (
                <button
                  key={u}
                  type="button"
                  onClick={() => setFormData({...formData, urgency: u})}
                  className={`py-2 rounded-xl border font-bold uppercase tracking-widest text-[10px] transition-all
                    ${formData.urgency === u 
                      ? 'border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-500/10' 
                      : 'border-slate-100 dark:border-slate-800 text-slate-400 hover:border-blue-600/30'}`}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest ml-1 text-slate-400 dark:text-slate-500">Problem Details</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Describe the issue..."
              className={`w-full bg-slate-50 dark:bg-slate-800/30 border rounded-xl px-4 py-3 font-semibold transition-all resize-none outline-none text-sm
                ${errors.description ? 'border-red-500/50' : 'border-slate-100 dark:border-slate-800 focus:border-blue-500/30'}`}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest ml-1 text-slate-400 dark:text-slate-500">Email Updates</label>
              <div className="relative group">
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="recipient@example.com"
                  className="w-full bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 rounded-xl px-4 py-3 font-semibold transition-all outline-none text-sm"
                />
              </div>
            </div>
            
            <div className="flex items-end">
              <label className="flex items-center gap-3 cursor-pointer group mb-2">
                <input
                  type="checkbox"
                  checked={formData.receiveUpdates}
                  onChange={(e) => setFormData({...formData, receiveUpdates: e.target.checked})}
                  className="h-5 w-5 rounded border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 checked:bg-blue-600 checked:border-blue-600 transition-all appearance-none cursor-pointer"
                />
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 group-hover:text-blue-600 transition-colors">
                  Enable Notifications
                </span>
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest ml-1 text-slate-400 dark:text-slate-500">Inspection Photo (Optional)</label>
            <FileUpload onFileSelect={setPhotoData} />
          </div>

          <button type="submit" disabled={submitting} className="btn-primary w-full py-4 text-sm font-extrabold uppercase tracking-widest">
            {submitting ? (
              <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <Wrench className="h-4 w-4" />
                Submit Ticket
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
