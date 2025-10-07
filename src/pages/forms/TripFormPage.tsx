import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTripStore } from '../../store/tripStore';

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
    
    navigate('/corridas');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Plataforma
          </label>
          <select
            name="platform"
            value={formData.platform}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            required
          >
            <option value="Uber">Uber</option>
            <option value="99">99</option>
            <option value="iFood">iFood</option>
            <option value="Rappi">Rappi</option>
            <option value="Outros">Outros</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Valor (R$)
          </label>
          <input
            type="number"
            name="amount"
            step="0.01"
            value={formData.amount}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Distância (km)
          </label>
          <input
            type="number"
            name="distance"
            step="0.1"
            value={formData.distance}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Duração (minutos)
          </label>
          <input
            type="number"
            name="duration"
            value={formData.duration}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Data e Hora
          </label>
          <input
            type="datetime-local"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            required
          />
        </div>

        <div className="flex space-x-3 pt-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            {isEditing ? 'Salvar Alterações' : 'Adicionar Corrida'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default TripFormPage;
