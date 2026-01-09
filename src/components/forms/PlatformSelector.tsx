import React from 'react';

interface Platform {
    id: string;
    name: string;
    color: string;
    bgColor: string;
    textColor: string;
}

const PLATFORMS: Platform[] = [
    { id: 'Uber', name: 'Uber', color: 'border-black', bgColor: 'bg-black', textColor: 'text-white' },
    { id: '99', name: '99', color: 'border-yellow-500', bgColor: 'bg-yellow-500', textColor: 'text-black' },
    { id: 'inDrive', name: 'InDrive', color: 'border-green-500', bgColor: 'bg-green-500', textColor: 'text-white' },
    { id: 'iFood', name: 'iFood', color: 'border-red-500', bgColor: 'bg-red-500', textColor: 'text-white' },
    { id: 'Rappi', name: 'Rappi', color: 'border-orange-500', bgColor: 'bg-orange-500', textColor: 'text-white' },
    { id: 'Lalamove', name: 'Lalamove', color: 'border-orange-600', bgColor: 'bg-orange-600', textColor: 'text-white' },
    { id: 'Particular', name: 'Particular', color: 'border-blue-500', bgColor: 'bg-blue-500', textColor: 'text-white' },
    { id: 'Outros', name: 'Outros', color: 'border-gray-500', bgColor: 'bg-gray-500', textColor: 'text-white' },
];

interface PlatformSelectorProps {
    value: string;
    onChange: (platform: string) => void;
    label?: string;
}

const PlatformSelector: React.FC<PlatformSelectorProps> = ({ value, onChange, label = 'Plataforma' }) => {
    return (
        <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                {label}
            </label>
            <div className="flex flex-wrap gap-2">
                {PLATFORMS.map((platform) => {
                    const isSelected = value === platform.id;
                    return (
                        <button
                            key={platform.id}
                            type="button"
                            onClick={() => onChange(platform.id)}
                            className={`
                px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200
                ${isSelected
                                    ? `${platform.bgColor} ${platform.textColor} ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-800 ring-primary-500 shadow-lg scale-105`
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                }
              `}
                        >
                            {platform.name}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default PlatformSelector;
