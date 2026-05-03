import { useState } from 'react';
import { Bell, BellOff, Clock, Sun, Moon, AlertCircle, CheckCircle } from 'lucide-react';
import { useNotificationReminder } from '../hooks/useNotificationReminder';

const DAY_LABELS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const DAY_LABELS_FULL = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

export default function NotificationReminderSettings() {
  const {
    settings,
    permission,
    updateSettings,
    requestPermission,
  } = useNotificationReminder();

  const [expanded, setExpanded] = useState(false);

  // Toggle ativar/desativar
  const handleToggle = async () => {
    if (!settings.enabled && permission !== 'granted') {
      const granted = await requestPermission();
      if (!granted) {
        alert(
          'Para receber lembretes, permita notificações nas configurações do seu navegador.'
        );
        return;
      }
    }
    updateSettings({ enabled: !settings.enabled, lastShownDate: null });
  };

  // Toggle dia da semana
  const toggleDay = (day: number) => {
    const current = settings.daysOfWeek;
    if (current.includes(day)) {
      // Não permite desmarcar todos
      if (current.length <= 1) return;
      updateSettings({ daysOfWeek: current.filter(d => d !== day) });
    } else {
      updateSettings({ daysOfWeek: [...current, day].sort() });
    }
  };

  const formatTime = (h: number, m: number) =>
    `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;

  return (
    <div className="bg-[var(--ios-card)] rounded-2xl overflow-hidden shadow-sm border border-[var(--ios-separator)]">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-black/5 active:bg-black/10 transition-colors"
        aria-label="Configurar lembretes"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
            {settings.enabled ? (
              <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            ) : (
              <BellOff className="w-5 h-5 text-gray-400" />
            )}
          </div>
          <div className="text-left">
            <span className="font-semibold text-[var(--ios-text)]">
              {settings.enabled ? 'Lembrete ativo' : 'Lembrete inativo'}
            </span>
            {settings.enabled && (
              <p className="text-sm text-[var(--ios-text-secondary)]">
                {formatTime(settings.hour, settings.minute)} • {settings.daysOfWeek.map(d => DAY_LABELS[d]).join(', ')}
              </p>
            )}
          </div>
        </div>

        {/* Toggle Switch */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            handleToggle();
          }}
          className={`relative w-12 h-7 rounded-full transition-colors cursor-pointer ${
            settings.enabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
          }`}
          role="switch"
          aria-checked={settings.enabled}
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && handleToggle()}
        >
          <div
            className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-transform ${
              settings.enabled ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </div>
      </button>

      {/* Expanded Settings */}
      {expanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-[var(--ios-separator)] pt-4">
          {/* Status da permissão */}
          <div className="flex items-center gap-2 text-sm">
            {permission === 'granted' ? (
              <>
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-green-600 dark:text-green-400">Notificações permitidas</span>
              </>
            ) : permission === 'denied' ? (
              <>
                <AlertCircle className="w-4 h-4 text-red-500" />
                <span className="text-red-600 dark:text-red-400">
                  Notificações bloqueadas. Permita nas configurações do navegador.
                </span>
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4 text-yellow-500" />
                <span className="text-yellow-600 dark:text-yellow-400">Permissão não solicitada</span>
              </>
            )}
          </div>

          {/* Seleção de horário */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-[var(--ios-text-secondary)] mb-2">
              <Clock className="w-4 h-4" />
              Horário do lembrete
            </label>
            <div className="flex gap-2">
              <select
                value={settings.hour}
                onChange={(e) => updateSettings({ hour: Number(e.target.value) })}
                className="flex-1 px-3 py-2 rounded-xl border border-[var(--ios-separator)] bg-[var(--ios-bg)] text-[var(--ios-text)] text-sm appearance-none"
              >
                {Array.from({ length: 24 }, (_, i) => (
                  <option key={i} value={i}>
                    {String(i).padStart(2, '0')}h
                  </option>
                ))}
              </select>
              <span className="self-center text-[var(--ios-text-secondary)]">:</span>
              <select
                value={settings.minute}
                onChange={(e) => updateSettings({ minute: Number(e.target.value) })}
                className="flex-1 px-3 py-2 rounded-xl border border-[var(--ios-separator)] bg-[var(--ios-bg)] text-[var(--ios-text)] text-sm appearance-none"
              >
                {Array.from({ length: 60 }, (_, i) => (
                  <option key={i} value={i}>
                    {String(i).padStart(2, '0')}min
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Dias da semana */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-[var(--ios-text-secondary)] mb-2">
              <Sun className="w-4 h-4" />
              Dias da semana
            </label>
            <div className="flex gap-1.5">
              {DAY_LABELS_FULL.map((label, idx) => (
                <button
                  key={idx}
                  onClick={() => toggleDay(idx)}
                  className={`flex-1 py-2 rounded-xl text-xs font-medium transition-colors ${
                    settings.daysOfWeek.includes(idx)
                      ? 'bg-blue-600 text-white'
                      : 'bg-[var(--ios-bg)] text-[var(--ios-text-secondary)] border border-[var(--ios-separator)]'
                  }`}
                  aria-label={label}
                  title={label}
                >
                  {label.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="bg-[var(--ios-bg)] rounded-xl p-3">
            <p className="text-xs text-[var(--ios-text-secondary)] mb-1">Pré-visualização:</p>
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-blue-500 shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-[var(--ios-text)]">
                  📋 Hora de registrar suas corridas!
                </p>
                <p className="text-[var(--ios-text-secondary)]">
                  Não esqueça de lançar as corridas de hoje no MotoristAI.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}