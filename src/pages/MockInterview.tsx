import React, { useState, useEffect, useRef } from 'react';
import { Settings, Sun, Mic, ChevronDown, ArrowLeft, Copy, Video, VideoOff, Volume2, VolumeX, Send, BarChart2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Line, Radar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  RadialLinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  RadialLinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 20
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 10
  },
  text: {
    fontSize: 12,
    marginBottom: 5
  },
  score: {
    fontSize: 36,
    textAlign: 'center',
    marginBottom: 20,
    color: '#024aad'
  }
});

const ReportPDF = ({ metrics }) => (
  <Document>
    <Page size="A4" orientation="landscape" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>Interview Analysis Report</Text>
        <Text style={styles.score}>{metrics.overallScore}%</Text>
        <Text style={styles.subtitle}>Performance Metrics</Text>
        {Object.entries(metrics).map(([key, value]) => (
          key !== 'overallScore' && (
            <Text key={key} style={styles.text}>
              {key.replace(/([A-Z])/g, ' $1').trim()}: {value}%
            </Text>
          )
        ))}
        <Text style={styles.subtitle}>Key Insights</Text>
        <Text style={styles.text}>• Strong technical knowledge demonstrated</Text>
        <Text style={styles.text}>• Clear communication style with good examples</Text>
        <Text style={styles.text}>• Excellent problem-solving approach</Text>
        <Text style={styles.text}>• Maintained professional composure</Text>
      </View>
    </Page>
  </Document>
);

const interviewQuestions = [
  "Can you tell me about a challenging project you worked on and how you handled it?",
  "How do you handle conflicts in a team environment?",
  "What's your approach to learning new technologies?",
  "Describe a situation where you had to meet a tight deadline.",
  "How do you ensure code quality in your projects?",
  "Tell me about a time you had to deal with a difficult coworker.",
  "What's your experience with agile methodologies?",
  "How do you handle technical debt in your projects?",
  "Describe your debugging process.",
  "What's your approach to writing maintainable code?"
];

interface Message {
  id: string;
  type: 'ai' | 'user';
  text: string;
  timestamp: string;
}

interface PerformanceMetrics {
  technicalAccuracy: number;
  communicationClarity: number;
  problemSolving: number;
  confidence: number;
  overallScore: number;
}

