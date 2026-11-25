import { Search } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useEffect, useState } from 'react';

interface AnimatedSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholders: string[];
  resetKey?: string;
  ariaLabel: string;
  className?: string;
}

export function AnimatedSearchInput({
  value,
  onChange,
  placeholders,
  resetKey = '',
  ariaLabel,
  className = ''
}: AnimatedSearchInputProps) {
  const shouldReduceMotion = useReducedMotion();
  const [placeholderIdx, setPlaceholderIdx] = useState(0);

  useEffect(() => {
    setPlaceholderIdx(0);
  }, [resetKey]);

  useEffect(() => {
    if (value.length > 0 || placeholders.length <= 1) return;
    const interval = window.setInterval(() => {
      setPlaceholderIdx((prev) => (prev + 1) % placeholders.length);
    }, 2600);
    return () => window.clearInterval(interval);
  }, [value.length, placeholders.length]);

  const currentPlaceholder = placeholders[placeholderIdx % Math.max(1, placeholders.length)] ?? '';

  return (
    <div className={`relative ${className}`}>
      <Search className="pointer-events-none absolute top-1/2 left-3.5 z-10 h-4 w-4 -translate-y-1/2 text-[#53625F]" />
      <input
        type="search"
        enterKeyHint="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={ariaLabel}
        className="h-11 w-full rounded-2xl border border-[#013230]/12 bg-[#FFFDF9] pr-4 pl-10 text-[16px] text-[#101918] focus:border-[#013230] focus:outline-none"
      />
      {value.length === 0 && currentPlaceholder && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-4 left-10 flex items-center overflow-hidden"
        >
          <AnimatePresence mode="sync" initial={false}>
            <motion.span
              key={`${resetKey}-${placeholderIdx}`}
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 14 }}
              animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -14 }}
              transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-x-0 truncate text-[16px] text-[#53625F]"
            >
              {currentPlaceholder}
            </motion.span>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

export function buildInterleavedPlaceholders<T extends { name: string; category: string }>(
  items: T[],
  emptyFallback: string
): string[] {
  if (items.length === 0) return [emptyFallback];
  const buckets = new Map<string, T[]>();
  for (const item of items) {
    const list = buckets.get(item.category);
    if (list) list.push(item);
    else buckets.set(item.category, [item]);
  }
  const orderedBuckets = Array.from(buckets.values());
  const maxLen = Math.max(...orderedBuckets.map((b) => b.length));
  const interleaved: string[] = [];
  for (let i = 0; i < maxLen; i++) {
    for (const bucket of orderedBuckets) {
      if (bucket[i]) {
        interleaved.push(`Buscar "${bucket[i].name}"...`);
      }
    }
  }
  return interleaved;
}
