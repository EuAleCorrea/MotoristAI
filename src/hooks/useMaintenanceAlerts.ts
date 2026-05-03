import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../services/supabase';
import { useMaintenanceStore, MaintenanceRule } from '../store/maintenanceStore';

export interface MaintenanceAlert {
  rule: MaintenanceRule;
  progress_pct: number;
  km_remaining: number;
  is_overdue: boolean;
  severity: 'success' | 'warning' | 'danger';
}

export function useMaintenanceAlerts() {
  const { rules, fetchRules, isLoading, calculateProgress } = useMaintenanceStore();
  const [alerts, setAlerts] = useState<MaintenanceAlert[]>([]);
  const [currentKm, setCurrentKm] = useState<number>(0);
  const [kmLoading, setKmLoading] = useState(false);

  // Busca o km atual do veículo (mais recente)
  const fetchCurrentKm = useCallback(async () => {
    setKmLoading(true);
    try {
      const { data, error } = await supabase
        .from('odometer_entries')
        .select('km')
        .order('date', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setCurrentKm(data.km);
      }
    } catch (err) {
      console.warn('Erro ao buscar km atual:', err);
    } finally {
      setKmLoading(false);
    }
  }, []);

  // Carrega dados iniciais
  useEffect(() => {
    fetchRules();
    fetchCurrentKm();
  }, [fetchRules, fetchCurrentKm]);

  // Recalcula alertas sempre que rules ou currentKm mudam
  useEffect(() => {
    if (currentKm <= 0 || rules.length === 0) {
      setAlerts([]);
      return;
    }

    const computedAlerts: MaintenanceAlert[] = rules.map((rule) => {
      const { progress_pct, km_remaining, is_overdue } = calculateProgress(rule, currentKm);
      let severity: 'success' | 'warning' | 'danger';
      if (is_overdue) {
        severity = 'danger';
      } else if (progress_pct >= 80) {
        severity = 'warning';
      } else {
        severity = 'success';
      }

      return {
        rule: { ...rule, progress_pct, km_remaining, is_overdue },
        progress_pct,
        km_remaining,
        is_overdue,
        severity,
      };
    });

    // Ordena: perigo primeiro, depois warning, depois success
    computedAlerts.sort((a, b) => {
      const order = { danger: 0, warning: 1, success: 2 };
      return order[a.severity] - order[b.severity];
    });

    setAlerts(computedAlerts);
  }, [rules, currentKm, calculateProgress]);

  return {
    alerts,
    rules,
    currentKm,
    isLoading: isLoading || kmLoading,
    refreshKm: fetchCurrentKm,
    refreshRules: fetchRules,
  };
}

// Hook simplificado para o Dashboard (apenas contagem de alertas)
export function useMaintenanceAlertCount() {
  const { alerts } = useMaintenanceAlerts();
  return {
    total: alerts.length,
    danger: alerts.filter((a) => a.severity === 'danger').length,
    warning: alerts.filter((a) => a.severity === 'warning').length,
    hasAlerts: alerts.some((a) => a.severity === 'danger' || a.severity === 'warning'),
  };
}