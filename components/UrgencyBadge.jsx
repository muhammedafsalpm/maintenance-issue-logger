'use client';

export default function UrgencyBadge({ urgency }) {
  const styles = {
    Low: 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20',
    Medium: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20',
    High: 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20'
  };
  
  const dotColor = {
    Low: 'bg-green-500',
    Medium: 'bg-amber-500',
    High: 'bg-red-500'
  };
  
  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${styles[urgency]}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dotColor[urgency]} animate-pulse`} />
      <span>{urgency}</span>
    </span>
  );
}
