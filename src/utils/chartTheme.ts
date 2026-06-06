import { useEffect, useState } from 'react';

export interface ChartTheme {
  textColor: string;
  axisLineColor: string;
  splitLineColor: string;
  tooltipBg: string;
  tooltipBorder: string;
  pieBorderColor: string;
  legendTextColor: string;
}

function readVar(name: string, fallback: string): string {
  if (typeof window === 'undefined') return fallback;
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || fallback;
}

export function getChartTheme(): ChartTheme {
  const isDark = document.documentElement.classList.contains('dark');
  return {
    textColor: readVar('--ios-text', isDark ? '#FFFFFF' : '#000000'),
    axisLineColor: readVar('--ios-separator', isDark ? 'rgba(255,255,255,0.08)' : 'rgba(60,60,67,0.12)'),
    splitLineColor: readVar('--ios-separator', isDark ? 'rgba(255,255,255,0.08)' : 'rgba(60,60,67,0.12)'),
    tooltipBg: readVar('--ios-card', isDark ? '#1C2B3A' : '#FFFFFF'),
    tooltipBorder: readVar('--ios-separator', isDark ? 'rgba(255,255,255,0.08)' : 'rgba(60,60,67,0.12)'),
    pieBorderColor: readVar('--ios-card', isDark ? '#1C2B3A' : '#FFFFFF'),
    legendTextColor: readVar('--ios-text-secondary', isDark ? 'rgba(235,235,245,0.6)' : 'rgba(60,60,67,0.6)'),
  };
}

export function useChartTheme(): ChartTheme {
  const [theme, setTheme] = useState<ChartTheme>(() => getChartTheme());

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setTheme(getChartTheme());
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    return () => observer.disconnect();
  }, []);

  return theme;
}
