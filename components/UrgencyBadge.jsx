export default function UrgencyBadge({ urgency }) {
  const colors = {
    Low: 'bg-green-100 text-green-800 border border-green-200',
    Medium: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
    High: 'bg-red-100 text-red-800 border border-red-200'
  };
  
  const icons = {
    Low: '🟢',
    Medium: '🟡',
    High: '🔴'
  };
  
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${colors[urgency]}`}>
      <span>{icons[urgency]}</span>
      <span>{urgency}</span>
    </span>
  );
}
