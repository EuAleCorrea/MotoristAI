import { useState, useRef, useEffect } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, X, Download, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useImportPreviewStore, type ImportRow } from '../../store/importPreviewStore';
import { useExpenseStore } from '../../store/expenseStore';
import { parseBankStatement, parseOfx, parseCsv, readFileAsText, ParseError, normalizeDate, normalizeAmount } from '../../lib/bankStatementParser';
import { suggestCategory, DEFAULT_CATEGORIES } from '../../utils/autoCategorize';
import { formatCurrency } from '../../utils/formatters';
import PageHeader from '../../components/PageHeader';

type Stage = 'upload' | 'preview' | 'result';

const ImportStatementPage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stage, setStage] = useState<Stage>('upload');
  const [error, setError] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const [importedCount, setImportedCount] = useState(0);
  const [dragOver, setDragOver] = useState(false);

  const { fileName, source, rows, skipped, setImport, toggleRow, selectAll, updateRow, removeRow, clear, getSelected } =
    useImportPreviewStore();
  const { bulkAddExpenses } = useExpenseStore();

  useEffect(() => {
    return () => clear();
  }, [clear]);

  const handleFile = async (file: File) => {
    setError(null);
    try {
      const text = await readFileAsText(file);
      const result = parseBankStatement(text);
      const initialRows: ImportRow[] = result.transactions.map((t) => ({
        ...t,
        selected: true,
        category: suggestCategory(t.description, t.type),
      }));
      setImport(file.name, result.source, initialRows, result.skipped);
      setStage('preview');
    } catch (e) {
      if (e instanceof ParseError) {
        setError(e.message);
      } else {
        setError('Erro ao processar arquivo');
      }
    }
  };

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleImport = async () => {
    const selected = getSelected();
    if (selected.length === 0) return;
    setImporting(true);
    setError(null);
    try {
      const expensesToInsert = selected.map((row) => ({
        date: row.date,
        description: row.description.slice(0, 200),
        amount: row.amount,
        category: row.category,
      }));
      const inserted = await bulkAddExpenses(expensesToInsert);
      setImportedCount(inserted);
      setStage('result');
    } catch (e: any) {
      setError(e?.message || 'Erro ao importar');
    } finally {
      setImporting(false);
    }
  };

  const downloadTemplate = () => {
    const csv = 'Data,Descrição,Valor\n2024-01-15,Exemplo de despesa,-50.00\n2024-01-16,Exemplo de receita,200.00\n';
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'modelo-extrato-motoristai.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (stage === 'result') {
    return (
      <div className="space-y-6">
        <PageHeader title="Importar Extrato" icon={Upload} />
        <div className="bg-[var(--ios-card)] rounded-2xl p-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-[rgba(52,199,89,0.15)] flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8 text-[var(--ios-green)]" />
          </div>
          <h2 className="text-xl font-semibold text-[var(--ios-text)]">Importação concluída</h2>
          <p className="text-[var(--ios-text-secondary)]">
            {importedCount} transação(ões) importada(s) com sucesso.
          </p>
          <div className="flex gap-3 justify-center pt-2">
            <button
              onClick={() => navigate('/despesas')}
              className="bg-[var(--ios-blue)] text-white px-5 py-2.5 rounded-xl font-medium text-sm"
            >
              Ver Despesas
            </button>
            <button
              onClick={() => {
                clear();
                setStage('upload');
                setImportedCount(0);
              }}
              className="bg-[var(--ios-fill)] text-[var(--ios-text)] px-5 py-2.5 rounded-xl font-medium text-sm"
            >
              Importar Outro
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (stage === 'preview') {
    const selectedCount = rows.filter((r) => r.selected).length;
    const totalSelectedAmount = rows
      .filter((r) => r.selected)
      .reduce((sum, r) => sum + (r.type === 'credit' ? r.amount : -r.amount), 0);

    return (
      <div className="space-y-4">
        <PageHeader title="Importar Extrato" icon={Upload} />
        <div className="flex items-center justify-between flex-wrap gap-2 text-sm text-[var(--ios-text-secondary)]">
          <div>
            <span className="font-medium text-[var(--ios-text)]">{fileName}</span> · {rows.length} transações
            {skipped > 0 && ` · ${skipped} ignoradas`}
          </div>
          <div className="flex gap-2">
            <button onClick={() => selectAll(true)} className="text-[var(--ios-blue)] text-xs font-medium">Selecionar tudo</button>
            <span className="text-[var(--ios-text-tertiary)]">·</span>
            <button onClick={() => selectAll(false)} className="text-[var(--ios-blue)] text-xs font-medium">Limpar</button>
            <span className="text-[var(--ios-text-tertiary)]">·</span>
            <button
              onClick={() => {
                clear();
                setStage('upload');
              }}
              className="text-[var(--ios-blue)] text-xs font-medium"
            >
              Outro arquivo
            </button>
          </div>
        </div>

        <div className="bg-[var(--ios-card)] rounded-2xl overflow-hidden">
          <div className="max-h-[60vh] overflow-y-auto">
            {rows.map((row) => (
              <ImportRowItem key={row.id} row={row} onToggle={() => toggleRow(row.id)} onUpdate={(p) => updateRow(row.id, p)} onRemove={() => removeRow(row.id)} />
            ))}
          </div>
        </div>

        <div className="sticky bottom-0 bg-[var(--ios-bg)] border-t border-[var(--ios-separator)] -mx-4 px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="text-sm">
              <div className="text-[var(--ios-text-secondary)]">{selectedCount} selecionada(s)</div>
              <div className="text-lg font-semibold text-[var(--ios-text)]">{formatCurrency(totalSelectedAmount)}</div>
            </div>
            <button
              onClick={handleImport}
              disabled={selectedCount === 0 || importing}
              className="bg-[var(--ios-blue)] text-white px-6 py-3 rounded-xl font-medium text-sm disabled:opacity-50"
            >
              {importing ? 'Importando...' : `Importar ${selectedCount}`}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Importar Extrato" icon={Upload} />

      <div className="bg-[var(--ios-card)] rounded-2xl p-4 text-sm text-[var(--ios-text-secondary)]">
        <p className="font-medium text-[var(--ios-text)] mb-1">Formatos suportados</p>
        <ul className="list-disc list-inside space-y-1 text-xs">
          <li><strong>CSV</strong> com colunas data, descrição, valor (delimitador , ou ;)</li>
          <li><strong>OFX</strong> exportado pelo app do seu banco (Nubank, Inter, Itaú, Bradesco, CEF, etc.)</li>
        </ul>
        <button
          onClick={downloadTemplate}
          className="mt-3 inline-flex items-center gap-1.5 text-[var(--ios-blue)] text-xs font-medium"
        >
          <Download className="w-3.5 h-3.5" />
          Baixar modelo CSV
        </button>
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-colors ${
          dragOver ? 'border-[var(--ios-blue)] bg-[var(--ios-tint)]' : 'border-[var(--ios-border)]'
        }`}
      >
        <FileText className="w-12 h-12 mx-auto mb-3 text-[var(--ios-text-tertiary)]" />
        <p className="text-[var(--ios-text)] font-medium mb-1">Toque para selecionar</p>
        <p className="text-xs text-[var(--ios-text-secondary)]">ou arraste o arquivo aqui</p>
        <p className="text-xs text-[var(--ios-text-tertiary)] mt-3">CSV ou OFX · até 10 MB</p>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.ofx,.txt,text/csv,application/x-ofx"
          onChange={handleSelect}
          className="hidden"
        />
      </div>

      {error && (
        <div className="bg-[rgba(255,59,48,0.1)] border border-[rgba(255,59,48,0.3)] text-[var(--ios-red)] px-4 py-3 rounded-xl text-sm flex items-start gap-2">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-[var(--ios-text-secondary)] text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar
      </button>
    </div>
  );
};

interface ImportRowItemProps {
  row: ImportRow;
  onToggle: () => void;
  onUpdate: (patch: Partial<ImportRow>) => void;
  onRemove: () => void;
}

const ImportRowItem = ({ row, onToggle, onUpdate, onRemove }: ImportRowItemProps) => {
  const [editing, setEditing] = useState(false);
  const [dateInput, setDateInput] = useState(row.date);
  const [descInput, setDescInput] = useState(row.description);
  const [amountInput, setAmountInput] = useState(row.amount.toFixed(2));

  useEffect(() => {
    setDateInput(row.date);
    setDescInput(row.description);
    setAmountInput(row.amount.toFixed(2));
  }, [row.date, row.description, row.amount]);

  const saveEdit = () => {
    const date = normalizeDate(dateInput) || row.date;
    const amount = normalizeAmount(amountInput);
    onUpdate({
      date,
      description: descInput.trim() || row.description,
      amount: Math.abs(amount ?? row.amount),
    });
    setEditing(false);
  };

  return (
    <div className={`border-b border-[var(--ios-separator)] p-3 ${!row.selected ? 'opacity-40' : ''}`}>
      <div className="flex items-start gap-3">
        <button
          onClick={onToggle}
          className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 ${
            row.selected
              ? 'bg-[var(--ios-blue)] border-[var(--ios-blue)]'
              : 'border-[var(--ios-border)]'
          }`}
        >
          {row.selected && <CheckCircle2 className="w-4 h-4 text-white" />}
        </button>

        <div className="flex-1 min-w-0">
          {editing ? (
            <div className="space-y-2">
              <input
                type="date"
                value={dateInput}
                onChange={(e) => setDateInput(e.target.value)}
                className="w-full bg-[var(--ios-fill)] rounded px-2 py-1 text-xs text-[var(--ios-text)]"
              />
              <input
                type="text"
                value={descInput}
                onChange={(e) => setDescInput(e.target.value)}
                placeholder="Descrição"
                className="w-full bg-[var(--ios-fill)] rounded px-2 py-1 text-xs text-[var(--ios-text)]"
              />
              <input
                type="number"
                step="0.01"
                value={amountInput}
                onChange={(e) => setAmountInput(e.target.value)}
                className="w-full bg-[var(--ios-fill)] rounded px-2 py-1 text-xs text-[var(--ios-text)]"
              />
              <select
                value={row.type}
                onChange={(e) => onUpdate({ type: e.target.value as 'credit' | 'debit' })}
                className="w-full bg-[var(--ios-fill)] rounded px-2 py-1 text-xs text-[var(--ios-text)]"
              >
                <option value="debit">Despesa</option>
                <option value="credit">Receita</option>
              </select>
              <select
                value={row.category}
                onChange={(e) => onUpdate({ category: e.target.value })}
                className="w-full bg-[var(--ios-fill)] rounded px-2 py-1 text-xs text-[var(--ios-text)]"
              >
                {DEFAULT_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <div className="flex gap-2">
                <button
                  onClick={saveEdit}
                  className="flex-1 bg-[var(--ios-blue)] text-white py-1.5 rounded text-xs font-medium"
                >
                  Salvar
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="flex-1 bg-[var(--ios-fill)] text-[var(--ios-text)] py-1.5 rounded text-xs font-medium"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <div onClick={() => setEditing(true)} className="cursor-pointer">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[var(--ios-text)] text-sm font-medium truncate">{row.description}</span>
                <span className={`text-sm font-semibold whitespace-nowrap ${row.type === 'credit' ? 'text-[var(--ios-green)]' : 'text-[var(--ios-text)]'}`}>
                  {row.type === 'credit' ? '+' : '-'} {formatCurrency(row.amount, false)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2 mt-0.5">
                <span className="text-[10px] text-[var(--ios-text-tertiary)]">
                  {new Date(row.date).toLocaleDateString('pt-BR')} · {row.category}
                </span>
              </div>
            </div>
          )}
        </div>

        {!editing && (
          <button
            onClick={onRemove}
            className="text-[var(--ios-text-tertiary)] p-1 flex-shrink-0"
            aria-label="Remover"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ImportStatementPage;
