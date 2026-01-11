import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Fuel, Zap, Droplets, Calendar, Gauge } from 'lucide-react';
import { useVehicleExpensesStore, FuelExpense } from '../../../store/vehicleExpensesStore';
import FormSection from '../../../components/forms/FormSection';
import FormInput from '../../../components/forms/FormInput';
import FormSelect from '../../../components/forms/FormSelect';
import FormTextArea from '../../../components/forms/FormTextArea';
import FormPageLayout from '../../../components/layouts/FormPageLayout';

type FuelType = 'Gasolina' | 'Etanol' | 'Diesel' | 'Elétrico' | 'Híbrido';

const EnergyFuelFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;

  const { expenses, addExpense, updateExpense } = useVehicleExpensesStore();

  const [fuelType, setFuelType] = useState<FuelType>('Gasolina');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [odometer, setOdometer] = useState('');
  const [notes, setNotes] = useState('');

  const [pricePerLiter, setPricePerLiter] = useState('');
  const [liters, setLiters] = useState('');
  const [totalValue, setTotalValue] = useState('');

  const [pricePerKwh, setPricePerKwh] = useState('');
  const [kwh, setKwh] = useState('');
  const [totalElectricValue, setTotalElectricValue] = useState('');

  const [lastEdited, setLastEdited] = useState<'price' | 'quantity' | 'total' | null>(null);

  useEffect(() => {
    if (isEditing) {
      const expenseToEdit = expenses.find(e => e.id === id && e.type === 'fuel') as FuelExpense | undefined;
      if (expenseToEdit) {
        setFuelType(expenseToEdit.details.fuelType);
        setDate(new Date(expenseToEdit.date).toISOString().slice(0, 10));
        setOdometer(expenseToEdit.odometer?.toString() || '');
        setNotes(expenseToEdit.notes || '');
        setPricePerLiter(expenseToEdit.details.pricePerUnit?.toString() || '');
        setLiters(expenseToEdit.details.quantity?.toString() || '');
        setPricePerKwh(expenseToEdit.details.electricPricePerUnit?.toString() || '');
        setKwh(expenseToEdit.details.electricQuantity?.toString() || '');

        const liquidTotal = (expenseToEdit.details.pricePerUnit || 0) * (expenseToEdit.details.quantity || 0);
        const electricTotal = (expenseToEdit.details.electricPricePerUnit || 0) * (expenseToEdit.details.electricQuantity || 0);
        setTotalValue(liquidTotal > 0 ? liquidTotal.toFixed(2) : '');
        setTotalElectricValue(electricTotal > 0 ? electricTotal.toFixed(2) : '');
      }
    }
  }, [id, isEditing, expenses]);

  useEffect(() => {
    const priceNum = parseFloat(pricePerLiter);
    const quantityNum = parseFloat(liters);
    if (lastEdited !== 'total' && !isNaN(priceNum) && !isNaN(quantityNum)) {
      setTotalValue((priceNum * quantityNum).toFixed(2));
    }
  }, [pricePerLiter, liters, lastEdited]);

  useEffect(() => {
    const priceNum = parseFloat(pricePerKwh);
    const quantityNum = parseFloat(kwh);
    if (!isNaN(priceNum) && !isNaN(quantityNum)) {
      setTotalElectricValue((priceNum * quantityNum).toFixed(2));
    }
  }, [pricePerKwh, kwh]);

  const summary = useMemo(() => {
    const parts: string[] = [];
    const finalTotal = (parseFloat(totalValue) || 0) + (parseFloat(totalElectricValue) || 0);

    if (fuelType === 'Híbrido') {
      if (liters) parts.push(`${liters} L`);
      if (kwh) parts.push(`${kwh} kWh`);
    } else if (fuelType === 'Elétrico') {
      if (kwh) parts.push(`${kwh} kWh`);
    } else {
      if (liters) parts.push(`${liters} L`);
    }

    if (odometer) parts.push(`Odômetro ${odometer} km`);

    if (parts.length === 0 && finalTotal === 0) return "Preencha os campos para ver o resumo.";

    return `R$ ${finalTotal.toFixed(2)} | ${parts.join(' | ')}`;
  }, [fuelType, totalValue, totalElectricValue, liters, kwh, odometer]);

  const fuelTypeOptions = ['Gasolina', 'Etanol', 'Diesel', 'Elétrico', 'Híbrido'];
  const showLiquid = fuelType !== 'Elétrico';
  const showElectric = fuelType === 'Elétrico' || fuelType === 'Híbrido';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalTotal = (parseFloat(totalValue) || 0) + (parseFloat(totalElectricValue) || 0);

    const expenseData: Omit<FuelExpense, 'id' | 'createdAt' | 'updatedAt'> = {
      type: 'fuel',
      vehicleId: 'default',
      date: new Date(date + 'T12:00:00').toISOString(),
      totalValue: finalTotal,
      odometer: parseFloat(odometer) || undefined,
      notes: notes || undefined,
      details: {
        fuelType,
        pricePerUnit: parseFloat(pricePerLiter) || 0,
        quantity: parseFloat(liters) || 0,
        electricPricePerUnit: parseFloat(pricePerKwh) || undefined,
        electricQuantity: parseFloat(kwh) || undefined,
      }
    };

    if (isEditing && id) {
      updateExpense(id, expenseData);
    } else {
      addExpense(expenseData);
    }
    navigate(-1);
  };

  const getIconForFuelType = () => {
    switch (fuelType) {
      case 'Elétrico': return <Zap className="w-8 h-8 text-yellow-500" />;
      case 'Híbrido': return <div className="flex items-center"><Fuel className="w-7 h-7 text-orange-500" /><Zap className="w-7 h-7 text-yellow-500" /></div>;
      default: return <Fuel className="w-8 h-8 text-orange-500" />;
    }
  };

  return (
    <FormPageLayout title={isEditing ? 'Editar Abastecimento' : 'Energia / Combustível'} icon={Fuel}>
      <form onSubmit={handleSubmit} className="space-y-6 pb-24">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 sm:p-6">
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <FormSelect id="fuelType" name="fuelType" label="Tipo de Combustível/Energia" value={fuelType} onChange={(e) => setFuelType(e.target.value as FuelType)}>
                {fuelTypeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </FormSelect>
            </div>
            <div className="pl-4 pt-8">
              {getIconForFuelType()}
            </div>
          </div>
        </div>

        {showLiquid && (
          <FormSection title={fuelType === 'Híbrido' ? "Parte 1: Combustível Líquido" : "Detalhes do Abastecimento"}>
            <FormInput id="pricePerLiter" name="pricePerLiter" label="Valor por Litro (R$)" type="number" step="0.001" placeholder="0,000" value={pricePerLiter} onChange={e => { setPricePerLiter(e.target.value); setLastEdited('price'); }} icon={<span className="text-sm font-semibold text-gray-500">R$</span>} />
            <FormInput id="liters" name="liters" label="Quantidade (L)" type="number" step="0.01" placeholder="0,00" value={liters} onChange={e => { setLiters(e.target.value); setLastEdited('quantity'); }} icon={<Droplets className="w-4 h-4 text-gray-400" />} />
            <FormInput id="totalValue" name="totalValue" label="Valor Total (R$)" type="number" step="0.01" placeholder="0,00" value={totalValue} onChange={e => { setTotalValue(e.target.value); setLastEdited('total'); }} icon={<span className="text-sm font-semibold text-gray-500">R$</span>} />
          </FormSection>
        )}

        {showElectric && (
          <FormSection title={fuelType === 'Híbrido' ? "Parte 2: Energia Elétrica" : "Detalhes da Recarga"}>
            <FormInput id="pricePerKwh" name="pricePerKwh" label="Valor por kWh (R$)" type="number" step="0.01" placeholder="0,00" value={pricePerKwh} onChange={e => setPricePerKwh(e.target.value)} icon={<span className="text-sm font-semibold text-gray-500">R$</span>} />
            <FormInput id="kwh" name="kwh" label="Quantidade (kWh)" type="number" step="0.01" placeholder="0,0" value={kwh} onChange={e => setKwh(e.target.value)} icon={<Zap className="w-4 h-4 text-gray-400" />} />
            <FormInput id="totalElectricValue" name="totalElectricValue" label="Valor Total da Recarga (R$)" type="number" step="0.01" placeholder="0,00" value={totalElectricValue} onChange={e => setTotalElectricValue(e.target.value)} icon={<span className="text-sm font-semibold text-gray-500">R$</span>} />
          </FormSection>
        )}

        <FormSection title="Informações Gerais">
          <FormInput id="date" name="date" label="Data do Abastecimento" type="date" value={date} onChange={e => setDate(e.target.value)} required icon={<Calendar className="w-4 h-4 text-gray-400" />} />
          <FormInput id="odometer" name="odometer" label="Odômetro Atual (km)" type="number" placeholder="50123" value={odometer} onChange={e => setOdometer(e.target.value)} required icon={<Gauge className="w-4 h-4 text-gray-400" />} />
          <FormTextArea id="notes" name="notes" label="Observações (Opcional)" placeholder="Ex: Posto Shell da Av. Principal, promoção de aditivo." value={notes} onChange={e => setNotes(e.target.value)} />
        </FormSection>

        <div className="bg-primary-50 dark:bg-gray-800 border-l-4 border-primary-500 text-primary-800 dark:text-primary-200 p-4 rounded-r-lg shadow-sm">
          <p className="font-semibold">Resumo</p>
          <p className="text-sm">{summary}</p>
        </div>

        <div className="pt-6 flex items-center gap-4">
          <button type="button" onClick={() => navigate(-1)} className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition">Cancelar</button>
          <button type="submit" className="flex-1 px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition shadow-sm">Salvar</button>
        </div>
      </form>
    </FormPageLayout>
  );
};

export default EnergyFuelFormPage;
