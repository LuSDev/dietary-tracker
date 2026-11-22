import { RotateCcw, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

interface UndoToastProps {
  message: string | null;
  onUndo: () => void;
  onDismiss: () => void;
}

export function UndoToast({ message, onUndo, onDismiss }: UndoToastProps) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.96 }}
          transition={{ type: 'spring', bounce: 0.1, duration: 0.3 }}
          role="status"
          aria-live="polite"
          className="fixed inset-x-0 bottom-[calc(5.6rem+env(safe-area-inset-bottom,0px))] z-40 mx-auto flex w-[calc(100%-2rem)] max-w-md items-center justify-between gap-3 rounded-full bg-[#101918] px-4 py-2.5 text-[#F3EBDD] shadow-[0_12px_28px_rgba(16,25,24,0.28)]"
        >
          <span className="truncate text-[13px] font-medium">{message}</span>
          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={onUndo}
              className="pressable-sm inline-flex min-h-[36px] items-center gap-1 rounded-full bg-[#D7E6E3] px-3 text-[12px] font-bold text-[#013230]"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Deshacer
            </button>
            <button
              type="button"
              onClick={onDismiss}
              aria-label="Cerrar aviso"
              className="pressable-sm flex h-9 w-9 items-center justify-center rounded-full text-[#F3EBDD]/70 hover:text-[#F3EBDD]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
