export default function StatusBadge({ status }) {
  const colors = {
    Open: 'bg-blue-100 text-blue-800 border border-blue-200',
    'In Progress': 'bg-purple-100 text-purple-800 border border-purple-200',
    Resolved: 'bg-green-100 text-green-800 border border-green-200'
  };
  
  const icons = {
    Open: '📋',
    'In Progress': '⚙️',
    Resolved: '✅'
  };
  
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${colors[status]}`}>
      <span>{icons[status]}</span>
      <span>{status}</span>
    </span>
  );
}
