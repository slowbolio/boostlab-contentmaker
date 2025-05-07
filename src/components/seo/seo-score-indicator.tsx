import React, { useEffect, useState } from 'react';

interface SEOScoreIndicatorProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
}

export default function SEOScoreIndicator({ score, size = 'md' }: SEOScoreIndicatorProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  
  useEffect(() => {
    const duration = 1000;
    const start = animatedScore;
    const end = score;
    const increment = end > start ? 1 : -1;
    const steps = Math.abs(end - start);
    const stepDuration = steps > 0 ? duration / steps : 0;
    
    let currentStep = 0;
    
    const timer = setInterval(() => {
      currentStep++;
      const progress = Math.min(currentStep / steps, 1);
      setAnimatedScore(Math.round(start + (end - start) * progress));
      
      if (currentStep >= steps) {
        clearInterval(timer);
      }
    }, stepDuration);
    
    return () => clearInterval(timer);
  }, [score]);
  
  // Calculate colors based on score
  const getColor = (score: number) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 70) return 'text-green-400';
    if (score >= 50) return 'text-yellow-400';
    if (score >= 30) return 'text-orange-400';
    return 'text-red-500';
  }
  
  const getTrackColor = (score: number) => {
    if (score >= 90) return 'rgba(34, 197, 94, 0.2)';
    if (score >= 70) return 'rgba(74, 222, 128, 0.2)';
    if (score >= 50) return 'rgba(250, 204, 21, 0.2)';
    if (score >= 30) return 'rgba(251, 146, 60, 0.2)';
    return 'rgba(239, 68, 68, 0.2)';
  }
  
  const getSizeDimensions = () => {
    switch(size) {
      case 'sm': return { 
        containerSize: 'w-16 h-16', 
        fontSize: 'text-xl',
        strokeWidth: 5
      };
      case 'lg': return { 
        containerSize: 'w-40 h-40', 
        fontSize: 'text-5xl',
        strokeWidth: 8
      };
      default: return { 
        containerSize: 'w-28 h-28', 
        fontSize: 'text-3xl',
        strokeWidth: 6
      };
    }
  }
  
  const { containerSize, fontSize, strokeWidth } = getSizeDimensions();
  const radius = 50 - (strokeWidth / 2);
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (animatedScore / 100) * circumference;
  
  return (
    <div className={`relative ${containerSize} flex items-center justify-center`}>
      <svg className="w-full h-full transform -rotate-90">
        {/* Background track */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={getTrackColor(score)}
          strokeWidth={strokeWidth}
        />
        {/* Score indicator */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          className={`${getColor(score)} transition-all duration-300`}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className={`font-bold ${fontSize} ${getColor(score)}`}>{animatedScore}</span>
        {size !== 'sm' && (
          <span className="text-xs text-muted-foreground mt-1">SEO Poäng</span>
        )}
      </div>
    </div>
  );
}