import React, { useState, useEffect, Fragment, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import Countdown from 'react-countdown';
import axios from 'axios';
import { Question, ExamConfig, UserAnswer, ExamResponse, ExamResult, ExamError } from '../types/aptitude';
import TokenService from '../services/TokenService';
import { categories } from '../data/categories';

// Add API base URL
const API_BASE_URL = 'http://localhost:8000';

/* ------------------------------------------------------------------
   APTITUDE TEST COMPONENT (Second Page)
--------------------------------------------------------------------*/
function AptitudeTest({ onBack, selectedCategory }) {
  const [config] = useState({ difficulty: 'moderate', questionCount: 15 }); // Set default config
  const [showInstructions, setShowInstructions] = useState(false);
  const [canProceed, setCanProceed] = useState(false);
  const [testStarted, setTestStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showScore, setShowScore] = useState(false);
  // Score is not dynamically calculated in this sample; you can enhance as needed
  const [score] = useState(0);

  // New state variables
  const [questions, setQuestions] = useState<Question[]>([]);
  const [examId, setExamId] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<Map<number, string>>(new Map());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<ExamResult | null>(null);
  const [countdownTime, setCountdownTime] = useState(Date.now() + 45000);

  useEffect(() => {
    if (showInstructions) {
      const timer = setTimeout(() => {
        setCanProceed(true);
      }, 30000); // 30 seconds
      return () => clearTimeout(timer);
    }
  }, [showInstructions]);

  const handleStartTest = () => {
    setShowInstructions(true);
  };

  // Fetch questions from API
  const fetchQuestions = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const token = TokenService.getAccessToken(); // Assuming token is stored in localStorage
      const response = await axios.post<ExamResponse>(
        `${API_BASE_URL}/aptitude/start-exam/`,
        {
          category_id: selectedCategory // Add category ID to request body
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setExamId(response.data.exam_id);
      setQuestions(response.data.questions);
      setTestStarted(true);
      setCountdownTime(Date.now() + 45000); // Set timer only after questions are loaded
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load questions');
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory]); // Add selectedCategory to dependency array

  // Handle answer selection
  const handleAnswerSelection = useCallback((questionId: number, answer: string) => {
    setUserAnswers(prev => new Map(prev).set(questionId, answer));
  }, []); // Remove currentQuestion from dependencies

  // Add handle next question
  const handleNextQuestion = useCallback(() => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setCountdownTime(Date.now() + 45000); // Reset timer when moving to next question
    }
  }, [currentQuestion, questions.length]);

  // Submit answers
  const submitAnswers = useCallback(async () => {
    if (!examId) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const token = TokenService.getAccessToken();
      const answers: UserAnswer[] = Array.from(userAnswers.entries()).map(([question_id, answer]) => ({
        question_id,
        answer,
      }));

      const response = await axios.post<ExamResult>(
        `${API_BASE_URL}/aptitude/submit-exam/`,
        {
          exam_id: examId,
          answers,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setResults(response.data);
      setShowScore(true);
      setTestStarted(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit answers');
    } finally {
      setIsLoading(false);
    }
  }, [examId, userAnswers]);

  // Add timer completion handler
  const handleTimerComplete = useCallback(() => {
    if (currentQuestion < questions.length - 1) {
      // If current question has no answer, set it to null before moving to next
      if (!userAnswers.has(questions[currentQuestion].id)) {
        setUserAnswers(prev => new Map(prev).set(questions[currentQuestion].id, null));
      }
      handleNextQuestion();
    } else {
      // On last question, submit the test
      submitAnswers();
    }
  }, [currentQuestion, questions, userAnswers, handleNextQuestion, submitAnswers]);

  // Display results
  const displayResults = useCallback(() => {
    if (!results) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="mb-8">
          <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-[#024aad]">Test Completed!</h2>
        </div>
        
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md mx-auto">
          <h3 className="text-2xl font-semibold text-[#024aad] mb-4">Your Score</h3>
          <div className="text-5xl font-bold text-[#41b0f8] mb-4">
            {Math.round((results.score / results.total) * 100)}%
          </div>
          <p className="text-gray-600">
            You got {results.score} out of {results.total} questions correct.
          </p>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="mt-8 bg-[#024aad] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#41b0f8] transition-colors"
        >
          Take Another Test
        </button>
      </motion.div>
    );
  }, [results]);

  // Error display component
  const ErrorMessage = ({ message }: { message: string }) => (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
      <div className="flex items-center">
        <AlertCircle className="w-5 h-5 mr-2" />
        <span>{message}</span>
      </div>
    </div>
  );

  // Updated startTest handler
  const startTest = useCallback(() => {
    fetchQuestions();  // First fetch questions
    setShowInstructions(false);  // Then hide instructions
    setTestStarted(true);  // And set test as started
  }, [fetchQuestions]);

  // Update the loading component
  const LoadingScreen = () => (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      {/* Outer animated circle */}
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#024aad] to-[#41b0f8] animate-spin" 
             style={{ padding: '3px' }}>
          <div className="w-full h-full bg-white rounded-full"></div>
        </div>
        {/* Inner pulsing circle */}
        <div className="relative w-24 h-24 rounded-full bg-gradient-to-r from-[#024aad] to-[#41b0f8] animate-pulse">
          <div className="absolute inset-1 bg-white rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-[#024aad]">HV</span>
          </div>
        </div>
      </div>
      <p className="mt-8 text-lg text-gray-600 animate-pulse">Loading your questions...</p>
      <p className="mt-2 text-sm text-gray-500">This may take a few moments</p>
    </div>
  );

  // Update the renderQuestion function to use the new loading screen
  const renderQuestion = useCallback(() => {
    if (isLoading) return <LoadingScreen />;
    if (error) return <ErrorMessage message={error} />;

    const currentQ = questions[currentQuestion];
    if (!currentQ) return null;

    const hasAnswered = userAnswers.has(currentQ.id);
    const isLastQuestion = currentQuestion === questions.length - 1;

    return (
      <div className="space-y-6">
        <p className="text-lg text-gray-700">{currentQ.question}</p>
        <div className="space-y-4">
          {currentQ.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelection(currentQ.id, option)}
              className={`w-full text-left p-4 rounded-lg border ${
                userAnswers.get(currentQ.id) === option
                  ? 'border-[#024aad] bg-[#f8fafc]'
                  : 'border-gray-200 hover:border-[#024aad] hover:bg-[#f8fafc]'
              } transition-colors`}
            >
              {option}
            </button>
          ))}
        </div>
        
        <div className="flex justify-end mt-6">
          {!isLastQuestion ? (
            <button
              onClick={handleNextQuestion}
              disabled={!hasAnswered}
              className={`px-6 py-2 rounded-lg font-medium ${
                hasAnswered
                  ? 'bg-[#024aad] text-white hover:bg-[#41b0f8]'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              } transition-colors`}
            >
              Next Question
            </button>
          ) : (
            <button
              onClick={submitAnswers}
              disabled={!hasAnswered}
              className={`px-6 py-2 rounded-lg font-medium ${
                hasAnswered
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              } transition-colors`}
            >
              Submit Test
            </button>
          )}
        </div>
      </div>
    );
  }, [currentQuestion, questions, isLoading, error, userAnswers, handleAnswerSelection, handleNextQuestion, submitAnswers]);

  // Update the return section to show loading screen properly
  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Show loading screen when loading is true */}
        {isLoading && <LoadingScreen />}

        {/* Only show other content when not loading */}
        {!isLoading && (
          <>
            {/* Back Button */}
            {!testStarted && onBack && (
              <div className="mb-4">
                <button 
                  onClick={onBack} 
                  className="text-[#024aad] hover:underline font-medium"
                >
                  &larr; Back
                </button>
              </div>
            )}

            {/* Initial Start Test Screen */}
            {!showInstructions && !testStarted && !showScore && (
              <div className="text-center">
                <h1 className="text-4xl font-bold text-[#024aad] mb-8">Aptitude Test</h1>
                <p className="text-xl text-gray-600 mb-12">
                  Test your skills with our comprehensive aptitude assessment
                </p>
                <button
                  onClick={handleStartTest}
                  className="bg-[#024aad] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#41b0f8] transition-colors"
                >
                  Start Test
                </button>
              </div>
            )}

            {/* Instructions Screen */}
            {showInstructions && !testStarted && (
              <div className="bg-white p-8 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold text-[#024aad] mb-6">Test Instructions</h2>
                <div className="space-y-4 text-gray-600">
                  <p>1. You will receive {config?.questionCount} questions.</p>
                  <p>2. Each question has a time limit of 3 minutes.</p>
                  <p>3. You cannot return to previous questions.</p>
                  <p>4. Select only one answer per question.</p>
                  <p>5. Your final score will be shown after completion.</p>
                </div>
                
                <div className="mt-8 flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="instructionsCheckbox"
                      className="mr-2"
                      onChange={(e) => setCanProceed(e.target.checked)}
                    />
                    <label htmlFor="instructionsCheckbox" className="text-gray-700">
                      I have read and understood the instructions
                    </label>
                  </div>
                  <button
                    onClick={startTest}
                    disabled={!canProceed}
                    className={`px-6 py-2 rounded-lg font-medium ${
                      canProceed
                        ? 'bg-[#024aad] text-white hover:bg-[#41b0f8]'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Start Test
                  </button>
                </div>
              </div>
            )}

            {/* Test Questions */}
            {testStarted && !showScore && !isLoading && (
              <div className="bg-white p-8 rounded-xl shadow-lg">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-semibold text-[#024aad]">
                    Question {currentQuestion + 1} of {config?.questionCount}
                  </h3>
                  {questions.length > 0 && (
                    <Countdown
                      date={countdownTime}
                      onComplete={handleTimerComplete}
                      renderer={({ minutes, seconds }) => (
                        <div className="flex items-center">
                          <Clock className="text-[#41b0f8] mr-2" />
                          <span className="font-mono">
                            {minutes}:{seconds.toString().padStart(2, '0')}
                          </span>
                        </div>
                      )}
                    />
                  )}
                </div>

                {renderQuestion()}
              </div>
            )}

            {/* Score Screen */}
            {showScore && displayResults()}
          </>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
   HIREVISION HOME COMPONENT (First Page)
--------------------------------------------------------------------*/
function HireVisionHome({ onSelectCategory }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Left Sidebar */}
      <aside className="w-64 bg-white shadow-md p-4">
        <nav className="space-y-2">
          <p className="text-sm font-semibold text-gray-500 px-2 uppercase">Categories</p>
          <ul className="space-y-1">
            {categories.map((category) => (
              <li key={category.id}>
                <button
                  onClick={() => onSelectCategory(category.id)}
                  className="w-full text-left block px-3 py-2 rounded hover:bg-gray-100 text-gray-700"
                >
                  {category.name}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Welcome Section */}
        <div className="bg-white p-4 rounded-md shadow-sm mb-6">
          <h2 className="text-xl font-bold text-gray-800">Welcome to HireVision!</h2>
          <p className="text-gray-600 mt-1">
            Aptitude questions and answers for your placement interviews and competitive exams!
          </p>
        </div>

        {/* Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories
            .filter(category => category.displayOnHome)
            .map(category => (
              <div
                key={category.id}
                onClick={() => onSelectCategory(category.id)}
                className="bg-white rounded-md shadow-sm p-4 cursor-pointer hover:shadow-md transition"
              >
                <h3 className="text-lg font-bold text-[#024aad] mb-2">{category.name}</h3>
                <p className="text-sm text-gray-600">{category.description}</p>
              </div>
            ))}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          © HireVision™ Technologies
        </div>
      </main>
    </div>
  );
}

/* ------------------------------------------------------------------
   MAIN APP COMPONENT
--------------------------------------------------------------------*/
export default function App() {
  const [selectedCategory, setSelectedCategory] = useState(null);

  // If no category is selected, show the HireVision homepage
  if (!selectedCategory) {
    return <HireVisionHome onSelectCategory={setSelectedCategory} />;
  }

  // If a category is selected, show the AptitudeTest component with a Back button
  return <AptitudeTest 
    onBack={() => setSelectedCategory(null)} 
    selectedCategory={selectedCategory}
  />;
}