import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Award, TrendingUp, BarChart } from 'lucide-react';
import { ExamResult } from '../../types/aptitude';

interface ResultsProps {
  results: ExamResult;
  onRetake: () => void;
}

const Results: React.FC<ResultsProps> = ({ results, onRetake }) => {
  const { score, total } = results;
  const percentage = Math.round((score / total) * 100);
  const isPassing = percentage >= 70; // Assuming 70% is passing

  // Calculate the circumference of the circle
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Get color based on score
  const getScoreColor = () => {
    if (percentage >= 90) return 'text-green-500';
    if (percentage >= 70) return 'text-blue-500';
    if (percentage >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  // Define statistics to show
  const statistics = [
    {
      icon: <TrendingUp className="w-5 h-5 text-blue-500" />,
      label: "Score",
      value: `${score}/${total}`,
    },
    {
      icon: <BarChart className="w-5 h-5 text-green-500" />,
      label: "Accuracy",
      value: `${percentage}%`,
    },
    {
      icon: <Award className="w-5 h-5 text-amber-500" />,
      label: "Status",
      value: isPassing ? "Passed" : "Failed",
      valueClass: isPassing ? "text-green-500" : "text-red-500"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center max-w-lg mx-auto"
    >
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring" }}
        className="mb-10"
      >
        <div className="mx-auto relative w-36 h-36 mb-4">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
            <circle 
              cx="100" 
              cy="100" 
              r={radius} 
              stroke="#e5e7eb" 
              strokeWidth="12" 
              fill="none" 
            />
            <circle 
              cx="100" 
              cy="100" 
              r={radius} 
              stroke={isPassing ? "#22c55e" : "#ef4444"} 
              strokeWidth="12" 
              fill="none" 
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-4xl font-bold ${getScoreColor()}`}>{percentage}%</span>
            <span className="text-sm text-gray-500">Your Score</span>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-[#024aad] mb-1">
          {isPassing ? "Congratulations!" : "Test Completed"}
        </h2>
        <p className="text-gray-600">
          {isPassing 
            ? "You passed the test with excellent performance!" 
            : "You've completed the test. Keep practicing to improve your score."}
        </p>
      </motion.div>
      
      <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
        <h3 className="text-lg font-semibold text-[#024aad] mb-4">Performance Summary</h3>
        
        <div className="grid grid-cols-3 gap-4">
          {statistics.map((stat, index) => (
            <motion.div 
              key={index}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 + (index * 0.1) }}
              className="text-center"
            >
              <div className="flex justify-center mb-2">{stat.icon}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
              <div className={`font-bold text-lg ${stat.valueClass || 'text-gray-800'}`}>{stat.value}</div>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        onClick={onRetake}
        className="bg-[#024aad] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#41b0f8] transition-colors"
      >
        Take Another Test
      </motion.button>
    </motion.div>
  );
};

export default Results;