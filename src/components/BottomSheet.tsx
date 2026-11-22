import { X } from 'lucide-react';
import { AnimatePresence, motion, PanInfo } from 'motion/react';
import { ReactNode, useEffect } from 'react';

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  headerRight?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  maxHeightClass?: string;
}

export function BottomSheet({
  open,
  onClose,
  title,
  subtitle,
  headerRight,
  children,
  footer,
  maxHeightClass = 'max-h-[88dvh]'
}: BottomSheetProps) {
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    // Momentum projection inspired by Apple Fluid Interfaces
    const projectedY = info.offset.y + (info.velocity.y / 1000) * 180;
    if (projectedY > 120 || info.velocity.y > 460) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-label={title}
        >
          {/* Dimming Scrim */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#101918]/45 backdrop-blur-[2px]"
          />

          {/* Sheet Surface */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{
              type: 'spring',
              bounce: 0.08,
              duration: 0.36
            }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={{ top: 0.05, bottom: 0.55 }}
            onDragEnd={handleDragEnd}
            className={`relative z-10 flex w-full max-w-lg flex-col rounded-t-[28px] bg-[#FAF6EE] shadow-[0_-12px_40px_rgba(1,50,48,0.18)] sm:rounded-[28px] ${maxHeightClass}`}
          >
            {/* Drag Handle */}
            <div className="flex shrink-0 cursor-grab justify-center pt-3 pb-1 active:cursor-grabbing">
              <div className="h-1.5 w-11 rounded-full bg-[#013230]/18" />
            </div>

            {/* Sheet Header */}
            <div className="flex shrink-0 items-start justify-between gap-3 border-b border-[#013230]/8 px-5 pt-2 pb-3.5">
              <div className="min-w-0 flex-1">
                <h2 className="heading-tight truncate text-[19px] font-bold text-[#101918]">
                  {title}
                </h2>
                {subtitle && (
                  <p className="mt-0.5 truncate text-[13px] text-[#485856]">
                    {subtitle}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                {headerRight}
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Cerrar panel"
                  className="pressable-sm flex h-11 w-11 items-center justify-center rounded-full bg-[#E8DEC8]/70 text-[#101918] transition-colors hover:bg-[#E8DEC8]"
                >
                  <X className="h-5 w-5" strokeWidth={2.2} />
                </button>
              </div>
            </div>

            {/* Scrollable Body */}
            <div
              onPointerDown={(e) => e.stopPropagation()}
              className="sheet-scroll flex-1 px-5 py-4"
            >
              {children}
            </div>

            {/* Optional Sticky Footer */}
            {footer && (
              <div
                onPointerDown={(e) => e.stopPropagation()}
                className="shrink-0 border-t border-[#013230]/8 bg-[#FAF6EE] px-5 pt-3.5 pb-[calc(1rem+env(safe-area-inset-bottom,0px))] sm:rounded-b-[28px]"
              >
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
