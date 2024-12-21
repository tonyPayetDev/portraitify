import React, { useState, useEffect } from 'react';

export function CountdownTimer() {
  const [time, setTime] = useState({ hours: 23, minutes: 59, seconds: 59 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(prevTime => {
        if (prevTime.seconds > 0) {
          return { ...prevTime, seconds: prevTime.seconds - 1 };
        } else if (prevTime.minutes > 0) {
          return { ...prevTime, minutes: prevTime.minutes - 1, seconds: 59 };
        } else if (prevTime.hours > 0) {
          return { hours: prevTime.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex gap-4 justify-center">
      {Object.entries(time).map(([unit, value]) => (
        <div key={unit} className="text-center">
          <div className="bg-black text-yellow-400 rounded-lg p-3 min-w-[60px]">
            <span className="text-2xl font-bold">{value.toString().padStart(2, '0')}</span>
          </div>
          <div className="text-xs mt-1 text-gray-400 capitalize">{unit}</div>
        </div>
      ))}
    </div>
  );
}