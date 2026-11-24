import { animate, motion, useMotionValue, useReducedMotion, useTransform } from 'motion/react';
import { useEffect } from 'react';

interface AnimatedNumberProps {
  value: number;
  /** When false, holds the counter at 0 until revealed. */
  enabled?: boolean;
  duration?: number;
  delay?: number;
}

/**
 * Counts smoothly from 0 (on mount / reveal) to `value` using a critically-damped
 * spring so numeric readouts stay in 1:1 lockstep with progress rings and bars.
 */
export function AnimatedNumber({
  value,
  enabled = true,
  duration = 0.62,
  delay = 0
}: AnimatedNumberProps) {
  const shouldReduceMotion = useReducedMotion();
  const target = Math.round(value);
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    if (!enabled) {
      count.set(0);
      return;
    }

    if (shouldReduceMotion) {
      count.set(target);
      return;
    }

    const controls = animate(count, target, {
      type: 'spring',
      bounce: 0,
      duration,
      delay
    });

    return () => controls.stop();
  }, [count, target, enabled, duration, delay, shouldReduceMotion]);

  return <motion.span>{rounded}</motion.span>;
}
