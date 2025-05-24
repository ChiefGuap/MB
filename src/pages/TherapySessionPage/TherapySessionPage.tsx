import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Webcam from 'react-webcam';
import { Send, Mic, MicOff, Camera, CameraOff, X, AlertCircle, Settings } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import ChatMessage from './ChatMessage';
import EmotionIndicator from './EmotionIndicator';
import { detectEmotion } from '../../utils/emotionDetection';
import { useSpeechToText } from '../../utils/speechRecognition';
import { generateTherapyResponse } from '../../utils/anthropicClient';
import { saveSession, TherapySession } from '../../utils/supabase';
import { useAuth } from '../../context/AuthContext';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

const TherapySessionPage: React.FC = () => {
  const { user } = useAuth();
  const [isSessionStarted, setIsSessionStarted] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<string | null>(null);
  const [emotionConfidence, setEmotionConfidence] = useState<number>(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [showEmergencyResources, setShowEmergencyResources] = useState(false);
  const [sessionId] = useState(uuidv4());
  
  const webcamRef = useRef<Webcam>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  const {
    transcript,
    listening,
    browserSupportsSpeechRecognition,
    startListening,
    stopListening,
    resetTranscript
  } = useSpeechToText();

  // Handle speech recognition
  useEffect(() => {
    if (transcript && isSessionStarted) {
      setInputMessage(transcript);
    }
  }, [transcript]);

  useEffect(() => {
    if (isMicOn && isSessionStarted && !listening) {
      startListening();
    } else if (!isMicOn && listening) {
      stopListening();
    }
  }, [isMicOn, isSessionStarted, listening]);

  // Load emotion detection models when component mounts
  useEffect(() => {
    if (!isSessionStarted || !isCameraOn) return;

    let animationFrame: number;
    
    const detectEmotions = async () => {
      if (webcamRef.current && webcamRef.current.video) {
        const video = webcamRef.current.video;
        const result = await detectEmotion(video);
        
        if (result) {
          setCurrentEmotion(result.emotion);
          setEmotionConfidence(result.confidence);
        }
      }
      
      animationFrame = requestAnimationFrame(detectEmotions);
    };

    detectEmotions();

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isSessionStarted, isCameraOn]);
  
  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);
  
  // Welcome message when session starts
  useEffect(() => {
    if (isSessionStarted) {
      const welcomeMessage: Message = {
        id: 'welcome',
        sender: 'ai',
        text: "Hello! I'm your AI therapy assistant. How are you feeling today?",
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [isSessionStarted]);
  
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    const messageText = inputMessage;
    setInputMessage('');
    resetTranscript();
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: messageText,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);

    try {
      // Get AI response
      const response = await generateTherapyResponse(
        messageText,
        currentEmotion,
        messages.map(m => `${m.sender}: ${m.text}`)
      );
      
      const aiMessage: Message = {
        id: Date.now().toString(),
        sender: 'ai',
        text: response,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);

      // Save session progress
      if (user) {
        const sessionData: Omit<TherapySession, 'id'> = {
          user_id: user.id,
          start_time: new Date().toISOString(),
          end_time: null,
          emotions: currentEmotion ? [currentEmotion] : [],
          transcript: messages.map(m => `${m.sender}: ${m.text}`),
          summary: null
        };
        
        await saveSession(sessionData);
      }
    } catch (error) {
      console.error('Error generating response:', error);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const startSession = () => {
    setIsSessionStarted(true);
    if (isMicOn) {
      startListening();
    }
  };
  
  const endSession = () => {
    if (confirm("Are you sure you want to end this therapy session?")) {
      setIsSessionStarted(false);
      setMessages([]);
      setCurrentEmotion(null);
      stopListening();
    }
  };

  return (
    <div className="min-h-screen pt-16 pb-6 bg-neutral-50">
      <motion.div 
        className="container-fluid h-full"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { duration: 0.5 } }
        }}
      >
        {!isSessionStarted ? (
          <div className="max-w-2xl mx-auto py-20">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Ready for Your Therapy Session?
              </h1>
              <p className="text-lg text-gray-700">
                Take a moment to find a quiet, private space before beginning your session.
              </p>
            </motion.div>
            
            <motion.div
              className="bg-white rounded-lg shadow-md p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <button
                onClick={startSession}
                className="w-full btn btn-primary py-4 text-lg font-medium"
              >
                Begin Session
              </button>
            </motion.div>
          </div>
        ) : (
          <div className="h-[calc(100vh-80px)] flex flex-col">
            <div className="bg-white shadow-sm border-b border-gray-200 py-4">
              <div className="container-fluid">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <h1 className="text-xl font-semibold text-gray-900">Therapy Session</h1>
                    {currentEmotion && (
                      <div className="ml-4 flex items-center bg-gray-100 px-3 py-1 rounded-full">
                        <EmotionIndicator emotion={currentEmotion} confidence={emotionConfidence} />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-3">
                    <button 
                      onClick={() => setIsMicOn(!isMicOn)}
                      className={`p-2 rounded-full ${isMicOn ? 'bg-gray-100 text-gray-700' : 'bg-red-100 text-red-600'}`}
                    >
                      {isMicOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                    </button>
                    <button 
                      onClick={() => setIsCameraOn(!isCameraOn)}
                      className={`p-2 rounded-full ${isCameraOn ? 'bg-gray-100 text-gray-700' : 'bg-red-100 text-red-600'}`}
                    >
                      {isCameraOn ? <Camera className="h-5 w-5" /> : <CameraOff className="h-5 w-5" />}
                    </button>
                    <button 
                      onClick={endSession}
                      className="p-2 rounded-full bg-red-100 text-red-600"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex-1 flex">
              {/* Webcam Feed */}
              <div className="w-1/2 p-4">
                {isCameraOn ? (
                  <Webcam
                    ref={webcamRef}
                    audio={false}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
                    <CameraOff className="h-12 w-12 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Chat Interface */}
              <div className="w-1/2 p-4 flex flex-col">
                <div 
                  ref={chatContainerRef}
                  className="flex-1 overflow-y-auto space-y-4 p-4"
                >
                  {messages.map(message => (
                    <ChatMessage key={message.id} message={message} />
                  ))}
                </div>
                
                <div className="p-4 border-t border-gray-200">
                  <div className="relative">
                    <textarea
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Type or speak your message..."
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-12"
                      rows={3}
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim()}
                      className="absolute right-2 bottom-2 p-2 rounded-full bg-sage text-white disabled:opacity-50"
                    >
                      <Send className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default TherapySessionPage;