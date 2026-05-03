import { useEffect } from 'react';
import { usePreferencesStore, UserPreferences } from '../../store/preferencesStore';
import {
  Globe, DollarSign, Calendar, Clock, Monitor, Ruler,
  Bell, Target, RotateCcw, Loader2, CheckCircle2, AlertCircle,
  ChevronLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LANGUAGES = [
  { value: 'pt-BR', label: 'Português (Brasil)' },
  { value: 'en-US', label: 'English (US)' },
  { value: 'es', label: 'Español' },
];

const CURRENCIES = [
  { value: 'BRL', label: 'R$ (Real)', symbol: 'R$' },
  { value: 'USD', label: '$ (Dólar)', symbol: '$' },
  { value: 'EUR', label: '€ (Euro)', symbol: '€' },
  { value: 'ARS', label: '$ (Peso Argentino)', symbol: 'AR$' },
];

const DATE_FORMATS = [
  { value: 'DD/MM/YYYY', label: '31/12/2024' },
  { value: 'MM/DD/YYYY', label: '12/31/2024' },
  { value: 'YYYY-MM-DD', label: '2024-12-31' },
];

const TIME_FORMATS = [
  { value: '24h', label: '14:30 (24h)' },
  { value: '12h', label: '2:30 PM (12h)' },
];

const THEMES = [
  { value: 'system', label: 'Sistema', icon: Monitor },
  { value: 'light', label: 'Claro', icon: Monitor },
  { value: 'dark', label: 'Escuro', icon: Monitor },
];

const UNIT_SYSTEMS = [
  { value: 'metric', label: 'Métrico (km, L)' },
  { value: 'imperial', label: 'Imperial (mi, gal)' },
];

interface SelectFieldProps {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}

const SelectField = ({ label, icon: Icon, value, options, onChange }: SelectFieldProps) => (
  <div className="bg-white dark:bg-[#1c1c1e] rounded-2xl p-4 space-y-2 border border-[var(--ios-separator)]">
    <div className="flex items-center gap-2 text-sm text-[var(--ios-text-secondary)]">
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </div>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-transparent text-base text-[var(--ios-text)] font-medium outline-none appearance-none cursor-pointer"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </div>
);

const ToggleField = ({ label, description, enabled, onChange }: {
  label: string;
  description?: string;
  enabled: boolean;
  onChange: (v: boolean) => void;
}) => (
  <div className="bg-white dark:bg-[#1c1c1e] rounded-2xl p-4 flex items-center justify-between border border-[var(--ios-separator)]">
    <div className="flex-1">
      <p className="text-[var(--ios-text)] font-medium">{label}</p>
      {description && (
        <p className="text-sm text-[var(--ios-text-secondary)] mt-0.5">{description}</p>
      )}
    </div>
    <button
      onClick={() => onChange(!enabled)}
      className={`relative w-12 h-7 rounded-full transition-colors duration-200 ${
        enabled ? 'bg-[#34c759]' : 'bg-[#e9e9eb] dark:bg-[#3a3a3c]'
      }`}
    >
      <div className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-200 ${
        enabled ? 'translate-x-6' : 'translate-x-0.5'
      }`} />
    </button>
  </div>
);

const PreferencesPage = () => {
  const navigate = useNavigate();
  const { preferences, loading, saving, error, fetchPreferences, updatePreferences, resetPreferences } = usePreferencesStore();

  useEffect(() => {
    fetchPreferences();
  }, [fetchPreferences]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--ios-blue)]" />
      </div>
    );
  }

  if (!preferences) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <p className="text-[var(--ios-text-secondary)]">Erro ao carregar preferências</p>
        <button
          onClick={fetchPreferences}
          className="px-6 py-2 bg-[var(--ios-blue)] text-white rounded-xl font-medium"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  const update = (key: keyof UserPreferences, value: any) => {
    updatePreferences({ [key]: value });
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/ajustes')}
          className="p-1 -ml-1 hover:opacity-70 transition-opacity"
        >
          <ChevronLeft className="w-6 h-6 text-[var(--ios-blue)]" />
        </button>
        <h1 className="text-ios-title1 font-bold text-[var(--ios-text)]" style={{ letterSpacing: '-0.5px' }}>
          Preferências
        </h1>
      </div>

      {/* Status do salvamento */}
      {saving && (
        <div className="flex items-center gap-2 px-4 py-2 bg-[var(--ios-blue)]/10 rounded-2xl text-sm text-[var(--ios-blue)]">
          <Loader2 className="w-4 h-4 animate-spin" />
          Salvando...
        </div>
      )}
      {!saving && preferences && (
        <div className="flex items-center gap-2 px-4 py-2 bg-[#34c759]/10 rounded-2xl text-sm text-[#34c759]">
          <CheckCircle2 className="w-4 h-4" />
          Salvo automaticamente
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 rounded-2xl text-sm text-red-500">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {/* Idioma e Moeda */}
      <div className="space-y-3">
        <h2 className="text-xs font-semibold text-[var(--ios-text-secondary)] uppercase tracking-wider px-1">
          Geral
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <SelectField
            label="Idioma"
            icon={Globe}
            value={preferences.language}
            options={LANGUAGES}
            onChange={(v) => update('language', v)}
          />
          <SelectField
            label="Moeda"
            icon={DollarSign}
            value={preferences.currency}
            options={CURRENCIES}
            onChange={(v) => update('currency', v)}
          />
        </div>
      </div>

      {/* Data e Hora */}
      <div className="space-y-3">
        <h2 className="text-xs font-semibold text-[var(--ios-text-secondary)] uppercase tracking-wider px-1">
          Data e Hora
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <SelectField
            label="Formato de Data"
            icon={Calendar}
            value={preferences.date_format}
            options={DATE_FORMATS}
            onChange={(v) => update('date_format', v)}
          />
          <SelectField
            label="Formato de Hora"
            icon={Clock}
            value={preferences.time_format}
            options={TIME_FORMATS}
            onChange={(v) => update('time_format', v)}
          />
        </div>
      </div>

      {/* Tema */}
      <div className="space-y-3">
        <h2 className="text-xs font-semibold text-[var(--ios-text-secondary)] uppercase tracking-wider px-1">
          Aparência
        </h2>
        <div className="bg-white dark:bg-[#1c1c1e] rounded-2xl p-4 space-y-2 border border-[var(--ios-separator)]">
          <div className="flex items-center gap-2 text-sm text-[var(--ios-text-secondary)] mb-3">
            <Monitor className="w-4 h-4" />
            <span>Tema</span>
          </div>
          <div className="flex gap-2">
            {THEMES.map((theme) => (
              <button
                key={theme.value}
                onClick={() => update('theme', theme.value)}
                className={`flex-1 py-3 rounded-xl text-sm font-medium transition-colors ${
                  preferences.theme === theme.value
                    ? 'bg-[var(--ios-blue)] text-white'
                    : 'bg-[#f2f2f7] dark:bg-[#2c2c2e] text-[var(--ios-text-secondary)]'
                }`}
              >
                {theme.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-[var(--ios-text-secondary)] mt-1">
            {preferences.theme === 'system' ? 'Segue a preferência do sistema' :
             preferences.theme === 'light' ? 'Tema claro sempre' :
             'Tema escuro sempre'}
          </p>
        </div>
      </div>

      {/* Unidades */}
      <div className="space-y-3">
        <h2 className="text-xs font-semibold text-[var(--ios-text-secondary)] uppercase tracking-wider px-1">
          Unidades
        </h2>
        <SelectField
          label="Sistema de Unidades"
          icon={Ruler}
          value={preferences.unit_system}
          options={UNIT_SYSTEMS}
          onChange={(v) => update('unit_system', v)}
        />
      </div>

      {/* Plataforma Padrão e Categoria */}
      <div className="space-y-3">
        <h2 className="text-xs font-semibold text-[var(--ios-text-secondary)] uppercase tracking-wider px-1">
          Padrões
        </h2>
        <div className="bg-white dark:bg-[#1c1c1e] rounded-2xl p-4 space-y-3 border border-[var(--ios-separator)]">
          <div>
            <label className="text-sm text-[var(--ios-text-secondary)]">Plataforma padrão</label>
            <input
              type="text"
              value={preferences.default_platform || ''}
              onChange={(e) => update('default_platform', e.target.value || null)}
              placeholder="Ex: Uber, 99..."
              className="w-full bg-transparent text-base text-[var(--ios-text)] font-medium outline-none mt-1 placeholder:text-[var(--ios-text-tertiary)]"
            />
          </div>
          <div className="border-t border-[var(--ios-separator)] pt-3">
            <label className="text-sm text-[var(--ios-text-secondary)]">Categoria padrão</label>
            <input
              type="text"
              value={preferences.default_category || ''}
              onChange={(e) => update('default_category', e.target.value || null)}
              placeholder="Ex: Motorista de App..."
              className="w-full bg-transparent text-base text-[var(--ios-text)] font-medium outline-none mt-1 placeholder:text-[var(--ios-text-tertiary)]"
            />
          </div>
        </div>
      </div>

      {/* Meta Semanal */}
      <div className="space-y-3">
        <h2 className="text-xs font-semibold text-[var(--ios-text-secondary)] uppercase tracking-wider px-1">
          Produtividade
        </h2>
        <div className="bg-white dark:bg-[#1c1c1e] rounded-2xl p-4 space-y-2 border border-[var(--ios-separator)]">
          <div className="flex items-center gap-2 text-sm text-[var(--ios-text-secondary)]">
            <Target className="w-4 h-4" />
            <span>Meta semanal de horas trabalhadas</span>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min="0"
              max="168"
              step="0.5"
              value={preferences.weekly_goal_hours ?? ''}
              onChange={(e) => update('weekly_goal_hours', e.target.value ? parseFloat(e.target.value) : null)}
              placeholder="40"
              className="flex-1 bg-[#f2f2f7] dark:bg-[#2c2c2e] text-[var(--ios-text)] text-lg font-bold rounded-xl px-4 py-2 outline-none text-center"
            />
            <span className="text-[var(--ios-text-secondary)] font-medium">horas/semana</span>
          </div>
        </div>
      </div>

      {/* Notificações */}
      <div className="space-y-3">
        <h2 className="text-xs font-semibold text-[var(--ios-text-secondary)] uppercase tracking-wider px-1">
          Notificações
        </h2>
        <ToggleField
          label="Notificações push"
          description="Receber lembretes e alertas"
          enabled={preferences.notifications_enabled}
          onChange={(v) => update('notifications_enabled', v)}
        />
      </div>

      {/* Reset */}
      <div className="pt-4">
        <button
          onClick={() => {
            if (window.confirm('Tem certeza que deseja restaurar as preferências padrão?')) {
              resetPreferences();
            }
          }}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-red-500/30 text-red-500 font-medium hover:bg-red-500/5 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Restaurar Padrões
        </button>
      </div>
    </div>
  );
};

export default PreferencesPage;