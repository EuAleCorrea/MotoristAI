import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from '../contexts/AuthContext';

const ONBOARDING_STEPS = [
  {
    title: 'Bem-vindo ao MotoristAI!',
    description:
      'Seu assistente financeiro inteligente para motoristas de aplicativo. Vamos te ajudar a organizar suas finanças e maximizar seus ganhos.',
    icon: '🚗',
  },
  {
    title: 'Registre suas Corridas',
    description:
      'Adicione suas corridas diárias com quilometragem, tempo e valor recebido. Todos os dados centralizados em um só lugar.',
    icon: '📊',
  },
  {
    title: 'Controle suas Despesas',
    description:
      'Categorize gastos do veículo (combustível, manutenção, pedágio) e despesas familiares. Veja exatamente para onde seu dinheiro vai.',
    icon: '💰',
  },
  {
    title: 'Acompanhe Metas e Relatórios',
    description:
      'Defina metas de economia e receita. Gere relatórios detalhados e exporte CSV para análise externa.',
    icon: '🎯',
  },
];

const ONBOARDING_META_KEY = 'onboarding_completed';

export function useOnboarding() {
  const { user } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    // Verifica se o onboarding já foi concluído via user_metadata
    const completed = user.user_metadata?.[ONBOARDING_META_KEY];
    setShowOnboarding(!completed);
    setIsLoading(false);
  }, [user]);

  const nextStep = useCallback(() => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  }, [currentStep]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  const completeOnboarding = useCallback(async () => {
    try {
      await supabase.auth.updateUser({
        data: { [ONBOARDING_META_KEY]: true },
      });
    } catch (error) {
      console.error('Erro ao salvar status do onboarding:', error);
    }
    setShowOnboarding(false);
  }, []);

  const skipOnboarding = useCallback(async () => {
    await completeOnboarding();
  }, [completeOnboarding]);

  return {
    showOnboarding,
    currentStep,
    totalSteps: ONBOARDING_STEPS.length,
    steps: ONBOARDING_STEPS,
    isLoading,
    nextStep,
    prevStep,
    completeOnboarding,
    skipOnboarding,
  };
}