class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h1>
            <button onClick={() => window.location.reload()} className="btn-primary">Reload Page</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function InterviewApp() {
  try {
    const [interviewStatus, setInterviewStatus] = React.useState('not-started');
    const [messages, setMessages] = React.useState([]);
    const [currentQuestion, setCurrentQuestion] = React.useState('');
    const [isAITyping, setIsAITyping] = React.useState(false);
    const [codeAttempts, setCodeAttempts] = React.useState([]);
    const [showFeedback, setShowFeedback] = React.useState(false);
    const [feedbackData, setFeedbackData] = React.useState('');
    const [timeElapsed, setTimeElapsed] = React.useState(0);
    const [resumeFile, setResumeFile] = React.useState(null);
    const [resumeAnalysis, setResumeAnalysis] = React.useState('');
    const [parsedAnalysis, setParsedAnalysis] = React.useState(null);
    const [currentQuestionType, setCurrentQuestionType] = React.useState('coding');
    const [mcqOptions, setMcqOptions] = React.useState([]);
    const [correctAnswer, setCorrectAnswer] = React.useState('');
    const [questionTypesHistory, setQuestionTypesHistory] = React.useState([]);
    const [animateResults, setAnimateResults] = React.useState(false);

    React.useEffect(() => {
      let interval;
      if (interviewStatus === 'ongoing') {
        interval = setInterval(() => {
          setTimeElapsed(prev => prev + 1);
        }, 1000);
      }
      return () => clearInterval(interval);
    }, [interviewStatus]);

    React.useEffect(() => {
      if (interviewStatus === 'analysis-results') {
        setTimeout(() => setAnimateResults(true), 300);
      }
    }, [interviewStatus]);

    const startInterview = () => {
      setInterviewStatus('resume-upload');
    };

    const handleResumeUpload = async (file) => {
      setResumeFile(file);
      setInterviewStatus('resume-analysis');
      setIsAITyping(true);

      try {
        const analysis = await AIInterviewer.analyzeResume(file);
        setResumeAnalysis(analysis);
        const parsed = AIInterviewer.parseResumeAnalysis(analysis);
        setParsedAnalysis(parsed);
        setInterviewStatus('analysis-results');
      } catch (error) {
        console.error('Resume analysis failed:', error);
        setResumeAnalysis('Error analyzing resume. Please try again.');
        setParsedAnalysis(null);
        setInterviewStatus('analysis-results');
      }

      setIsAITyping(false);
    };

    const proceedToInterview = async () => {
      setInterviewStatus('camera-setup');
    };

    const startCameraAndInterview = async () => {
      setInterviewStatus('ongoing');
      setIsAITyping(true);

      const greeting = await AIInterviewer.startInterview();
      const aiMessage = {
        id: Date.now(),
        text: greeting,
        sender: 'AI Interviewer',
        time: new Date().toLocaleTimeString(),
        isAI: true
      };

      setMessages([aiMessage]);
      setCurrentQuestion(greeting);
      setIsAITyping(false);
    };

    const handleSendMessage = async (message) => {
      const userMessage = {
        id: Date.now(),
        text: message,
        sender: 'You',
        time: new Date().toLocaleTimeString(),
        isAI: false
      };

      setMessages(prev => [...prev, userMessage]);
      setIsAITyping(true);

      const chatHistory = [...messages, userMessage]
        .map(m => `${m.sender}: ${m.text}`)
        .join('\n');

      let aiResponse;

      if (currentQuestionType === 'mcq') {
        // Handle MCQ response using evaluateMCQ
        const evaluation = await AIInterviewer.evaluateMCQ(
          currentQuestion,
          message,
          chatHistory
        );

        aiResponse = {
          feedback: evaluation.feedback,
          nextQuestion: evaluation.nextQuestion
        };

        if (evaluation.nextQuestion) {
          setCurrentQuestionType(evaluation.nextType);
        }
      } else if (currentQuestionType === 'theory') {
        // Handle theory response
        aiResponse = await AIInterviewer.evaluateAnswer(
          currentQuestion,
          message,
          chatHistory
        );

        // If correct, get next question
        if (aiResponse.feedback.includes('correct') || aiResponse.feedback.includes('good')) {
          const evaluation = await AIInterviewer.evaluateCode(
            currentQuestion,
            `Theory Answer: ${message}`,
            'text',
            chatHistory
          );

          if (evaluation.nextQuestion) {
            aiResponse.nextQuestion = evaluation.nextQuestion;
            setCurrentQuestionType(evaluation.nextType);
          }
        }
      } else {
        // Handle coding questions (fallback)
        aiResponse = await AIInterviewer.evaluateAnswer(
          currentQuestion,
          message,
          chatHistory
        );
      }

      // Handle feedback message if present
      if (aiResponse.feedback) {
        const feedbackMessage = {
          id: Date.now() + 1,
          text: aiResponse.feedback,
          sender: 'AI Interviewer',
          time: new Date().toLocaleTimeString(),
          isAI: true
        };
        setMessages(prev => [...prev, feedbackMessage]);
      }

      // Handle next question if present
      if (aiResponse.nextQuestion) {
        setCurrentQuestion(aiResponse.nextQuestion);
        const questionMessage = {
          id: Date.now() + 2,
          text: aiResponse.nextQuestion,
          sender: 'AI Interviewer',
          time: new Date().toLocaleTimeString(),
          isAI: true
        };
        setMessages(prev => [...prev, questionMessage]);
      } else {
        // If no next question, end the interview
        setCurrentQuestion('');
      }

      setIsAITyping(false);
    };

    const handleRequestHint = async () => {
      setIsAITyping(true);
      
      const chatHistory = messages
        .map(m => `${m.sender}: ${m.text}`)
        .join('\n');
      
      const hint = await AIInterviewer.provideHint(currentQuestion, chatHistory);
      
      const hintMessage = {
        id: Date.now(),
        text: `💡 Hint: ${hint}`,
        sender: 'AI Interviewer',
        time: new Date().toLocaleTimeString(),
        isAI: true
      };
      
      setMessages(prev => [...prev, hintMessage]);
      setIsAITyping(false);
    };

    const handleCodeRun = (code, language) => {
      setCodeAttempts(prev => [...prev, { code, language, time: new Date().toISOString() }]);
    };

    const handleCodeEvaluated = async (evaluation) => {
      // Add feedback message
      const feedbackMessage = {
        id: Date.now(),
        text: evaluation.feedback,
        sender: 'AI Interviewer',
        time: new Date().toLocaleTimeString(),
        isAI: true
      };
      setMessages(prev => [...prev, feedbackMessage]);

      if (evaluation.correct && evaluation.nextQuestion) {
        // Move to next question
        setCurrentQuestion(evaluation.nextQuestion);
        setCurrentQuestionType(evaluation.nextType);
        setQuestionTypesHistory(prev => [...prev, evaluation.nextType]);

        let questionMessage;
        if (evaluation.nextType === 'mcq') {
          // Parse MCQ options
          const optionsMatch = evaluation.nextQuestion.match(/OPTIONS:\s*(.+)/i);
          const correctMatch = evaluation.nextQuestion.match(/CORRECT_ANSWER:\s*([A-D])/i);
          const questionText = evaluation.nextQuestion.replace(/OPTIONS:.*/i, '').replace(/CORRECT_ANSWER:.*/i, '').trim();

          if (optionsMatch && correctMatch) {
            const options = optionsMatch[1].split(/[A-D]\)\s*/).filter(opt => opt.trim());
            setMcqOptions(options);
            setCorrectAnswer(correctMatch[1]);
            questionMessage = {
              id: Date.now() + 1,
              text: questionText,
              sender: 'AI Interviewer',
              time: new Date().toLocaleTimeString(),
              isAI: true,
              type: 'mcq'
            };
          }
        } else {
          questionMessage = {
            id: Date.now() + 1,
            text: evaluation.nextQuestion,
            sender: 'AI Interviewer',
            time: new Date().toLocaleTimeString(),
            isAI: true,
            type: evaluation.nextType
          };
        }

        setMessages(prev => [...prev, questionMessage]);
      } else if (!evaluation.nextQuestion) {
        // End interview
        setCurrentQuestion('');
      }
    };

    const submitInterview = async () => {
      setIsAITyping(true);

      const chatHistory = messages
        .map(m => `${m.sender}: ${m.text}`)
        .join('\n');

      const feedback = await AIInterviewer.generateFeedback(
        chatHistory,
        JSON.stringify(codeAttempts),
        questionTypesHistory.join(', ')
      );

      setFeedbackData(feedback);
      setShowFeedback(true);
      setInterviewStatus('completed');
      setIsAITyping(false);
    };

    if (interviewStatus === 'not-started') {
      return (
        <div className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[var(--primary-color)] flex items-center justify-center">
              <div className="icon-bot text-4xl text-white"></div>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">AI Interview Ready</h1>
            <p className="text-gray-300 mb-8 max-w-md">
              Click start to begin your technical interview with our AI interviewer.
              Make sure your camera and microphone are ready.
            </p>
            <button onClick={startInterview} className="btn-primary text-lg px-8 py-4">
              Start Interview
            </button>
          </div>
        </div>
      );
    }

    if (interviewStatus === 'resume-upload') {
      return (
        <div className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[var(--primary-color)] flex items-center justify-center">
              <div className="icon-file-text text-4xl text-white"></div>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">Upload Your Resume</h1>
            <p className="text-gray-300 mb-8">
              Upload your resume for AI analysis to get personalized insights and ATS score before starting the interview.
            </p>
            <div className="mb-6">
              <input
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) handleResumeUpload(file);
                }}
                className="hidden"
                id="resume-upload"
              />
              <label
                htmlFor="resume-upload"
                className="btn-primary text-lg px-8 py-4 cursor-pointer inline-block"
              >
                Choose Resume File
              </label>
            </div>
            <p className="text-sm text-gray-400">
              Supported formats: PDF, DOC, DOCX, TXT
            </p>
          </div>
        </div>
      );
    }

    if (interviewStatus === 'resume-analysis') {
      return (
        <div className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[var(--primary-color)] flex items-center justify-center animate-pulse">
              <div className="icon-loader text-4xl text-white"></div>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">Analyzing Resume</h1>
            <p className="text-gray-300 mb-8 max-w-md">
              Our AI is analyzing your resume to provide ATS score and personalized insights...
            </p>
            {isAITyping && <div className="text-gray-400">Processing...</div>}
          </div>
        </div>
      );
    }

    if (interviewStatus === 'analysis-results') {
      return (
        <div className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
          <div className="text-center max-w-4xl mx-auto px-4">
            <div className={`w-24 h-24 mx-auto mb-6 rounded-full bg-[var(--primary-color)] flex items-center justify-center transition-all duration-1000 ${animateResults ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
              <div className="icon-check-circle text-4xl text-white"></div>
            </div>
            <h1 className={`text-4xl font-bold text-white mb-8 transition-all duration-1000 delay-200 ${animateResults ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>Resume Analysis Complete</h1>

            {parsedAnalysis ? (
              <div className="bg-gray-800 rounded-lg p-8 mb-8 text-left space-y-8">
                {/* ATS Score Section */}
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-white mb-4">ATS Score</h2>
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeDasharray={`${parsedAnalysis.atsScore}, 100`}
                        className="text-gray-600"
                      />
                      <path
                        d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeDasharray={`${parsedAnalysis.atsScore}, 100`}
                        className={parsedAnalysis.atsScore >= 80 ? 'text-green-500' : parsedAnalysis.atsScore >= 60 ? 'text-yellow-500' : 'text-red-500'}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl font-bold text-white">{parsedAnalysis.atsScore}/100</span>
                    </div>
                  </div>
                  <p className="text-gray-300">
                    {parsedAnalysis.atsScore >= 80 ? 'Excellent! Your resume is highly optimized for ATS systems.' :
                     parsedAnalysis.atsScore >= 60 ? 'Good! Your resume is reasonably optimized, but could use some improvements.' :
                     'Your resume needs significant improvements to pass ATS filters.'}
                  </p>
                </div>

                {/* Experience Level */}
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Experience Level</h3>
                  <p className="text-gray-300 bg-gray-700 rounded px-3 py-2 inline-block">{parsedAnalysis.experienceLevel}</p>
                </div>

                {/* Key Skills */}
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Key Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {parsedAnalysis.skills.map((skill, index) => (
                      <span key={index} className="bg-[var(--primary-color)] text-white px-3 py-1 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Strengths */}
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Strengths</h3>
                  <ul className="space-y-2">
                    {parsedAnalysis.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start text-gray-300">
                        <span className="text-green-500 mr-2 mt-1">✓</span>
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Areas for Improvement */}
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Areas for Improvement</h3>
                  <ul className="space-y-2">
                    {parsedAnalysis.improvements.map((improvement, index) => (
                      <li key={index} className="flex items-start text-gray-300">
                        <span className="text-yellow-500 mr-2 mt-1">⚠</span>
                        {improvement}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Suggested Roles */}
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Suggested Roles</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {parsedAnalysis.suggestedRoles.map((role, index) => (
                      <div key={index} className="bg-gray-700 rounded-lg p-3 text-gray-300">
                        <div className="flex items-center">
                          <span className="text-[var(--primary-color)] mr-2">🎯</span>
                          {role}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className={`bg-gray-800 rounded-lg p-6 mb-8 text-left transition-all duration-1000 delay-500 ${animateResults ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <pre className="text-gray-300 whitespace-pre-wrap">{resumeAnalysis}</pre>
              </div>
            )}

            <button onClick={proceedToInterview} className={`btn-primary text-lg px-8 py-4 transition-all duration-1000 delay-700 ${animateResults ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              Proceed to Interview
            </button>
          </div>
        </div>
      );
    }

    if (interviewStatus === 'camera-setup') {
      return (
        <div className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[var(--primary-color)] flex items-center justify-center">
              <div className="icon-video text-4xl text-white"></div>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">Camera & Microphone Setup</h1>
            <p className="text-gray-300 mb-8">
              Please allow camera and microphone access for your interview. Make sure you're in a quiet environment.
            </p>
            <button onClick={startCameraAndInterview} className="btn-primary text-lg px-8 py-4">
              Start Interview
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="h-screen flex flex-col bg-gray-900">
        <header className="bg-gray-800 px-6 py-4 flex items-center justify-between border-b border-gray-700">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-lg bg-[var(--primary-color)] flex items-center justify-center">
              <div className="icon-bot text-xl text-white"></div>
            </div>
            <span className="text-xl font-bold text-white">AI Interview</span>
            <InterviewTimer timeElapsed={timeElapsed} />
          </div>
          <button
            onClick={submitInterview}
            className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
          >
            Submit Interview
          </button>
        </header>

        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 flex flex-col">
            <VideoPanel />
            <CodeEditor
              onCodeRun={handleCodeRun}
              currentQuestion={currentQuestion}
              onCodeEvaluated={handleCodeEvaluated}
            />
          </div>
          <ChatPanel 
            messages={messages}
            onSendMessage={handleSendMessage}
            onRequestHint={handleRequestHint}
            isAITyping={isAITyping}
          />
        </div>

        {showFeedback && (
          <FeedbackModal 
            feedback={feedbackData}
            onClose={() => window.location.href = 'dashboard.html'}
          />
        )}
      </div>
    );
  } catch (error) {
    console.error('InterviewApp error:', error);
    return null;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    <InterviewApp />
  </ErrorBoundary>
);
