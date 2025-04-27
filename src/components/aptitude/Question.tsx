import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Countdown from 'react-countdown';
import { Clock, ArrowRight, CheckCircle } from 'lucide-react';
import { Question as QuestionType } from '../../types/aptitude';

interface QuestionProps {
  question: QuestionType;
  currentQuestionIndex: number;
  totalQuestions: number;
  selectedAnswer: string | null;
  timeLimit: number;
  onSelectAnswer: (answer: string) => void;
  onTimeUp: () => void;
  onNextQuestion: () => void;
  isLastQuestion: boolean;
}

interface TimerRendererProps {
  seconds: number;
  completed: boolean;
}

const Question: React.FC<QuestionProps> = ({
  question,
  currentQuestionIndex,
  totalQuestions,
  selectedAnswer,
  timeLimit,
  onSelectAnswer,
  onTimeUp,
  onNextQuestion,
  isLastQuestion
}) => {
  const [countdownTime, setCountdownTime] = useState(Date.now() + timeLimit);
  const [animateTimeWarning, setAnimateTimeWarning] = useState(false);

  // Reset timer when question changes
  useEffect(() => {
    setCountdownTime(Date.now() + timeLimit);
    setAnimateTimeWarning(false);
  }, [question.id, timeLimit]);

  // Timer component renderer
  const renderTimer = ({ seconds, completed }: TimerRendererProps) => {
    const timePercentage = (seconds / (timeLimit / 1000)) * 100;
    let timerColor = 'bg-green-500';
    
    if (timePercentage < 60 && timePercentage >= 30) {
      timerColor = 'bg-yellow-500';
    } else if (timePercentage < 30) {
      timerColor = 'bg-red-500';
      if (!animateTimeWarning && timePercentage < 20) {
        setAnimateTimeWarning(true);
      }
    }

    if (completed) {
      return <div className="font-mono text-red-500">Time's up!</div>;
    }

    return (
      <div className="flex flex-col">
        <div className="flex items-center">
          <Clock className={`w-4 h-4 mr-1 ${animateTimeWarning ? 'animate-pulse text-red-500' : 'text-[#41b0f8]'}`} />
          <span className={`font-mono ${animateTimeWarning ? 'text-red-500' : 'text-gray-700'}`}>
            {seconds}s
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
          <div 
            className={`h-1.5 rounded-full ${timerColor} transition-all duration-1000 ease-linear`}
            style={{ width: `${timePercentage}%` }}
          ></div>
        </div>
      </div>
    );
  };

  // Progress indicator
  const progressPercentage = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-white p-6 rounded-xl shadow-lg"
    >
      <div className="flex justify-between items-center mb-6">
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold text-[#024aad]">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </h3>
          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1.5 w-48">
            <div 
              className="h-1.5 rounded-full bg-[#41b0f8] transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
        <Countdown
          date={countdownTime}
          onComplete={onTimeUp}
          renderer={renderTimer}
        />
      </div>

      <div className="mb-8">
        <p className="text-lg text-gray-800 font-medium">{question.question}</p>
      </div>

      <div className="space-y-3 mb-8">
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === option;
          return (
            <motion.button
              key={index}
              onClick={() => onSelectAnswer(option)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className={`w-full text-left p-4 rounded-lg border-2 flex justify-between items-center group transition-all ${
                isSelected
                  ? 'border-[#024aad] bg-blue-50 text-[#024aad]'
                  : 'border-gray-200 hover:border-[#41b0f8] hover:bg-blue-50/30'
              }`}
            >
              <span className="flex-1">{option}</span>
              {isSelected && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-6 h-6 rounded-full bg-[#024aad] flex items-center justify-center"
                >
                  <CheckCircle className="w-4 h-4 text-white" />
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>
      
      <div className="flex justify-end">
        <motion.button
          onClick={onNextQuestion}
          disabled={!selectedAnswer}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`flex items-center px-6 py-2.5 rounded-lg font-medium transition-colors ${
            selectedAnswer
              ? isLastQuestion 
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-[#024aad] text-white hover:bg-[#41b0f8]'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isLastQuestion ? (
            <>Submit Test</>
          ) : (
            <>Next <ArrowRight className="ml-1 w-4 h-4" /></>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Question;