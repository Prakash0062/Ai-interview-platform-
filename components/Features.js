function Features() {
  try {
    const features = [
      {
        icon: 'video',
        title: 'Live Video Interview',
        description: 'Real-time video and audio using your camera and microphone for authentic interview experience.'
      },
      {
        icon: 'bot',
        title: 'AI Interviewer',
        description: 'Smart AI agent asks technical questions, evaluates answers, and provides helpful hints.'
      },
      {
        icon: 'code',
        title: 'Code Editor',
        description: 'Write and execute code in Python, Java, JavaScript, C, and C++ with instant feedback.'
      },
      {
        icon: 'message-square',
        title: 'Real-time Chat',
        description: 'Interactive chat interface to communicate with the AI interviewer during the session.'
      },
      {
        icon: 'gauge',
        title: 'Adaptive Difficulty',
        description: 'AI gradually increases question difficulty based on your performance and responses.'
      },
      {
        icon: 'file-text',
        title: 'Instant Feedback',
        description: 'Get detailed evaluation and personalized feedback summary at the end of each session.'
      }
    ];

    return (
      <section id="features" className="py-20 px-6 bg-white" data-name="features" data-file="components/Features.js">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[var(--text-primary)] mb-4">Everything You Need</h2>
            <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
              Powerful features designed to make technical interviews smooth and effective
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="p-6 rounded-xl border border-[var(--border-color)] hover:shadow-lg transition-shadow duration-200">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 bg-[var(--secondary-color)]">
                  <div className={`icon-${feature.icon} text-2xl text-[var(--primary-color)]`}></div>
                </div>
                <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">{feature.title}</h3>
                <p className="text-[var(--text-secondary)]">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  } catch (error) {
    console.error('Features component error:', error);
    return null;
  }
}