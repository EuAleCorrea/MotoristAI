import { useState, useEffect, useMemo } from 'react';
import { Plus, Search, Filter, Edit2, Trash2, Download, Car } from 'lucide-react';
import { useTripStore } from '../store/tripStore';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '../utils/formatters';
import { exportToCsv, formatDateBR, formatCurrencyBR } from '../utils/exportCsv';

function Trips() {
 const { trips, deleteTrip, fetchTrips } = useTripStore();
 const navigate = useNavigate();

 useEffect(() => {
   fetchTrips();
 }, [fetchTrips]);

 const [searchTerm, setSearchTerm] = useState('');
 const [platformFilter, setPlatformFilter] = useState('all');

 const filteredTrips = trips.filter((trip) => {
 const matchesSearch =
 trip.platform.toLowerCase().includes(searchTerm.toLowerCase()) ||
 trip.amount.toString().includes(searchTerm);
 const matchesPlatform = platformFilter === 'all' || trip.platform === platformFilter;
 return matchesSearch && matchesPlatform;
 });

 const platforms = Array.from(new Set(trips.map((trip) => trip.platform)));

 const platformStats = useMemo(() => {
   const stats: Record<string, { revenue: number; trips: number; distance: number }> = {};
   trips.forEach((trip) => {
     const platform = trip.platform || 'Outros';
     if (!stats[platform]) {
       stats[platform] = { revenue: 0, trips: 0, distance: 0 };
     }
     stats[platform].revenue += trip.amount;
     stats[platform].trips += 1;
     stats[platform].distance += trip.distance;
   });
   return Object.entries(stats)
     .map(([name, data]) => ({ name, ...data }))
     .sort((a, b) => b.revenue - a.revenue);
 }, [trips]);

 const totalRevenue = platformStats.reduce((sum, p) => sum + p.revenue, 0);

 const handleEdit = (id: string) => {
 navigate(`/corridas/${id}/editar`);
 };

  const handleDelete = (id: string) => {
 if (window.confirm('Tem certeza que deseja excluir esta corrida?')) {
 deleteTrip(id);
 }
 };

 const handleExportCSV = () => {
   const filtered = platformFilter === 'all' ? trips : trips.filter(t => t.platform === platformFilter);
   exportToCsv(
     filtered,
     {
       date: 'Data',
       platform: 'Plataforma',
       amount: 'Valor',
       distance: 'Distância (km)',
       duration: 'Duração (min)',
     },
     `corridas-${new Date().toISOString().slice(0, 10)}`,
     {
       date: (v) => formatDateBR(v),
       amount: (v) => formatCurrencyBR(v),
       distance: (v) => v.toFixed(1),
       duration: (v) => String(v),
     },
   );
 };

 return (
 <div className="space-y-6">
 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
 <div>
 <h1 className="text-2xl font-bold text-[var(--ios-text)]">Corridas</h1>
 <p className="mt-1 text-sm text-[var(--ios-text-secondary)]">
   Histórico de todas as suas corridas individuais
 </p>
 </div>
  <button
 onClick={() => navigate('/corridas/nova')}
 className="ios-btn"
 >
 <Plus className="h-5 w-5 mr-2" />
 Nova Corrida
 </button>
 <button
   onClick={handleExportCSV}
   className="ios-btn-tinted ml-2"
   title="Exportar CSV"
 >
   <Download className="h-5 w-5" />
 </button>
 </div>

 {/* Platform Summary Cards */}
 {platformStats.length > 0 && (
   <div className="flex gap-3 overflow-x-auto pb-2 -mx-2 px-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
     <button
       onClick={() => setPlatformFilter('all')}
       className={`flex-shrink-0 px-4 py-3 rounded-xl transition-all ${
         platformFilter === 'all'
           ? 'bg-[var(--ios-accent)] text-white'
           : 'bg-[var(--ios-fill)] text-[var(--ios-text)] hover:bg-[var(--ios-fill)]'
       }`}
     >
       <p className="text-xs font-medium">Todas</p>
       <p className="text-lg font-bold">{formatCurrency(totalRevenue)}</p>
     </button>
     {platformStats.map((stat) => (
       <button
         key={stat.name}
         onClick={() => setPlatformFilter(stat.name)}
         className={`flex-shrink-0 px-4 py-3 rounded-xl transition-all ${
           platformFilter === stat.name
             ? 'bg-[var(--ios-accent)] text-white'
             : 'bg-[var(--ios-fill)] text-[var(--ios-text)] hover:bg-[var(--ios-fill)]'
         }`}
       >
         <p className="text-xs font-medium">{stat.name}</p>
         <p className="text-lg font-bold">{formatCurrency(stat.revenue)}</p>
         <p className="text-xs opacity-70">{stat.trips} corridas</p>
       </button>
     ))}
   </div>
 )}

 <div className="bg-[var(--ios-card)] rounded-lg shadow-sm p-4">
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 <div className="relative">
 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[var(--ios-text-tertiary)]" />
 <input
 type="text"
 placeholder="Buscar corridas..."
 value={searchTerm}
 onChange={(e) => setSearchTerm(e.target.value)}
 className="w-full pl-10 pr-4 py-2 border border-[var(--ios-separator)] rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-[var(--ios-card)] "
 />
 </div>
 <div className="relative">
 <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[var(--ios-text-tertiary)]" />
 <select
 value={platformFilter}
 onChange={(e) => setPlatformFilter(e.target.value)}
 className="w-full pl-10 pr-4 py-2 border border-[var(--ios-separator)] rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-[var(--ios-card)] "
 >
 <option value="all">Todas as Plataformas</option>
 {platforms.map((platform) => (
 <option key={platform} value={platform}>
 {platform}
 </option>
 ))}
 </select>
 </div>
 </div>
 </div>

 <div className="bg-[var(--ios-card)] rounded-lg shadow-sm overflow-hidden">
 <div className="overflow-x-auto">
 <table className="min-w-full divide-y divide-[var(--ios-separator)]">
 <thead className="bg-[var(--ios-bg)] ">
 <tr>
 <th className="px-6 py-3 text-left text-xs font-medium text-[var(--ios-text-secondary)] uppercase tracking-wider">
 Data e Hora
 </th>
 <th className="px-6 py-3 text-left text-xs font-medium text-[var(--ios-text-secondary)] uppercase tracking-wider">
 Plataforma
 </th>
 <th className="px-6 py-3 text-left text-xs font-medium text-[var(--ios-text-secondary)] uppercase tracking-wider">
 Valor
 </th>
 <th className="px-6 py-3 text-left text-xs font-medium text-[var(--ios-text-secondary)] uppercase tracking-wider">
 Distância
 </th>
 <th className="px-6 py-3 text-left text-xs font-medium text-[var(--ios-text-secondary)] uppercase tracking-wider">
 Duração
 </th>
 <th className="px-6 py-3 text-right text-xs font-medium text-[var(--ios-text-secondary)] uppercase tracking-wider">
 Ações
 </th>
 </tr>
 </thead>
 <tbody className="bg-[var(--ios-card)] divide-y divide-[var(--ios-separator)]">
 {filteredTrips.map((trip) => (
 <tr key={trip.id} className="hover:bg-[var(--ios-bg)] ">
 <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--ios-text)]">
 {format(new Date(trip.date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
 </td>
 <td className="px-6 py-4 whitespace-nowrap">
 <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-[var(--ios-tint)] text-[var(--ios-text)] ">
 {trip.platform}
 </span>
 </td>
 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-success-600 dark:text-success-400">
 {formatCurrency(trip.amount)}
 </td>
 <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--ios-text-secondary)]">
 {trip.distance.toFixed(1)} km
 </td>
 <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--ios-text-secondary)]">
 {trip.duration} min
 </td>
 <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
 <button
 onClick={() => handleEdit(trip.id)}
 className="text-[var(--ios-accent)] hover:text-primary-900 dark:hover:text-primary-300 mr-3"
 >
 <Edit2 className="h-4 w-4" />
 </button>
 <button
 onClick={() => handleDelete(trip.id)}
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
 {filteredTrips.length === 0 && (
 <div className="text-center py-12">
 <p className="text-[var(--ios-text-secondary)]">Nenhuma corrida encontrada</p>
 </div>
 )}
 </div>
 </div>
 );
}

export default Trips;
