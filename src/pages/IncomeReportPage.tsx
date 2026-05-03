import { useState, useEffect } from 'react';
import { Download, Calendar, User, FileText, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEntryStore } from '../store/entryStore';
import { useExpenseStore } from '../store/expenseStore';
import { generateIncomeReport } from '../services/pdfReport';
import { format } from 'date-fns';

const IncomeReportPage = () => {
  const navigate = useNavigate();
  const { entries, fetchEntries, isLoading: entriesLoading } = useEntryStore();
  const { expenses, fetchExpenses, isLoading: expensesLoading } = useExpenseStore();

  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 3);
    return format(d, 'yyyy-MM-dd');
  });
  const [endDate, setEndDate] = useState(() => format(new Date(), 'yyyy-MM-dd'));
  const [driverName, setDriverName] = useState('');
  const [driverDocument, setDriverDocument] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    fetchEntries();
    fetchExpenses();
  }, []);

  const getEntryValue = (entry: any): number => {
    if (typeof entry.value === 'number') return entry.value;
    if (typeof entry.totalValue === 'number') return entry.totalValue;
    return 0;
  };

  const getTripCount = (entry: any): number => {
    if (typeof entry.tripCount === 'number') return entry.tripCount;
    if (typeof entry.trip_count === 'number') return entry.trip_count;
    if (typeof entry.trips === 'number') return entry.trips;
    return 1;
  };

  const getKmDriven = (entry: any): number => {
    if (typeof entry.kmDriven === 'number') return entry.kmDriven;
    if (typeof entry.km_driven === 'number') return entry.km_driven;
    if (typeof entry.km === 'number') return entry.km;
    return 0;
  };

  const getSource = (entry: any): string => {
    if (entry.source) return entry.source;
    if (entry.platform) return entry.platform;
    return 'Outros';
  };

  const getHoursWorked = (entry: any): string => {
    if (entry.hoursWorked) return entry.hoursWorked;
    if (entry.hours_worked) return entry.hours_worked;
    return '00:00';
  };

  const handleGeneratePDF = async () => {
    setIsGenerating(true);
    try {
      const start = new Date(startDate + 'T00:00:00');
      const end = new Date(endDate + 'T23:59:59');

      // Filtrar entradas e despesas pelo período
      const filteredEntries = entries
        .filter(e => {
          const date = new Date(e.date);
          return date >= start && date <= end;
        })
        .map(e => ({
          date: e.date,
          source: getSource(e),
          value: getEntryValue(e),
          tripCount: getTripCount(e),
          kmDriven: getKmDriven(e),
          hoursWorked: getHoursWorked(e),
          notes: e.notes,
        }));

      const filteredExpenses = expenses
        .filter(e => {
          const date = new Date(e.date);
          return date >= start && date <= end;
        })
        .map(e => ({
          date: e.date,
          category: e.category,
          description: e.description,
          amount: e.amount,
        }));

      const doc = generateIncomeReport(filteredEntries, filteredExpenses, {
        startDate: start,
        endDate: end,
        driverName: driverName || undefined,
        document: driverDocument || undefined,
      });

      // Nome do arquivo
      const fileName = driverName
        ? `comprovante-renda-${driverName.replace(/\s+/g, '-').toLowerCase()}.pdf`
        : `comprovante-renda-${format(start, 'dd-MM-yyyy')}-a-${format(end, 'dd-MM-yyyy')}.pdf`;

      doc.save(fileName);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Ocorreu um erro ao gerar o PDF. Tente novamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  const totalEntries = entries.filter(e => {
    const date = new Date(e.date);
    return date >= new Date(startDate + 'T00:00:00') && date <= new Date(endDate + 'T23:59:59');
  });
  const totalRevenue = totalEntries.reduce((sum, e) => sum + getEntryValue(e), 0);
  const totalTrips = totalEntries.reduce((sum, e) => sum + getTripCount(e), 0);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/relatorios')}
            className="p-2 rounded-full hover:bg-[var(--ios-fill)] transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-[var(--ios-text-secondary)]" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-[var(--ios-text)]">Comprovante de Renda</h1>
            <p className="text-sm text-[var(--ios-text-secondary)]">
              Gere um PDF profissional para comprovação de renda
            </p>
          </div>
        </div>
      </div>

      {/* Informações importantes */}
      <div className="bg-[rgba(37,99,235,0.08)] border-l-4 border-[var(--ios-accent)] p-4 rounded-r-lg">
        <div className="flex items-start gap-3">
          <ShieldCheck className="h-5 w-5 text-[var(--ios-accent)] mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-[var(--ios-accent)]">
              Documento com validade jurídica
            </p>
            <p className="text-xs text-[var(--ios-text-secondary)] mt-1">
              O PDF gerado contém declaração de veracidade, dados detalhados de receitas e despesas,
              e pode ser utilizado para comprovação de renda em bancos, financiamentos e processos seletivos.
            </p>
          </div>
        </div>
      </div>

      {/* Formulário de filtros */}
      <div className="bg-[var(--ios-card)] rounded-xl shadow-sm p-6 space-y-5">
        <h2 className="text-lg font-semibold text-[var(--ios-text)] flex items-center gap-2">
          <FileText className="h-5 w-5 text-[var(--ios-accent)]" />
          Dados para o Relatório
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Data Início */}
          <div>
            <label className="block text-sm font-medium text-[var(--ios-text-secondary)] mb-1.5">
              Data Início
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--ios-text-tertiary)]" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-[var(--ios-separator)] bg-[var(--ios-bg)] text-[var(--ios-text)] rounded-lg focus:ring-2 focus:ring-[var(--ios-accent)] focus:border-transparent"
              />
            </div>
          </div>

          {/* Data Fim */}
          <div>
            <label className="block text-sm font-medium text-[var(--ios-text-secondary)] mb-1.5">
              Data Fim
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--ios-text-tertiary)]" />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-[var(--ios-separator)] bg-[var(--ios-bg)] text-[var(--ios-text)] rounded-lg focus:ring-2 focus:ring-[var(--ios-accent)] focus:border-transparent"
              />
            </div>
          </div>

          {/* Nome do Motorista */}
          <div>
            <label className="block text-sm font-medium text-[var(--ios-text-secondary)] mb-1.5">
              Nome do Motorista
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--ios-text-tertiary)]" />
              <input
                type="text"
                value={driverName}
                onChange={(e) => setDriverName(e.target.value)}
                placeholder="Seu nome completo"
                className="w-full pl-10 pr-4 py-2.5 border border-[var(--ios-separator)] bg-[var(--ios-bg)] text-[var(--ios-text)] rounded-lg focus:ring-2 focus:ring-[var(--ios-accent)] focus:border-transparent"
              />
            </div>
          </div>

          {/* CPF/CNPJ */}
          <div>
            <label className="block text-sm font-medium text-[var(--ios-text-secondary)] mb-1.5">
              CPF ou CNPJ (opcional)
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--ios-text-tertiary)]" />
              <input
                type="text"
                value={driverDocument}
                onChange={(e) => setDriverDocument(e.target.value)}
                placeholder="000.000.000-00"
                className="w-full pl-10 pr-4 py-2.5 border border-[var(--ios-separator)] bg-[var(--ios-bg)] text-[var(--ios-text)] rounded-lg focus:ring-2 focus:ring-[var(--ios-accent)] focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Pré-visualização dos dados */}
      <div className="bg-[var(--ios-card)] rounded-xl shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-semibold text-[var(--ios-text)]">
          Resumo do Período Selecionado
        </h2>

        {entriesLoading || expensesLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--ios-accent)]" />
          </div>
        ) : totalEntries.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-[var(--ios-text-tertiary)] mx-auto mb-3" />
            <p className="text-sm text-[var(--ios-text-secondary)]">
              Nenhum registro encontrado no período selecionado.
            </p>
            <p className="text-xs text-[var(--ios-text-tertiary)] mt-1">
              Cadastre receitas na página de Entradas para gerar o relatório.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 bg-[var(--ios-fill)] rounded-lg text-center">
              <p className="text-xs text-[var(--ios-text-secondary)]">Receita Total</p>
              <p className="text-lg font-bold text-success-600 mt-1">
                {totalRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </p>
            </div>
            <div className="p-3 bg-[var(--ios-fill)] rounded-lg text-center">
              <p className="text-xs text-[var(--ios-text-secondary)]">Corridas</p>
              <p className="text-lg font-bold text-[var(--ios-text)] mt-1">{totalTrips}</p>
            </div>
            <div className="p-3 bg-[var(--ios-fill)] rounded-lg text-center">
              <p className="text-xs text-[var(--ios-text-secondary)]">Dias com Registro</p>
              <p className="text-lg font-bold text-[var(--ios-text)] mt-1">{totalEntries.length}</p>
            </div>
            <div className="p-3 bg-[var(--ios-fill)] rounded-lg text-center">
              <p className="text-xs text-[var(--ios-text-secondary)]">Média por Dia</p>
              <p className="text-lg font-bold text-[var(--ios-accent)] mt-1">
                {totalRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </p>
            </div>
          </div>
        )}

        {/* Botão de geração */}
        <button
          onClick={handleGeneratePDF}
          disabled={isGenerating || totalEntries.length === 0}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[var(--ios-accent)] text-white rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed mt-4"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
              Gerando PDF...
            </>
          ) : (
            <>
              <Download className="h-5 w-5" />
              Gerar Comprovante de Renda (PDF)
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default IncomeReportPage;