function DashboardSidebar() {
  try {
    const menuItems = [
      { icon: 'home', label: 'Dashboard', active: true },
      { icon: 'video', label: 'Sessions', active: false },
      { icon: 'calendar', label: 'Schedule', active: false },
      { icon: 'settings', label: 'Settings', active: false }
    ];

    return (
      <aside className="w-64 bg-white border-r border-[var(--border-color)] min-h-screen pt-8" data-name="sidebar" data-file="components/DashboardSidebar.js">
        <nav className="px-4">
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                <a href="#" className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  item.active 
                    ? 'bg-[var(--secondary-color)] text-[var(--primary-color)]' 
                    : 'text-[var(--text-secondary)] hover:bg-gray-50'
                }`}>
                  <div className={`icon-${item.icon} text-xl`}></div>
                  <span className="font-medium">{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    );
  } catch (error) {
    console.error('DashboardSidebar component error:', error);
    return null;
  }
}