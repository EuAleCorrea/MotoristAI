import React from 'react';

const PLATFORMS = [
    { id: 'Uber', name: 'Uber' },
    { id: '99', name: '99' },
    { id: 'inDrive', name: 'InDrive' },
    { id: 'iFood', name: 'iFood' },
    { id: 'Rappi', name: 'Rappi' },
    { id: 'Lalamove', name: 'Lalamove' },
    { id: 'Particular', name: 'Particular' },
    { id: 'Outros', name: 'Outros' },
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
                {PLATFORMS.map((platform) => (
                    <option key={platform.id} value={platform.id}>
                        {platform.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default PlatformSelector;
