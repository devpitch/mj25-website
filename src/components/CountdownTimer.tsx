import { useEffect, useState } from "react";

interface TimeUnit {
  value: number;
  label: string;
}

interface CountdownTimerProps {
  targetDate: string;
}

export const CountdownTimer = ({ targetDate }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState<TimeUnit[]>([]);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        setTimeLeft([
          { value: days, label: "Days" },
          { value: hours, label: "Hours" },
          { value: minutes, label: "Minutes" },
          { value: seconds, label: "Seconds" },
        ]);
      } else {
        setTimeLeft([]);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (timeLeft.length === 0) {
    setTimeLeft([
      { value: 0, label: "Days" },
      { value: 0, label: "Hours" },
      { value: 0, label: "Minutes" },
      { value: 0, label: "Seconds" },
    ]);
  }

  return (
    <div className="flex gap-2 sm:gap-4 justify-center flex-nowrap overflow-x-auto">
  {timeLeft.map((unit, index) => (
    <div
      key={index}
      className="bg-white rounded-xl shadow-soft p-2 sm:p-4 w-[70px] sm:w-[80px] border border-wedding-sage/20 text-center flex-shrink-0"
    >
      <div className="text-xl sm:text-3xl font-bold text-wedding-primary font-poppins">
        {unit.value.toString().padStart(2, '0')}
      </div>
      <div className="text-xs sm:text-sm text-muted-foreground font-medium">
        {unit.label}
      </div>
    </div>
  ))}
</div>

  );
};
