import React, { useEffect } from 'react';
import { usePlatformStore } from '../../store/platformStore';

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
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {label}
            </label>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 
           bg-white dark:bg-gray-800 text-gray-900 dark:text-white
           focus:ring-2 focus:ring-primary-500 focus:border-transparent
           transition-all duration-200"
            >
                <option value="">Selecione uma plataforma</option>
                {displayPlatforms.map((platform) => (
                    <option key={platform.id} value={platform.id}>
                        {platform.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default PlatformSelector;
