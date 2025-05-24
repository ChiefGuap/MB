import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Webcam from 'react-webcam';
import { Send, Mic, MicOff, Camera, CameraOff, X, AlertCircle, Settings } from 'lucide-react';
import ChatMessage from './ChatMessage';
import EmotionIndicator from './EmotionIndicator';
import { detectEmotion, loadModels } from '../../utils/emotionDetection';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

const TherapySessionPage: React.FC = () => {
  const [isSessionStarted, setIsSessionStarted] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<string | null>(null);
  const [emotionConfidence, setEmotionConfidence] = useState<number>(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [showEmergencyResources, setShowEmergencyResources] = useState(false);
  
  const webcamRef = useRef<Webcam>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  // Load emotion detection models when component mounts
  useEffect(() => {
    loadModels();
  }, []);

  // Start emotion detection when session starts
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
  
  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputMessage,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    
    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "I understand how you're feeling. Can you tell me more about that?",
        "That sounds challenging. How long have you been feeling this way?",
        "I'm here to support you. What would help you feel better right now?",
        "It's normal to feel that way. Have you tried any coping strategies?",
        "I notice you seem to be feeling " + currentEmotion + ". Is that accurate?"
      ];
      
      const aiMessage: Message = {
        id: Date.now().toString(),
        sender: 'ai',
        text: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const startSession = () => {
    setIsSessionStarted(true);
  };
  
  const endSession = () => {
    if (confirm("Are you sure you want to end this therapy session?")) {
      setIsSessionStarted(false);
      setMessages([]);
      setCurrentEmotion(null);
    }
  };

  // Animation variants
  const pageVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="min-h-screen pt-16 pb-6 bg-neutral-50">
      <motion.div 
        className="container-fluid h-full"
        initial="hidden"
        animate="visible"
        variants={pageVariants}
      >
        {!isSessionStarted ? (
          <div className="max-w-2xl mx-auto py-20">
            <motion.div
              className="text-center mb-12"
              variants={itemVariants}
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
              variants={itemVariants}
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Before we start:</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-sage flex items-center justify-center mt-1 mr-3">
                    <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-gray-700">Ensure you're in a quiet, private space</p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-sage flex items-center justify-center mt-1 mr-3">
                    <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-gray-700">Check that your camera and microphone are working</p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-sage flex items-center justify-center mt-1 mr-3">
                    <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-gray-700">Have a glass of water nearby</p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-sage flex items-center justify-center mt-1 mr-3">
                    <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-gray-700">Set aside at least 20 minutes for your session</p>
                </div>
              </div>
              
              <div className="bg-peach bg-opacity-20 p-4 rounded-lg mb-8">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-orange-500 mr-3 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700">
                    <strong>Note:</strong> While our AI assistant can provide support, it is not a replacement for professional mental health treatment. If you're experiencing a crisis, please call the National Suicide Prevention Lifeline at 1-800-273-8255.
                  </p>
                </div>
              </div>
              
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
                        <span className="text-sm text-gray-700 mr-2">Current emotion:</span>
                        <EmotionIndicator emotion={currentEmotion} confidence={emotionConfidence} />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-3">
                    <button 
                      onClick={() => setShowEmergencyResources(!showEmergencyResources)}
                      className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                    >
                      <AlertCircle className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={() => setIsMicOn(!isMicOn)}
                      className={`p-2 rounded-full ${isMicOn ? 'bg-gray-100 text-gray-700' : 'bg-red-100 text-red-600'} hover:bg-opacity-80 transition-colors`}
                    >
                      {isMicOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                    </button>
                    <button 
                      onClick={() => setIsCameraOn(!isCameraOn)}
                      className={`p-2 rounded-full ${isCameraOn ? 'bg-gray-100 text-gray-700' : 'bg-red-100 text-red-600'} hover:bg-opacity-80 transition-colors`}
                    >
                      {isCameraOn ? <Camera className="h-5 w-5" /> : <CameraOff className="h-5 w-5" />}
                    </button>
                    <button 
                      onClick={endSession}
                      className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Emergency Resources Modal */}
            {showEmergencyResources && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
                <motion.div 
                  className="bg-white rounded-lg max-w-lg w-full p-6"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-900">Emergency Resources</h3>
                    <button 
                      onClick={() => setShowEmergencyResources(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-red-50 border-l-4 border-red-500 p-4">
                      <p className="text-sm text-red-700">
                        If you're experiencing a mental health emergency or having thoughts of suicide, please reach out for immediate help:
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">National Suicide Prevention Lifeline</h4>
                      <p className="text-gray-700 mb-2">Available 24/7</p>
                      <a href="tel:1-800-273-8255" className="text-lg font-bold text-sage block">1-800-273-8255</a>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Crisis Text Line</h4>
                      <p className="text-gray-700 mb-2">Text HOME to 741741</p>
                      <p className="text-sm text-gray-600">Available 24/7 in the USA</p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Emergency Services</h4>
                      <a href="tel:911" className="text-lg font-bold text-sage block">911</a>
                      <p className="text-sm text-gray-600 mt-1">For immediate danger, call emergency services</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setShowEmergencyResources(false)}
                    className="mt-6 w-full btn btn-primary"
                  >
                    Close
                  </button>
                </motion.div>
              </div>
            )}
            
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
              {/* Webcam Feed */}
              <div className="md:w-1/2 p-4 flex flex-col">
                <div className="flex-1 bg-black rounded-lg overflow-hidden relative">
                  {isCameraOn ? (
                    <Webcam
                      audio={isMicOn}
                      ref={webcamRef}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-900">
                      <CameraOff className="h-16 w-16 text-gray-600" />
                    </div>
                  )}
                  
                  {/* Emotion overlay */}
                  {currentEmotion && isCameraOn && (
                    <div className="absolute bottom-4 left-4 bg-black bg-opacity-60 text-white px-3 py-2 rounded-lg">
                      <div className="flex items-center">
                        <EmotionIndicator emotion={currentEmotion} confidence={emotionConfidence} showText={false} />
                        <span className="ml-2 capitalize">{currentEmotion}</span>
                        <span className="ml-2 text-xs text-gray-300">{emotionConfidence}%</span>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="mt-4 bg-white rounded-lg shadow-sm p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Session Controls</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => setIsMicOn(!isMicOn)}
                      className={`flex items-center justify-center py-2 px-4 rounded-md ${
                        isMicOn 
                          ? 'bg-gray-100 text-gray-800 hover:bg-gray-200' 
                          : 'bg-red-100 text-red-600 hover:bg-red-200'
                      }`}
                    >
                      {isMicOn ? <Mic className="h-4 w-4 mr-2" /> : <MicOff className="h-4 w-4 mr-2" />}
                      {isMicOn ? 'Mute' : 'Unmute'}
                    </button>
                    <button 
                      onClick={() => setIsCameraOn(!isCameraOn)}
                      className={`flex items-center justify-center py-2 px-4 rounded-md ${
                        isCameraOn 
                          ? 'bg-gray-100 text-gray-800 hover:bg-gray-200' 
                          : 'bg-red-100 text-red-600 hover:bg-red-200'
                      }`}
                    >
                      {isCameraOn ? <CameraOff className="h-4 w-4 mr-2" /> : <Camera className="h-4 w-4 mr-2" />}
                      {isCameraOn ? 'Hide Camera' : 'Show Camera'}
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Chat Interface */}
              <div className="md:w-1/2 p-4 flex flex-col">
                <div className="flex-1 bg-white rounded-lg shadow-sm overflow-hidden flex flex-col">
                  <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-gray-900">AI Therapy Assistant</h3>
                      <p className="text-xs text-gray-500">Conversation is private and secure</p>
                    </div>
                    <button className="text-gray-500 hover:text-gray-700">
                      <Settings className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <div 
                    ref={chatContainerRef}
                    className="flex-1 p-4 overflow-y-auto space-y-4"
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
                        placeholder="Type your message here..."
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-sage focus:border-transparent resize-none"
                        rows={3}
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={!inputMessage.trim()}
                        className="absolute right-2 bottom-2 p-2 rounded-full bg-sage text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Send className="h-5 w-5" />
                      </button>
                    </div>
                    <p className="mt-2 text-xs text-gray-500">
                      Press Enter to send. Use Shift+Enter for a new line.
                    </p>
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