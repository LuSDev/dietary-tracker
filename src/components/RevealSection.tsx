import { motion } from 'motion/react';
import { ReactNode } from 'react';

interface RevealSectionProps {
  children: ReactNode;
  className?: string;
  /** Controls visibility during initial app launch handoff; defaults to true. */
  revealed?: boolean;
  /** Vertical offset in px before settling. */
  offsetY?: number;
  /** Stagger delay in seconds. */
  delay?: number;
  /** Spring duration in seconds. */
  duration?: number;
  'aria-label'?: string;
}

/**
 * Shared critically-damped Apple spring reveal for view sections.
 * Animates on mount when `revealed` is true (replaying on tab/day switches)
 * and holds hidden until `revealed` flips true during initial app boot.
 */
export function RevealSection({
  children,
  className,
  revealed = true,
  offsetY = 12,
  delay = 0,
  duration = 0.54,
  'aria-label': ariaLabel
}: RevealSectionProps) {
  return (
    <motion.section
      aria-label={ariaLabel}
      initial={{ opacity: 0, y: offsetY }}
      animate={{
        opacity: revealed ? 1 : 0,
        y: revealed ? 0 : offsetY
      }}
      transition={{
        type: 'spring',
        bounce: 0,
        duration,
        delay: revealed ? delay : 0
      }}
      className={className}
    >
      {children}
    </motion.section>
  );
}
