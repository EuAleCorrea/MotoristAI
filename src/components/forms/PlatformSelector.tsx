import React, { useEffect } from 'react';
import { usePlatformStore } from '../../store/platformStore';
import { AppSelect } from './AppSelect';

// Fallback para plataformas padrão caso não haja nenhuma cadastrada
const DEFAULT_PLATFORMS = [
  { id: 'Uber', name: 'Uber' },
  { id: '99', name: '99' },
];

interface PlatformSelectorProps {
  value: string;
  onChange: (platform: string) => void;
  label?: string;
}

const PlatformSelector: React.FC<PlatformSelectorProps> = ({
  value,
  onChange,
  label = 'Plataforma'
}) => {
  const { platforms, fetchPlatforms } = usePlatformStore();

  useEffect(() => {
    fetchPlatforms();
  }, [fetchPlatforms]);

  // Usa plataformas do banco ou fallback para padrão
  const displayPlatforms = platforms.length > 0
    ? platforms.filter(p => p.isActive).map(p => ({ id: p.name, name: p.name }))
    : DEFAULT_PLATFORMS;

  return (
    <div>
      <label className="block text-sm font-medium text-[var(--ios-text)] mb-1.5 pl-1">
        {label}
      </label>
      <AppSelect
        value={value}
        onValueChange={onChange}
        placeholder="Selecione uma plataforma"
        options={displayPlatforms.map((platform) => ({
          value: platform.id,
          label: platform.name,
        }))}
      />
    </div>
  );
};

export default PlatformSelector;
