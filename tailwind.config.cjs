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
                // iOS colors via CSS variables (auto-switch light/dark)
                ios: {
                    bg: 'var(--ios-bg)',
                    card: 'var(--ios-card)',
                    'card-secondary': 'var(--ios-card-secondary)',
                    text: 'var(--ios-text)',
                    'text-secondary': 'var(--ios-text-secondary)',
                    'text-tertiary': 'var(--ios-text-tertiary)',
                    separator: 'var(--ios-separator)',
                    fill: 'var(--ios-fill)',
                    accent: 'var(--ios-accent)',
                    tint: 'var(--ios-tint)',
                },
                // System colors (same in light/dark with slight shift)
                'sys-blue': 'var(--sys-blue)',
                'sys-green': 'var(--sys-green)',
                'sys-red': 'var(--sys-red)',
                'sys-orange': 'var(--sys-orange)',
                'sys-yellow': 'var(--sys-yellow)',
                'sys-purple': 'var(--sys-purple)',
                'sys-gray': 'var(--sys-gray)',
            },

            fontFamily: {
                sans: [
                    '-apple-system',
                    'BlinkMacSystemFont',
                    'SF Pro Display',
                    'SF Pro Text',
                    'Inter',
                    ...defaultTheme.fontFamily.sans,
                ],
            },

            fontSize: {
                'ios-large-title': ['34px', { lineHeight: '41px', fontWeight: '700', letterSpacing: '0.37px' }],
                'ios-title1': ['28px', { lineHeight: '34px', fontWeight: '700', letterSpacing: '0.36px' }],
                'ios-title2': ['22px', { lineHeight: '28px', fontWeight: '700', letterSpacing: '0.35px' }],
                'ios-title3': ['20px', { lineHeight: '25px', fontWeight: '600', letterSpacing: '0.38px' }],
                'ios-headline': ['17px', { lineHeight: '22px', fontWeight: '600', letterSpacing: '-0.41px' }],
                'ios-body': ['17px', { lineHeight: '22px', fontWeight: '400', letterSpacing: '-0.41px' }],
                'ios-callout': ['16px', { lineHeight: '21px', fontWeight: '400', letterSpacing: '-0.32px' }],
                'ios-subhead': ['15px', { lineHeight: '20px', fontWeight: '400', letterSpacing: '-0.24px' }],
                'ios-footnote': ['13px', { lineHeight: '18px', fontWeight: '400', letterSpacing: '-0.08px' }],
                'ios-caption1': ['12px', { lineHeight: '16px', fontWeight: '400' }],
                'ios-caption2': ['11px', { lineHeight: '13px', fontWeight: '400', letterSpacing: '0.07px' }],
                'ios-tab': ['10px', { lineHeight: '12px', fontWeight: '500' }],
            },

            borderRadius: {
                'ios': '10px',
                'ios-lg': '12px',
                'ios-xl': '16px',
                'ios-2xl': '22px',
                'ios-full': '9999px',
            },

            boxShadow: {
                'ios-card': '0 0.5px 0 0 rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.06)',
                'ios-elevated': '0 2px 8px rgba(0,0,0,0.08)',
                'ios-float': '0 4px 16px rgba(0,0,0,0.12)',
            },

            keyframes: {
                'sheet-up': {
                    '0%': { transform: 'translateY(100%)' },
                    '100%': { transform: 'translateY(0)' },
                },
                'fade-in': {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
            },
            animation: {
                'sheet-up': 'sheet-up 0.38s cubic-bezier(0.32, 0.72, 0, 1) forwards',
                'fade-in': 'fade-in 0.2s ease-out forwards',
            },
        },
    },
    plugins: [],
};
