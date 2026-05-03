import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, AlertTriangle, CheckCircle, Clock, Gauge, Trash2, Car, Wrench, ArrowLeft } from 'lucide-react';
import { useMaintenanceStore, MaintenanceRule } from '../../../store/maintenanceStore';
import { supabase } from '../../../services/supabase';

// Modal para adicionar/editar regra
function RuleModal({
  isOpen,
  onClose,
  onSave,
  editingRule,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  editingRule: MaintenanceRule | null;
}) {
  const [serviceName, setServiceName] = useState('');
  const [intervalKm, setIntervalKm] = useState('');
  const [lastKm, setLastKm] = useState('');
  const [vehicleId, setVehicleId] = useState('');
  const [notes, setNotes] = useState('');
  const [vehicles, setVehicles] = useState<{ id: string; name: string }[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Carrega veículos
      supabase.from('vehicles').select('id, name').then(({ data }) => {
        setVehicles(data || []);
      });

      if (editingRule) {
        setServiceName(editingRule.service_name);
        setIntervalKm(String(editingRule.interval_km));
        setLastKm(String(editingRule.last_km));
        setVehicleId(editingRule.vehicle_id || '');
        setNotes(editingRule.notes || '');
      } else {
        setServiceName('');
        setIntervalKm('');
        setLastKm('');
        setVehicleId('');
        setNotes('');
      }
    }
  }, [isOpen, editingRule]);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!serviceName.trim() || !intervalKm) return;
    setSaving(true);
    try {
      await onSave({
        service_name: serviceName.trim(),
        interval_km: parseInt(intervalKm),
        last_km: lastKm ? parseInt(lastKm) : 0,
        vehicle_id: vehicleId || null,
        notes: notes || null,
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center">
      <div className="bg-[var(--ios-bg-secondary)] rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md p-6 animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-[var(--ios-text)]">
            {editingRule ? 'Editar Regra' : 'Nova Regra de Manutenção'}
          </h2>
          <button onClick={onClose} className="text-[var(--ios-text-secondary)]">
            ✕
          </button>
        </div>

        <div className="space-y-4">
          {/* Nome do Serviço */}
          <div>
            <label className="text-sm text-[var(--ios-text-secondary)] mb-1 block">Nome do Serviço</label>
            <input
              type="text"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              placeholder="Ex: Troca de óleo"
              className="w-full bg-[var(--ios-bg)] text-[var(--ios-text)] rounded-xl px-4 py-3 placeholder:text-[var(--ios-text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--ios-blue)]"
            />
          </div>

          {/* Intervalo em km */}
          <div>
            <label className="text-sm text-[var(--ios-text-secondary)] mb-1 block">Intervalo (km)</label>
            <input
              type="number"
              value={intervalKm}
              onChange={(e) => setIntervalKm(e.target.value)}
              placeholder="Ex: 10000"
              min={1}
              className="w-full bg-[var(--ios-bg)] text-[var(--ios-text)] rounded-xl px-4 py-3 placeholder:text-[var(--ios-text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--ios-blue)]"
            />
          </div>

          {/* Último km */}
          <div>
            <label className="text-sm text-[var(--ios-text-secondary)] mb-1 block">Último km realizado</label>
            <input
              type="number"
              value={lastKm}
              onChange={(e) => setLastKm(e.target.value)}
              placeholder="Ex: 50000"
              min={0}
              className="w-full bg-[var(--ios-bg)] text-[var(--ios-text)] rounded-xl px-4 py-3 placeholder:text-[var(--ios-text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--ios-blue)]"
            />
          </div>

          {/* Veículo */}
          <div>
            <label className="text-sm text-[var(--ios-text-secondary)] mb-1 block">Veículo (opcional)</label>
            <select
              value={vehicleId}
              onChange={(e) => setVehicleId(e.target.value)}
              className="w-full bg-[var(--ios-bg)] text-[var(--ios-text)] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--ios-blue)]"
            >
              <option value="">Todos os veículos</option>
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>{v.name}</option>
              ))}
            </select>
          </div>

          {/* Observações */}
          <div>
            <label className="text-sm text-[var(--ios-text-secondary)] mb-1 block">Observações</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Informações adicionais..."
              rows={3}
              className="w-full bg-[var(--ios-bg)] text-[var(--ios-text)] rounded-xl px-4 py-3 placeholder:text-[var(--ios-text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--ios-blue)] resize-none"
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={!serviceName.trim() || !intervalKm || saving}
          className="w-full mt-6 bg-[var(--ios-blue)] text-white font-semibold rounded-xl py-3 disabled:opacity-50 transition-opacity"
        >
          {saving ? 'Salvando...' : editingRule ? 'Atualizar' : 'Adicionar Regra'}
        </button>
      </div>
    </div>
  );
}

