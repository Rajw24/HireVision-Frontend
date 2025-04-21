import React from 'react';
import { motion } from 'framer-motion';

const LoadingScreen: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-h-[400px]">
    {/* Animated loading indicator */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      {/* Outer animated circle */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#024aad] to-[#41b0f8] animate-spin" 
           style={{ padding: '3px' }}>
        <div className="w-full h-full bg-white rounded-full"></div>
      </div>
      
      {/* Inner pulsing circle */}
      <motion.div
        animate={{ scale: [0.95, 1.05, 0.95] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="relative w-24 h-24 rounded-full bg-gradient-to-r from-[#024aad] to-[#41b0f8]"
      >
        <div className="absolute inset-1 bg-white rounded-full flex items-center justify-center">
          <span className="text-2xl font-bold text-[#024aad]">HV</span>
        </div>
      </motion.div>
    </motion.div>
    
    <motion.p
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="mt-8 text-lg text-gray-600 animate-pulse"
    >
      Loading your questions...
    </motion.p>
    
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6, duration: 0.5 }}
      className="mt-2 text-sm text-gray-500"
    >
      This may take a few moments
    </motion.p>
  </div>
);

export default LoadingScreen;