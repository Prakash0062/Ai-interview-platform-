function Hero() {
  try {
    return (
      <section className="pt-32 pb-20 px-6 bg-gradient-to-br from-[var(--secondary-color)] to-white" data-name="hero" data-file="components/Hero.js">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-[var(--text-primary)] mb-6 leading-tight">
                AI-Powered Technical Interview
              </h1>
              <p className="text-xl text-[var(--text-secondary)] mb-8 leading-relaxed">
                Experience real technical interviews with an AI interviewer. Get instant feedback, practice coding live, and improve your skills with personalized guidance.
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="dashboard.html" className="btn-primary">Start Interview</a>
                <button className="btn-secondary">Learn More</button>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8 border border-[var(--border-color)]">
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 pb-4 border-b border-[var(--border-color)]">
                    <div className="w-12 h-12 rounded-full bg-[var(--secondary-color)] flex items-center justify-center">
                      <div className="icon-user text-xl text-[var(--primary-color)]"></div>
                    </div>
                    <div className="flex-1">
                      <div className="h-3 bg-gray-200 rounded w-32 mb-2"></div>
                      <div className="h-2 bg-gray-100 rounded w-24"></div>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                      <div className="icon-video text-lg text-green-600"></div>
                    </div>
                  </div>
                  <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm text-green-400">
                    <div>function reverseString(str) {'{'}</div>
                    <div className="ml-4">return str.split('').reverse();</div>
                    <div>{'}'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  } catch (error) {
    console.error('Hero component error:', error);
    return null;
  }
}