function MockInterview() {
  const [time, setTime] = useState('00:00');
  const [isTranscribing, setIsTranscribing] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [transcription, setTranscription] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics>({
    technicalAccuracy: 85,
    communicationClarity: 78,
    problemSolving: 92,
    confidence: 88,
    overallScore: 86
  });

  const chatRef = useRef<HTMLDivElement>(null);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    let startTime = Date.now();
    const timer = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      const minutes = Math.floor(elapsedTime / 60000);
      const seconds = Math.floor((elapsedTime % 60000) / 1000);
      setTime(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    speechSynthesisRef.current = new SpeechSynthesisUtterance();
    speechSynthesisRef.current.rate = 1;
    speechSynthesisRef.current.pitch = 1;
    speechSynthesisRef.current.volume = 1;
    
    if ('webkitSpeechRecognition' in window) {
      recognitionRef.current = new (window as any).webkitSpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        setTranscription(transcript);
      };
    }

    addMessage('ai', interviewQuestions[0]);
    speakQuestion(interviewQuestions[0]);

    return () => {
      if (speechSynthesisRef.current) {
        window.speechSynthesis.cancel();
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

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
    } else {
      setShowAnalysis(true);
    }
  };

  const addMessage = (type: 'ai' | 'user', text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      text,
      timestamp: new Date().toLocaleTimeString()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSendMessage = () => {
    if (userInput.trim()) {
      addMessage('user', userInput);
      setUserInput('');
      handleNextQuestion();
    }
  };

  const handleLeave = () => {
    if (window.confirm('Are you sure you want to leave the interview?')) {
      window.speechSynthesis.cancel();
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
      setIsTranscribing(false);
      window.history.back();
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      recognitionRef.current?.start();
    } else {
      recognitionRef.current?.stop();
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setUserInput(text);
  };

  if (showAnalysis) {
    const radarData = {
      labels: ['Technical Accuracy', 'Communication', 'Problem Solving', 'Confidence'],
      datasets: [{
        label: 'Performance',
        data: [
          performanceMetrics.technicalAccuracy,
          performanceMetrics.communicationClarity,
          performanceMetrics.problemSolving,
          performanceMetrics.confidence
        ],
        backgroundColor: 'rgba(2, 74, 173, 0.2)',
        borderColor: '#024aad',
        borderWidth: 2,
        fill: true
      }]
    };

    const doughnutData = {
      labels: ['Technical', 'Communication', 'Problem Solving', 'Confidence'],
      datasets: [{
        data: [
          performanceMetrics.technicalAccuracy,
          performanceMetrics.communicationClarity,
          performanceMetrics.problemSolving,
          performanceMetrics.confidence
        ],
        backgroundColor: [
          '#024aad',
          '#41b0f8',
          '#0066cc',
          '#003366'
        ]
      }]
    };

    const progressData = {
      labels: ['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6', 'Q7', 'Q8', 'Q9', 'Q10'],
      datasets: [{
        label: 'Performance Progress',
        data: [75, 82, 88, 85, 90, 87, 92, 88, 94, 86],
        borderColor: '#024aad',
        tension: 0.4
      }]
    };

    return (
      <div className="h-screen overflow-y-auto bg-[#1C1C1E] text-white">
        <div className="max-w-7xl mx-auto p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#2C2C2E] rounded-xl p-8"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold">Interview Analysis Report</h2>
              <PDFDownloadLink
                document={<ReportPDF metrics={performanceMetrics} />}
                fileName="interview-analysis.pdf"
                className="bg-[#024aad] text-white px-4 py-2 rounded-lg hover:bg-[#41b0f8] transition-colors"
              >
                {({ loading }) => (loading ? 'Preparing PDF...' : 'Download PDF Report')}
              </PDFDownloadLink>
            </div>
            
            <div className="grid grid-cols-12 gap-8">
              <div className="col-span-12 md:col-span-4 bg-[#3C3C3E] rounded-lg p-6 text-center">
                <div className="text-6xl font-bold text-[#024aad] mb-2">
                  {performanceMetrics.overallScore}%
                </div>
                <p className="text-gray-400">Overall Performance</p>
              </div>

              <div className="col-span-12 md:col-span-4 bg-[#3C3C3E] rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Skill Distribution</h3>
                <div className="aspect-square">
                  <Radar 
                    data={radarData}
                    options={{
                      scales: {
                        r: {
                          beginAtZero: true,
                          max: 100,
                          ticks: { color: 'white' },
                          grid: { color: 'rgba(255, 255, 255, 0.1)' },
                          pointLabels: { color: 'white' }
                        }
                      },
                      plugins: {
                        legend: { display: false }
                      }
                    }}
                  />
                </div>
              </div>

              <div className="col-span-12 md:col-span-4 bg-[#3C3C3E] rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Performance Breakdown</h3>
                <div className="aspect-square">
                  <Doughnut 
                    data={doughnutData}
                    options={{
                      plugins: {
                        legend: {
                          position: 'bottom',
                          labels: { color: 'white' }
                        }
                      }
                    }}
                  />
                </div>
              </div>

              <div className="col-span-12 bg-[#3C3C3E] rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Progress Throughout Interview</h3>
                <Line 
                  data={progressData}
                  options={{
                    scales: {
                      y: {
                        beginAtZero: true,
                        max: 100,
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        ticks: { color: 'white' }
                      },
                      x: {
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        ticks: { color: 'white' }
                      }
                    },
                    plugins: {
                      legend: {
                        labels: { color: 'white' }
                      }
                    }
                  }}
                />
              </div>

              <div className="col-span-12 bg-[#3C3C3E] rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Recommendations</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-[#024aad]">→</span>
                    Consider providing more specific metrics in project outcomes
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#024aad]">→</span>
                    Expand on technical implementation details when discussing solutions
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#024aad]">→</span>
                    Practice more concise responses while maintaining detail quality
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-8 flex justify-center">
              <button
                onClick={() => window.location.reload()}
                className="bg-[#024aad] text-white px-6 py-3 rounded-lg hover:bg-[#41b0f8] transition-colors"
              >
                Start New Interview
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[#1C1C1E] text-white">
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
            className="p-2 hover:bg-[#3C3C3E] rounded-full transition-colors"
            onClick={() => setIsVideoOn(!isVideoOn)}
          >
            {isVideoOn ? <Video size={20} /> : <VideoOff size={20} />}
          </button>
          <button 
            className="p-2 hover:bg-[#3C3C3E] rounded-full transition-colors"
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
          <button className="p-2 hover:bg-[#3C3C3E] rounded-full transition-colors">
            <Settings size={20} />
          </button>
          <button 
            className={`p-2 hover:bg-[#3C3C3E] rounded-full transition-colors ${isRecording ? 'bg-[#024aad] hover:bg-[#41b0f8]' : ''}`}
            onClick={toggleRecording}
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

      <div className="flex-1 flex flex-col lg:flex-row gap-6 p-6 overflow-hidden">
        <div className="flex-1 flex flex-col gap-6 min-w-0">
          <div className="bg-[#2C2C2E] rounded-lg overflow-hidden">
            <div className="aspect-video bg-black relative">
              {!isVideoOn && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                  <p className="text-gray-400">Camera is turned off</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 bg-[#2C2C2E] rounded-lg p-6 flex flex-col min-h-0">
            <div className="flex items-center justify-between mb-4">
              <div className="text-lg">Voice Transcription</div>
              <div className="flex items-center gap-2">
                {isRecording && (
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-[#024aad] rounded-full animate-pulse"></span>
                    Recording
                  </span>
                )}
              </div>
            </div>
            <div className="flex-1 p-4 bg-[#3C3C3E] rounded-lg overflow-y-auto">
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

        <div className="flex-1 bg-[#2C2C2E] rounded-lg p-6 flex flex-col min-w-0">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-semibold">Interview Chat</h2>
              <span className="px-2 py-1 bg-[#024aad]/20 text-[#41b0f8] rounded text-sm">
                {isTranscribing ? 'Active' : 'Ready'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">
                Question {currentQuestionIndex + 1} of {interviewQuestions.length}
              </span>
            </div>
          </div>

          <div 
            ref={chatRef}
            className="flex-1 overflow-y-auto space-y-4 mb-4 p-4 bg-[#3C3C3E] rounded-lg"
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
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  <span className="text-xs text-gray-300 mt-1 block">
                    {message.timestamp}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2 mt-auto">
            <textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Type your response..."
              className="flex-1 bg-[#3C3C3E] rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#024aad] resize-none"
              rows={3}
              style={{ minHeight: '60px', maxHeight: '120px' }}
            />
            <button
              onClick={handleSendMessage}
              className="p-2 bg-[#024aad] hover:bg-[#41b0f8] rounded-lg transition-colors self-end"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MockInterview;