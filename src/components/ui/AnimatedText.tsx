'use client';

import React, { useEffect, useState } from 'react';

interface AnimatedTextProps {
  text: string;
  className?: string;
  delay?: number;
  speed?: number;
}

export const TypewriterText: React.FC<AnimatedTextProps> = ({
  text,
  className = '',
  delay = 0,
  speed = 50
}) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (currentIndex < text.length) {
        setDisplayText(text.substring(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }
    }, speed);

    return () => clearTimeout(timeout);
  }, [currentIndex, text, speed]);

  return (
    <span className={className}>
      {displayText}
      <span className="animate-pulse">|</span>
    </span>
  );
};

export const FadeInText: React.FC<AnimatedTextProps> = ({
  text,
  className = '',
  delay = 0
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timeout);
  }, [delay]);

  return (
    <span
      className={`transition-opacity duration-1000 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      } ${className}`}
    >
      {text}
    </span>
  );
};

export const SlideUpText: React.FC<AnimatedTextProps> = ({
  text,
  className = '',
  delay = 0
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timeout);
  }, [delay]);

  return (
    <span
      className={`transition-all duration-700 ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-4'
      } ${className}`}
    >
      {text}
    </span>
  );
};

export const WordByWordText: React.FC<AnimatedTextProps> = ({
  text,
  className = '',
  delay = 0,
  speed = 200
}) => {
  const words = text.split(' ');
  const [visibleWords, setVisibleWords] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (visibleWords < words.length) {
        setVisibleWords(visibleWords + 1);
      }
    }, delay + (visibleWords * speed));

    return () => clearTimeout(timeout);
  }, [visibleWords, words.length, delay, speed]);

  return (
    <span className={className}>
      {words.map((word, index) => (
        <span
          key={index}
          className={`inline-block transition-opacity duration-300 ${
            index < visibleWords ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          {word}{' '}
        </span>
      ))}
    </span>
  );
};