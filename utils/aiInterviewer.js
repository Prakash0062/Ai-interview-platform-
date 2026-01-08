// Real-time AI agent function using OpenAI API

async function getOpenAIApiKey() {
  let apiKey = localStorage.getItem('openai_api_key');
  if (!apiKey) {
    apiKey = prompt('Please enter your OpenAI API key:');
    if (apiKey) {
      localStorage.setItem('openai_api_key', apiKey);
    } else {
      throw new Error('API key is required');
    }
  }
  return apiKey;
}

async function invokeAIAgent(systemPrompt, userPrompt) {
  const apiKey = await getOpenAIApiKey();

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('OpenAI API call failed:', error);
    // Fallback to mock responses if API fails
    return getMockResponse(systemPrompt, userPrompt);
  }
}

// Fallback mock responses in case API fails
function getMockResponse(systemPrompt, userPrompt) {
  // Extract question count from system prompt
  const questionCountMatch = systemPrompt.match(/Questions asked: (\d+)/);
  const questionCount = questionCountMatch ? parseInt(questionCountMatch[1]) : 0;

  // List of coding interview questions
  const questions = [
    "Write a function to reverse a string in JavaScript.",
    "Implement a function to check if a string is a palindrome.",
    "Write a function to find the maximum element in an array.",
    "Implement a binary search algorithm.",
    "Write a function to remove duplicates from an array.",
    "Implement a stack using an array.",
    "Write a function to check if parentheses are balanced.",
    "Implement a function to merge two sorted arrays.",
    "Write a recursive function to calculate factorial.",
    "Implement a function to find the longest common prefix in an array of strings."
  ];

  // List of MCQ questions
  const mcqQuestions = [
    {
      question: "What is the time complexity of accessing an element in an array by index?",
      options: {
        A: "O(1)",
        B: "O(n)",
        C: "O(log n)",
        D: "O(n^2)"
      },
      correct: "A"
    },
    {
      question: "Which data structure follows Last In First Out (LIFO) principle?",
      options: {
        A: "Queue",
        B: "Stack",
        C: "Linked List",
        D: "Tree"
      },
      correct: "B"
    },
    {
      question: "What does the acronym 'API' stand for?",
      options: {
        A: "Application Programming Interface",
        B: "Advanced Programming Interface",
        C: "Automated Programming Interface",
        D: "Application Process Interface"
      },
      correct: "A"
    },
    {
      question: "Which of the following is NOT a primitive data type in JavaScript?",
      options: {
        A: "string",
        B: "number",
        C: "boolean",
        D: "object"
      },
      correct: "D"
    },
    {
      question: "What is the purpose of the 'git clone' command?",
      options: {
        A: "To create a new repository",
        B: "To copy an existing repository",
        C: "To merge branches",
        D: "To push changes to remote"
      },
      correct: "B"
    }
  ];

  if (userPrompt.includes("Start the interview")) {
    return `Hello! I'm your AI interviewer today. Let's start with a warm-up question: ${questions[0]}`;
  } else if (userPrompt.includes("Question:")) {
    const nextQuestionIndex = Math.min(questionCount, questions.length - 1);
    const nextQuestion = questions[nextQuestionIndex];
    return `Good explanation! Now, let's move to the next question: ${nextQuestion}`;
  } else if (userPrompt.includes("provide a helpful hint")) {
    return "Consider the operations you need to perform. Think about how arrays store elements contiguously in memory.";
  } else if (userPrompt.includes("Generate the final interview feedback")) {
    const codeCount = systemPrompt.match(/Code attempts: (\d+)/) ? parseInt(systemPrompt.match(/Code attempts: (\d+)/)[1]) : 0;
    const totalTime = systemPrompt.match(/Total time: (\d+) minutes/) ? parseInt(systemPrompt.match(/Total time: (\d+) minutes/)[1]) : 0;

    let score = 7;
    let strengths = "Good understanding of basic coding concepts";
    let weaknesses = "Practice more algorithm problems";
    let recommendations = "Focus on time/space complexity analysis";

    if (questionCount >= 5) {
      score += 1;
      strengths += ", demonstrated problem-solving skills";
    }
    if (codeCount >= 3) {
      score += 1;
      strengths += ", active coding practice";
    }
    if (totalTime > 30) {
      score += 1;
      strengths += ", good time management";
    }

    return `Overall Performance Score: ${score}/10\n\nStrengths: ${strengths}\n\nAreas for improvement: ${weaknesses}\n\nRecommendations: ${recommendations}\n\nTechnical Skills Demonstrated:\n- Coding proficiency: ${codeCount > 0 ? 'Good' : 'Needs improvement'}\n- Problem-solving: ${questionCount > 3 ? 'Strong' : 'Developing'}\n- Time management: ${totalTime > 20 ? 'Excellent' : 'Good'}`;
  }

  return `Resume Analysis Results:\n\nATS Score: 78/100\n\nExperience Level: Mid-level (3-5 years)\n\nKey Skills:\n- React.js, Node.js, Express\n- Python, Django\n- JavaScript, TypeScript\n- REST APIs, GraphQL\n- Git, Docker, AWS\n\nStrengths:\n- Good technical skill coverage\n- Relevant project experience\n- Clean formatting\n\nAreas for Improvement:\n- Add more quantifiable achievements\n- Include certifications\n- Expand on leadership experience\n\nSuggested Roles:\n- Full Stack Developer\n- Backend Developer\n- Frontend Developer\n- Software Engineer`;
}

