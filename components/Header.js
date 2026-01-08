function Header() {
  try {
    const navigateToSection = (sectionId) => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.location.href = `index.html#${sectionId}`;
      }
    };

    return (
      <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-[var(--border-color)] z-50" data-name="header" data-file="components/Header.js">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-lg bg-[var(--primary-color)] flex items-center justify-center">
                <div className="icon-video text-xl text-white"></div>
              </div>
              <span className="text-2xl font-bold text-[var(--text-primary)]">Interview</span>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <a onClick={() => navigateToSection('features')} className="text-[var(--text-secondary)] hover:text-[var(--primary-color)] cursor-pointer transition-colors">Features</a>
              <a onClick={() => navigateToSection('how-it-works')} className="text-[var(--text-secondary)] hover:text-[var(--primary-color)] cursor-pointer transition-colors">How It Works</a>
              <a href="dashboard.html" className="text-[var(--text-secondary)] hover:text-[var(--primary-color)] transition-colors">Dashboard</a>
            </nav>

            <div className="flex items-center space-x-4">
              <a href="dashboard.html" className="btn-secondary">Get Started</a>
            </div>
          </div>
        </div>
      </header>
    );
  } catch (error) {
    console.error('Header component error:', error);
    return null;
  }
}