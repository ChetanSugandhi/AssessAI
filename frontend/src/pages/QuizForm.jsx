import { useState } from 'react';
import { 
  ArrowLeft,
  AlertCircle,
  Save,
  Send,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QuizForm = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);

  const quiz = {
    title: "Calculus Quiz 1",
    description: "This quiz covers differentiation and basic integration techniques",
    totalQuestions: 6,
    questions: [
      {
        id: 1,
        type: 'mcq',
        question: 'What is the derivative of y = x²?',
        options: ['y = 2x', 'y = x', 'y = 2x²', 'y = ½x²'],
        correctOption: 0 // Index of correct answer
      },
      {
        id: 2,
        type: 'mcq',
        question: 'Which of the following is the correct integration of 2x?',
        options: ['x²', 'x² + C', '2x² + C', 'x² - C'],
        correctOption: 1
      },
      {
        id: 3,
        type: 'paragraph',
        question: 'Explain the chain rule and provide an example of its application.',
      },
      {
        id: 4,
        type: 'mcq',
        question: 'What is the derivative of sin(x)?',
        options: ['cos(x)', '-sin(x)', '-cos(x)', 'tan(x)'],
        correctOption: 0
      },
      {
        id: 5,
        type: 'paragraph',
        question: 'Describe the relationship between differentiation and integration. How are they inverse operations?',
      },
      {
        id: 6,
        type: 'mcq',
        question: 'Which of the following is NOT a valid integration rule?',
        options: [
          '∫(f(x) + g(x))dx = ∫f(x)dx + ∫g(x)dx',
          '∫kf(x)dx = k∫f(x)dx',
          '∫(f(x)/g(x))dx = ∫f(x)dx/∫g(x)dx',
          '∫x^n dx = (x^(n+1))/(n+1) + C'
        ],
        correctOption: 2
      }
    ]
  };

  const handleMCQAnswerChange = (questionId, option, optionIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: {
        type: 'mcq',
        selectedOption: option,
        optionIndex: optionIndex
      }
    }));
  };

  const handleParagraphAnswerChange = (questionId, text) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: {
        type: 'paragraph',
        text: text
      }
    }));
  };

  const goBack = () => {
    navigate(-1);
  };

  const handleSubmit = () => {
    console.log('Submitting answers:', answers);
    // Here you can see the different data structures for MCQs and paragraphs
    navigate(-1);
  };

  // Helper to check if a question has been answered
  const isQuestionAnswered = (questionId) => {
    return !!answers[questionId];
  };
  
  // Check if all questions have been answered
  const areAllQuestionsAnswered = () => {
    return quiz.questions.every((_, index) => isQuestionAnswered(index + 1));
  };
  
  // Determine if the submit button should be shown
  const isLastQuestion = currentQuestion === quiz.totalQuestions - 1;
  const canSubmit = isLastQuestion && areAllQuestionsAnswered();
  
  // Check for unanswered questions
  const getUnansweredQuestions = () => {
    return quiz.questions
      .map((_, index) => index + 1)
      .filter(questionId => !isQuestionAnswered(questionId));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      {/* Confirmation Dialog */}
      {showConfirmSubmit && (
        <div className="fixed inset-0 flex items-center justify-center z-[1000]">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"></div>
          <div className="relative bg-slate-900 rounded-xl p-6 w-full max-w-md border border-slate-800 shadow-xl">
            <h3 className="text-xl font-bold text-cyan-400 mb-4">Submit Quiz?</h3>
            <p className="text-slate-300 mb-6">
              Are you sure you want to submit your quiz? Make sure you have reviewed all your answers.
              This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirmSubmit(false)}
                className="px-4 py-2 text-slate-300 hover:text-white transition-colors"
              >
                Review Answers
              </button>
              <button
                onClick={handleSubmit}
                className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
              >
                <Send className="mr-2 h-4 w-4" /> Submit Quiz
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button 
            onClick={goBack} 
            className="bg-slate-800 p-2 rounded-full mr-4 hover:bg-slate-700 transition-colors"
          >
            <ArrowLeft />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-cyan-400">{quiz.title}</h1>
            <p className="text-slate-400">{quiz.description}</p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-slate-800 rounded-full h-2 mb-6">
        <div 
          className="bg-cyan-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${((currentQuestion + 1) / quiz.totalQuestions) * 100}%` }}
        ></div>
      </div>

      {/* Question Navigation */}
      <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
        {quiz.questions.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentQuestion(index)}
            className={`
              flex items-center justify-center w-10 h-10 rounded-lg font-medium transition-colors
              ${currentQuestion === index 
                ? 'bg-cyan-600 text-white' 
                : isQuestionAnswered(index + 1) 
                  ? 'bg-slate-700 text-cyan-400' 
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }
            `}
          >
            {isQuestionAnswered(index + 1) ? <CheckCircle className="h-4 w-4" /> : index + 1}
          </button>
        ))}
      </div>

      {/* Question Card */}
      <div className="bg-slate-900 rounded-xl shadow-2xl p-6 border border-slate-800 mb-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-slate-400">Question {currentQuestion + 1} of {quiz.totalQuestions}</span>
          <span className={`
            px-3 py-1 rounded-full text-xs
            ${quiz.questions[currentQuestion].type === 'mcq' 
              ? 'bg-purple-900 text-purple-400' 
              : 'bg-cyan-900 text-cyan-400'
            }
          `}>
            {quiz.questions[currentQuestion].type === 'mcq' ? 'Multiple Choice' : 'Paragraph'}
          </span>
        </div>

        <h2 className="text-xl font-semibold mb-6">{quiz.questions[currentQuestion].question}</h2>

        {quiz.questions[currentQuestion].type === 'mcq' ? (
          <div className="space-y-3">
            {quiz.questions[currentQuestion].options.map((option, index) => {
              const currentAnswer = answers[currentQuestion + 1];
              const isSelected = currentAnswer && currentAnswer.optionIndex === index;
              
              return (
                <label 
                  key={index}
                  className={`
                    block p-4 rounded-lg border-2 transition-all cursor-pointer
                    ${isSelected
                      ? 'bg-cyan-900/50 border-cyan-500'
                      : 'bg-slate-800 border-transparent hover:border-slate-600'
                    }
                  `}
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestion}`}
                    value={option}
                    checked={isSelected}
                    onChange={() => handleMCQAnswerChange(currentQuestion + 1, option, index)}
                    className="hidden"
                  />
                  <div className="flex items-center">
                    <div className={`
                      w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center
                      ${isSelected
                        ? 'border-cyan-500 bg-cyan-500'
                        : 'border-slate-600'
                      }
                    `}>
                      {isSelected && (
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      )}
                    </div>
                    {option}
                  </div>
                </label>
              );
            })}
          </div>
        ) : (
          <textarea
            value={answers[currentQuestion + 1]?.text || ''}
            onChange={(e) => handleParagraphAnswerChange(currentQuestion + 1, e.target.value)}
            className="w-full h-48 bg-slate-800 border border-slate-700 rounded-lg p-4 text-white resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            placeholder="Type your answer here..."
          />
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button
          onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
          disabled={currentQuestion === 0}
          className={`
            px-4 py-2 rounded-lg flex items-center transition-colors
            ${currentQuestion === 0
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
              : 'bg-slate-800 text-white hover:bg-slate-700'
            }
          `}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Previous
        </button>

        <div className="flex space-x-3">
          {isLastQuestion && (
            <button
              onClick={() => {
                if (areAllQuestionsAnswered()) {
                  setShowConfirmSubmit(true);
                } else {
                  // Get unanswered question indices
                  const unanswered = getUnansweredQuestions();
                  alert(`Please answer all questions before submitting. Questions ${unanswered.join(', ')} are unanswered.`);
                }
              }}
              className={`
                px-4 py-2 rounded-lg transition-colors flex items-center
                ${areAllQuestionsAnswered()
                  ? 'bg-cyan-600 hover:bg-cyan-700 text-white'
                  : 'bg-slate-700 text-slate-300'
                }
              `}
            >
              <Send className="mr-2 h-4 w-4" /> Submit Quiz
            </button>
          )}
          
          {currentQuestion < quiz.totalQuestions - 1 && (
            <button
              onClick={() => setCurrentQuestion(prev => Math.min(quiz.totalQuestions - 1, prev + 1))}
              className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
            >
              Next <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
            </button>
          )}
        </div>
      </div>

      {/* Help Text */}
      <div className="mt-6 bg-slate-800/50 rounded-lg p-4 flex items-start">
        <HelpCircle className="text-cyan-400 mr-3 h-5 w-5 mt-0.5" />
        <div>
          <h3 className="text-sm font-semibold text-cyan-400">Need Help?</h3>
          <p className="text-sm text-slate-400">
            You can navigate between questions using the number buttons above or the previous/next buttons.
            Your answers are automatically saved. You must answer all questions before submitting the quiz.
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuizForm;