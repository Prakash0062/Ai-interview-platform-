function InterviewTimer({ timeElapsed }) {
  try {
    const formatTime = (seconds) => {
      const hrs = Math.floor(seconds / 3600);
      const mins = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
      <div className="flex items-center space-x-2 px-3 py-1 bg-gray-700 rounded-lg" data-name="timer" data-file="components/InterviewTimer.js">
        <div className="icon-clock text-lg text-green-400"></div>
        <span className="text-white font-mono text-sm">{formatTime(timeElapsed)}</span>
      </div>
    );
  } catch (error) {
    console.error('InterviewTimer component error:', error);
    return null;
  }
}