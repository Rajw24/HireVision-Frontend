import React, { useState, useEffect, useRef } from 'react';
import { Settings, Sun, Mic, ChevronDown, ArrowLeft, RotateCcw, Copy, Video, VideoOff, Volume2, VolumeX, Send, X } from 'lucide-react';

// Mock interview questions
const interviewQuestions = [
  "Can you tell me about a challenging project you worked on and how you handled it?",
  "How do you handle conflicts in a team environment?",
  "What's your approach to learning new technologies?",
  "Describe a situation where you had to meet a tight deadline.",
  "How do you ensure code quality in your projects?"
];

interface Message {
  id: string;
  type: 'ai' | 'user';
  text: string;
  timestamp: string;
}

interface SettingsConfig {
  verbosity: 'concise' | 'default' | 'lengthy';
  temperature: 'low' | 'default' | 'high';
  performance: 'speed' | 'quality';
  mode: 'default' | 'star' | 'soar';
}

function MockInterview() {
  const [time, setTime] = useState('00:00');
  const [isTranscribing, setIsTranscribing] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAutoScroll, setIsAutoScroll] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [transcription, setTranscription] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<SettingsConfig>({
    verbosity: 'default',
    temperature: 'default',
    performance: 'quality',
    mode: 'default'
  });
  const [performanceMetrics, setPerformanceMetrics] = useState({
    accuracy: 85,
    fluency: 78,
    rhythm: 92
  });
  const [sessionId, setSessionId] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const transcriptRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);
  const recognitionRef = useRef<any>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    // Initialize time with Indian Standard Time
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'Asia/Kolkata'
      };
      setTime(now.toLocaleTimeString('en-US', options));
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Initialize speech synthesis with improved settings
    speechSynthesisRef.current = new SpeechSynthesisUtterance();
    speechSynthesisRef.current.rate = 1;
    speechSynthesisRef.current.pitch = 1;
    speechSynthesisRef.current.volume = 1;
    
    // Initialize speech recognition with enhanced accuracy
    if ('webkitSpeechRecognition' in window) {
      recognitionRef.current = new (window as any).webkitSpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';
      
      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        setTranscription(finalTranscript || interimTranscript);
      };
    }

    // Initialize camera
    initializeCamera();

    // Add first question to messages
    startInterview();

    return () => {
      stopMediaStream();
      if (speechSynthesisRef.current) {
        window.speechSynthesis.cancel();
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const initializeCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing media devices:', error);
    }
  };

  const stopMediaStream = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
    }
  };

  const toggleCamera = () => {
    setIsVideoOn(prev => !prev);
    if (mediaStreamRef.current) {
      const videoTrack = mediaStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isVideoOn;
      }
    }
  };

  const toggleMicrophone = () => {
    setIsRecording(prev => !prev);
    if (mediaStreamRef.current) {
      const audioTrack = mediaStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isRecording;
      }
    }
    if (!isRecording) {
      recognitionRef.current?.start();
    } else {
      recognitionRef.current?.stop();
    }
  };

  const speakQuestion = (text: string) => {
    if (speechSynthesisRef.current && !isMuted) {
      speechSynthesisRef.current.text = text;
      window.speechSynthesis.speak(speechSynthesisRef.current);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < interviewQuestions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      addMessage('ai', interviewQuestions[nextIndex]);
      speakQuestion(interviewQuestions[nextIndex]);
    }
  };

  const addMessage = (type: 'ai' | 'user', text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      text,
      timestamp: new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'Asia/Kolkata'
      })
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const startInterview = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/interview/start/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          position: 'software_engineer',
          difficulty: 'medium',
        }),
      });
      const data = await response.json();
      setSessionId(data.session_id);
      addMessage('ai', data.question);
      speakQuestion(data.question);
    } catch (error) {
      console.error('Error starting interview:', error);
    }
  };

  const handleSendMessage = async () => {
    if (userInput.trim() && sessionId) {
      addMessage('user', userInput);
      try {
        const response = await fetch(`http://localhost:8000/api/interview/${sessionId}/respond/`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            answer: userInput,
          }),
        });
        const data = await response.json();
        if (data.question) {
          addMessage('ai', data.question);
          speakQuestion(data.question);
        }
        if (data.is_complete) {
          setPerformanceMetrics({
            accuracy: data.score.accuracy || 85,
            fluency: data.score.fluency || 78,
            rhythm: data.score.rhythm || 92,
          });
        }
      } catch (error) {
        console.error('Error sending response:', error);
      }
      setUserInput('');
    }
  };

  const handleLeave = () => {
    if (window.confirm('Are you sure you want to leave the interview?')) {
      stopMediaStream();
      window.speechSynthesis.cancel();
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
      setIsTranscribing(false);
      window.history.back();
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setUserInput(text);
  };

  const SettingsModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#2C2C2E] rounded-lg p-6 w-[480px] max-w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Settings</h2>
          <button onClick={() => setShowSettings(false)} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg mb-2">Verbosity</h3>
            <div className="grid grid-cols-3 gap-2">
              {['concise', 'default', 'lengthy'].map((option) => (
                <button
                  key={option}
                  className={`p-2 rounded ${
                    settings.verbosity === option
                      ? 'bg-[#024aad] text-white'
                      : 'bg-[#3C3C3E] text-gray-300 hover:bg-[#4C4C4E]'
                  }`}
                  onClick={() => setSettings(prev => ({ ...prev, verbosity: option as any }))}
                >
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg mb-2">Copilot Temperature</h3>
            <div className="grid grid-cols-3 gap-2">
              {['low', 'default', 'high'].map((option) => (
                <button
                  key={option}
                  className={`p-2 rounded ${
                    settings.temperature === option
                      ? 'bg-[#024aad] text-white'
                      : 'bg-[#3C3C3E] text-gray-300 hover:bg-[#4C4C4E]'
                  }`}
                  onClick={() => setSettings(prev => ({ ...prev, temperature: option as any }))}
                >
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg mb-2">Performance Preference</h3>
            <div className="grid grid-cols-2 gap-2">
              {['speed', 'quality'].map((option) => (
                <button
                  key={option}
                  className={`p-2 rounded ${
                    settings.performance === option
                      ? 'bg-[#024aad] text-white'
                      : 'bg-[#3C3C3E] text-gray-300 hover:bg-[#4C4C4E]'
                  }`}
                  onClick={() => setSettings(prev => ({ ...prev, performance: option as any }))}
                >
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg mb-2">Mode Preference</h3>
            <div className="grid grid-cols-3 gap-2">
              {['default', 'star', 'soar'].map((option) => (
                <button
                  key={option}
                  className={`p-2 rounded ${
                    settings.mode === option
                      ? 'bg-[#024aad] text-white'
                      : 'bg-[#3C3C3E] text-gray-300 hover:bg-[#4C4C4E]'
                  }`}
                  onClick={() => setSettings(prev => ({ ...prev, mode: option as any }))}
                >
                  {option.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={() => setShowSettings(false)}
            className="px-4 py-2 bg-[#3C3C3E] rounded hover:bg-[#4C4C4E]"
          >
            Cancel
          </button>
          <button
            onClick={() => setShowSettings(false)}
            className="px-4 py-2 bg-[#024aad] rounded hover:bg-[#41b0f8]"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#1C1C1E] text-white">
      {/* Top Navigation Bar */}
      <nav className="flex items-center justify-between px-6 py-3 bg-[#2C2C2E]">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold">Code Interview</h1>
          <span className="px-3 py-1 bg-[#024aad] rounded-full text-sm">Premium</span>
          <div className="flex items-center gap-2 text-gray-400">
            <span className="text-sm">{time}</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
            className={`p-2 hover:bg-[#3C3C3E] rounded-full transition-colors ${!isVideoOn ? 'bg-red-500/20 text-red-500' : ''}`}
            onClick={toggleCamera}
          >
            {isVideoOn ? <Video size={20} /> : <VideoOff size={20} />}
          </button>
          <button 
            className={`p-2 hover:bg-[#3C3C3E] rounded-full transition-colors ${isMuted ? 'bg-red-500/20 text-red-500' : ''}`}
            onClick={() => {
              setIsMuted(!isMuted);
              if (isMuted) {
                speakQuestion(interviewQuestions[currentQuestionIndex]);
              } else {
                window.speechSynthesis.cancel();
              }
            }}
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          <button className="p-2 hover:bg-[#3C3C3E] rounded-full transition-colors">
            <Sun size={20} />
          </button>
          <button 
            className="p-2 hover:bg-[#3C3C3E] rounded-full transition-colors"
            onClick={() => setShowSettings(true)}
          >
            <Settings size={20} />
          </button>
          <button 
            className={`p-2 hover:bg-[#3C3C3E] rounded-full transition-colors ${isRecording ? 'bg-red-500' : ''}`}
            onClick={toggleMicrophone}
          >
            <Mic size={20} />
          </button>
          <button 
            className="flex items-center gap-2 px-4 py-2 bg-[#024aad] hover:bg-[#41b0f8] rounded-lg transition-colors"
            onClick={handleLeave}
          >
            <ArrowLeft size={16} />
            Leave
            <ChevronDown size={16} />
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="grid grid-cols-12 gap-6 p-6">
        {/* Left Panel */}
        <div className="col-span-6 space-y-6">
          <div className="bg-[#2C2C2E] rounded-lg overflow-hidden">
            <div className="aspect-video bg-black relative">
              {isVideoOn ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                  <p className="text-gray-400">Camera is turned off</p>
                </div>
              )}
            </div>
          </div>

          {/* Transcription Area */}
          <div className="bg-[#2C2C2E] rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-lg">Voice Transcription</div>
              <div className="flex items-center gap-2">
                {isRecording && (
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                    Recording
                  </span>
                )}
              </div>
            </div>
            <div 
              ref={transcriptRef}
              className="p-4 bg-[#3C3C3E] rounded-lg min-h-[100px] max-h-[200px] overflow-y-auto"
            >
              <p className="text-gray-300">{transcription || 'Start speaking to see transcription...'}</p>
            </div>
            <div className="mt-2 flex justify-end">
              <button
                onClick={() => handleCopy(transcription)}
                className="text-sm text-[#41b0f8] hover:text-[#024aad] transition-colors flex items-center gap-1"
              >
                <Copy size={14} />
                Copy to chat
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="col-span-6 bg-[#2C2C2E] rounded-lg p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-semibold">Interview Chat</h2>
              <span className="px-2 py-1 bg-[#024aad]/20 text-[#41b0f8] rounded text-sm">
                {isTranscribing ? 'Active' : 'Ready'}
              </span>
            </div>
          </div>

          {/* Chat Messages */}
          <div 
            ref={chatRef}
            className="flex-1 overflow-y-auto space-y-4 mb-4 max-h-[400px] p-4 bg-[#3C3C3E] rounded-lg"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-[#024aad] text-white'
                      : 'bg-gray-700 text-white'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <span className="text-xs text-gray-300 mt-1 block">
                    {message.timestamp}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your response..."
              className="flex-1 bg-[#3C3C3E] rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#024aad]"
            />
            <button
              onClick={handleSendMessage}
              className="p-2 bg-[#024aad] hover:bg-[#41b0f8] rounded-lg transition-colors"
            >
              <Send size={20} />
            </button>
          </div>

          {/* Performance Metrics */}
          <div className="mt-8 p-4 bg-[#3C3C3E] rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Speech Performance</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Accuracy</span>
                <div className="w-48 h-2 bg-gray-700 rounded-full">
                  <div 
                    className="h-full bg-[#41b0f8] rounded-full"
                    style={{ width: `${performanceMetrics.accuracy}%` }}
                  ></div>
                </div>
                <span>{performanceMetrics.accuracy}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Fluency</span>
                <div className="w-48 h-2 bg-gray-700 rounded-full">
                  <div 
                    className="h-full bg-[#024aad] rounded-full"
                    style={{ width: `${performanceMetrics.fluency}%` }}
                  ></div>
                </div>
                <span>{performanceMetrics.fluency}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Rhythm & Intonation</span>
                <div className="w-48 h-2 bg-gray-700 rounded-full">
                  <div 
                    className="h-full bg-[#41b0f8] rounded-full"
                    style={{ width: `${performanceMetrics.rhythm}%` }}
                  ></div>
                </div>
                <span>{performanceMetrics.rhythm}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && <SettingsModal />}
    </div>
  );
}

export default MockInterview;