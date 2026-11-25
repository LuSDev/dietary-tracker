import { Trash2 } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useEffect } from 'react';

interface ConfirmDeleteModalProps {
  open: boolean;
  title: string;
  description: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ConfirmDeleteModal({
  open,
  title,
  description,
  onCancel,
  onConfirm
}: ConfirmDeleteModalProps) {
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onCancel]);

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="confirm-delete-title"
          aria-describedby="confirm-delete-description"
        >
          {/* Scrim */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0.1 : 0.2 }}
            onClick={onCancel}
            className="fixed inset-0 bg-[#101918]/45 backdrop-blur-[2px]"
          />

          {/* Modal Surface */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 18, scale: 0.96 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.96 }}
            transition={{
              type: 'spring',
              bounce: 0.08,
              duration: shouldReduceMotion ? 0.12 : 0.32
            }}
            className="relative z-10 w-full max-w-sm overflow-hidden rounded-[28px] border border-[#013230]/10 bg-[#FAF6EE] p-5 shadow-[0_20px_50px_rgba(1,50,48,0.24)] sm:p-6"
          >
            <div className="flex items-start gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#F5E1D8] text-[#B54E28]">
                <Trash2 className="h-5 w-5" strokeWidth={2.1} />
              </div>
              <div className="min-w-0">
                <h2
                  id="confirm-delete-title"
                  className="heading-tight text-[18px] font-bold text-[#101918]"
                >
                  {title}
                </h2>
                <p
                  id="confirm-delete-description"
                  className="mt-1 text-[13.5px] leading-relaxed text-[#41514F]"
                >
                  {description}
                </p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={onCancel}
                className="pressable-sm flex min-h-[46px] items-center justify-center rounded-full bg-[#E8DEC8] px-4 text-[14px] font-semibold text-[#101918] transition-colors hover:bg-[#DFD2B8]"
              >
                Regresar
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className="pressable-sm flex min-h-[46px] items-center justify-center rounded-full bg-[#B54E28] px-4 text-[14px] font-bold text-[#FFFDF9] shadow-[0_4px_14px_rgba(181,78,40,0.26)] transition-colors hover:bg-[#9D4220]"
              >
                Eliminar
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
