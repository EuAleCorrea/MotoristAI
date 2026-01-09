import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useVehicleExpensesStore, MaintenanceExpense } from '../../../store/vehicleExpensesStore';
import FormSection from '../../../components/forms/FormSection';
import FormInput from '../../../components/forms/FormInput';
import FormSelect from '../../../components/forms/FormSelect';
import FormTextArea from '../../../components/forms/FormTextArea';
import { Wrench, Calendar, DollarSign, Gauge, Paperclip, AlertTriangle, Building } from 'lucide-react';
import FormPageLayout from '../../../components/layouts/FormPageLayout';

const MaintenanceFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;

  const { expenses, addExpense, updateExpense } = useVehicleExpensesStore();

  const [maintenanceType, setMaintenanceType] = useState('Revisão');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [provider, setProvider] = useState('');
  const [partsReplaced, setPartsReplaced] = useState('');
  const [partsCost, setPartsCost] = useState('');
  const [laborCost, setLaborCost] = useState('');
  const [totalValue, setTotalValue] = useState('');
  const [odometer, setOdometer] = useState('');
  const [notes, setNotes] = useState('');
  const [invoiceFile, setInvoiceFile] = useState<File | null>(null);
  const [odometerWarning, setOdometerWarning] = useState<string | null>(null);

  const latestOdometer = useMemo(() => {
    const expensesWithOdometer = expenses
      .filter(e => e.odometer && e.odometer > 0)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if (isEditing && id) {
      const expenseToEdit = expenses.find(e => e.id === id);
      if (expenseToEdit) {
        // Exclude the current entry from the check
        const otherExpenses = expensesWithOdometer.filter(e => e.id !== id);
        return otherExpenses.length > 0 ? otherExpenses[0].odometer : 0;
      }
    }

    return expensesWithOdometer.length > 0 ? expensesWithOdometer[0].odometer : 0;
  }, [expenses, id, isEditing]);

  useEffect(() => {
    if (isEditing) {
      const expenseToEdit = expenses.find(e => e.id === id && e.type === 'maintenance') as MaintenanceExpense | undefined;
      if (expenseToEdit) {
        setMaintenanceType(expenseToEdit.description); // Assuming description holds the type for now
        setDate(new Date(expenseToEdit.date).toISOString().slice(0, 10));
        setProvider(expenseToEdit.provider);
        setPartsReplaced(expenseToEdit.partsReplaced || '');
        setPartsCost(expenseToEdit.partsCost.toString());
        setLaborCost(expenseToEdit.laborCost.toString());
        setOdometer(expenseToEdit.odometer?.toString() || '');
        setNotes(expenseToEdit.notes || '');
      }
    }
  }, [id, isEditing, expenses]);

  useEffect(() => {
    const parts = parseFloat(partsCost) || 0;
    const labor = parseFloat(laborCost) || 0;
    setTotalValue((parts + labor).toFixed(2));
  }, [partsCost, laborCost]);

  useEffect(() => {
    const currentOdometer = parseFloat(odometer);
    if (latestOdometer && currentOdometer > 0 && currentOdometer < latestOdometer) {
      setOdometerWarning(`Atenção: O odômetro inserido (${currentOdometer} km) é menor que o último registro (${latestOdometer} km).`);
    } else {
      setOdometerWarning(null);
    }
  }, [odometer, latestOdometer]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setInvoiceFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const expenseData: Omit<MaintenanceExpense, 'id' | 'createdAt' | 'updatedAt'> = {
      type: 'maintenance',
      vehicleId: 'default',
      date,
      maintenanceType: 'Corretiva', // Placeholder
      description: maintenanceType,
      provider,
      partsReplaced: partsReplaced || undefined,
      laborCost: parseFloat(laborCost) || 0,
      partsCost: parseFloat(partsCost) || 0,
      totalValue: parseFloat(totalValue) || 0,
      odometer: parseFloat(odometer) || undefined,
      notes: notes || undefined,
    };

    if (isEditing && id) {
      updateExpense(id, expenseData);
    } else {
      addExpense(expenseData);
    }
    navigate(-1);
  };

  return (
    <FormPageLayout title={isEditing ? 'Editar Manutenção' : 'Manutenção'} icon={Wrench}>
      <form onSubmit={handleSubmit} className="space-y-6 pb-24">
        <FormSection title="Detalhes do Serviço">
          <FormSelect id="maintenanceType" name="maintenanceType" label="Tipo de Manutenção" value={maintenanceType} onChange={e => setMaintenanceType(e.target.value)}>
            <option>Revisão</option>
            <option>Troca de óleo</option>
            <option>Pneus</option>
            <option>Freios</option>
            <option>Bateria</option>
            <option>Outros</option>
          </FormSelect>
          <FormInput id="date" name="date" label="Data do Serviço" type="date" value={date} onChange={e => setDate(e.target.value)} required icon={<Calendar className="w-4 h-4 text-gray-400" />} />
          <FormInput id="provider" name="provider" label="Oficina / Local" type="text" placeholder="Ex: Oficina do Zé" value={provider} onChange={e => setProvider(e.target.value)} required icon={<Building className="w-4 h-4 text-gray-400" />} />
          <FormTextArea id="partsReplaced" name="partsReplaced" label="Itens Substituídos" placeholder="Ex: Filtro de ar, pastilhas de freio" value={partsReplaced} onChange={e => setPartsReplaced(e.target.value)} />
        </FormSection>

        <FormSection title="Custos e Odômetro">
          <FormInput id="partsCost" name="partsCost" label="Custo de Peças (R$)" type="number" step="0.01" placeholder="150.00" value={partsCost} onChange={e => setPartsCost(e.target.value)} icon={<DollarSign className="w-4 h-4 text-gray-400" />} />
          <FormInput id="laborCost" name="laborCost" label="Custo de Mão de Obra (R$)" type="number" step="0.01" placeholder="100.00" value={laborCost} onChange={e => setLaborCost(e.target.value)} icon={<DollarSign className="w-4 h-4 text-gray-400" />} />
          <FormInput id="totalValue" name="totalValue" label="Valor Total (R$)" type="number" value={totalValue} readOnly disabled icon={<DollarSign className="w-4 h-4 text-gray-400" />} />
          <div>
            <FormInput id="odometer" name="odometer" label="Odômetro Atual (km)" type="number" placeholder="51200" value={odometer} onChange={e => setOdometer(e.target.value)} required icon={<Gauge className="w-4 h-4 text-gray-400" />} />
            {odometerWarning && (
              <div className="mt-2 flex items-center text-sm text-yellow-700 dark:text-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded-md">
                <AlertTriangle className="h-4 w-4 mr-2 flex-shrink-0" />
                <span>{odometerWarning}</span>
              </div>
            )}
          </div>
        </FormSection>

        <FormSection title="Anexos e Observações">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Nota Fiscal / Imagem</label>
            <label htmlFor="invoice-upload" className="w-full flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/10 transition">
              <Paperclip className="w-5 h-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400 ml-2">{invoiceFile ? invoiceFile.name : 'Clique para anexar um arquivo'}</span>
            </label>
            <input id="invoice-upload" type="file" className="hidden" onChange={handleFileChange} accept="image/*,.pdf" />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">A funcionalidade de upload requer integração com um serviço de armazenamento.</p>
          </div>
          <FormTextArea id="notes" name="notes" label="Observações Adicionais" placeholder="Ex: Garantia de 3 meses para o serviço." value={notes} onChange={e => setNotes(e.target.value)} />
        </FormSection>

        <div className="pt-6 flex items-center gap-4">
          <button type="button" onClick={() => navigate(-1)} className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition">Cancelar</button>
          <button type="submit" className="flex-1 px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition shadow-sm">Salvar</button>
        </div>
      </form>
    </FormPageLayout>
  );
};

export default MaintenanceFormPage;
