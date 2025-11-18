"use client";

import React, { useEffect, useState } from "react";

interface SeatTimerProps {
  seconds: number;
  onExpire?: () => void;
}

export const SeatTimer: React.FC<SeatTimerProps> = ({ seconds, onExpire }) => {
  const [timer, setTimer] = useState(seconds);

  // Update timer when seconds prop changes (e.g., on page refresh/restore)
  useEffect(() => {
    setTimer(seconds);
  }, [seconds]);

  // Countdown timer
  useEffect(() => {
    if (timer <= 0) {
      onExpire?.();
      return;
    }

    const intervalId = setInterval(() => {
      setTimer((prev) => {
        const newTime = prev - 1;
        if (newTime <= 0) {
          onExpire?.();
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timer, onExpire]);

  const minutes = Math.floor(timer / 60);
  const sec = timer % 60;

  return (
    <div className="p-4 bg-indigo-600 text-white rounded-lg shadow-xl text-center">
      <h3 className="text-xl font-semibold mb-2">Booking Session Timer</h3>
      <div className="text-5xl font-mono">
        {minutes}:{sec.toString().padStart(2, "0")}
      </div>
      <p className="mt-2 text-sm">{timer > 0 ? "Time is ticking..." : "Time Expired!"}</p>
    </div>
  );
};
