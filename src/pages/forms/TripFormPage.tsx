import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTripStore } from '../../store/tripStore';
import FormPageLayout from '../../components/layouts/FormPageLayout';
import FormInput from '../../components/forms/FormInput';
import MoneyInput from '../../components/forms/MoneyInput';
import FormSelect from '../../components/forms/FormSelect';
import { Car, Calendar, Route, Clock } from 'lucide-react';

function TripFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const { trips, addTrip, updateTrip } = useTripStore();
  const tripToEdit = isEditing ? trips.find(t => t.id === id) : undefined;

  const [formData, setFormData] = useState({
    platform: 'Uber',
    amount: '',
    distance: '',
    duration: '',
    date: new Date().toISOString().slice(0, 16),
  });

  useEffect(() => {
    if (isEditing && tripToEdit) {
      setFormData({
        platform: tripToEdit.platform,
        amount: tripToEdit.amount.toString(),
        distance: tripToEdit.distance.toString(),
        duration: tripToEdit.duration.toString(),
        date: new Date(tripToEdit.date).toISOString().slice(0, 16),
      });
    } else if (isEditing && !tripToEdit) {
      // Trip not found, redirect
      navigate('/corridas');
    }
  }, [id, isEditing, tripToEdit, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const tripData = {
      platform: formData.platform,
      amount: parseFloat(formData.amount),
      distance: parseFloat(formData.distance),
      duration: parseInt(formData.duration),
      date: new Date(formData.date).toISOString(),
    };

    if (isEditing && id) {
      updateTrip(id, tripData);
    } else {
      addTrip(tripData);
    }

    navigate(-1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <FormPageLayout title={isEditing ? 'Editar Corrida' : 'Nova Corrida'} icon={Car}>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 overflow-hidden">
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormSelect
            label="Plataforma"
            id="platform"
            name="platform"
            value={formData.platform}
            onChange={handleInputChange}
            required
          >
            <option value="Uber">Uber</option>
            <option value="99">99</option>
            <option value="iFood">iFood</option>
            <option value="Rappi">Rappi</option>
            <option value="Outros">Outros</option>
          </FormSelect>

          <MoneyInput
            label="Valor (R$)"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleInputChange}
            placeholder="0,00"
            required
            icon={<span className="text-sm font-semibold text-gray-500">R$</span>}
          />

          <FormInput
            label="Distância (km)"
            id="distance"
            name="distance"
            type="number"
            step="0.1"
            value={formData.distance}
            onChange={handleInputChange}
            required
            icon={<Route className="w-4 h-4 text-gray-400" />}
          />

          <FormInput
            label="Duração (minutos)"
            id="duration"
            name="duration"
            type="number"
            value={formData.duration}
            onChange={handleInputChange}
            required
            icon={<Clock className="w-4 h-4 text-gray-400" />}
          />

          <FormInput
            label="Data e Hora"
            id="date"
            name="date"
            type="datetime-local"
            value={formData.date}
            onChange={handleInputChange}
            required
            icon={<Calendar className="w-4 h-4 text-gray-400" />}
          />

          <div className="flex items-center gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition shadow-sm"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </FormPageLayout>
  );
}

export default TripFormPage;
