import React from 'react';

interface EmotionIndicatorProps {
  emotion: string;
  confidence: number;
  showText?: boolean;
}

const EmotionIndicator: React.FC<EmotionIndicatorProps> = ({ 
  emotion, 
  confidence,
  showText = true
}) => {
  // Map emotions to colors and icons
  const emotionMap: Record<string, { color: string, icon: string }> = {
    happy: { 
      color: 'bg-yellow-500', 
      icon: '😊' 
    },
    sad: { 
      color: 'bg-blue-500', 
      icon: '😢' 
    },
    angry: { 
      color: 'bg-red-500', 
      icon: '😠' 
    },
    surprised: { 
      color: 'bg-purple-500', 
      icon: '😮' 
    },
    fearful: { 
      color: 'bg-orange-500', 
      icon: '😨' 
    },
    neutral: { 
      color: 'bg-gray-500', 
      icon: '😐' 
    }
  };
  
  const { color, icon } = emotionMap[emotion.toLowerCase()] || { color: 'bg-gray-500', icon: '❓' };
  
  return (
    <div className="flex items-center">
      <span className="text-lg mr-1">{icon}</span>
      {showText && (
        <span className="capitalize">{emotion}</span>
      )}
    </div>
  );
};

export default EmotionIndicator;