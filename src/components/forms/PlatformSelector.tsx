import React from 'react';
import { Car } from 'lucide-react';

interface Platform {
    id: string;
    name: string;
    bgColor: string;
    icon: React.ReactNode;
}

const PLATFORMS: Platform[] = [
    {
        id: 'Uber',
        name: 'Uber',
        bgColor: 'bg-black',
        icon: (
            <svg viewBox="0 0 24 24" className="w-8 h-8" fill="white">
                <path d="M12,2 C6.48,2 2,6.48 2,12 C2,17.52 6.48,22 12,22 C17.52,22 22,17.52 22,12 C22,6.48 17.52,2 12,2 Z M15.5,8 L13.5,8 C13.5,7.5 12.8,7.2 12,7.2 C11.2,7.2 10.5,7.6 10.5,8.2 L10.5,12 L11.2,12 C12.8,12 13.5,12.8 13.5,13.8 C13.5,15.2 12.5,16.5 10.8,16.5 L10.5,16.5 C9,16.5 8.2,15.5 8.2,14.5 L10,14.5 C10,14.8 10.2,15.2 10.8,15.2 C11.2,15.2 11.5,14.8 11.5,14.2 L11.5,13.5 L10.5,13.5 C9.2,13.5 8.2,12.5 8.2,11.2 L8.2,8.5 C8.2,7 9.5,5.8 11.5,5.8 C12.8,5.8 13.8,6.5 14.2,7.5 L15.5,8 Z" />
            </svg>
        )
    },
    {
        id: '99',
        name: '99',
        bgColor: 'bg-yellow-400',
        icon: <span className="text-black font-extrabold text-xl font-sans tracking-tighter">99</span>
    },
    {
        id: 'inDrive',
        name: 'InDrive',
        bgColor: 'bg-[#bceb42]', // Lime green from mockup
        icon: <span className="text-black font-bold text-2xl tracking-tighter">iD</span>
    },
    {
        id: 'iFood',
        name: 'iFood',
        bgColor: 'bg-[#ea1d2c]',
        icon: (
            <svg viewBox="0 0 24 24" className="w-7 h-7" fill="white">
                <path d="M12.91,6.57c0.7-1.16,2.18-1.54,3.34-0.85c1.16,0.7,1.54,2.18,0.85,3.34c-0.23,0.38-0.54,0.68-0.9,0.88v0.01 c-0.03,0.01-0.05,0.03-0.08,0.04c-0.12,0.65-0.34,1.27-0.64,1.86c0.55,0.18,0.96,0.68,0.96,1.28c0,0.75-0.6,1.35-1.35,1.35 s-1.35-0.6-1.35-1.35c0-0.45,0.22-0.84,0.56-1.1c-0.42-0.88-0.65-1.85-0.65-2.88c0-0.06,0-0.12,0.01-0.18 C12.44,8.44,12.38,7.46,12.91,6.57z" />
                <path d="M7.75,9.06c-1.16-0.7-1.54-2.18-0.85-3.34c0.7-1.16,2.18-1.54,3.34-0.85c0.88,0.53,1.3,1.53,1.11,2.44 c0.01,0.06,0.01,0.12,0.01,0.18c0,1.02-0.23,2-0.65,2.88c0.34,0.26,0.56,0.65,0.56,1.1c0,0.75-0.6,1.35-1.35,1.35 c-0.75,0-1.35-0.6-1.35-1.35c0-0.6,0.41-1.1,0.96-1.28c-0.3-0.59-0.52-1.21-0.64-1.86c-0.02-0.01-0.05-0.03-0.08-0.04v-0.01 C8.45,9.88,8.08,9.54,7.75,9.06z" />
                <path d="M12,12.5c-3.03,0-5.5,2.47-5.5,5.5S8.97,23.5,12,23.5s5.5-2.47,5.5-5.5S15.03,12.5,12,12.5z M10.5,17 c-0.55,0-1-0.45-1-1s0.45-1,1-1s1,0.45,1,1S11.05,17,10.5,17z M14.5,17c-0.55,0-1-0.45-1-1s0.45-1,1-1s1,0.45,1,1 S15.05,17,14.5,17z" />
            </svg>
        )
    },
    {
        id: 'Rappi',
        name: 'Rappi',
        bgColor: 'bg-[#ff441f]',
        icon: (
            <div className="flex flex-col items-center justify-center -mt-1">
                <span className="text-white font-bold text-[10px] leading-tight">Rappi</span>
                <svg viewBox="0 0 100 40" className="w-8 h-3 text-white fill-current">
                    <path d="M10,15 Q30,35 50,15 Q70,-5 90,15" stroke="white" strokeWidth="8" fill="none" strokeLinecap="round" />
                </svg>
            </div>
        )
    },
    {
        id: 'Lalamove',
        name: 'Lalamove',
        bgColor: 'bg-[#ea5900]',
        icon: (
            <svg viewBox="0 0 24 24" className="w-6 h-6" fill="white">
                <path d="M19 13v-2c0-.55-.45-1-1-1h-1V8c0-.55-.45-1-1-1H5c-.55 0-1 .45-1 1v8c0 .55.45 1 1 1h1c0 1.1.9 2 2 2s2-.9 2-2h4c0 1.1.9 2 2 2s2-.9 2-2h1v-4h-1zm-11 4c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm8 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" />
            </svg>
        )
    },
    {
        id: 'Particular',
        name: 'Particular',
        bgColor: 'bg-slate-600',
        icon: (
            <div className="relative">
                <Car className="w-6 h-6 text-white" />
                <div className="absolute -bottom-1 -right-2 bg-white rounded-full w-4 h-4 flex items-center justify-center border-2 border-slate-600">
                    <span className="text-[8px] font-bold text-slate-800">$</span>
                </div>
            </div>
        )
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
            {/* Horizontal scrollable container - hidden scrollbar for mobile experience */}
            <div
                className="flex gap-4 overflow-x-auto pb-2 -mx-2 px-2"
                style={{
                    scrollbarWidth: 'none', /* Firefox */
                    msOverflowStyle: 'none', /* IE/Edge */
                    WebkitOverflowScrolling: 'touch', /* Smooth scrolling on iOS */
                }}
            >
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
