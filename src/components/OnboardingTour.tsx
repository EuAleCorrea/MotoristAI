import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface OnboardingStep {
  title: string;
  description: string;
  icon: string;
}

interface OnboardingTourProps {
  steps: OnboardingStep[];
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
  onComplete: () => void;
  onSkip: () => void;
}

export default function OnboardingTour({
  steps,
  currentStep,
  totalSteps,
  onNext,
  onPrev,
  onComplete,
  onSkip,
}: OnboardingTourProps) {
  const step = steps[currentStep];
  const isLastStep = currentStep === totalSteps - 1;
  const isFirstStep = currentStep === 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      style={{ WebkitBackdropFilter: 'blur(4px)' }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ scale: 0.85, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: -20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-[90%] max-w-sm bg-[var(--ios-card)] rounded-3xl shadow-2xl p-8 pt-10 text-center"
        >
          {/* Botão fechar */}
          <button
            onClick={onSkip}
            className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-[var(--ios-separator)] transition-colors"
            aria-label="Fechar onboarding"
          >
            <X className="w-5 h-5" style={{ color: 'var(--ios-text-tertiary)' }} />
          </button>

          {/* Ícone */}
          <div className="text-6xl mb-6">{step.icon}</div>

          {/* Título */}
          <h2
            className="text-xl font-semibold mb-3"
            style={{ color: 'var(--ios-text)' }}
          >
            {step.title}
          </h2>

          {/* Descrição */}
          <p
            className="text-sm leading-relaxed mb-8"
            style={{ color: 'var(--ios-text-secondary)' }}
          >
            {step.description}
          </p>

          {/* Indicador de páginas */}
          <div className="flex justify-center gap-1.5 mb-6">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === currentStep ? 'w-8 bg-ios-accent' : 'w-2 bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>

          {/* Botões */}
          <div className="flex items-center justify-between gap-3">
            {!isFirstStep ? (
              <button
                onClick={onPrev}
                className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium rounded-xl transition-colors"
                style={{
                  color: 'var(--ios-text-secondary)',
                  backgroundColor: 'var(--ios-separator)',
                }}
              >
                <ChevronLeft className="w-4 h-4" />
                Voltar
              </button>
            ) : (
              <div />
            )}

            {isLastStep ? (
              <button
                onClick={onComplete}
                className="flex-1 py-2.5 text-sm font-semibold text-white bg-ios-accent rounded-xl active:scale-[0.97] transition-all"
              >
                Começar!
              </button>
            ) : (
              <button
                onClick={onNext}
                className="flex items-center gap-1.5 px-5 py-2.5 text-sm font-medium text-white bg-ios-accent rounded-xl active:scale-[0.97] transition-all"
              >
                Próximo
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Pular */}
          {!isLastStep && (
            <button
              onClick={onSkip}
              className="mt-4 text-xs underline opacity-60 hover:opacity-100 transition-opacity"
              style={{ color: 'var(--ios-text-tertiary)' }}
            >
              Pular tour
            </button>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}