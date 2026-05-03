import { useNavigate } from 'react-router-dom';
import SectionGrid from '../components/settings/SectionGrid';
import NotificationReminderSettings from '../components/NotificationReminderSettings';
import {
  Receipt, Fuel, Gauge, Camera, Wrench, ParkingCircle, Landmark, TrendingDown, Home, ShoppingCart, HeartPulse, GraduationCap, MoreHorizontal, PieChart, Layers3, FileText, Car, AppWindow, CalendarClock, Settings2, Repeat, Drama, Target, HelpCircle, MessageCircle, Shield, ScrollText, ShieldCheck
} from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import { useQuickLaunchStore } from '../store/quickLaunchStore';
import { iconMap } from '../utils/iconMap';

interface CardDefinition {
 id: string;
 title: string;
 icon: LucideIcon;
 iconName: keyof typeof iconMap;
 route: string;
 disabled?: boolean;
}

const SettingsPage = () => {
 const navigate = useNavigate();
 const { recentCards, addRecentCard } = useQuickLaunchStore();

 const handleCardClick = (card: CardDefinition) => {
 if (card.disabled) return;

 addRecentCard({
 id: card.id,
 title: card.title,
 iconName: card.iconName,
 route: card.route,
 });
 navigate(card.route);
 };

  const allSections: { title: string; items: CardDefinition[] }[] = [
 {
 title: 'Despesas do Veículo',
 items: [
 { id: 'Energia / Combustível', title: 'Energia / Combustível', icon: Fuel, iconName: 'Fuel', route: '/despesas/veiculo/energia-combustivel' },
 { id: 'Manutenção', title: 'Manutenção', icon: Wrench, iconName: 'Wrench', route: '/despesas/veiculo/manutencao' },
 { id: 'Pedágio / Estacionamento', title: 'Pedágio / Estacionamento', icon: ParkingCircle, iconName: 'ParkingCircle', route: '/despesas/veiculo/pedagio-estacionamento' },
 { id: 'Financeiro do Veículo', title: 'Financeiro do Veículo', icon: Landmark, iconName: 'Landmark', route: '/despesas/veiculo/financeiro' },
 { id: 'Depreciação', title: 'Depreciação', icon: TrendingDown, iconName: 'TrendingDown', route: '/despesas/veiculo/depreciacao' },
 { id: 'Todas as Despesas Veiculares', title: 'Todas as Despesas', icon: Receipt, iconName: 'Receipt', route: '/despesas/veiculo' },
 ],
 },
 {
 title: 'Despesas da Família',
 items: [
 { id: 'Moradia', title: 'Moradia', icon: Home, iconName: 'Home', route: '/despesas/familia/moradia' },
 { id: 'Alimentação', title: 'Alimentação', icon: ShoppingCart, iconName: 'ShoppingCart', route: '/despesas/familia/alimentacao' },
 { id: 'Saúde', title: 'Saúde', icon: HeartPulse, iconName: 'HeartPulse', route: '/despesas/familia/saude' },
 { id: 'Educação', title: 'Educação', icon: GraduationCap, iconName: 'GraduationCap', route: '/despesas/familia/educacao' },
 { id: 'Lazer', title: 'Lazer', icon: Drama, iconName: 'Drama', route: '/despesas/familia/lazer' },
 { id: 'Outras', title: 'Outras', icon: MoreHorizontal, iconName: 'MoreHorizontal', route: '/despesas/familia/outras' },
 { id: 'Todas as Despesas Familiares', title: 'Todas as Despesas', icon: Receipt, iconName: 'Receipt', route: '/despesas/familia' },
 ],
 },
 {
 title: 'Relatórios de Custos',
 items: [
 { id: 'Custos por Categoria', title: 'Custos por Categoria', icon: PieChart, iconName: 'PieChart', route: '/relatorios?view=category' },
 { id: 'Custo por Km e Energia', title: 'Custo por Km e Energia', icon: Gauge, iconName: 'Gauge', route: '/relatorios?view=km_energy' },
 { id: 'Plataformas e Categorias', title: 'Plataformas e Categorias', icon: Layers3, iconName: 'Layers3', route: '/relatorios?view=platforms' },
 { id: 'Resumo Mensal', title: 'Resumo Mensal', icon: FileText, iconName: 'FileText', route: '/relatorios?view=monthly' },
 ],
 },
 {
 title: 'Cadastros e Parâmetros',
 items: [
 { id: 'Veículos', title: 'Veículos', icon: Car, iconName: 'Car', route: '/cadastros/veiculos' },
 { id: 'Metas', title: 'Metas', icon: Target, iconName: 'Target', route: '/metas' },
 { id: 'Plataformas e Categorias', title: 'Plataformas e Categorias', icon: AppWindow, iconName: 'AppWindow', route: '/cadastros/plataformas' },
  { id: 'Recorrências e Parcelas', title: 'Recorrências e Parcelas', icon: CalendarClock, iconName: 'CalendarClock', route: '/cadastros/recorrencias' },
  { id: 'Preferências', title: 'Preferências', icon: Settings2, iconName: 'Settings2', route: '/cadastros/preferencias' },
 ],
 },
  {
  title: 'Alertas e Automação',
  items: [
  { id: 'Manutenção por km', title: 'Manutenção por km', icon: Wrench, iconName: 'Wrench', route: '/alertas/manutencao' },
  { id: 'Despesas recorrentes', title: 'Despesas recorrentes', icon: Repeat, iconName: 'Repeat', route: '/alertas/despesas' },
  ],
  },
 {
 title: 'Ajuda',
 items: [
 { id: 'FAQ', title: 'Perguntas Frequentes', icon: HelpCircle, iconName: 'HelpCircle', route: '/faq' },
 { id: 'Suporte', title: 'Falar com o Suporte', icon: MessageCircle, iconName: 'MessageCircle', route: '/suporte' },
 ],
 },
 {
 title: 'Políticas',
 items: [
 { id: 'Privacidade', title: 'Política de Privacidade', icon: Shield, iconName: 'Shield', route: '/politicas/privacidade' },
 { id: 'Termos', title: 'Termos de Uso', icon: ScrollText, iconName: 'ScrollText', route: '/politicas/termos' },
 { id: 'LGPD', title: 'LGPD', icon: ShieldCheck, iconName: 'ShieldCheck', route: '/politicas/lgpd' },
 ],
 },
 ];

 const quickLaunchItems = recentCards.map(card => ({
 ...card,
 icon: iconMap[card.iconName],
 onClick: () => handleCardClick(card as CardDefinition),
 }));

 return (
 <div className="space-y-8">
 <h1 className="text-ios-title1 font-bold text-[var(--ios-text)]" style={{ letterSpacing: '-0.5px' }}>Ajustes</h1>

 {quickLaunchItems.length > 0 && (
 <SectionGrid
 title="Lançamentos Rápidos"
 items={quickLaunchItems}
 />
 )}

  {/* Notificações push (lembrete para registrar corridas) */}
  <div className="space-y-2">
    <h2 className="text-xs font-semibold text-[var(--ios-text-secondary)] uppercase tracking-wider px-1">
      Lembretes
    </h2>
    <NotificationReminderSettings />
  </div>

  {allSections.map((section) => (
   <SectionGrid
     key={section.title}
     title={section.title}
     items={section.items
       .filter(item => !item.disabled)
       .map(item => ({
         ...item,
         onClick: () => handleCardClick(item)
       }))}
   />
 ))}
 </div>
 );
};

export default SettingsPage;
