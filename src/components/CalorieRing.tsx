import { motion } from 'motion/react';

interface CalorieRingProps {
  consumed: number;
  goal: number;
  size?: number;
}

export function CalorieRing({ consumed, goal, size = 240 }: CalorieRingProps) {
  const safeGoal = Math.max(1, goal);
  const isOver = consumed > goal;
  const progress = Math.min(1, Math.max(0, consumed / safeGoal));

  const strokeWidth = 20;
  const center = size / 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // 270° open-bottom arc (starts at 135° bottom-left, ends at 45° bottom-right)
  const arcAngle = 270;
  const startAngle = 135;
  const arcLength = circumference * (arcAngle / 360);
  const strokeDashoffset = arcLength * (1 - progress);
  const endOffsetRad = ((180 - startAngle) * Math.PI) / 180;
  const svgHeight = Math.ceil(center + radius * Math.sin(endOffsetRad) + strokeWidth / 2 + 6);

  const ringColor = isOver ? '#D46A43' : '#013230';
  const trackColor = isOver ? 'rgba(212, 106, 67, 0.16)' : 'rgba(1, 50, 48, 0.09)';

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: svgHeight }}
    >
      <svg
        width={size}
        height={svgHeight}
        viewBox={`0 0 ${size} ${svgHeight}`}
        role="img"
        aria-label={`Calorías consumidas: ${consumed} de ${goal} kcal`}
      >
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${arcLength} ${circumference}`}
          transform={`rotate(${startAngle} ${center} ${center})`}
        />
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={ringColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${arcLength} ${circumference}`}
          transform={`rotate(${startAngle} ${center} ${center})`}
          initial={false}
          animate={{
            strokeDashoffset,
            strokeOpacity: progress > 0 ? 1 : 0
          }}
          transition={{
            type: 'spring',
            bounce: 0,
            duration: 0.65
          }}
        />
      </svg>

      <div
        className="absolute inset-x-0 flex flex-col items-center justify-center px-6 text-center"
        style={{ top: center - 42 }}
      >
        <span
          className={`text-[11px] font-semibold tracking-wider uppercase ${
            isOver ? 'text-[#B54E28]' : 'text-[#485856]'
          }`}
        >
          {isOver ? 'Objetivo superado' : 'Consumidas'}
        </span>
        <span
          className={`display-number mt-1 text-[46px] leading-none font-bold ${
            isOver ? 'text-[#D46A43]' : 'text-[#101918]'
          }`}
        >
          {consumed}
        </span>
        <span className="tabular-nums mt-1.5 text-[13px] font-medium text-[#53625F]">
          de <strong className="font-semibold text-[#41514F]">{goal}</strong> kcal
        </span>
      </div>
    </div>
  );
}
