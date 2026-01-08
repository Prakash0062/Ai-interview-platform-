function ChatPanel({ messages, onSendMessage, onRequestHint, isAITyping }) {
  try {
    const [inputValue, setInputValue] = React.useState('');
    const messagesEndRef = React.useRef(null);

    React.useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isAITyping]);

    const handleSend = () => {
      if (inputValue.trim() && !isAITyping) {
        onSendMessage(inputValue);
        setInputValue('');
      }
    };

    return (
      <div className="w-96 bg-gray-800 border-l border-gray-700 flex flex-col" data-name="chat-panel" data-file="components/ChatPanel.js">
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-[var(--primary-color)] flex items-center justify-center">
              <div className="icon-bot text-lg text-white"></div>
            </div>
            <div>
              <h3 className="text-white font-semibold">AI Interviewer</h3>
              <p className="text-xs text-gray-400">{isAITyping ? 'Typing...' : 'Online'}</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map(msg => (
            <div key={msg.id} className={`rounded-lg p-3 ${msg.isAI ? 'bg-gray-700' : 'bg-[var(--primary-color)] ml-8'}`}>
              <div className="flex items-center justify-between mb-1">
                <span className={`text-sm font-medium ${msg.isAI ? 'text-[var(--primary-color)]' : 'text-white'}`}>{msg.sender}</span>
                <span className="text-gray-400 text-xs">{msg.time}</span>
              </div>
              <p className="text-white text-sm whitespace-pre-wrap">{msg.text}</p>
            </div>
          ))}
          {isAITyping && (
            <div className="bg-gray-700 rounded-lg p-3">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-gray-700 space-y-2">
          <button onClick={onRequestHint} disabled={isAITyping} className="w-full px-4 py-2 rounded-lg bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-medium transition-colors disabled:opacity-50">
            💡 Request Hint
          </button>
          <div className="flex space-x-2">
            <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSend()} placeholder="Type your answer..." disabled={isAITyping} className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] disabled:opacity-50"/>
            <button onClick={handleSend} disabled={isAITyping || !inputValue.trim()} className="w-10 h-10 rounded-lg bg-[var(--primary-color)] hover:bg-[var(--accent-color)] flex items-center justify-center transition-colors disabled:opacity-50">
              <div className="icon-send text-lg text-white"></div>
            </button>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('ChatPanel component error:', error);
    return null;
  }
}