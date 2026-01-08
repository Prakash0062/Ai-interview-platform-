function HowItWorks() {
  try {
    const steps = [
      {
        number: '1',
        title: 'Create Session',
        description: 'Start a new interview session and invite your partner with a unique link.'
      },
      {
        number: '2',
        title: 'Connect',
        description: 'Join the session with video, audio, and access to the shared code editor.'
      },
      {
        number: '3',
        title: 'Collaborate',
        description: 'Conduct the interview with real-time code editing, chat, and screen sharing.'
      },
      {
        number: '4',
        title: 'Review',
        description: 'Save and review the session to improve and track your progress.'
      }
    ];

    return (
      <section id="how-it-works" className="py-20 px-6 bg-[var(--secondary-color)]" data-name="how-it-works" data-file="components/HowItWorks.js">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[var(--text-primary)] mb-4">How It Works</h2>
            <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
              Get started in minutes with our simple and intuitive platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-xl p-6 shadow-md h-full">
                  <div className="w-12 h-12 rounded-full bg-[var(--primary-color)] text-white flex items-center justify-center text-xl font-bold mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">{step.title}</h3>
                  <p className="text-[var(--text-secondary)]">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <div className="icon-arrow-right text-2xl text-[var(--primary-color)]"></div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <a href="dashboard.html" className="btn-primary">Get Started Now</a>
          </div>
        </div>
      </section>
    );
  } catch (error) {
    console.error('HowItWorks component error:', error);
    return null;
  }
}