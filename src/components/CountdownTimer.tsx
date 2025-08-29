import { useEffect, useState } from 'react';

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
          { value: days, label: 'Days' },
          { value: hours, label: 'Hours' },
          { value: minutes, label: 'Minutes' },
          { value: seconds, label: 'Seconds' },
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
    return (
      <div className="text-center p-8 bg-gradient-gold rounded-2xl shadow-gold">
        <h3 className="text-2xl font-bold text-white">The Day Is Here!</h3>
      </div>
    );
  }

  return (
    <div className="flex gap-4 justify-center flex-wrap">
      {timeLeft.map((unit, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-soft p-4 min-w-[80px] border border-wedding-sage/20"
        >
          <div className="text-3xl font-bold text-wedding-primary font-poppins">
            {unit.value.toString().padStart(2, '0')}
          </div>
          <div className="text-sm text-muted-foreground font-medium">
            {unit.label}
          </div>
        </div>
      ))}
    </div>
  );
};