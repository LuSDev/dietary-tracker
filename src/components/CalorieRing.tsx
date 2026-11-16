import { motion } from 'motion/react';

interface CalorieRingProps {
  consumed: number;
  goal: number;
}

export function CalorieRing({ consumed, goal }: CalorieRingProps) {
  const safeGoal = Math.max(1, goal);
  const remaining = goal - consumed;
  const isOver = remaining < 0;
  const progress = Math.min(1, Math.max(0, consumed / safeGoal));

  const size = 166;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  const ringColor = isOver ? '#D46A43' : '#013230';
  const trackColor = isOver ? 'rgba(212, 106, 67, 0.16)' : 'rgba(1, 50, 48, 0.09)';

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
        role="img"
        aria-label={`Calorías consumidas: ${consumed} de ${goal}`}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={ringColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={false}
          animate={{ strokeDashoffset }}
          transition={{
            type: 'spring',
            bounce: 0,
            duration: 0.65
          }}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center px-3 text-center">
        <span
          className={`text-[11px] font-semibold tracking-wider uppercase ${
            isOver ? 'text-[#B54E28]' : 'text-[#485856]'
          }`}
        >
          {isOver ? 'Excedido' : 'Restantes'}
        </span>
        <span
          className={`display-number mt-0.5 text-[34px] font-bold ${
            isOver ? 'text-[#D46A43]' : 'text-[#101918]'
          }`}
        >
          {Math.abs(remaining)}
        </span>
        <span className="tabular-nums mt-0.5 text-[12px] font-medium text-[#53625F]">
          kcal
        </span>
      </div>
    </div>
  );
}
