import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Shield, Target, Award } from 'lucide-react';

interface InstructionsProps {
  questionCount: number;
  onStart: () => void;
  onBack: () => void;
}

const Instructions: React.FC<InstructionsProps> = ({ questionCount, onStart, onBack }) => {
  const [canProceed, setCanProceed] = useState(false);
  const [readTime, setReadTime] = useState(30);

  // Countdown for instructions reading time
  useEffect(() => {
    if (readTime > 0) {
      const timer = setTimeout(() => {
        setReadTime(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanProceed(true);
    }
  }, [readTime]);

  const instructionItems = [
    {
      icon: <Target className="w-6 h-6 text-blue-600" />,
      title: "Test Structure",
      description: `You will receive ${questionCount} questions to test your knowledge and skills.`
    },
    {
      icon: <Clock className="w-6 h-6 text-amber-600" />,
      title: "Time Limit",
      description: "Each question has a time limit of 45 seconds. After time expires, you'll automatically move to the next question."
    },
    {
      icon: <Shield className="w-6 h-6 text-green-600" />,
      title: "Rules",
      description: "You cannot return to previous questions. Select only one answer per question."
    },
    {
      icon: <Award className="w-6 h-6 text-purple-600" />,
      title: "Scoring",
      description: "Your final score will be calculated based on correct answers and shown after completion."
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-8 rounded-xl shadow-lg"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#024aad]">Test Instructions</h2>
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-[#41b0f8]" />
          <span className="text-sm text-gray-600">
            {readTime > 0 ? `Please read (${readTime}s)` : "Ready to proceed"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {instructionItems.map((item, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            className="border border-gray-100 p-4 rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="flex items-start">
              <div className="mr-3 p-2 rounded-full bg-blue-50">
                {item.icon}
              </div>
              <div>
                <h3 className="font-semibold text-[#024aad] mb-1">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="border-t border-gray-100 pt-6 flex flex-col sm:flex-row items-center justify-between">
        <div className="flex items-center mb-4 sm:mb-0">
          <input
            type="checkbox"
            id="instructionsCheckbox"
            checked={canProceed}
            onChange={(e) => setCanProceed(e.target.checked)}
            className="mr-2 w-4 h-4 text-[#024aad] rounded focus:ring-[#41b0f8]"
          />
          <label htmlFor="instructionsCheckbox" className="text-gray-700 select-none">
            I have read and understood the instructions
          </label>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={onBack}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Back
          </button>
          <button
            onClick={onStart}
            disabled={!canProceed}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              canProceed
                ? 'bg-[#024aad] text-white hover:bg-[#41b0f8]'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            Start Test
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Instructions;