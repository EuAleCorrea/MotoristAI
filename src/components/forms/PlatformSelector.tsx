import React from 'react';
import { Car } from 'lucide-react';

interface Platform {
    id: string;
    name: string;
    bgColor: string;
    icon: React.ReactNode;
}

// SVG icons for each platform
const UberIcon = () => (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="white">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c.55 0 1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V6c0-.55.45-1 1-1zm0 10c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" />
    </svg>
);

const PLATFORMS: Platform[] = [
    {
        id: 'Uber',
        name: 'Uber',
        bgColor: 'bg-black',
        icon: <span className="text-white font-bold text-lg">U</span>
    },
    {
        id: '99',
        name: '99',
        bgColor: 'bg-yellow-500',
        icon: <span className="text-black font-bold text-lg">99</span>
    },
    {
        id: 'inDrive',
        name: 'InDrive',
        bgColor: 'bg-green-500',
        icon: <span className="text-white font-bold text-lg">iD</span>
    },
    {
        id: 'iFood',
        name: 'iFood',
        bgColor: 'bg-red-500',
        icon: (
            <svg viewBox="0 0 24 24" className="w-6 h-6" fill="white">
                <circle cx="9" cy="10" r="1.5" />
                <circle cx="15" cy="10" r="1.5" />
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-6c-2.33 0-4.32 1.45-5.12 3.5h1.67c.69-1.19 1.97-2 3.45-2s2.75.81 3.45 2h1.67c-.8-2.05-2.79-3.5-5.12-3.5z" />
            </svg>
        )
    },
    {
        id: 'Rappi',
        name: 'Rappi',
        bgColor: 'bg-orange-500',
        icon: <span className="text-white font-bold text-xs">Rappi</span>
    },
    {
        id: 'Lalamove',
        name: 'Lalamove',
        bgColor: 'bg-orange-600',
        icon: (
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="white">
                <path d="M18 18.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5 1.5.67 1.5 1.5 1.5zM19.5 9.5l1.5 4v5h-2c0 1.1-.9 2-2 2s-2-.9-2-2H9c0 1.1-.9 2-2 2s-2-.9-2-2H3v-3.5h2V12H3V6c0-1.1.9-2 2-2h9v3.5h2.5l3 2.5zM6 18.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5 1.5.67 1.5 1.5 1.5zM15.5 9.5V7H5v6h10.5V9.5z" />
            </svg>
        )
    },
    {
        id: 'Particular',
        name: 'Particular',
        bgColor: 'bg-blue-500',
        icon: <Car className="w-5 h-5 text-white" />
    },
    {
        id: 'Outros',
        name: 'Outros',
        bgColor: 'bg-gray-500',
        icon: <span className="text-white font-bold text-lg">+</span>
    },
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
            {/* Horizontal scrollable container */}
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide -mx-2 px-2">
                {PLATFORMS.map((platform) => {
                    const isSelected = value === platform.id;
                    return (
                        <button
                            key={platform.id}
                            type="button"
                            onClick={() => onChange(platform.id)}
                            className="flex flex-col items-center gap-1.5 flex-shrink-0"
                        >
                            {/* Circle icon */}
                            <div
                                className={`
                  w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200
                  ${platform.bgColor}
                  ${isSelected
                                        ? 'ring-2 ring-offset-2 ring-offset-gray-900 ring-primary-400 scale-110'
                                        : 'opacity-70 hover:opacity-100'
                                    }
                `}
                            >
                                {platform.icon}
                            </div>
                            {/* Label */}
                            <span className={`text-xs font-medium transition-colors ${isSelected ? 'text-white' : 'text-gray-400'
                                }`}>
                                {platform.name}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default PlatformSelector;
