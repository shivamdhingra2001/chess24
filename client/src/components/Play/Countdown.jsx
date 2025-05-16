import React, { useEffect, useRef, useState } from 'react';

function Countdown({ initialCount, pause, onTimeout }) {
  const [count, setCount] = useState(initialCount);
  const timerRef = useRef(null);
  const lastUpdateRef = useRef(Date.now());
  
  // Update when initialCount changes (from the server)
  useEffect(() => {
    setCount(initialCount);
    lastUpdateRef.current = Date.now();
  }, [initialCount]);
  
  useEffect(() => {
    // Clean up any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    // Only start the timer if not paused and time remains
    if (!pause && count > 0) {
      // Use a faster interval for smoother display
      timerRef.current = setInterval(() => {
        const now = Date.now();
        const elapsed = (now - lastUpdateRef.current) / 1000;
        lastUpdateRef.current = now;
        
        setCount((prevCount) => {
          const newCount = Math.max(0, prevCount - elapsed);
          
          // Check for timeout
          if (newCount <= 0) {
            clearInterval(timerRef.current);
            if (onTimeout) {
              onTimeout();
            }
            return 0;
          }
          
          return newCount;
        });
      }, 100); // Update 10 times per second for smoother countdown
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [pause, onTimeout, count]);
  
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
      .toString()
      .padStart(2, '0');
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, '0');
    const milliseconds = Math.floor((time % 1) * 10)
      .toString();
    return `${minutes}:${seconds}.${milliseconds}`;
  };
  
  return (
    <div className={`text-center text-xl font-mono bg-black p-2 rounded border ${pause ? 'border-gray-500' : 'border-red-500'}`}>
      {formatTime(count)}
    </div>
  );
}

export default Countdown;