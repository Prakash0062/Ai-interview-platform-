function CodeEditor({ onCodeRun, currentQuestion, onCodeEvaluated }) {
  try {
    const [code, setCode] = React.useState('// Write your code here\nfunction solution() {\n  \n}');
    const [language, setLanguage] = React.useState('javascript');
    const [output, setOutput] = React.useState('');
    const [isRunning, setIsRunning] = React.useState(false);
    const [isEvaluating, setIsEvaluating] = React.useState(false);

    const runCode = async () => {
      setIsRunning(true);
      setOutput('Running code...');

      setTimeout(async () => {
        try {
          let executionResult = '';
          if (language === 'javascript') {
            const result = eval(code);
            executionResult = result !== undefined ? String(result) : 'Code executed successfully';
          } else {
            executionResult = `Code execution for ${language} simulated.\nYour code has been recorded.`;
          }

          setOutput(executionResult);

          if (onCodeRun) {
            onCodeRun(code, language);
          }

          // Trigger code evaluation if we have a current question
          if (currentQuestion && onCodeEvaluated) {
            setIsEvaluating(true);
            setOutput(prev => prev + '\n\nEvaluating your solution...');

            try {
              const evaluation = await AIInterviewer.evaluateCode(
                currentQuestion,
                code,
                language,
                [] // chatHistory can be passed if available
              );

              setOutput(prev => prev + `\n\nFeedback: ${evaluation.feedback}`);

              // Call the callback with evaluation results
              onCodeEvaluated(evaluation);
            } catch (error) {
              console.error('Code evaluation failed:', error);
              setOutput(prev => prev + '\n\nEvaluation failed. Please try again.');
            }

            setIsEvaluating(false);
          }
        } catch (error) {
          setOutput(`Error: ${error.message}`);
        }
        setIsRunning(false);
      }, 1000);
    };

    return (
      <div className="flex-1 flex flex-col bg-gray-900" data-name="code-editor" data-file="components/CodeEditor.js">
        <div className="px-4 py-3 bg-gray-800 border-b border-gray-700 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="icon-code text-xl text-[var(--primary-color)]"></div>
              <h3 className="text-white font-semibold">Code Editor</h3>
            </div>
            <select 
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="px-3 py-1 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-[var(--primary-color)]"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
            </select>
          </div>
          
          <button onClick={runCode} disabled={isRunning} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center space-x-2 disabled:opacity-50">
            <div className="icon-play text-lg"></div>
            <span>{isRunning ? 'Running...' : 'Run Code'}</span>
          </button>
        </div>

        <div className="flex-1 flex flex-col">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 p-4 bg-gray-900 text-green-400 font-mono text-sm focus:outline-none resize-none"
            style={{ fontFamily: 'Monaco, Consolas, monospace' }}
          />
          {output && (
            <div className="h-32 bg-gray-950 border-t border-gray-700 p-4 overflow-auto">
              <div className="text-xs text-gray-400 mb-1">Output:</div>
              <pre className="text-sm text-gray-200 font-mono">{output}</pre>
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('CodeEditor component error:', error);
    return null;
  }
}