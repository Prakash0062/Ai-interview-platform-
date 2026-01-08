function FeedbackModal({ feedback, onClose }) {
  try {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" data-name="feedback-modal" data-file="components/FeedbackModal.js">
        <div className="bg-gray-800 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
          <div className="p-6 border-b border-gray-700 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center">
                <div className="icon-check text-2xl text-white"></div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Interview Complete!</h2>
                <p className="text-gray-400 text-sm">Here's your detailed feedback</p>
              </div>
            </div>
          </div>

          <div className="p-6 overflow-y-auto max-h-96">
            <div className="prose prose-invert max-w-none">
              <div className="text-gray-200 whitespace-pre-wrap leading-relaxed">
                {feedback}
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-gray-700 flex justify-end space-x-3">
            <button onClick={onClose} className="px-6 py-2 rounded-lg bg-[var(--primary-color)] hover:bg-[var(--accent-color)] text-white font-medium transition-colors">
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('FeedbackModal component error:', error);
    return null;
  }
}