
import { useEffect, useState } from "react";
import { Timer as TimerIcon } from "lucide-react";

interface TimerProps {
  isRunning: boolean;
  shouldReset?: boolean;
  onTimeUpdate?: (time: number) => void;
}

export const Timer = ({ isRunning, shouldReset, onTimeUpdate }: TimerProps) => {
  const [time, setTime] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isRunning) {
      timer = setInterval(() => {
        setTime((prev) => {
          const newTime = prev + 1;
          onTimeUpdate?.(newTime);
          return newTime;
        });
      }, 1000);
    }

    if (shouldReset) {
      setTime(0);
    }

    return () => clearInterval(timer);
  }, [isRunning, shouldReset, onTimeUpdate]);

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  return (
    <div className="bg-white shadow-sm rounded-xl px-4 py-2 text-lg font-semibold flex items-center gap-2 border border-gray-100">
      <TimerIcon className="w-5 h-5 text-primary" />
      {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
    </div>
  );
};
