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
      // Handle error appropriately
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

  // Rest of the component remains the same...
  // (Previous JSX structure and UI components remain unchanged)

  return (
    // Previous JSX structure remains the same...
  );
};

export default TherapySessionPage;