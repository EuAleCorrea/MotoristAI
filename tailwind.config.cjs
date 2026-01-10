const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: [
        './src/**/*.{js,jsx,ts,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                // Cores primárias do app (azul)
                primary: {
                    '50': '#eff6ff',
                    '100': '#dbeafe',
                    '200': '#bfdbfe',
                    '300': '#93c5fd',
                    '400': '#60a5fa',
                    '500': '#3b82f6',
                    '600': '#2563eb',
                    '700': '#1d4ed8',
                    '800': '#1e40af',
                    '900': '#1e3a8a',
                    '950': '#172554',
                },
                // Verde para faturamento/sucesso
                success: {
                    '50': '#f0fdf4',
                    '100': '#dcfce7',
                    '200': '#bbf7d0',
                    '300': '#86efac',
                    '400': '#4ade80',
                    '500': '#22c55e',
                    '600': '#16a34a',
                    '700': '#15803d',
                    '800': '#166534',
                    '900': '#14532d',
                },
                // Vermelho/rosa para despesas/perigo
                danger: {
                    '50': '#fef2f2',
                    '100': '#fee2e2',
                    '200': '#fecaca',
                    '300': '#fca5a5',
                    '400': '#f87171',
                    '500': '#ef4444',
                    '600': '#dc2626',
                    '700': '#b91c1c',
                    '800': '#991b1b',
                    '900': '#7f1d1d',
                },
                // Background do app
                app: {
                    'light': '#f8fafc',      // slate-50 - fundo claro
                    'dark': '#0f172a',       // slate-900 - fundo escuro (navy)
                    'card-light': '#ffffff',
                    'card-dark': '#1e293b',  // slate-800
                },
                // Textos
                text: {
                    'primary-light': '#0f172a',   // slate-900
                    'primary-dark': '#f8fafc',    // slate-50
                    'secondary-light': '#64748b', // slate-500
                    'secondary-dark': '#94a3b8',  // slate-400
                    'muted-light': '#94a3b8',     // slate-400
                    'muted-dark': '#64748b',      // slate-500
                },
            },
            fontFamily: {
                sans: ['Inter', ...defaultTheme.fontFamily.sans],
            },
            keyframes: {
                'slide-up': {
                    '0%': { transform: 'translateY(100%)' },
                    '100%': { transform: 'translateY(0)' },
                },
                'fade-in': {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
            },
            animation: {
                'slide-up': 'slide-up 0.3s ease-out forwards',
                'fade-in': 'fade-in 0.2s ease-out forwards',
            },
            boxShadow: {
                'card': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
                'card-hover': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
            },
        }
    },
    plugins: [],
};
