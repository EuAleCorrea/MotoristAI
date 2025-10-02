import { Home, Car, Fuel, Wrench, ShieldAlert, BarChart2, TrendingUp, Activity, Bell, MessageSquare, User, Settings } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

interface CollapsibleNavItem {
  label: string;
  icon: LucideIcon;
  subItems: NavItem[];
}

export const mainNavItems: NavItem[] = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/revenues', label: 'Receitas', icon: Car },
  { href: '/expenses', label: 'Despesas', icon: Fuel },
  { href: '/maintenances', label: 'Manutenções', icon: Wrench },
  { href: '/risk-zones', label: 'Zonas de Risco', icon: ShieldAlert },
  { href: '/summary', label: 'Resumo Financeiro', icon: BarChart2 },
];

export const secondaryNavItems: CollapsibleNavItem[] = [
  {
    label: 'Desempenho',
    icon: TrendingUp,
    subItems: [
      { href: '/performance/goals', label: 'Metas & Desempenho', icon: TrendingUp },
      { href: '/performance/indicators', label: 'Indicadores do Motorista', icon: Activity },
    ],
  },
  {
    label: 'Monitoramento',
    icon: Bell,
    subItems: [
      { href: '/monitoring/alerts', label: 'Alertas & Notificações', icon: Bell },
      { href: '/monitoring/feedback', label: 'Feedback Recebido', icon: MessageSquare },
    ],
  },
  {
    label: 'Conta',
    icon: User,
    subItems: [
      { href: '/account/profile', label: 'Perfil Motorista', icon: User },
      { href: '/account/vehicles', label: 'Veículos', icon: Car },
      { href: '/account/settings', label: 'Configurações', icon: Settings },
    ],
  },
];