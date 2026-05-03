import { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit2, Trash2, Download } from 'lucide-react';
import { useExpenseStore } from '../store/expenseStore';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { formatCurrency } from '../utils/formatters';
import { exportToCsv, formatDateBR, formatCurrencyBR } from '../utils/exportCsv';

function Expenses() {
 const expenses = useExpenseStore((state) => state.expenses);
 const deleteExpense = useExpenseStore((state) => state.deleteExpense);
 const navigate = useNavigate();
 const [searchParams] = useSearchParams();

 const [searchTerm, setSearchTerm] = useState('');
 const [categoryFilter, setCategoryFilter] = useState('all');
 const { fetchExpenses } = useExpenseStore();

 useEffect(() => {
 fetchExpenses();
 const categoryFromUrl = searchParams.get('category');
 if (categoryFromUrl) {
 setCategoryFilter(categoryFromUrl);
 }
 }, [fetchExpenses, searchParams]);

 const filteredExpenses = expenses.filter((expense) => {
 const matchesSearch =
 expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
 expense.amount.toString().includes(searchTerm);
 const matchesCategory = categoryFilter === 'all' || expense.category === categoryFilter;
 return matchesSearch && matchesCategory;
 });

 const categories = Array.from(new Set(expenses.map((expense) => expense.category)));

 const handleEdit = (id: string) => {
 navigate(`/despesas/${id}/editar`);
 };

  const handleDelete = (id: string) => {
 if (window.confirm('Tem certeza que deseja excluir esta despesa?')) {
 deleteExpense(id);
 }
 };

 const handleExportCSV = () => {
   const filtered = categoryFilter === 'all' ? expenses : expenses.filter(e => e.category === categoryFilter);
   exportToCsv(
     filtered,
     {
       date: 'Data',
       category: 'Categoria',
       description: 'Descrição',
       amount: 'Valor',
     },
     `despesas-${new Date().toISOString().slice(0, 10)}`,
     {
       date: (v) => formatDateBR(v),
       amount: (v) => formatCurrencyBR(v),
     },
   );
 };

 const categoryColors: Record<string, string> = {
 Combustível: 'bg-orange-100 dark:bg-orange-900/50 text-orange-800 dark:text-orange-300',
 Manutenção: 'bg-blue-100 /50 text-blue-800 ',
 Alimentação: 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300',
 Outros: 'bg-[var(--ios-fill)] text-[var(--ios-text)] ',
 Moradia: 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-300',
 Saúde: 'bg-pink-100 dark:bg-pink-900/50 text-pink-800 dark:text-pink-300',
 Educação: 'bg-cyan-100 dark:bg-cyan-900/50 text-cyan-800 dark:text-cyan-300',
 Lazer: 'bg-teal-100 dark:bg-teal-900/50 text-teal-800 dark:text-teal-300',
 'Pedágio/Estacionamento': 'bg-[rgba(175,82,222,0.12)] dark:bg-purple-900/50 text-purple-800 dark:text-purple-300',
 };

 return (
 <div className="space-y-6">
 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
 <div>
 <h1 className="text-2xl font-bold text-[var(--ios-text)]">Minhas Despesas</h1>
 <p className="mt-1 text-sm text-[var(--ios-text-secondary)]">
 Controle seus gastos e custos operacionais
 </p>
 </div>
  <button
 onClick={() => navigate('/despesas/nova')}
 className="ios-btn"
 >
 <Plus className="h-5 w-5 mr-2" />
 Nova Despesa
 </button>
 <button
   onClick={handleExportCSV}
   className="ios-btn-tinted ml-2"
   title="Exportar CSV"
 >
   <Download className="h-5 w-5" />
 </button>
 </div>

 <div className="bg-[var(--ios-card)] rounded-lg shadow-sm p-4">
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 <div className="relative">
 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[var(--ios-text-tertiary)]" />
 <input
 type="text"
 placeholder="Buscar despesas..."
 value={searchTerm}
 onChange={(e) => setSearchTerm(e.target.value)}
 className="w-full pl-10 pr-4 py-2 border border-[var(--ios-separator)] rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-[var(--ios-card)] "
 />
 </div>
 <div className="relative">
 <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[var(--ios-text-tertiary)]" />
 <select
 value={categoryFilter}
 onChange={(e) => setCategoryFilter(e.target.value)}
 className="w-full pl-10 pr-4 py-2 border border-[var(--ios-separator)] rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-[var(--ios-card)] "
 >
 <option value="all">Todas as Categorias</option>
 {categories.map((category) => (
 <option key={category} value={category}>
 {category}
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
 Data
 </th>
 <th className="px-6 py-3 text-left text-xs font-medium text-[var(--ios-text-secondary)] uppercase tracking-wider">
 Descrição
 </th>
 <th className="px-6 py-3 text-left text-xs font-medium text-[var(--ios-text-secondary)] uppercase tracking-wider">
 Categoria
 </th>
 <th className="px-6 py-3 text-left text-xs font-medium text-[var(--ios-text-secondary)] uppercase tracking-wider">
 Valor
 </th>
 <th className="px-6 py-3 text-right text-xs font-medium text-[var(--ios-text-secondary)] uppercase tracking-wider">
 Ações
 </th>
 </tr>
 </thead>
 <tbody className="bg-[var(--ios-card)] divide-y divide-[var(--ios-separator)]">
 {filteredExpenses.map((expense) => (
 <tr key={expense.id} className="hover:bg-[var(--ios-bg)] ">
 <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--ios-text)]">
 {format(new Date(expense.date), 'dd/MM/yyyy', { locale: ptBR })}
 </td>
 <td className="px-6 py-4 text-sm text-[var(--ios-text)]">
 {expense.description}
 </td>
 <td className="px-6 py-4 whitespace-nowrap">
 <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${categoryColors[expense.category] || categoryColors.Outros}`}>
 {expense.category}
 </span>
 </td>
 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-danger-600 dark:text-danger-400">
 {formatCurrency(expense.amount)}
 </td>
 <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
 <button
 onClick={() => handleEdit(expense.id)}
 className="text-[var(--ios-accent)] hover:text-primary-900 dark:hover:text-primary-300 mr-3"
 >
 <Edit2 className="h-4 w-4" />
 </button>
 <button
 onClick={() => handleDelete(expense.id)}
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
 {filteredExpenses.length === 0 && (
 <div className="text-center py-12">
 <p className="text-[var(--ios-text-secondary)]">Nenhuma despesa encontrada</p>
 </div>
 )}
 </div>
 </div>
 );
}

export default Expenses;