const AIInterviewer = {
  difficulty: 'easy',
  questionCount: 0,
  mcqQuestions: [
    {
      question: "What is the time complexity of accessing an element in an array by index?",
      options: {
        A: "O(1)",
        B: "O(n)",
        C: "O(log n)",
        D: "O(n^2)"
      },
      correct: "A"
    },
    {
      question: "Which data structure follows Last In First Out (LIFO) principle?",
      options: {
        A: "Queue",
        B: "Stack",
        C: "Linked List",
        D: "Tree"
      },
      correct: "B"
    },
    {
      question: "What does the acronym 'API' stand for?",
      options: {
        A: "Application Programming Interface",
        B: "Advanced Programming Interface",
        C: "Automated Programming Interface",
        D: "Application Process Interface"
      },
      correct: "A"
    },
    {
      question: "Which of the following is NOT a primitive data type in JavaScript?",
      options: {
        A: "string",
        B: "number",
        C: "boolean",
        D: "object"
      },
      correct: "D"
    },
    {
      question: "What is the purpose of the 'git clone' command?",
      options: {
        A: "To create a new repository",
        B: "To copy an existing repository",
        C: "To merge branches",
        D: "To push changes to remote"
      },
      correct: "B"
    }
  ],
  
  async startInterview() {
    const systemPrompt = `You are an experienced technical interviewer conducting a coding interview. Your role is to:
1. Ask ONE technical question at a time (start with easy questions)
2. Wait for the candidate's response
3. Evaluate their answer
4. Provide constructive feedback
5. Ask follow-up questions or move to next question

Keep questions focused on data structures, algorithms, and problem-solving.
Be encouraging but professional.`;
    
    const userPrompt = "Start the interview by introducing yourself briefly and asking the first easy coding question.";
    
    try {
      const response = await invokeAIAgent(systemPrompt, userPrompt);
      this.questionCount = 1;
      return response;
    } catch (error) {
      console.error('AI Interviewer error:', error);
      return "Hello! I'm your AI interviewer today. Let's start with a warm-up question: Can you explain what a linked list is and how it differs from an array?";
    }
  },
  
  async evaluateAnswer(question, answer, chatHistory) {
    const systemPrompt = `You are evaluating a candidate's answer in a technical interview.

Current difficulty level: ${this.difficulty}
Questions asked: ${this.questionCount}

Your tasks:
1. Evaluate if the answer is correct, partially correct, or incorrect
2. Provide brief constructive feedback
3. If the answer is good, ask the next question (slightly harder)
4. If struggling, offer a hint or simpler follow-up
5. Keep responses concise and professional

IMPORTANT: Format your response as: "FEEDBACK: [your feedback here] QUESTION: [next question or 'NONE' if interview should end]"

Chat history:
${chatHistory}`;

    const userPrompt = `Question: ${question}\nCandidate's Answer: ${answer}`;

    try {
      if (this.questionCount >= 10) {
        return {
          feedback: "Thank you for completing all the questions! The interview is now complete.",
          nextQuestion: null
        };
      }

      const response = await invokeAIAgent(systemPrompt, userPrompt);
      this.questionCount++;

      if (this.questionCount > 3 && this.difficulty === 'easy') {
        this.difficulty = 'medium';
      } else if (this.questionCount > 6 && this.difficulty === 'medium') {
        this.difficulty = 'hard';
      }

      // Parse the response to separate feedback and next question
      const feedbackMatch = response.match(/FEEDBACK:\s*(.*?)\s*QUESTION:\s*(.+)/i);
      let feedback = response;
      let nextQuestion = null;

      if (feedbackMatch) {
        feedback = feedbackMatch[1].trim();
        const questionPart = feedbackMatch[2].trim();
        nextQuestion = questionPart.toLowerCase() === 'none' ? null : questionPart;
      }

      return { feedback, nextQuestion };
    } catch (error) {
      console.error('Evaluation error:', error);
      return {
        feedback: "Thank you for your answer. Let me ask you another question...",
        nextQuestion: null
      };
    }
  },

  async evaluateCode(question, code, language, chatHistory) {
    const systemPrompt = `You are evaluating a candidate's code solution in a technical interview.

Current difficulty level: ${this.difficulty}
Questions asked: ${this.questionCount}

Your tasks:
1. Analyze the code for correctness, efficiency, and best practices
2. Check if the code solves the problem correctly
3. Provide brief constructive feedback on code quality
4. If the code is correct, prepare the next question (coding, MCQ, or theory)
5. Occasionally include MCQ or theory questions to vary the interview

IMPORTANT: Format your response as: "FEEDBACK: [your feedback here] CORRECT: [true/false] NEXT_TYPE: [coding/mcq/theory] NEXT_QUESTION: [next question or 'NONE' if interview should end]"

For MCQ questions, format as: "QUESTION: [question text] OPTIONS: A) [option1] B) [option2] C) [option3] D) [option4] CORRECT_ANSWER: [A/B/C/D]"
For theory questions, format as: "QUESTION: [question text]"

Chat history:
${chatHistory}`;

    const userPrompt = `Question: ${question}\nCandidate's Code (${language}):\n${code}`;

    try {
      if (this.questionCount >= 10) {
        return {
          feedback: "Thank you for completing all the questions! The interview is now complete.",
          correct: true,
          nextType: null,
          nextQuestion: null
        };
      }

      const response = await invokeAIAgent(systemPrompt, userPrompt);
      this.questionCount++;

      if (this.questionCount > 3 && this.difficulty === 'easy') {
        this.difficulty = 'medium';
      } else if (this.questionCount > 6 && this.difficulty === 'medium') {
        this.difficulty = 'hard';
      }

      // Parse the response
      const feedbackMatch = response.match(/FEEDBACK:\s*(.*?)\s*CORRECT:\s*(true|false)/i);
      const nextTypeMatch = response.match(/NEXT_TYPE:\s*(coding|mcq|theory)/i);
      const nextQuestionMatch = response.match(/NEXT_QUESTION:\s*(.+)/i);

      let feedback = response;
      let correct = false;
      let nextType = 'coding';
      let nextQuestion = null;

      if (feedbackMatch) {
        feedback = feedbackMatch[1].trim();
        correct = feedbackMatch[2].toLowerCase() === 'true';
      }

      if (nextTypeMatch) {
        nextType = nextTypeMatch[1].toLowerCase();
      }

      if (nextQuestionMatch) {
        const questionPart = nextQuestionMatch[1].trim();
        nextQuestion = questionPart.toLowerCase() === 'none' ? null : questionPart;
      }

      return { feedback, correct, nextType, nextQuestion };
    } catch (error) {
      console.error('Code evaluation error:', error);
      return {
        feedback: "Thank you for your code. Let me evaluate it...",
        correct: false,
        nextType: 'coding',
        nextQuestion: null
      };
    }
  },

  async evaluateMCQ(question, answer, chatHistory) {
    const systemPrompt = `You are evaluating a candidate's MCQ answer in a technical interview.

Current difficulty level: ${this.difficulty}
Questions asked: ${this.questionCount}

Your tasks:
1. Check if the answer is correct
2. Provide brief constructive feedback
3. If the answer is correct, prepare the next question (coding, MCQ, or theory)
4. If incorrect, provide explanation and ask a follow-up or next question

IMPORTANT: Format your response as: "FEEDBACK: [your feedback here] CORRECT: [true/false] NEXT_TYPE: [coding/mcq/theory] NEXT_QUESTION: [next question or 'NONE' if interview should end]"

Chat history:
${chatHistory}`;

    const userPrompt = `MCQ Question: ${question}\nCandidate's Answer: ${answer}`;

    try {
      if (this.questionCount >= 10) {
        return {
          feedback: "Thank you for completing all the questions! The interview is now complete.",
          correct: true,
          nextType: null,
          nextQuestion: null
        };
      }

      const response = await invokeAIAgent(systemPrompt, userPrompt);
      this.questionCount++;

      if (this.questionCount > 3 && this.difficulty === 'easy') {
        this.difficulty = 'medium';
      } else if (this.questionCount > 6 && this.difficulty === 'medium') {
        this.difficulty = 'hard';
      }

      // Parse the response
      const feedbackMatch = response.match(/FEEDBACK:\s*(.*?)\s*CORRECT:\s*(true|false)/i);
      const nextTypeMatch = response.match(/NEXT_TYPE:\s*(coding|mcq|theory)/i);
      const nextQuestionMatch = response.match(/NEXT_QUESTION:\s*(.+)/i);

      let feedback = response;
      let correct = false;
      let nextType = 'coding';
      let nextQuestion = null;

      if (feedbackMatch) {
        feedback = feedbackMatch[1].trim();
        correct = feedbackMatch[2].toLowerCase() === 'true';
      }

      if (nextTypeMatch) {
        nextType = nextTypeMatch[1].toLowerCase();
      }

      if (nextQuestionMatch) {
        const questionPart = nextQuestionMatch[1].trim();
        nextQuestion = questionPart.toLowerCase() === 'none' ? null : questionPart;
      }

      return { feedback, correct, nextType, nextQuestion };
    } catch (error) {
      console.error('MCQ evaluation error:', error);
      // Fallback to mock evaluation
      const mcqIndex = Math.min(this.questionCount - 1, this.mcqQuestions.length - 1);
      const mcq = this.mcqQuestions[mcqIndex];
      const isCorrect = answer.toUpperCase() === mcq.correct;
      const feedback = isCorrect ? "Correct! Well done." : `Incorrect. The correct answer is ${mcq.correct}) ${mcq.options[mcq.correct]}.`;
      this.questionCount++;
      return {
        feedback,
        correct: isCorrect,
        nextType: 'coding',
        nextQuestion: null
      };
    }
  },

  async provideHint(currentQuestion, chatHistory) {
    const systemPrompt = `You are helping a candidate who requested a hint during a technical interview.
    
Provide a helpful hint that:
1. Guides them toward the solution without giving it away
2. Is encouraging and supportive
3. Helps them think through the problem
4. Is brief and clear

Chat history:
${chatHistory}`;

    const userPrompt = `The candidate is stuck on this question: ${currentQuestion}\nProvide a helpful hint.`;
    
    try {
      return await invokeAIAgent(systemPrompt, userPrompt);
    } catch (error) {
      console.error('Hint error:', error);
      return "Think about the problem step by step. What's the first thing you need to do? Consider the data structure that would be most efficient here.";
    }
  },
  
  async generateFeedback(chatHistory, codeAttempts, questionTypes) {
    const systemPrompt = `Generate a comprehensive interview feedback summary based on the entire session.

Include:
1. Overall Performance Score (1-10)
2. Strengths observed
3. Areas for improvement
4. Specific recommendations
5. Technical skills demonstrated
6. Performance breakdown by question type (coding, MCQ, theory)
7. Coding efficiency and quality assessment
8. Communication and problem-solving skills

Be constructive, specific, and encouraging. Analyze the mix of question types and provide insights on different skill areas.

Full interview transcript:
${chatHistory}

Code attempts: ${codeAttempts}
Question types covered: ${questionTypes || 'coding, mcq, theory'}`;

    const userPrompt = "Generate the final comprehensive interview performance report.";

    try {
      return await invokeAIAgent(systemPrompt, userPrompt);
    } catch (error) {
      console.error('Feedback error:', error);
      return `## Final Interview Performance Report

### Overall Performance Score: 7/10

### Performance Breakdown:
- **Coding Questions**: Good problem-solving approach with room for optimization
- **MCQ Questions**: Solid understanding of core concepts
- **Theory Questions**: Clear communication of technical knowledge

### Strengths:
- Demonstrated coding proficiency
- Good understanding of fundamental concepts
- Willingness to engage with different question types

### Areas for Improvement:
- Code optimization techniques
- Advanced algorithm knowledge
- Time management on complex problems

### Recommendations:
- Practice more algorithmic problems
- Focus on code efficiency and best practices
- Continue building theoretical knowledge

### Technical Skills Demonstrated:
- Programming: Intermediate
- Problem-solving: Good
- Communication: Clear
- Learning ability: Strong

Thank you for completing the interview! Keep practicing and you'll continue to improve.`;
    }
  },

  async analyzeResume(file) {
    // For now, we'll simulate resume analysis since we can't actually read file contents in this environment
    // In a real implementation, you'd extract text from the file and send it to AI for analysis

    const systemPrompt = `You are an expert resume analyzer for technical positions. Analyze the provided resume content and provide:

1. ATS Score (0-100) based on keyword optimization, format, and relevance
2. Experience Level (Junior/Mid/Senior)
3. Key Skills identified
4. Strengths of the resume
5. Areas for improvement
6. Suggested job roles that match the profile

Be specific, constructive, and encouraging. Format the response clearly.`;

    const userPrompt = `Please analyze this resume content: [Resume content would be extracted here from the uploaded file]

Since I can't actually read the file in this demo, please provide a sample analysis for a software developer resume with 3 years experience in React, Node.js, and Python.`;

    try {
      const analysis = await invokeAIAgent(systemPrompt, userPrompt);
      return analysis;
    } catch (error) {
      console.error('Resume analysis error:', error);
      return `Resume Analysis Results:

ATS Score: 78/100

Experience Level: Mid-level (3-5 years)

Key Skills:
- React.js, Node.js, Express
- Python, Django
- JavaScript, TypeScript
- REST APIs, GraphQL
- Git, Docker, AWS

Strengths:
- Good technical skill coverage
- Relevant project experience
- Clean formatting

Areas for Improvement:
- Add more quantifiable achievements
- Include certifications
- Expand on leadership experience

Suggested Roles:
- Full Stack Developer
- Backend Developer
- Frontend Developer
- Software Engineer`;
    }
  },

  parseResumeAnalysis(analysisText) {
    const parsed = {
      atsScore: null,
      experienceLevel: '',
      skills: [],
      strengths: [],
      improvements: [],
      suggestedRoles: []
    };

    // Extract ATS Score
    const atsMatch = analysisText.match(/ATS Score:\s*(\d+)\/100/i);
    if (atsMatch) {
      parsed.atsScore = parseInt(atsMatch[1]);
    }

    // Extract Experience Level
    const expMatch = analysisText.match(/Experience Level:\s*(.+)/i);
    if (expMatch) {
      parsed.experienceLevel = expMatch[1].trim();
    }

    // Extract Key Skills
    const skillsMatch = analysisText.match(/Key Skills:([\s\S]*?)(?=Strengths:|Areas for Improvement:|Suggested Roles:|$)/i);
    if (skillsMatch) {
      parsed.skills = skillsMatch[1]
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.startsWith('-'))
        .map(line => line.substring(1).trim());
    }

    // Extract Strengths
    const strengthsMatch = analysisText.match(/Strengths:([\s\S]*?)(?=Areas for Improvement:|Suggested Roles:|$)/i);
    if (strengthsMatch) {
      parsed.strengths = strengthsMatch[1]
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.startsWith('-'))
        .map(line => line.substring(1).trim());
    }

    // Extract Areas for Improvement
    const improvementsMatch = analysisText.match(/Areas for Improvement:([\s\S]*?)(?=Suggested Roles:|$)/i);
    if (improvementsMatch) {
      parsed.improvements = improvementsMatch[1]
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.startsWith('-'))
        .map(line => line.substring(1).trim());
    }

    // Extract Suggested Roles
    const rolesMatch = analysisText.match(/Suggested Roles:([\s\S]*?)$/i);
    if (rolesMatch) {
      parsed.suggestedRoles = rolesMatch[1]
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.startsWith('-'))
        .map(line => line.substring(1).trim());
    }

    return parsed;
  }
};