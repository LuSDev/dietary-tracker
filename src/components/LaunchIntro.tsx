import { motion, useReducedMotion } from 'motion/react';

export type BootPhase = 'intro' | 'handoff' | 'ready';

interface LaunchIntroProps {
  phase: Exclude<BootPhase, 'ready'>;
  onSkip: () => void;
}

/**
 * Minimalist startup sequence directly referencing Nura's favicon geometry:
 * - Deep Forest Teal canvas (#013230)
 * - Outer Cream 250° progress arc (#F3EBDD, r=148)
 * - Inner Eucalyptus Sage 262° progress arc (#2A6F68, r=92)
 * - Warm Terracotta core (#D46A43, r=36)
 *
 * Interruptible on pointer-down (never locks out user input) and hands off
 * with critically-damped Apple springs into TodayView.
 */
export function LaunchIntro({ phase, onSkip }: LaunchIntroProps) {
  const shouldReduceMotion = useReducedMotion();
  const isExiting = phase === 'handoff';

  return (
    <motion.div
      role="presentation"
      aria-hidden="true"
      onPointerDown={() => {
        if (!isExiting) onSkip();
      }}
      initial={{ opacity: 1 }}
      animate={{ opacity: isExiting ? 0 : 1 }}
      transition={{
        duration: shouldReduceMotion ? 0.2 : 0.46,
        ease: [0.32, 0.72, 0, 1]
      }}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#013230] px-6 pt-[env(safe-area-inset-top,0px)] pb-[env(safe-area-inset-bottom,0px)] select-none ${
        isExiting ? 'pointer-events-none' : 'cursor-pointer'
      }`}
    >
      {/* Subtle sage ambient radial wash behind the concentric mark */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 46%, rgba(42, 111, 104, 0.26) 0%, rgba(1, 50, 48, 0) 64%)'
        }}
      />

      {/* Centered Emblem + Wordmark Lockup (slightly above geometric center for mobile optical balance) */}
      <motion.div
        initial={false}
        animate={{
          scale: isExiting && !shouldReduceMotion ? 1.1 : 1,
          opacity: isExiting ? 0 : 1,
          y: isExiting && !shouldReduceMotion ? -6 : 0
        }}
        transition={{
          duration: shouldReduceMotion ? 0.18 : 0.38,
          ease: [0.22, 1, 0.36, 1]
        }}
        className="relative -mt-4 flex flex-col items-center"
      >
        <div className="relative h-[168px] w-[168px] sm:h-[192px] sm:w-[192px]">
          <svg
            viewBox="0 0 512 512"
            fill="none"
            className="h-full w-full overflow-visible"
          >
            {/* Outer Subtle Cream Track (matches favicon r=148 track) */}
            <motion.circle
              cx="256"
              cy="256"
              r="148"
              stroke="#F3EBDD"
              strokeOpacity="0.16"
              strokeWidth="34"
              initial={{ opacity: shouldReduceMotion ? 1 : 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.32, ease: 'easeOut' }}
            />

            {/* Inner Subtle Sage Groove (machined dial guide for r=92) */}
            <motion.circle
              cx="256"
              cy="256"
              r="92"
              stroke="#2A6F68"
              strokeOpacity="0.22"
              strokeWidth="26"
              initial={{ opacity: shouldReduceMotion ? 1 : 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.32, delay: 0.04, ease: 'easeOut' }}
            />

            {/* Inner Sage Arc — exact 261.6° arc matching favicon stroke-dasharray="420 600" */}
            <motion.g
              style={{ transformOrigin: '256px 256px', transformBox: 'view-box' }}
              initial={{ rotate: shouldReduceMotion ? 0 : -30 }}
              animate={{ rotate: shouldReduceMotion ? 0 : 17 }}
              transition={{
                duration: shouldReduceMotion ? 0 : 2.4,
                ease: [0.06, 0.82, 0.45, 0.93]
              }}
            >
              <circle cx="256" cy="256" r="256" fill="none" />
              <motion.path
                d="M 348 256 A 92 92 0 1 1 242.51 164.99"
                stroke="#2A6F68"
                strokeWidth="26"
                strokeLinecap="round"
                initial={{
                  pathLength: shouldReduceMotion ? 1 : 0,
                  opacity: shouldReduceMotion ? 1 : 0
                }}
                animate={{
                  pathLength: 1,
                  opacity: 1
                }}
                transition={{
                  pathLength: {
                    type: 'spring',
                    bounce: 0,
                    duration: 0.76
                  },
                  opacity: { duration: 0.18 }
                }}
              />
            </motion.g>

            {/* Outer Cream Arc — exact path from public/favicon.svg */}
            <motion.g
              style={{ transformOrigin: '256px 256px', transformBox: 'view-box' }}
              initial={{ rotate: shouldReduceMotion ? 0 : -22 }}
              animate={{ rotate: shouldReduceMotion ? 0 : 15 }}
              transition={{
                duration: shouldReduceMotion ? 0 : 2.4,
                delay: shouldReduceMotion ? 0 : 0.04,
                ease: [0.06, 0.82, 0.45, 0.93]
              }}
            >
              <circle cx="256" cy="256" r="256" fill="none" />
              <motion.path
                d="M256 108C337.738 108 404 174.262 404 256C404 337.738 337.738 404 256 404C191.5 404 136.6 362.7 116.4 305"
                stroke="#F3EBDD"
                strokeWidth="34"
                strokeLinecap="round"
                initial={{
                  pathLength: shouldReduceMotion ? 1 : 0,
                  opacity: shouldReduceMotion ? 1 : 0
                }}
                animate={{
                  pathLength: 1,
                  opacity: 1
                }}
                transition={{
                  pathLength: {
                    type: 'spring',
                    bounce: 0,
                    duration: 0.84,
                    delay: shouldReduceMotion ? 0 : 0.04
                  },
                  opacity: { duration: 0.18, delay: shouldReduceMotion ? 0 : 0.04 }
                }}
              />
            </motion.g>

            {/* Subtle Equilibrium Halo when the rings settle */}
            {!shouldReduceMotion && (
              <motion.circle
                cx="256"
                cy="256"
                r="36"
                stroke="#D46A43"
                strokeWidth="4"
                style={{ transformOrigin: '256px 256px', transformBox: 'view-box' }}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1.55, opacity: [0, 0.32, 0] }}
                transition={{
                  duration: 0.55,
                  delay: 0.48,
                  ease: [0.16, 1, 0.3, 1]
                }}
              />
            )}

            {/* Center Terracotta Core (matches favicon r=36 #D46A43) */}
            <motion.circle
              cx="256"
              cy="256"
              r="36"
              fill="#D46A43"
              style={{ transformOrigin: '256px 256px', transformBox: 'view-box' }}
              initial={{
                scale: shouldReduceMotion ? 1 : 0.32,
                opacity: shouldReduceMotion ? 1 : 0
              }}
              animate={{
                scale: 1,
                opacity: 1
              }}
              transition={{
                type: 'spring',
                bounce: 0,
                duration: 0.46
              }}
            />
          </svg>
        </div>

        {/* Minimalist Wordmark + Subtitle */}
        <motion.span
          initial={{
            opacity: shouldReduceMotion ? 1 : 0,
            y: shouldReduceMotion ? 0 : 8
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            type: 'spring',
            bounce: 0,
            duration: 0.52,
            delay: shouldReduceMotion ? 0 : 0.16
          }}
          className="mt-4 text-[34px] leading-tight font-semibold tracking-[-0.032em] text-[#F3EBDD]/95 sm:text-[38px]"
        >
          Nura
        </motion.span>

        <motion.span
          initial={{
            opacity: shouldReduceMotion ? 1 : 0,
            y: shouldReduceMotion ? 0 : 6
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            duration: shouldReduceMotion ? 0.15 : 0.54,
            delay: shouldReduceMotion ? 0 : 0.62,
            ease: [0.16, 1, 0.3, 1]
          }}
          className="mt-1.5 text-[15px] font-normal tracking-[0.03em] text-[#F3EBDD]/68 sm:text-[16px]"
        >
          Calorie Tracker
        </motion.span>
      </motion.div>
    </motion.div>
  );
}
