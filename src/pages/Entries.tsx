import { useState, useEffect, useMemo } from 'react';
import { Plus, Search, Filter, Edit2, Trash2 } from 'lucide-react';
import { useEntryStore } from '../store/entryStore';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';

function Entries() {
  const { entries, deleteEntry, fetchEntries } = useEntryStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const [searchTerm, setSearchTerm] = useState('');
  const [sourceFilter, setSourceFilter] = useState('all');

  const filteredEntries = entries.filter((entry) => {
    const matchesSearch =
      entry.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.value.toString().includes(searchTerm) ||
      (entry.notes && entry.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSource = sourceFilter === 'all' || entry.source === sourceFilter;
    return matchesSearch && matchesSource;
  });

  const sources = Array.from(new Set(entries.map((entry) => entry.source)));

  // Platform stats for summary cards
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

  const totalRevenue = platformStats.reduce((sum, p) => sum + p.revenue, 0);

  const handleEdit = (id: string) => {
    navigate(`/entradas/${id}/editar`);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta entrada?')) {
      deleteEntry(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Minhas Entradas</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Gerencie seus ganhos diários
          </p>
        </div>
        <button
          onClick={() => navigate('/entradas/nova')}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nova Entrada
        </button>
      </div>

      {/* Platform Summary Cards */}
      {platformStats.length > 0 && (
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-2 px-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <button
            onClick={() => setSourceFilter('all')}
            className={`flex-shrink-0 px-4 py-3 rounded-xl transition-all ${sourceFilter === 'all'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
          >
            <p className="text-xs font-medium">Todas</p>
            <p className="text-lg font-bold">R$ {totalRevenue.toFixed(0)}</p>
          </button>
          {platformStats.map((stat) => (
            <button
              key={stat.name}
              onClick={() => setSourceFilter(stat.name)}
              className={`flex-shrink-0 px-4 py-3 rounded-xl transition-all ${sourceFilter === stat.name
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
            >
              <p className="text-xs font-medium">{stat.name}</p>
              <p className="text-lg font-bold">R$ {stat.revenue.toFixed(0)}</p>
              <p className="text-xs opacity-70">{stat.count} entradas</p>
            </button>
          ))}
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por origem, valor, notas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white dark:bg-gray-700 dark:text-white"
            >
              <option value="all">Todas as Origens</option>
              {sources.map((source) => (
                <option key={source} value={source}>
                  {source}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Origem
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Valor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Viagens
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  KM
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Horas
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredEntries.map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {format(new Date(entry.date), "dd/MM/yy", { locale: ptBR })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary-100 dark:bg-primary-900/50 text-primary-800 dark:text-primary-300">
                      {entry.source}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-success-600 dark:text-success-400">
                    R$ {entry.value.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {entry.tripCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {entry.kmDriven} km
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {entry.hoursWorked}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(entry.id)}
                      className="text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-300 mr-3"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(entry.id)}
                      className="text-danger-600 dark:text-danger-400 hover:text-danger-900 dark:hover:text-danger-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredEntries.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">Nenhuma entrada encontrada</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Entries;
