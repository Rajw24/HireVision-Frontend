import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, Mic, MessageSquare, CheckCircle } from 'lucide-react';
import ResumeUploadModal from '../components/ResumeUploadModal';

function MockInterviewLanding() {
  const navigate = useNavigate();
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);

  const startInterview = () => {
    setIsResumeModalOpen(true);
  };

  const handleResumeUpload = (file: File) => {
    console.log('Uploaded file:', file);
    navigate('/mock-interview/start');
  };

  const handleStartWithoutResume = () => {
    navigate('/mock-interview/start');
  };

  return (
    <div className="min-h-screen bg-white py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#024aad] mb-8">AI Mock Interview</h1>
          <p className="text-xl text-gray-600 mb-12">
            Get ready for your next interview with our AI-powered mock interview system.
            Practice with real interview questions and receive instant feedback.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-[#f8fafc] p-6 rounded-xl">
            <Video className="w-12 h-12 text-[#41b0f8] mb-4" />
            <h3 className="text-xl font-semibold text-[#024aad] mb-2">Video Analysis</h3>
            <p className="text-gray-600">
              Our AI analyzes your facial expressions, body language, and eye contact.
            </p>
          </div>
          <div className="bg-[#f8fafc] p-6 rounded-xl">
            <Mic className="w-12 h-12 text-[#41b0f8] mb-4" />
            <h3 className="text-xl font-semibold text-[#024aad] mb-2">Speech Analysis</h3>
            <p className="text-gray-600">
              Get feedback on your speaking pace, clarity, and confidence level.
            </p>
          </div>
          <div className="bg-[#f8fafc] p-6 rounded-xl">
            <MessageSquare className="w-12 h-12 text-[#41b0f8] mb-4" />
            <h3 className="text-xl font-semibold text-[#024aad] mb-2">Answer Evaluation</h3>
            <p className="text-gray-600">
              Receive detailed feedback on your responses and suggestions for improvement.
            </p>
          </div>
          <div className="bg-[#f8fafc] p-6 rounded-xl">
            <CheckCircle className="w-12 h-12 text-[#41b0f8] mb-4" />
            <h3 className="text-xl font-semibold text-[#024aad] mb-2">Performance Score</h3>
            <p className="text-gray-600">
              Get a comprehensive score based on multiple performance metrics.
            </p>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={startInterview}
            className="bg-[#024aad] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#41b0f8] transition-colors text-lg"
          >
            Start Mock Interview
          </button>
          <p className="mt-4 text-sm text-gray-500">
            Note: You'll need to upload your resume before starting the interview
          </p>
        </div>
      </div>

      <ResumeUploadModal
        isOpen={isResumeModalOpen}
        onClose={() => setIsResumeModalOpen(false)}
        onUpload={handleResumeUpload}
        onStartWithoutResume={handleStartWithoutResume}
      />
    </div>
  );
}

export default MockInterviewLanding;