"use client";

import { useEffect, useState } from "react";

interface TimerProps {
  totalMinutes: number;
  onTimeUp: () => void;
}

export default function Timer({ totalMinutes, onTimeUp }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState<number>(totalMinutes * 60);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, onTimeUp]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const isLowTime = timeLeft <= 300; // 5 minutes

  return (
    <div
      style={{
        position: "fixed",
        top: "16px",
        right: "16px",
        padding: "16px",
        borderRadius: "8px",
        fontWeight: "bold",
        fontSize: "18px",
        backgroundColor: isLowTime ? "#fee2e2" : "#dbeafe",
        color: isLowTime ? "#b91c1c" : "#1e40af",
        zIndex: 10000,
        minWidth: "200px",
        textAlign: "center",
      }}
    >
      Time Left: {String(minutes).padStart(2, "0")}:
      {String(seconds).padStart(2, "0")}
    </div>
  );
}
