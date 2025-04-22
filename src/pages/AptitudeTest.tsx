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
              className={`w-full text-left p-4 rounded-lg border transition-all duration-200 ${
                userAnswers.get(currentQ.id) === option
                  ? 'border-[#024aad] bg-[#f0f7ff] shadow-sm'
                  : 'border-gray-200 hover:border-[#41b0f8] hover:bg-[#f8fafc]'
              }`}
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
              className={`px-6 py-2 rounded-lg font-medium transition-colors duration-200 ${
                hasAnswered
                  ? 'bg-[#024aad] text-white hover:bg-[#41b0f8]'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              Next Question
            </button>
          ) : (
            <button
              onClick={submitAnswers}
              disabled={!hasAnswered}
              className={`px-6 py-2 rounded-lg font-medium transition-colors duration-200 ${
                hasAnswered
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
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
    <div className="min-h-screen bg-gray-50 py-12">
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
                  className="text-[#024aad] hover:underline font-medium flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Categories
                </button>
              </div>
            )}

            {/* Initial Start Test Screen */}
            {!showInstructions && !testStarted && !showScore && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <h1 className="text-4xl font-bold text-[#024aad] mb-8">Aptitude Test</h1>
                <p className="text-xl text-gray-600 mb-12">
                  Test your skills with our comprehensive aptitude assessment
                </p>
                <motion.button
                  onClick={handleStartTest}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-[#024aad] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#41b0f8] transition-colors shadow-md"
                >
                  Start Test
                </motion.button>
              </motion.div>
            )}

            {/* Instructions Screen */}
            {showInstructions && !testStarted && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-8 rounded-xl shadow-lg"
              >
                <h2 className="text-2xl font-bold text-[#024aad] mb-6">Test Instructions</h2>
                <div className="space-y-4 text-gray-600">
                  <p className="flex items-start">
                    <span className="inline-flex items-center justify-center bg-[#41b0f8] text-white rounded-full w-6 h-6 mr-3 flex-shrink-0 text-sm">1</span>
                    You will receive {config?.questionCount} questions.
                  </p>
                  <p className="flex items-start">
                    <span className="inline-flex items-center justify-center bg-[#41b0f8] text-white rounded-full w-6 h-6 mr-3 flex-shrink-0 text-sm">2</span>
                    Each question has a time limit of 3 minutes.
                  </p>
                  <p className="flex items-start">
                    <span className="inline-flex items-center justify-center bg-[#41b0f8] text-white rounded-full w-6 h-6 mr-3 flex-shrink-0 text-sm">3</span>
                    You cannot return to previous questions.
                  </p>
                  <p className="flex items-start">
                    <span className="inline-flex items-center justify-center bg-[#41b0f8] text-white rounded-full w-6 h-6 mr-3 flex-shrink-0 text-sm">4</span>
                    Select only one answer per question.
                  </p>
                  <p className="flex items-start">
                    <span className="inline-flex items-center justify-center bg-[#41b0f8] text-white rounded-full w-6 h-6 mr-3 flex-shrink-0 text-sm">5</span>
                    Your final score will be shown after completion.
                  </p>
                </div>
                
                <div className="mt-8 flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="instructionsCheckbox"
                      className="mr-2 h-4 w-4 text-[#024aad] focus:ring-[#41b0f8] border-gray-300 rounded"
                      onChange={(e) => setCanProceed(e.target.checked)}
                    />
                    <label htmlFor="instructionsCheckbox" className="text-gray-700">
                      I have read and understood the instructions
                    </label>
                  </div>
                  <motion.button
                    onClick={startTest}
                    disabled={!canProceed}
                    whileHover={canProceed ? { scale: 1.05 } : {}}
                    whileTap={canProceed ? { scale: 0.95 } : {}}
                    className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                      canProceed
                        ? 'bg-[#024aad] text-white hover:bg-[#41b0f8] shadow-md'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Start Test
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Test Questions */}
            {testStarted && !showScore && !isLoading && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-8 rounded-xl shadow-lg"
              >
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-semibold text-[#024aad]">
                    Question {currentQuestion + 1} of {questions.length}
                  </h3>
                  {questions.length > 0 && (
                    <div className="bg-[#f8fafc] px-4 py-2 rounded-lg border border-[#e1e7ef] flex items-center">
                      <Clock className="text-[#41b0f8] mr-2 h-5 w-5" />
                      <Countdown
                        date={countdownTime}
                        onComplete={handleTimerComplete}
                        renderer={({ minutes, seconds }) => (
                          <span className="font-mono font-medium">
                            {minutes}:{seconds.toString().padStart(2, '0')}
                          </span>
                        )}
                      />
                    </div>
                  )}
                </div>

                {renderQuestion()}
              </motion.div>
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
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#024aad] mb-4">Welcome to HireVision</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Aptitude questions and answers for your placement interviews and competitive exams
          </p>
        </div>

        {/* Category Cards - 2 per row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {categories.map(category => (
            <motion.div
              key={category.id}
              whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
              transition={{ duration: 0.2 }}
              onClick={() => onSelectCategory(category.id)}
              className="bg-white rounded-xl shadow-md p-6 cursor-pointer border border-gray-100 hover:border-[#41b0f8] transition-all duration-200"
            >
              <h3 className="text-xl font-bold text-[#024aad] mb-3">{category.name}</h3>
              <p className="text-gray-600 mb-4">{category.description || 'Test your skills in this category.'}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {category.questionCount || 15} questions
                </span>
                <span className="inline-flex items-center justify-center bg-[#e6f0ff] text-[#024aad] px-3 py-1 rounded-full text-sm font-medium">
                  {category.difficulty || 'Moderate'}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Featured Categories Row (Optional) */}
        {categories.filter(category => category.featured).length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-[#024aad] mb-6 text-center">Featured Categories</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {categories
                .filter(category => category.featured)
                .map(category => (
                  <motion.div
                    key={category.id}
                    whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
                    transition={{ duration: 0.2 }}
                    onClick={() => onSelectCategory(category.id)}
                    className="bg-gradient-to-br from-[#024aad] to-[#41b0f8] text-white rounded-xl shadow-md p-6 cursor-pointer transition-all duration-200"
                  >
                    <h3 className="text-xl font-bold mb-3">{category.name}</h3>
                    <p className="text-white text-opacity-90 mb-4">{category.description || 'Test your skills in this category.'}</p>
                    <div className="flex justify-end">
                      <span className="inline-flex items-center justify-center bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm font-medium">
                        Start Test
                      </span>
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>
        )}
      </div>
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