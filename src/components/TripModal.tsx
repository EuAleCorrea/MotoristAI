import { useState } from 'react';
import { X } from 'lucide-react';
import { useTripStore } from '../store/tripStore';

/*
 * TripModal — Apple HIG Bottom Sheet
 * Ref: hig-foundations/references/materials.md - glass-thick
 * Ref: hig-foundations/references/motion.md - sheet-up
 * Ref: hig-foundations/references/typography.md - form labels
 */

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

 const inputClass = `ios-input`;
 const selectClass = `ios-input`;
 const labelClass = `block text-ios-subhead font-medium text-[var(--ios-text-secondary)] mb-1.5`;

 return (
 <div
 className="fixed inset-0 z-50 flex items-end justify-center animate-fade-in"
 style={{ background: 'rgba(0, 0, 0, 0.32)' }}
 onClick={onClose}
 >
 <div
 className="w-full max-w-md glass-thick animate-sheet-up pb-safe"
 style={{ borderTopLeftRadius: '20px', borderTopRightRadius: '20px' }}
 onClick={(e) => e.stopPropagation()}
 >
 {/* Drag handle */}
 <div className="flex justify-center pt-3 pb-2">
 <div className="w-9 h-1 rounded-full bg-label-quaternary dark:bg-label-quaternary-dark" />
 </div>

 {/* Header */}
 <div className="flex items-center justify-between px-5 pb-3">
 <h2 className="text-ios-title3 font-semibold text-[var(--ios-text)]" style={{ letterSpacing: '-0.43px' }}>
 {trip ? 'Editar Corrida' : 'Nova Corrida'}
 </h2>
 <button
 id="trip-modal-close"
 onClick={onClose}
 className="btn-icon text-[var(--ios-text-tertiary)] hover:bg-fill-tertiary dark:hover:bg-fill-tertiary-dark"
 >
 <X className="h-5 w-5" />
 </button>
 </div>

 <form onSubmit={handleSubmit} className="px-4 pb-6 space-y-4">
 <div>
 <label className={labelClass}>Plataforma</label>
 <select
 id="trip-platform"
 value={formData.platform}
 onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
 className={selectClass}
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
 <label className={labelClass}>Valor (R$)</label>
 <input
 id="trip-amount"
 type="number"
 step="0.01"
 value={formData.amount}
 onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
 className={inputClass}
 required
 />
 </div>

 <div>
 <label className={labelClass}>Distância (km)</label>
 <input
 id="trip-distance"
 type="number"
 step="0.1"
 value={formData.distance}
 onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
 className={inputClass}
 required
 />
 </div>

 <div>
 <label className={labelClass}>Duração (minutos)</label>
 <input
 id="trip-duration"
 type="number"
 value={formData.duration}
 onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
 className={inputClass}
 required
 />
 </div>

 <div>
 <label className={labelClass}>Data e Hora</label>
 <input
 id="trip-date"
 type="datetime-local"
 value={formData.date}
 onChange={(e) => setFormData({ ...formData, date: e.target.value })}
 className={inputClass}
 required
 />
 </div>

 <div className="flex gap-3 pt-3">
 <button type="button" onClick={onClose} className="flex-1 ios-btn-tinted">
 Cancelar
 </button>
 <button type="submit" className="flex-1 ios-btn">
 {trip ? 'Salvar' : 'Adicionar'}
 </button>
 </div>
 </form>
 </div>
 </div>
 );
}

export default TripModal;
