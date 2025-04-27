import { useState, useEffect, useRef } from 'react';
import { Settings, Sun, Mic, ChevronDown, ArrowLeft, Copy, Video, VideoOff, Volume2, VolumeX, Send } from 'lucide-react';
import { FaceDetection } from '@mediapipe/face_detection';
import { Camera } from '@mediapipe/camera_utils';
import { Radar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js';
import { motion } from 'framer-motion';
import {
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
import { interviewService } from '../services/interviewService';
import { useSearchParams } from 'react-router-dom';
import TokenService from '../services/TokenService';

interface FaceDetectionResults {
  detections: Array<{
    boundingBox: {
      xCenter: number;
      yCenter: number;
      width: number;
      height: number;
    };
    landmarks: Array<{ x: number; y: number; z: number }>,
    score: number[];
  }>;
}

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

interface PDFMetrics extends PerformanceMetrics {
  overallScore: number;
}

const ReportPDF = ({ metrics }: { metrics: PDFMetrics }) => (
  <Document>
    <Page size="A4" orientation="landscape" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>Interview Analysis Report</Text>
        <Text style={styles.score}>{metrics.overallScore.toFixed(1)}%</Text>
        
        <Text style={styles.subtitle}>Technical Performance</Text>
        {Object.entries(metrics.technical_scores).map(([key, value]) => (
          <Text key={key} style={styles.text}>
            {key.split('_').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}: {value.toFixed(1)}%
          </Text>
        ))}

        <Text style={styles.subtitle}>Communication Performance</Text>
        {Object.entries(metrics.communication_scores).map(([key, value]) => (
          <Text key={key} style={styles.text}>
            {key.split('_').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}: {value.toFixed(1)}%
          </Text>
        ))}

        <Text style={styles.subtitle}>Feedback</Text>
        <Text style={styles.text}>Technical: {metrics.feedback.technical_feedback}</Text>
        <Text style={styles.text}>Communication: {metrics.feedback.communication_feedback}</Text>
        
        <Text style={styles.subtitle}>Strengths</Text>
        {metrics.feedback.strengths.map((strength, index) => (
          <Text key={index} style={styles.text}>• {strength}</Text>
        ))}

        <Text style={styles.subtitle}>Areas for Improvement</Text>
        {metrics.feedback.areas_for_improvement.map((area, index) => (
          <Text key={index} style={styles.text}>• {area}</Text>
        ))}

      </View>
    </Page>
  </Document>
);

interface Message {
  id: string;
  type: 'ai' | 'user';
  text: string;
  timestamp: string;
}

interface PerformanceMetrics {
  candidate_name: string;
  technical_scores: {
    technical_accuracy: number;
    depth_of_knowledge: number;
    relevance_score: number;
    overall_technical_score: number;
  };
  communication_scores: {
    grammar_score: number;
    clarity_score: number;
    professionalism_score: number;
    overall_communication_score: number;
  };
  sentiment_scores: {
    positive: number;
    neutral: number;
    negative: number;
    compound: number;
  };
  final_score: number;
  feedback: {
    technical_feedback: string;
    communication_feedback: string;
    strengths: string[];
    areas_for_improvement: string[];
    vocabulary_analysis: any;
  };
  responses: Array<{
    question: string;
    answer: string;
  }>;
}

interface InterviewState {
  interviewId: number | null;
  isLoading: boolean;
  error: string | null;
}

const MockInterview = () => {
  // Fix state declarations
  const [time, setTime] = useState('00:00');
  const [isTranscribing, setIsTranscribing] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics>({
    candidate_name: '',
    technical_scores: {
      technical_accuracy: 0,
      depth_of_knowledge: 0,
      relevance_score: 0,
      overall_technical_score: 0
    },
    communication_scores: {
      grammar_score: 0,
      clarity_score: 0,
      professionalism_score: 0,
      overall_communication_score: 0
    },
    sentiment_scores: {
      positive: 0,
      neutral: 0,
      negative: 0,
      compound: 0
    },
    final_score: 0,
    feedback: {
      technical_feedback: '',
      communication_feedback: '',
      strengths: [],
      areas_for_improvement: [],
      vocabulary_analysis: null
    },
    responses: []
  });
  const [interviewState, setInterviewState] = useState<InterviewState>({
    interviewId: null,
    isLoading: false,
    error: null,
  });
  const [faceDetectionWarning, setFaceDetectionWarning] = useState<string>('');
  const faceDetection = useRef<FaceDetection | null>(null);
  const camera = useRef<Camera | null>(null);

  const chatRef = useRef<HTMLDivElement>(null);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);
  const recognitionRef = useRef<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const requestCacheRef = useRef<Map<string, any>>(new Map());
  const [searchParams] = useSearchParams();

  useEffect(() => {
    let startTime = Date.now();
    const timer = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      const mins = Math.floor(elapsedTime / 60000);
      const secs = Math.floor((elapsedTime % 60000) / 1000);
      setTime(`${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
    }, 1000);

    // Get interview ID from URL params
    const interviewId = Number(searchParams.get('id'));
    if (!interviewId) {
      setInterviewState((prevState: InterviewState) => ({ 
        ...prevState, 
        error: 'Invalid interview ID' 
      }));
      return;
    }

    setInterviewState((prevState: InterviewState) => ({ 
      ...prevState, 
      interviewId,
      isLoading: false 
    }));

    // Initialize interview to get first question
    interviewService.startInterview(interviewId)
      .then(response => {
        if (response && response.question) {
          addMessage('ai', response.question);
          speakQuestion(response.question);
        }
      })
      .catch(error => {
        console.error('Interview initialization error:', error);
        setInterviewState(prev => ({
          ...prev,
          error: 'Failed to start interview'
        }));
      });

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
        if (isTranscribing) {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0].transcript)
            .join('');
          setTranscription(transcript);
        }
      };
    }

    // Initialize camera when component mounts
    const initializeCamera = async () => {
      try {
        if (isVideoOn && videoRef.current) {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          videoRef.current.srcObject = stream;
          streamRef.current = stream;

          // Initialize MediaPipe Face Detection
          faceDetection.current = new FaceDetection({
            locateFile: (file) => {
              return `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`;
            }
          });

          faceDetection.current.setOptions({
            model: 'short',
            minDetectionConfidence: 0.6
          });

          faceDetection.current.onResults((results: FaceDetectionResults) => {
            if (!results.detections || results.detections.length === 0) {
              setFaceDetectionWarning('No face detected!');
            } else if (results.detections.length > 1) {
              setFaceDetectionWarning('Multiple faces detected!');
            } else if (results.detections.length === 1) {
              setFaceDetectionWarning('');
            }
          });

          // Initialize MediaPipe Camera
          camera.current = new Camera(videoRef.current, {
            onFrame: async () => {
              if (videoRef.current && faceDetection.current) {
                await faceDetection.current.send({ image: videoRef.current });
              }
            },
            width: 640,
            height: 480
          });

          camera.current.start();
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setIsVideoOn(false);
      }
    };

    initializeCamera();

    return () => {
      // Cleanup camera stream when component unmounts
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (speechSynthesisRef.current) {
        window.speechSynthesis.cancel();
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isVideoOn]);

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

  const addMessage = (type: 'ai' | 'user', text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      text,
      timestamp: new Date().toLocaleTimeString()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSendMessage = async () => {
    if (!userInput.trim() || !interviewState.interviewId || isSubmitting) return;

    // Cancel any ongoing requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      setInterviewState(prev => ({ ...prev, isLoading: true, error: null }));
      setIsSubmitting(true);
      addMessage('user', userInput);

      const response = await handleRequestWithDebounce(
        () => interviewService.submitAnswer(
          interviewState.interviewId!, 
          userInput
        ),
        `answer-${Date.now()}`
      );

      if (!response) {
        throw new Error('No response from server');
      }

      setUserInput('');

      if (response.status === 'completed') {
        // Fetch interview results from new API endpoint
        const accessToken = TokenService.getAccessToken();
        const resultsResponse = await fetch(
          `http://127.0.0.1:8000/aiinterview/interview-results/${interviewState.interviewId}/`,
          { 
            signal: abortControllerRef.current.signal,
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            }
          }
        );
        
        if (!resultsResponse.ok) {
          throw new Error('Failed to fetch interview results');
        }

        const results = await resultsResponse.json();
        setPerformanceMetrics(results);
        setShowAnalysis(true);
      } else if (response.question) {
        addMessage('ai', response.question);
        speakQuestion(response.question);
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error('Send message error:', error);
        setInterviewState(prev => ({ 
          ...prev, 
          error: error.message || 'Failed to submit answer' 
        }));
      }
    } finally {
      setInterviewState(prev => ({ ...prev, isLoading: false }));
      setIsSubmitting(false);
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

  const handleRequestWithDebounce = async (fn: () => Promise<any>, cacheKey?: string) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (cacheKey && requestCacheRef.current.has(cacheKey)) {
      return requestCacheRef.current.get(cacheKey);
    }

    return new Promise((resolve, reject) => {
      debounceTimerRef.current = setTimeout(async () => {
        try {
          const result = await fn();
          if (cacheKey) {
            requestCacheRef.current.set(cacheKey, result);
          }
          resolve(result);
        } catch (error) {
          reject(error);
        }
      }, 500);
    });
  };

  const toggleVideo = () => {
    if (isVideoOn) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (camera.current) {
        camera.current.stop();
      }
    }
    setIsVideoOn(!isVideoOn);
  };

  // Fix JSX in the analysis view
  if (showAnalysis) {
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
                document={<ReportPDF metrics={{ ...performanceMetrics, overallScore: performanceMetrics.final_score }} />}
                fileName="interview-analysis.pdf"
                className="bg-[#024aad] text-white px-4 py-2 rounded-lg hover:bg-[#41b0f8] transition-colors"
              >
                Download PDF Report
              </PDFDownloadLink>
            </div>
            
            <div className="grid grid-cols-12 gap-8">
              <div className="col-span-12 md:col-span-4 bg-[#3C3C3E] rounded-lg p-6 text-center">
                <div className="text-6xl font-bold text-[#024aad] mb-2">
                  {performanceMetrics.final_score.toFixed(1)}%
                </div>
                <p className="text-gray-400">Final Score</p>
              </div>

              <div className="col-span-12 md:col-span-4 bg-[#3C3C3E] rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Technical Skills</h3>
                <div className="aspect-square">
                  <Radar 
                    data={{
                      labels: ['Technical Accuracy', 'Depth of Knowledge', 'Relevance', 'Overall Technical'],
                      datasets: [{
                        label: 'Technical Performance',
                        data: [
                          performanceMetrics.technical_scores.technical_accuracy,
                          performanceMetrics.technical_scores.depth_of_knowledge,
                          performanceMetrics.technical_scores.relevance_score,
                          performanceMetrics.technical_scores.overall_technical_score
                        ],
                        backgroundColor: 'rgba(2, 74, 173, 0.2)',
                        borderColor: '#024aad',
                        borderWidth: 2,
                        fill: true
                      }]
                    }}
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
                <h3 className="text-xl font-semibold mb-4">Communication Skills</h3>
                <div className="aspect-square">
                  <Radar 
                    data={{
                      labels: ['Grammar', 'Clarity', 'Professionalism', 'Overall Communication'],
                      datasets: [{
                        label: 'Communication Performance',
                        data: [
                          performanceMetrics.communication_scores.grammar_score,
                          performanceMetrics.communication_scores.clarity_score,
                          performanceMetrics.communication_scores.professionalism_score,
                          performanceMetrics.communication_scores.overall_communication_score
                        ],
                        backgroundColor: 'rgba(65, 176, 248, 0.2)',
                        borderColor: '#41b0f8',
                        borderWidth: 2,
                        fill: true
                      }]
                    }}
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

              <div className="col-span-12 md:col-span-6 bg-[#3C3C3E] rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Sentiment Analysis</h3>
                <div className="aspect-[2/1]">
                  <Doughnut 
                    data={{
                      labels: ['Positive', 'Neutral', 'Negative'],
                      datasets: [{
                        data: [
                          performanceMetrics.sentiment_scores.positive,
                          performanceMetrics.sentiment_scores.neutral,
                          performanceMetrics.sentiment_scores.negative
                        ],
                        backgroundColor: [
                          '#4CAF50',
                          '#FFC107',
                          '#F44336'
                        ]
                      }]
                    }}
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

              <div className="col-span-12 md:col-span-6 bg-[#3C3C3E] rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Key Insights</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-[#41b0f8] mb-2">Technical Feedback</h4>
                    <p className="text-gray-300">{performanceMetrics.feedback.technical_feedback}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-[#41b0f8] mb-2">Communication Feedback</h4>
                    <p className="text-gray-300">{performanceMetrics.feedback.communication_feedback}</p>
                  </div>
                </div>
              </div>

              <div className="col-span-12 bg-[#3C3C3E] rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Detailed Analysis</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-[#41b0f8] mb-2">Strengths</h4>
                    <ul className="list-disc list-inside space-y-2 text-gray-300">
                      {performanceMetrics.feedback.strengths.map((strength, index) => (
                        <li key={index}>{strength}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-[#41b0f8] mb-2">Areas for Improvement</h4>
                    <ul className="list-disc list-inside space-y-2 text-gray-300">
                      {performanceMetrics.feedback.areas_for_improvement.map((area, index) => (
                        <li key={index}>{area}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="col-span-12 bg-[#3C3C3E] rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Interview Responses</h3>
                <div className="space-y-4">
                  {performanceMetrics.responses.map((response, index) => (
                    <div key={index} className="bg-[#2C2C2E] p-4 rounded-lg">
                      <p className="font-medium text-[#41b0f8] mb-2">Q: {response.question}</p>
                      <p className="text-gray-300">A: {response.answer}</p>
                    </div>
                  ))}
                </div>
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

  if (interviewState.error) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#1C1C1E] text-white">
        <div className="text-center">
          <p className="text-red-500 mb-4">{interviewState.error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#024aad] text-white px-6 py-3 rounded-lg hover:bg-[#41b0f8] transition-colors"
          >
            Retry Interview
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#1C1C1E]">
      <nav className="flex items-center justify-between px-6 py-3 bg-[#2C2C2E]">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold text-white">Code Interview</h1>
          <span className="px-3 py-1 bg-[#024aad] rounded-full text-sm text-white">Premium</span>
          <div className="flex items-center gap-2">
            <span className="text-sm text-white">{time}</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
            className="p-2 hover:bg-[#3C3C3E] rounded-full transition-colors text-white"
            onClick={() => toggleVideo()}
          >
            {isVideoOn ? <Video size={20} /> : <VideoOff size={20} />}
          </button>
          <button 
            className="p-2 hover:bg-[#3C3C3E] rounded-full transition-colors text-white"
            onClick={() => {
              setIsMuted(!isMuted);
              if (isMuted) {
                const lastAIMessage = messages.filter(m => m.type === 'ai').slice(-1)[0];
                if (lastAIMessage) {
                  speakQuestion(lastAIMessage.text);
                }
              } else {
                window.speechSynthesis.cancel();
              }
            }}
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          <button className="p-2 hover:bg-[#3C3C3E] rounded-full transition-colors text-white">
            <Sun size={20} />
          </button>
          <button className="p-2 hover:bg-[#3C3C3E] rounded-full transition-colors text-white">
            <Settings size={20} />
          </button>
          <button 
            className={`p-2 hover:bg-[#3C3C3E] rounded-full transition-colors text-white ${isRecording ? 'bg-[#024aad] hover:bg-[#41b0f8]' : ''}`}
            onClick={toggleRecording}
          >
            <Mic size={20} />
          </button>
          <button 
            className="flex items-center gap-2 px-4 py-2 bg-[#024aad] hover:bg-[#41b0f8] rounded-lg transition-colors text-white"
            onClick={handleLeave}
          >
            <ArrowLeft size={16} />
            Leave
            <ChevronDown size={16} />
          </button>
        </div>
      </nav>

      <div className="flex-1 flex lg:flex-row gap-6 p-6 overflow-hidden">
        {/* Video and Controls Section */}
        <div className="w-full lg:w-1/3 flex flex-col gap-6">
          <div className="bg-[#2C2C2E] rounded-lg overflow-hidden">
            <div className="aspect-video bg-black relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full rounded-lg"
              />
              {faceDetectionWarning && (
                <div className="absolute bottom-4 left-0 right-0 mx-auto text-center">
                  <div className="bg-red-500 text-white px-4 py-2 rounded-lg inline-block">
                    {faceDetectionWarning}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 bg-[#2C2C2E] rounded-lg p-6 flex flex-col min-h-0">
            <div className="flex items-center justify-between mb-4">
              <div className="text-lg text-white">Voice Transcription</div>
              <div className="flex items-center gap-2">
                {isRecording && (
                  <span className="flex items-center gap-1 text-white">
                    <span className="w-2 h-2 bg-[#024aad] rounded-full animate-pulse"></span>
                    {isTranscribing ? 'Recording' : 'Paused'}
                  </span>
                )}
                <button
                  onClick={() => setIsTranscribing(!isTranscribing)}
                  className={`text-sm px-2 py-1 rounded ${
                    isTranscribing ? 'bg-[#024aad] text-white' : 'bg-gray-600 text-gray-300'
                  }`}
                >
                  {isTranscribing ? 'Pause' : 'Resume'} Transcription
                </button>
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
                Copy to Response
              </button>
            </div>
          </div>
        </div>

        {/* Chat Section */}
        <div className="w-full lg:w-2/3 flex flex-col gap-4 h-[calc(100vh-8rem)]">
          <div
            ref={chatRef}
            className="flex-1 bg-[#2C2C2E] rounded-lg p-4 overflow-y-auto space-y-4"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'ai' ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`${
                    message.type === 'ai'
                      ? 'bg-[#024aad]'
                      : 'bg-[#41b0f8]'
                  } p-4 rounded-lg max-w-[80%]`}
                >
                  <p className="text-sm text-white whitespace-pre-wrap">{message.text}</p>
                  <span className="text-xs text-gray-300 mt-1 block">
                    {message.timestamp}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
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
              className="flex-1 bg-[#2C2C2E] text-white rounded-lg px-4 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#024aad] resize-none"
              rows={3}
              style={{ minHeight: '60px', maxHeight: '120px' }}
            />
            <button
              onClick={handleSendMessage}
              disabled={isSubmitting}
              className="p-2 bg-[#024aad] hover:bg-[#41b0f8] rounded-lg transition-colors self-end disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={20} className="text-white" />
            </button>
          </div>
        </div>
      </div>
      {interviewState.isLoading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#024aad] border-t-transparent"></div>
        </div>
      )}
    </div>
  );
}

export default MockInterview;