// Card de progresso individual
function MaintenanceCard({
  rule,
  currentKm,
  onEdit,
  onDelete,
  onResetKm,
}: {
  rule: MaintenanceRule;
  currentKm: number;
  onEdit: () => void;
  onDelete: () => void;
  onResetKm: (km: number) => void;
}) {
  const { calculateProgress } = useMaintenanceStore();
  const { progress_pct, km_remaining, is_overdue } = calculateProgress(rule, currentKm);

  const severityColor = is_overdue
    ? 'var(--ios-red)'
    : progress_pct >= 80
    ? 'var(--ios-orange)'
    : 'var(--ios-green)';

  return (
    <div className="bg-[var(--ios-bg-secondary)] rounded-2xl p-5 space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: severityColor + '20' }}>
            {is_overdue ? (
              <AlertTriangle size={20} style={{ color: severityColor }} />
            ) : progress_pct >= 80 ? (
              <Clock size={20} style={{ color: severityColor }} />
            ) : (
              <CheckCircle size={20} style={{ color: severityColor }} />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-[var(--ios-text)]">{rule.service_name}</h3>
            {rule.vehicle_name && (
              <p className="text-xs text-[var(--ios-text-secondary)] flex items-center gap-1 mt-0.5">
                <Car size={12} />
                {rule.vehicle_name}
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={onEdit} className="text-[var(--ios-blue)] text-sm font-medium">Editar</button>
          <button onClick={onDelete} className="text-[var(--ios-red)]"><Trash2 size={16} /></button>
        </div>
      </div>

      {/* Barra de progresso */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-[var(--ios-text-secondary)]">
          <span>Progresso</span>
          <span>{progress_pct}%</span>
        </div>
        <div className="h-2 bg-[var(--ios-bg)] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${Math.min(100, progress_pct)}%`,
              backgroundColor: severityColor,
            }}
          />
        </div>
      </div>

      {/* Info */}
      <div className="flex justify-between text-sm">
        <div className="text-[var(--ios-text-secondary)]">
          <span className="block text-xs">Último km</span>
          <span className="font-medium text-[var(--ios-text)]">{rule.last_km.toLocaleString('pt-BR')} km</span>
        </div>
        <div className="text-right">
          <span className="block text-xs">{is_overdue ? 'Vencido há' : 'Restante'}</span>
          <span className="font-medium" style={{ color: severityColor }}>
            {is_overdue
              ? `${Math.abs(km_remaining).toLocaleString('pt-BR')} km`
              : `${km_remaining.toLocaleString('pt-BR')} km`}
          </span>
        </div>
      </div>

      {/* Botão "Fiz essa manutenção" */}
      <button
        onClick={() => onResetKm(currentKm)}
        className="w-full mt-1 py-2 rounded-xl text-sm font-medium border border-dashed"
        style={{
          color: 'var(--ios-blue)',
          borderColor: 'var(--ios-blue)',
        }}
      >
        <span className="flex items-center justify-center gap-1">
          <Wrench size={14} />
          Marcar como realizada agora
        </span>
      </button>
    </div>
  );
}

// Página principal
const MaintenanceAlertsPage = () => {
  const navigate = useNavigate();
  const { rules, isLoading, fetchRules, addRule, updateRule, deleteRule } = useMaintenanceStore();
  const [currentKm, setCurrentKm] = useState<number>(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<MaintenanceRule | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  // Busca km atual
  const fetchCurrentKm = async () => {
    const { data } = await supabase
      .from('odometer_entries')
      .select('km')
      .order('date', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (data) {
      setCurrentKm(data.km);
    }
  };

  useEffect(() => {
    fetchRules();
    fetchCurrentKm();
  }, [fetchRules]);

  const handleSave = async (data: any) => {
    if (editingRule) {
      await updateRule(editingRule.id, data);
    } else {
      await addRule(data);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteRule(id);
    setConfirmDelete(null);
  };

  const handleResetKm = async (ruleId: string, km: number) => {
    await updateRule(ruleId, { last_km: km });
  };

  // Contagem de alertas
  const dangerCount = rules.filter((r) => {
    if (currentKm <= 0) return false;
    const { is_overdue } = useMaintenanceStore.getState().calculateProgress(r, currentKm);
    return is_overdue;
  }).length;

  const warningCount = rules.filter((r) => {
    if (currentKm <= 0) return false;
    const pct = useMaintenanceStore.getState().calculateProgress(r, currentKm);
    return !pct.is_overdue && pct.progress_pct >= 80;
  }).length;

  if (isLoading && rules.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[var(--ios-blue)] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 text-[var(--ios-text-secondary)] hover:text-[var(--ios-text)] transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="flex-1">
          <h1 className="text-ios-large-title font-bold text-[var(--ios-text)]">
            Manutenção por km
          </h1>
          <p className="text-sm text-[var(--ios-text-secondary)] mt-1">
            {currentKm > 0
              ? `Km atual: ${currentKm.toLocaleString('pt-BR')} km`
              : 'Registre o km do odômetro para ativar os alertas'}
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      {rules.length > 0 && currentKm > 0 && (
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-red-500/10 rounded-2xl p-4">
            <AlertTriangle size={24} className="text-red-500" />
            <p className="text-2xl font-bold text-[var(--ios-text)] mt-2">{dangerCount}</p>
            <p className="text-xs text-red-500 font-medium">Vencidas</p>
          </div>
          <div className="bg-orange-500/10 rounded-2xl p-4">
            <Clock size={24} className="text-orange-500" />
            <p className="text-2xl font-bold text-[var(--ios-text)] mt-2">{warningCount}</p>
            <p className="text-xs text-orange-500 font-medium">Próximas</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {rules.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-[var(--ios-bg-secondary)] flex items-center justify-center mx-auto mb-4">
            <Wrench size={32} className="text-[var(--ios-text-tertiary)]" />
          </div>
          <h2 className="text-lg font-semibold text-[var(--ios-text)] mb-2">
            Nenhuma regra de manutenção
          </h2>
          <p className="text-sm text-[var(--ios-text-secondary)] mb-6 max-w-xs mx-auto">
            Adicione serviços como troca de óleo, correia dentada, filtros, etc. O app vai te alertar quando estiver perto do km de revisão.
          </p>
        </div>
      )}

      {/* Rules List */}
      <div className="space-y-3">
        {rules.map((rule) => (
          <MaintenanceCard
            key={rule.id}
            rule={rule}
            currentKm={currentKm}
            onEdit={() => {
              setEditingRule(rule);
              setModalOpen(true);
            }}
            onDelete={() => setConfirmDelete(rule.id)}
            onResetKm={(km) => handleResetKm(rule.id, km)}
          />
        ))}
      </div>

      {/* FAB para adicionar */}
      <button
        onClick={() => {
          setEditingRule(null);
          setModalOpen(true);
        }}
        className="fixed bottom-24 right-6 w-14 h-14 bg-[var(--ios-blue)] text-white rounded-full shadow-lg flex items-center justify-center hover:opacity-90 transition-opacity z-40"
      >
        <Plus size={28} />
      </button>

      {/* Modal de regra */}
      <RuleModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingRule(null);
        }}
        onSave={handleSave}
        editingRule={editingRule}
      />

      {/* Modal de confirmação de exclusão */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-[var(--ios-bg-secondary)] rounded-2xl p-6 w-80 mx-4">
            <h3 className="text-lg font-semibold text-[var(--ios-text)] mb-2">Excluir regra?</h3>
            <p className="text-sm text-[var(--ios-text-secondary)] mb-6">
              Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 py-2.5 rounded-xl bg-[var(--ios-bg)] text-[var(--ios-text)] font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-medium"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaintenanceAlertsPage;