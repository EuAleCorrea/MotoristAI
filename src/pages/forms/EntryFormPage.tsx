import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEntryStore, Entry } from '../../store/entryStore';
import FormPageLayout from '../../components/layouts/FormPageLayout';
import { DollarSign, Calendar, Hash, Route, Clock } from 'lucide-react';
import FormSection from '../../components/forms/FormSection';
import FormInput from '../../components/forms/FormInput';
import FormTextArea from '../../components/forms/FormTextArea';
import PlatformSelector from '../../components/forms/PlatformSelector';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

function EntryFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const { entries, addEntry, updateEntry, isLoading } = useEntryStore();

  const [formData, setFormData] = useState({
    date: new Date().toISOString().slice(0, 10),
    source: 'Uber',
    value: '',
    tripCount: '',
    kmDriven: '',
    hoursWorked: '08:00',
    notes: '',
  });

  const [dayOfWeek, setDayOfWeek] = useState('');

  useEffect(() => {
    if (formData.date) {
      try {
        // Adding time to handle timezone issues with parseISO
        const dateObj = new Date(formData.date + 'T12:00:00');
        const formattedDay = format(dateObj, 'EEEE', { locale: ptBR });
        setDayOfWeek(formattedDay.charAt(0).toUpperCase() + formattedDay.slice(1));
      } catch (error) {
        setDayOfWeek('');
      }
    } else {
      setDayOfWeek('');
    }
  }, [formData.date]);

  useEffect(() => {
    if (isEditing) {
      const entryToEdit = entries.find(e => e.id === id);
      if (entryToEdit) {
        setFormData({
          date: new Date(entryToEdit.date).toISOString().slice(0, 10),
          source: entryToEdit.source,
          value: entryToEdit.value.toString(),
          tripCount: entryToEdit.tripCount.toString(),
          kmDriven: entryToEdit.kmDriven.toString(),
          hoursWorked: entryToEdit.hoursWorked,
          notes: entryToEdit.notes || '',
        });
      } else {
        navigate('/entradas');
      }
    }
  }, [id, isEditing, entries, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const entryData: Omit<Entry, 'id'> = {
      date: new Date(formData.date + 'T12:00:00').toISOString(),
      source: formData.source,
      value: parseFloat(formData.value),
      tripCount: parseInt(formData.tripCount),
      kmDriven: parseFloat(formData.kmDriven),
      hoursWorked: formData.hoursWorked || '00:00',
      notes: formData.notes,
    };

    try {
      if (isEditing && id) {
        await updateEntry(id, entryData);
      } else {
        await addEntry(entryData);
      }
      navigate('/entradas');
    } catch (error) {
      console.error('Erro ao salvar:', error);
      // O erro já é tratado na store, mas poderíamos mostrar um toast aqui
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePlatformChange = (platform: string) => {
    setFormData(prev => ({ ...prev, source: platform }));
  };

  return (
    <FormPageLayout title={isEditing ? 'Editar Entrada' : 'Nova Entrada'} icon={DollarSign}>
      <form onSubmit={handleSubmit} className="space-y-6 pb-24">
        <FormSection title="Informações da Entrada">
          <FormInput
            id="date"
            name="date"
            label="Data da Entrada"
            type="date"
            value={formData.date}
            onChange={handleInputChange}
            required
            icon={<Calendar className="w-4 h-4 text-gray-400" />}
          />
          <FormInput
            id="dayOfWeek"
            name="dayOfWeek"
            label="Dia da Semana"
            type="text"
            value={dayOfWeek}
            readOnly
            disabled
            icon={<Calendar className="w-4 h-4 text-gray-400" />}
          />
          <PlatformSelector
            value={formData.source}
            onChange={handlePlatformChange}
            label="Plataforma"
          />
          <FormInput
            id="value"
            name="value"
            label="Valor da Entrada"
            type="number"
            step="0.01"
            value={formData.value}
            onChange={handleInputChange}
            placeholder="250.00"
            required
            icon={<DollarSign className="w-4 h-4 text-gray-400" />}
          />
        </FormSection>

        <FormSection title="Métricas">
          <FormInput
            id="tripCount"
            name="tripCount"
            label="Quantidade de Viagens"
            type="number"
            value={formData.tripCount}
            onChange={handleInputChange}
            placeholder="15"
            required
            icon={<Hash className="w-4 h-4 text-gray-400" />}
          />
          <FormInput
            id="kmDriven"
            name="kmDriven"
            label="Km Rodados"
            type="number"
            step="0.1"
            value={formData.kmDriven}
            onChange={handleInputChange}
            placeholder="120.5"
            required
            icon={<Route className="w-4 h-4 text-gray-400" />}
          />
          <FormInput
            id="hoursWorked"
            name="hoursWorked"
            label="Horas Trabalhadas"
            type="time"
            value={formData.hoursWorked}
            onChange={handleInputChange}
            required
            icon={<Clock className="w-4 h-4 text-gray-400" />}
          />
        </FormSection>

        <FormSection title="Observações">
          <FormTextArea
            id="notes"
            name="notes"
            label="Observação (Opcional)"
            value={formData.notes}
            onChange={handleInputChange}
            placeholder="Ex: Dia de chuva, alta demanda."
          />
        </FormSection>

        <div className="pt-6 flex items-center gap-4">
          <button type="button" onClick={() => navigate(-1)} className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition">
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </form>
    </FormPageLayout>
  );
}

export default EntryFormPage;
