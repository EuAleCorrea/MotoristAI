import { useState, useEffect, useMemo } from 'react';
import { Plus, Search, Edit2, Trash2, Download, Landmark, Wallet, Banknote, CreditCard, LayoutGrid } from 'lucide-react';
import { useEntryStore } from '../store/entryStore';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { useScrollReset } from '../hooks/useScrollReset';
import { formatCurrency } from '../utils/formatters';
import { exportToCsv, formatDateBR, formatCurrencyBR } from '../utils/exportCsv';

const sourceIcons: Record<string, any> = {
  Uber: Landmark,
  "99Pop": Wallet,
  Indrive: Banknote,
  Particular: CreditCard,
  Outros: LayoutGrid,
};

function Entries() {
  const { entries, deleteEntry, fetchEntries } = useEntryStore();
  const navigate = useNavigate();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const [searchTerm, setSearchTerm] = useState('');
  const [sourceFilter, setSourceFilter] = useState('all');

  // Reset scroll when filter changes
  useScrollReset(sourceFilter);

  const filteredEntries = entries.filter((entry) => {
    const matchesSearch =
      entry.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.value.toString().includes(searchTerm) ||
      (entry.notes && entry.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSource = sourceFilter === 'all' || entry.source === sourceFilter;
    return matchesSearch && matchesSource;
  });

  const platformStats = useMemo(() => {
    const stats: Record<string, { revenue: number; trips: number; count: number }> = {};
    entries.forEach((entry) => {
      const platform = entry.source || 'Outros';
      if (!stats[platform]) {
        stats[platform] = { revenue: 0, trips: 0, count: 0 };
      }
      stats[platform].revenue += entry.value;
      stats[platform].trips += entry.tripCount || 0;
      stats[platform].count += 1;
    });
    return Object.entries(stats)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.revenue - a.revenue);
  }, [entries]);

  const totalRevenue = entries.reduce((sum, e) => sum + e.value, 0);

  const handleEdit = (id: string) => {
    navigate(`/entradas/${id}/editar`);
  };

  const handleDelete = (id: string) => {
    deleteEntry(id);
    setDeletingId(null);
  };

  const handleExportCSV = () => {
    const filtered = sourceFilter === 'all' ? entries : entries.filter(e => e.source === sourceFilter);
    exportToCsv(
      filtered,
      {
        date: 'Data',
        source: 'Origem',
        value: 'Valor',
        tripCount: 'Viagens',
        kmDriven: 'KM',
        hoursWorked: 'Horas',
        notes: 'Observações',
      },
      `entradas-${new Date().toISOString().slice(0, 10)}`,
      {
        date: (v) => formatDateBR(v),
        value: (v) => formatCurrencyBR(v),
        tripCount: (v) => String(v ?? 0),
        kmDriven: (v) => String(v ?? 0),
        hoursWorked: (v) => v ?? '00:00',
      },
    );
  };

  return (
    <div className="max-w-lg mx-auto pb-20 px-1">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[var(--ios-text)]">Receitas</h1>
          <p className="text-[var(--ios-text-secondary)] font-medium text-sm">Seus ganhos diários</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExportCSV}
            className="p-2.5 rounded-2xl bg-[var(--ios-fill)] text-[var(--ios-accent)] hover:opacity-80 transition-all active:scale-90"
            title="Exportar CSV"
          >
            <Download className="h-5 w-5" />
          </button>
          <button
            onClick={() => navigate('/entradas/nova')}
            className="p-2.5 rounded-2xl bg-[var(--ios-accent)] text-white shadow-lg hover:scale-105 active:scale-95 transition-all"
          >
            <Plus className="h-6 w-6" strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Horizontal Filter Stats */}
      <div className="flex gap-3 overflow-x-auto pb-4 mb-4 no-scrollbar -mx-4 px-4">
        <button
          onClick={() => setSourceFilter('all')}
          className={`flex-shrink-0 px-5 py-3 rounded-2xl transition-all duration-200 border ${
            sourceFilter === 'all'
              ? 'bg-[var(--ios-accent)] border-[var(--ios-accent)] text-white shadow-md scale-105'
              : 'bg-[var(--ios-card)] border-[var(--ios-separator)] text-[var(--ios-text)]'
          }`}
        >
          <p className="text-[10px] uppercase tracking-wider font-bold opacity-80 mb-1">Todas</p>
          <p className="text-lg font-bold leading-none">{formatCurrency(totalRevenue)}</p>
          <p className="text-[10px] mt-1.5 font-medium opacity-70">{entries.length} registros</p>
        </button>

        {platformStats.map((stat) => (
          <button
            key={stat.name}
            onClick={() => setSourceFilter(stat.name)}
            className={`flex-shrink-0 px-5 py-3 rounded-2xl transition-all duration-200 border ${
              sourceFilter === stat.name
                ? 'bg-[var(--ios-accent)] border-[var(--ios-accent)] text-white shadow-md scale-105'
                : 'bg-[var(--ios-card)] border-[var(--ios-separator)] text-[var(--ios-text)]'
            }`}
          >
            <p className="text-[10px] uppercase tracking-wider font-bold opacity-80 mb-1">{stat.name}</p>
            <p className="text-lg font-bold leading-none">{formatCurrency(stat.revenue)}</p>
            <p className="text-[10px] mt-1.5 font-medium opacity-70">{stat.trips} viagens</p>
          </button>
        ))}
      </div>

      {/* Search Bar - Below Filters */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--ios-text-tertiary)]" size={18} />
        <input
          type="text"
          placeholder="Buscar receitas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-[var(--ios-card)] border-none rounded-2xl py-3.5 pl-11 pr-4 text-[17px] focus:ring-2 focus:ring-[var(--ios-accent)] shadow-sm text-[var(--ios-text)] placeholder:text-[var(--ios-text-tertiary)]"
        />
      </div>

      {/* Transactions List */}
      <div className="space-y-3">
        {filteredEntries.length > 0 ? (
          filteredEntries.map((entry) => {
            const Icon = sourceIcons[entry.source] || LayoutGrid;
            return (
              <div
                key={entry.id}
                className="bg-[var(--ios-card)] rounded-[20px] p-4 border border-[var(--ios-separator)] shadow-sm relative overflow-hidden"
              >
                {deletingId === entry.id && (
                  <div className="absolute inset-0 bg-[rgba(255,59,48,0.12)] backdrop-blur-sm flex flex-col items-center justify-center gap-3 z-20 animate-in fade-in duration-200">
                    <span className="text-sm font-semibold text-red-600">Excluir?</span>
                    <div className="flex gap-2">
                      <button onClick={() => handleDelete(entry.id)} className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm font-bold">Sim</button>
                      <button onClick={() => setDeletingId(null)} className="px-3 py-1 bg-white/50 text-gray-700 rounded-lg text-sm font-bold">Não</button>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[var(--ios-fill)] text-[var(--sys-green)] shrink-0">
                    <Icon size={20} strokeWidth={2.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[17px] font-semibold text-[var(--ios-text)] truncate">
                      {entry.source}
                    </h3>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEdit(entry.id)}
                      className="p-2 rounded-full text-[var(--ios-text-secondary)] hover:bg-[var(--ios-fill)] active:bg-[var(--ios-fill)]"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => setDeletingId(entry.id)}
                      className="p-2 rounded-full text-ios-red hover:bg-ios-red/10 active:bg-ios-red/20"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="flex items-end justify-between">
                  <div className="space-y-1">
                    <p className="text-[13px] text-[var(--ios-text-tertiary)] font-medium">
                      {format(new Date(entry.date), "dd 'de' MMM, yyyy", { locale: ptBR })}
                    </p>
                    <p className="text-[14px] text-[var(--sys-green)] font-bold uppercase tracking-wider">
                      {entry.tripCount || 0} viagens
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[19px] font-bold text-[var(--sys-green)] tracking-tight">
                      +{formatCurrency(entry.value)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center px-4 bg-[var(--ios-card)] rounded-[32px] border border-dashed border-[var(--ios-separator)]">
            <div className="w-20 h-20 bg-[var(--ios-fill)] rounded-full flex items-center justify-center mb-6">
              <Search className="h-10 w-10 text-[var(--ios-text-tertiary)] opacity-30" />
            </div>
            <h3 className="text-xl font-bold text-[var(--ios-text)] mb-2">Sem ganhos ainda</h3>
            <p className="text-[var(--ios-text-secondary)] font-medium">
              Não encontramos entradas com os filtros atuais.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Entries;

