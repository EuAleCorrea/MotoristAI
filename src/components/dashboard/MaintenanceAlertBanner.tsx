import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Wrench, ChevronRight } from 'lucide-react';
import { useMaintenanceAlertCount } from '../../hooks/useMaintenanceAlerts';

export function MaintenanceAlertBanner() {
  const navigate = useNavigate();
  const { total, danger, warning, hasAlerts } = useMaintenanceAlertCount();

  if (!hasAlerts) return null;

  const severityColor = danger > 0 ? 'var(--ios-red)' : 'var(--ios-orange)';
  const bgColor = danger > 0 ? 'rgba(239,68,68,0.1)' : 'rgba(249,115,22,0.1)';

  return (
    <button
      onClick={() => navigate('/alertas/manutencao')}
      className="w-full rounded-2xl p-4 flex items-center gap-3 transition-all active:scale-[0.98]"
      style={{ backgroundColor: bgColor }}
    >
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: severityColor + '20' }}
      >
        <AlertTriangle size={22} style={{ color: severityColor }} />
      </div>

      <div className="flex-1 text-left">
        <p className="font-semibold text-[var(--ios-text)] text-sm">
          Manutenção {danger > 0 ? 'atrasada' : 'programada'}
        </p>
        <p className="text-xs mt-0.5" style={{ color: severityColor }}>
          {danger > 0
            ? `${danger} serviço${danger > 1 ? 's' : ''} vencido${danger > 1 ? 's' : ''}`
            : `${warning} serviço${warning > 1 ? 's' : ''} próximo${warning > 1 ? 's' : ''} do limite`}
          {total > 0 && ` (${total} no total)`}
        </p>
      </div>

      <Wrench size={18} className="text-[var(--ios-text-secondary)]" />
    </button>
  );
}

// Versão compacta para cards do Dashboard
export function MaintenanceAlertCard() {
  const navigate = useNavigate();
  const { danger, hasAlerts } = useMaintenanceAlertCount();

  return (
    <button
      onClick={() => navigate('/alertas/manutencao')}
      className="bg-[var(--ios-bg-secondary)] rounded-2xl p-4 flex items-center gap-3 transition-all active:scale-[0.98]"
    >
      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-red-500/20">
        <Wrench size={20} className="text-red-500" />
      </div>
      <div className="flex-1 text-left">
        <p className="font-semibold text-[var(--ios-text)] text-sm">Manutenção</p>
        <p className="text-xs text-[var(--ios-text-secondary)] mt-0.5">
          {hasAlerts
            ? `${danger} vencida${danger > 1 ? 's' : ''} · Toque para ver`
            : 'Nenhum alerta pendente'}
        </p>
      </div>
      <ChevronRight size={18} className="text-[var(--ios-text-tertiary)]" />
    </button>
  );
}