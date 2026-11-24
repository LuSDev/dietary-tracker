import {
  Compass,
  Download,
  MoreVertical,
  PlusSquare,
  Share,
  Smartphone,
  X
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { ReactNode, useEffect, useMemo } from 'react';
import { detectInstallPlatform, InstallPlatform } from '../domain/pwa';

interface InstallStep {
  icon: ReactNode;
  text: string;
}

interface PlatformInstructions {
  badge: string;
  steps: InstallStep[];
}

function getPlatformInstructions(platform: InstallPlatform): PlatformInstructions {
  switch (platform) {
    case 'ios-safari':
      return {
        badge: 'Safari en iPhone / iPad',
        steps: [
          {
            icon: <Share className="h-4 w-4 text-[#013230]" strokeWidth={2.2} />,
            text: 'Toca el botón Compartir en la barra inferior de Safari.'
          },
          {
            icon: <PlusSquare className="h-4 w-4 text-[#013230]" strokeWidth={2.2} />,
            text: 'Desliza hacia abajo y selecciona «Añadir a la pantalla de inicio».'
          },
          {
            icon: <Smartphone className="h-4 w-4 text-[#013230]" strokeWidth={2.2} />,
            text: 'Toca «Añadir» arriba a la derecha y abre Nura desde tu inicio.'
          }
        ]
      };

    case 'ios-other':
      return {
        badge: 'Navegador en iOS',
        steps: [
          {
            icon: <Compass className="h-4 w-4 text-[#013230]" strokeWidth={2.2} />,
            text: 'Abre esta página en Safari (o toca el botón Compartir de tu navegador).'
          },
          {
            icon: <PlusSquare className="h-4 w-4 text-[#013230]" strokeWidth={2.2} />,
            text: 'Selecciona «Añadir a la pantalla de inicio».'
          },
          {
            icon: <Smartphone className="h-4 w-4 text-[#013230]" strokeWidth={2.2} />,
            text: 'Confirma con «Añadir» y ábrela como aplicación desde tu pantalla.'
          }
        ]
      };

    case 'android-chrome':
      return {
        badge: 'Chrome / Edge en Android',
        steps: [
          {
            icon: <MoreVertical className="h-4 w-4 text-[#013230]" strokeWidth={2.2} />,
            text: 'Toca el menú de tres puntos (⋮) arriba a la derecha.'
          },
          {
            icon: <Download className="h-4 w-4 text-[#013230]" strokeWidth={2.2} />,
            text: 'Elige «Instalar aplicación» o «Añadir a la pantalla de inicio».'
          },
          {
            icon: <Smartphone className="h-4 w-4 text-[#013230]" strokeWidth={2.2} />,
            text: 'Confirma en «Instalar» y abre Nura desde tu cajón de apps o inicio.'
          }
        ]
      };

    case 'android-other':
      return {
        badge: 'Navegador en Android',
        steps: [
          {
            icon: <MoreVertical className="h-4 w-4 text-[#013230]" strokeWidth={2.2} />,
            text: 'Abre el menú de opciones de tu navegador (⋮).'
          },
          {
            icon: <PlusSquare className="h-4 w-4 text-[#013230]" strokeWidth={2.2} />,
            text: 'Toca «Instalar» o «Añadir a la pantalla de inicio».'
          },
          {
            icon: <Smartphone className="h-4 w-4 text-[#013230]" strokeWidth={2.2} />,
            text: 'Ábrela desde el nuevo acceso directo para usarla a pantalla completa.'
          }
        ]
      };

    case 'desktop-chromium':
      return {
        badge: 'Chrome / Edge en escritorio',
        steps: [
          {
            icon: <MoreVertical className="h-4 w-4 text-[#013230]" strokeWidth={2.2} />,
            text: 'Haz clic en los 3 puntos flotantes de la esquina superior derecha.'
          },
          {
            icon: <Share className="h-4 w-4 text-[#013230]" strokeWidth={2.2} />,
            text: 'Navega hasta la opción «Enviar, guardar y compartir» y selecciónala.'
          },
          {
            icon: <Download className="h-4 w-4 text-[#013230]" strokeWidth={2.2} />,
            text: 'Dentro del panel desplegable, selecciona «Instalar página como aplicación».'
          }
        ]
      };

    case 'desktop-safari':
      return {
        badge: 'Safari en Mac',
        steps: [
          {
            icon: <Share className="h-4 w-4 text-[#013230]" strokeWidth={2.2} />,
            text: 'Haz clic en «Archivo» en la barra superior o en el botón Compartir.'
          },
          {
            icon: <PlusSquare className="h-4 w-4 text-[#013230]" strokeWidth={2.2} />,
            text: 'Selecciona «Añadir al Dock…».'
          },
          {
            icon: <Smartphone className="h-4 w-4 text-[#013230]" strokeWidth={2.2} />,
            text: 'Haz clic en «Añadir» y abre Nura directamente desde el Dock.'
          }
        ]
      };

    case 'desktop-other':
      return {
        badge: 'Navegador web',
        steps: [
          {
            icon: <Compass className="h-4 w-4 text-[#013230]" strokeWidth={2.2} />,
            text: 'Para instalar Nura como app, ábrela desde Chrome, Edge o Safari.'
          },
          {
            icon: <PlusSquare className="h-4 w-4 text-[#013230]" strokeWidth={2.2} />,
            text: 'Usa la opción «Instalar aplicación» o «Añadir a la pantalla de inicio».'
          }
        ]
      };
  }
}

interface InstallAppModalProps {
  open: boolean;
  onDismiss: () => void;
}

export function InstallAppModal({ open, onDismiss }: InstallAppModalProps) {
  const platform = useMemo(() => detectInstallPlatform(), []);
  const instructions = useMemo(() => getPlatformInstructions(platform), [platform]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onDismiss();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onDismiss]);

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center p-3 sm:items-center sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="install-modal-title"
        >
          {/* Scrim */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={onDismiss}
            className="fixed inset-0 bg-[#101918]/45 backdrop-blur-[2px]"
          />

          {/* Modal Surface */}
          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{
              type: 'spring',
              bounce: 0.08,
              duration: 0.36
            }}
            className="relative z-10 w-full max-w-md overflow-hidden rounded-[28px] border border-[#013230]/10 bg-[#FAF6EE] p-5 shadow-[0_20px_50px_rgba(1,50,48,0.22)] sm:p-6"
          >
            {/* Close X */}
            <button
              type="button"
              onClick={onDismiss}
              aria-label="Cerrar"
              className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-[#E8DEC8]/75 text-[#41514F] transition-colors hover:bg-[#DFD2B8]"
            >
              <X className="h-4 w-4" strokeWidth={2.2} />
            </button>

            {/* App Icon & Title */}
            <div className="flex items-center gap-3.5 pr-8">
              <img
                src="/favicon.svg"
                alt="Ícono de Nura"
                className="h-12 w-12 shrink-0 rounded-[14px] shadow-[0_4px_12px_rgba(1,50,48,0.18)]"
              />
              <div>
                <h2
                  id="install-modal-title"
                  className="heading-tight text-[19px] font-bold text-[#101918]"
                >
                  Instala Nura como app
                </h2>
              </div>
            </div>

            <p className="mt-3 text-[13.5px] leading-relaxed text-[#41514F]">
              Agrégala a tu pantalla de inicio para disfrutar una mejor experiencia: apertura
              instantánea, pantalla completa y acceso directo como app nativa.
            </p>

            {/* Browser-specific Steps */}
            <ol className="mt-4 space-y-2.5 rounded-[20px] border border-[#013230]/8 bg-[#FFFDF9] p-3.5">
              {instructions.steps.map((step, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#013230]/8 text-[12px] font-bold text-[#013230]">
                    {idx + 1}
                  </span>
                  <div className="flex flex-1 items-start gap-2 pt-0.5 text-[13px] leading-snug text-[#101918]">
                    <span className="mt-0.5 shrink-0">{step.icon}</span>
                    <span>{step.text}</span>
                  </div>
                </li>
              ))}
            </ol>

            {/* Primary Dismiss Button */}
            <button
              type="button"
              onClick={onDismiss}
              className="mt-5 w-full rounded-full bg-[#013230] px-4 py-3 text-[15px] font-semibold text-[#F3EBDD] shadow-[0_4px_14px_rgba(1,50,48,0.2)] transition-colors hover:bg-[#024542] active:scale-[0.99]"
            >
              Entendido
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
