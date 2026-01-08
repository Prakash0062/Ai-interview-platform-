function SessionCard({ session }) {
  try {
    const statusColors = {
      upcoming: 'bg-blue-100 text-blue-600',
      completed: 'bg-green-100 text-green-600',
      cancelled: 'bg-red-100 text-red-600'
    };

    return (
      <div className="bg-white rounded-xl p-6 border border-[var(--border-color)] hover:shadow-lg transition-shadow" data-name="session-card" data-file="components/SessionCard.js">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold text-[var(--text-primary)]">{session.title}</h3>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[session.status]}`}>
            {session.status}
          </span>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-[var(--text-secondary)]">
            <div className="icon-calendar text-lg mr-2"></div>
            <span>{session.date}</span>
          </div>
          <div className="flex items-center text-[var(--text-secondary)]">
            <div className="icon-clock text-lg mr-2"></div>
            <span>{session.time}</span>
          </div>
        </div>
        
        <button className="w-full px-4 py-2 rounded-lg bg-[var(--secondary-color)] text-[var(--primary-color)] font-medium hover:bg-[var(--primary-color)] hover:text-white transition-colors">
          {session.status === 'upcoming' ? 'Join Session' : 'View Details'}
        </button>
      </div>
    );
  } catch (error) {
    console.error('SessionCard component error:', error);
    return null;
  }
}