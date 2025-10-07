import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useTripStore } from '../store/tripStore';

interface TripModalProps {
  trip?: any;
  onClose: () => void;
}

function TripModal({ trip, onClose }: TripModalProps) {
  const addTrip = useTripStore((state) => state.addTrip);
  const updateTrip = useTripStore((state) => state.updateTrip);

  const [formData, setFormData] = useState({
    platform: trip?.platform || 'Uber',
    amount: trip?.amount || '',
    distance: trip?.distance || '',
    duration: trip?.duration || '',
    date: trip?.date ? new Date(trip.date).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const tripData = {
      platform: formData.platform,
      amount: parseFloat(formData.amount.toString()),
      distance: parseFloat(formData.distance.toString()),
      duration: parseInt(formData.duration.toString()),
      date: new Date(formData.date).toISOString(),
    };

    if (trip) {
      updateTrip(trip.id, tripData);
    } else {
      addTrip(tripData);
    }
    
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {trip ? 'Editar Corrida' : 'Nova Corrida'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Plataforma
            </label>
            <select
              value={formData.platform}
              onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
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
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
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
              step="0.1"
              value={formData.distance}
              onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
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
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
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
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              {trip ? 'Salvar' : 'Adicionar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TripModal;
