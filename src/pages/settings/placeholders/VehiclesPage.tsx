import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVehicleStore, Vehicle, FinancialStatus } from '../../../store/vehicleStore';

// --- Helper Components (Internal to this file) ---

const FormSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-6">{title}</h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">{children}</div>
  </div>
);

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, id, ...props }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
    <input id={id} {...props} className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition" />
  </div>
);

const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { label: string, children: React.ReactNode }> = ({ label, id, children, ...props }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
    <select id={id} {...props} className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition">
      {children}
    </select>
  </div>
);

const Toggle: React.FC<{ label: string; checked: boolean; onChange: () => void }> = ({ label, checked, onChange }) => (
  <div className="flex items-center justify-between col-span-1 sm:col-span-2">
    <span className="text-sm font-medium text-gray-700">{label}</span>
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only peer" />
      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
    </label>
  </div>
);

const RadioGroup: React.FC<{ label: string; name: string; options: string[]; selected: string; onChange: (value: any) => void; }> = ({ label, name, options, selected, onChange }) => (
    <div className="col-span-1 sm:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
        <div className="flex flex-wrap gap-3">
            {options.map(option => (
                <label key={option} className="flex items-center cursor-pointer">
                    <input type="radio" name={name} value={option} checked={selected === option} onChange={e => onChange(e.target.value)} className="sr-only" />
                    <div className={`px-4 py-2 rounded-lg border text-sm font-medium transition ${selected === option ? 'bg-primary-100 border-primary-500 text-primary-700' : 'bg-white border-gray-300 text-gray-600 hover:border-gray-400'}`}>
                        {option}
                    </div>
                </label>
            ))}
        </div>
    </div>
);


// --- Main Page Component ---

const VehicleFormPage = () => {
  const navigate = useNavigate();
  const { addVehicle } = useVehicleStore();
  
  const [formData, setFormData] = useState<Omit<Vehicle, 'id'>>({
    brand: '',
    model: '',
    version: '',
    year: new Date().getFullYear(),
    color: '',
    fuel: 'Gasolina',
    transmission: 'Manual',
    doors: 4,
    hasAirConditioning: false,
    mileage: 0,
    financialStatus: 'Quitado',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isNumber = type === 'number';
    setFormData(prev => ({ ...prev, [name]: isNumber ? Number(value) : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addVehicle(formData);
    navigate('/ajustes');
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-24">
      <h1 className="text-2xl font-bold text-gray-900 sr-only">Cadastrar Veículo</h1>

      <FormSection title="Identificação">
        <Input name="brand" label="Marca" value={formData.brand} onChange={handleInputChange} placeholder="Ex: Volkswagen" required />
        <Input name="model" label="Modelo" value={formData.model} onChange={handleInputChange} placeholder="Ex: Gol" required />
        <Input name="version" label="Versão" value={formData.version} onChange={handleInputChange} placeholder="Ex: 1.6 MSI" />
        <Select name="year" label="Ano" value={formData.year} onChange={handleInputChange}>
          {years.map(y => <option key={y} value={y}>{y}</option>)}
        </Select>
      </FormSection>

      <FormSection title="Características">
        <Input name="color" label="Cor" value={formData.color} onChange={handleInputChange} placeholder="Ex: Prata" />
        <Select name="fuel" label="Combustível" value={formData.fuel} onChange={handleInputChange}>
            <option>Gasolina</option>
            <option>Etanol</option>
            <option>Diesel</option>
            <option>GNV</option>
            <option>Elétrico</option>
            <option>Híbrido</option>
        </Select>
        <Select name="transmission" label="Câmbio" value={formData.transmission} onChange={handleInputChange}>
            <option>Manual</option>
            <option>Automático</option>
        </Select>
        <Input name="doors" label="Portas" type="number" value={formData.doors} onChange={handleInputChange} min="2" />
        <Input name="mileage" label="Quilometragem" type="number" value={formData.mileage} onChange={handleInputChange} placeholder="Ex: 50000" />
        <Toggle label="Ar-condicionado" checked={formData.hasAirConditioning} onChange={() => setFormData(p => ({...p, hasAirConditioning: !p.hasAirConditioning}))} />
      </FormSection>

      <FormSection title="Situação Financeira">
        <RadioGroup
            label="Qual a situação do veículo?"
            name="financialStatus"
            options={['Financiado', 'Alugado', 'Quitado']}
            selected={formData.financialStatus}
            onChange={(value) => setFormData(p => ({...p, financialStatus: value as FinancialStatus}))}
        />
      </FormSection>

      {/* Action Buttons */}
      <div className="pt-6">
          <div className="flex items-center gap-4">
            <button type="button" onClick={() => navigate(-1)} className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition">
              Cancelar
            </button>
            <button type="submit" className="flex-1 px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition shadow-sm">
              Salvar
            </button>
          </div>
      </div>
    </form>
  );
};

export default VehicleFormPage;
