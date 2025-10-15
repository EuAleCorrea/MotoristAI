import { useNavigate } from 'react-router-dom';
import SectionGrid from '../components/settings/SectionGrid';
import GlobalFilters from '../components/settings/GlobalFilters';
import { 
  Receipt, Fuel, Gauge, Camera, Wrench, ParkingCircle, Landmark, TrendingDown, Home, ShoppingCart, HeartPulse, GraduationCap, MoreHorizontal, PieChart, Layers3, FileText, Car, AppWindow, CalendarClock, Settings2, BellRing, Repeat, Drama
} from 'lucide-react';

const SettingsPage = () => {
  const navigate = useNavigate();

  const sections = [
    {
      title: 'Lançamentos Rápidos',
      items: [
        { title: 'Nova Despesa', icon: Receipt, onClick: () => navigate('/despesas/nova') },
        { title: 'Abastecer/Recargar', icon: Fuel, onClick: () => navigate('/despesas/veiculo/energia-combustivel') },
        { title: 'Km do Odômetro', icon: Gauge, onClick: () => navigate('/lancamentos/odometro'), disabled: true },
        { title: 'Foto da Nota', icon: Camera, onClick: () => navigate('/lancamentos/nota'), disabled: true },
      ],
    },
    {
      title: 'Despesas do Veículo',
      items: [
        { title: 'Energia / Combustível', icon: Fuel, onClick: () => navigate('/despesas/veiculo/energia-combustivel') },
        { title: 'Manutenção', icon: Wrench, onClick: () => navigate('/despesas/veiculo/manutencao') },
        { title: 'Pedágio / Estacionamento', icon: ParkingCircle, onClick: () => navigate('/despesas/veiculo/pedagio-estacionamento') },
        { title: 'Financeiro do Veículo', icon: Landmark, onClick: () => navigate('/despesas/veiculo/financeiro') },
        { title: 'Depreciação', icon: TrendingDown, onClick: () => navigate('/despesas/veiculo/depreciacao') },
      ],
    },
    {
      title: 'Despesas da Família',
      items: [
        { title: 'Moradia', icon: Home, onClick: () => navigate('/despesas/familia/moradia') },
        { title: 'Alimentação', icon: ShoppingCart, onClick: () => navigate('/despesas/familia/alimentacao') },
        { title: 'Saúde', icon: HeartPulse, onClick: () => navigate('/despesas/familia/saude') },
        { title: 'Educação', icon: GraduationCap, onClick: () => navigate('/despesas/familia/educacao') },
        { title: 'Lazer', icon: Drama, onClick: () => navigate('/despesas/familia/lazer') },
        { title: 'Outras', icon: MoreHorizontal, onClick: () => navigate('/despesas/familia/outras') },
      ],
    },
    {
      title: 'Relatórios de Custos',
      items: [
        { title: 'Custos por Categoria', icon: PieChart, onClick: () => navigate('/relatorios?view=category'), disabled: true },
        { title: 'Custo por Km e Energia', icon: Gauge, onClick: () => navigate('/relatorios?view=km_energy'), disabled: true },
        { title: 'Plataformas e Categorias', icon: Layers3, onClick: () => navigate('/relatorios?view=platforms'), disabled: true },
        { title: 'Resumo Mensal', icon: FileText, onClick: () => navigate('/relatorios?view=monthly'), disabled: true },
      ],
    },
    {
      title: 'Cadastros e Parâmetros',
      items: [
        { title: 'Veículos', icon: Car, onClick: () => navigate('/cadastros/veiculos') },
        { title: 'Plataformas e Categorias', icon: AppWindow, onClick: () => navigate('/cadastros/plataformas'), disabled: true },
        { title: 'Recorrências e Parcelas', icon: CalendarClock, onClick: () => navigate('/cadastros/recorrencias'), disabled: true },
        { title: 'Preferências', icon: Settings2, onClick: () => navigate('/cadastros/preferencias'), disabled: true },
      ],
    },
    {
      title: 'Alertas e Automação',
      items: [
        { title: 'Manutenção por km', icon: Wrench, onClick: () => navigate('/alertas/manutencao'), disabled: true },
        { title: 'Despesas recorrentes', icon: Repeat, onClick: () => navigate('/alertas/despesas'), disabled: true },
      ],
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Ajustes</h1>
        <div className="mt-4 sm:mt-0">
            <GlobalFilters />
        </div>
      </div>
      {sections.map((section) => (
        <SectionGrid key={section.title} title={section.title} items={section.items} />
      ))}
    </div>
  );
};

export default SettingsPage;
