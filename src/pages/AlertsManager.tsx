import React, { useState } from 'react';
import NotificationReminderSettings from '../components/NotificationReminderSettings';
import { Bell, Wrench, Repeat, ChevronRight, Plus, Clock, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';

interface CustomAlert {
  id: string;
  name: string;
  time: string;
  enabled: boolean;
}

export default function AlertsManager() {
  const navigate = useNavigate();
  const [customAlerts, setCustomAlerts] = useState<CustomAlert[]>([]);
  const [showNewAlertModal, setShowNewAlertModal] = useState(false);
  const [newAlertName, setNewAlertName] = useState('');
  const [newAlertTime, setNewAlertTime] = useState('08:00');

  const handleAddAlert = () => {
    if (!newAlertName) return;
    setCustomAlerts([...customAlerts, { id: Date.now().toString(), name: newAlertName, time: newAlertTime, enabled: true }]);
    setShowNewAlertModal(false);
    setNewAlertName('');
  };

  const toggleCustomAlert = (id: string) => {
    setCustomAlerts(customAlerts.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a));
  };

  const removeAlert = (id: string) => {
    setCustomAlerts(customAlerts.filter(a => a.id !== id));
  };

  return (
    <div className="pb-20 min-h-[100dvh] bg-ios-bg text-ios-text" style={{ background: 'var(--ios-bg)', color: 'var(--ios-text)' }}>
      <div className="px-4 pt-4">
        <div className="flex items-start justify-between">
          <PageHeader title="Alertas" icon={Bell} />
          <button 
            onClick={() => setShowNewAlertModal(true)}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-colors mt-2"
            style={{ backgroundColor: 'var(--ios-tint)', color: 'var(--ios-accent)' }}
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="px-4 py-2 space-y-8 animate-fade-in">
        
        {/* Alertas Ativos Padrão do Sistema */}
        <div className="space-y-2">
          <h2 className="text-xs font-semibold uppercase tracking-wider px-1" style={{ color: 'var(--ios-text-secondary)' }}>
            Alertas do Sistema (1)
          </h2>
          <NotificationReminderSettings />
        </div>

        {/* Alertas Customizados (Cadastro) */}
        {customAlerts.length > 0 && (
          <div className="space-y-2">
            <h2 className="text-xs font-semibold uppercase tracking-wider px-1" style={{ color: 'var(--ios-text-secondary)' }}>
              Meus Alertas
            </h2>
            <div className="ios-card overflow-hidden">
              {customAlerts.map((alerta, idx) => (
                <div 
                  key={alerta.id} 
                  className="flex items-center justify-between p-4"
                  style={{ borderBottom: idx < customAlerts.length - 1 ? '0.33px solid var(--ios-separator)' : 'none' }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--ios-fill)' }}>
                      <Clock className="w-5 h-5" style={{ color: 'var(--ios-text)' }} />
                    </div>
                    <div className="text-left">
                      <span className="font-semibold block" style={{ color: 'var(--ios-text)' }}>
                        {alerta.name}
                      </span>
                      <span className="text-sm block" style={{ color: 'var(--ios-text-secondary)' }}>
                        Horário: {alerta.time}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => removeAlert(alerta.id)}
                      className="p-2 rounded-full text-sys-red transition-opacity hover:opacity-70"
                      style={{ color: 'var(--sys-red)' }}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    <div 
                      className={`w-12 h-7 rounded-full p-1 cursor-pointer transition-colors duration-300 ${alerta.enabled ? 'bg-sys-green' : 'bg-ios-fill'}`}
                      style={{ backgroundColor: alerta.enabled ? 'var(--sys-green)' : 'var(--ios-fill)' }}
                      onClick={() => toggleCustomAlert(alerta.id)}
                    >
                      <div 
                        className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300 ${alerta.enabled ? 'translate-x-5' : 'translate-x-0'}`}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Módulos do Veículo (Atalhos) */}
        <div className="space-y-2">
          <h2 className="text-xs font-semibold uppercase tracking-wider px-1" style={{ color: 'var(--ios-text-secondary)' }}>
            Módulos do Veículo
          </h2>
          <div className="ios-card overflow-hidden">
            <button
              onClick={() => navigate('/alertas/manutencao')}
              className="w-full flex items-center justify-between p-4 transition-colors"
              style={{ borderBottom: '0.33px solid var(--ios-separator)' }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--sys-orange)', opacity: 0.15 }}>
                  <Wrench className="w-5 h-5" style={{ color: 'var(--sys-orange)' }} />
                </div>
                <div className="text-left">
                  <span className="font-semibold block" style={{ color: 'var(--ios-text)' }}>
                    Manutenção por km
                  </span>
                  <span className="text-sm block" style={{ color: 'var(--ios-text-secondary)' }}>
                    Avisos de troca de óleo, freios, etc.
                  </span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5" style={{ color: 'var(--ios-text-secondary)' }} />
            </button>

            <button
              onClick={() => navigate('/alertas/despesas')}
              className="w-full flex items-center justify-between p-4 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--sys-green)', opacity: 0.15 }}>
                  <Repeat className="w-5 h-5" style={{ color: 'var(--sys-green)' }} />
                </div>
                <div className="text-left">
                  <span className="font-semibold block" style={{ color: 'var(--ios-text)' }}>
                    Despesas Recorrentes
                  </span>
                  <span className="text-sm block" style={{ color: 'var(--ios-text-secondary)' }}>
                    IPVA, Seguro, Aluguel
                  </span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5" style={{ color: 'var(--ios-text-secondary)' }} />
            </button>
          </div>
        </div>

      </div>

      {/* Modal de Cadastro */}
      {showNewAlertModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
          <div 
            className="absolute inset-0 bg-black/50 animate-fade-in-overlay"
            onClick={() => setShowNewAlertModal(false)}
          />
          <div 
            className="relative w-full sm:max-w-md bg-ios-sheet-bg rounded-t-3xl sm:rounded-3xl p-6 animate-slide-up-curtain shadow-2xl"
            style={{ backgroundColor: 'var(--ios-sheet-bg)', border: '0.5px solid var(--ios-separator)' }}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold" style={{ color: 'var(--ios-text)' }}>Cadastrar Alerta</h3>
              <button 
                onClick={() => setShowNewAlertModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'var(--ios-fill)', color: 'var(--ios-text-secondary)' }}
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--ios-text-secondary)' }}>Nome do Alerta</label>
                <input 
                  type="text" 
                  placeholder="Ex: Ligar App Uber"
                  value={newAlertName}
                  onChange={e => setNewAlertName(e.target.value)}
                  className="ios-input w-full" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--ios-text-secondary)' }}>Horário do Alerta</label>
                <input 
                  type="time" 
                  value={newAlertTime}
                  onChange={e => setNewAlertTime(e.target.value)}
                  className="ios-input w-full" 
                />
              </div>
            </div>

            <div className="mt-8">
              <button 
                onClick={handleAddAlert}
                className="ios-btn w-full"
                disabled={!newAlertName}
                style={{ opacity: newAlertName ? 1 : 0.5 }}
              >
                Salvar Alerta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
