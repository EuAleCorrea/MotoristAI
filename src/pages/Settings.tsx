import { useNavigate } from 'react-router-dom';
import SectionGrid from '../components/settings/SectionGrid';
import GlobalFilters from '../components/settings/GlobalFilters';
import { 
  Receipt, Fuel, Gauge, Camera, Wrench, ParkingCircle, Landmark, TrendingDown, Home, ShoppingBasket, HeartPulse, GraduationCap, MoreHorizontal, PieChart, Layers3, FileText, Car, AppWindow, CalendarClock, Settings2, BellRing, Repeat, Clock
} from 'lucide-react';

const SettingsPage = () => {
  const navigate = useNavigate();

  const sections = [
    {
      title: 'Lançamentos Rápidos',
      items: [
        { title: 'Nova Despesa', icon: Receipt, onClick: () => navigate('/despesas/nova') },
        { title: 'Abastecer/Recargar', icon: Fuel, onClick: () => navigate('/despesas/nova', { state: { category: 'Combustível' } }) },
        { title: 'Km do Odômetro', icon: Gauge, onClick: () => navigate('/lancamentos/odometro') },
        { title: 'Foto da Nota', icon: Camera, onClick: () => navigate('/lancamentos/nota') },
      ],
    },
    {
      title: 'Despesas do Veículo',
      items: [
        { title: 'Energia/Combustível', icon: Fuel, onClick: () => navigate('/despesas?category=Combustível') },
        { title: 'Manutenção', icon: Wrench, onClick: () => navigate('/despesas?category=Manutenção') },
        { title: 'Pedágio/Estacionamento', icon: ParkingCircle, onClick: () => navigate('/despesas?category=Pedágio/Estacionamento') },
        { title: 'Financeiro do Veículo', icon: Landmark, onClick: () => navigate('/despesas/veiculo/financeiro') },
        { title: 'Depreciação', icon: TrendingDown, onClick: () => navigate('/despesas/veiculo/depreciacao') },
      ],
    },
    {
      title: 'Despesas da Família',
      items: [
        { title: 'Moradia', icon: Home, onClick: () => navigate('/despesas?category=Moradia') },
        { title: 'Alimentação', icon: ShoppingBasket, onClick: () => navigate('/despesas?category=Alimentação') },
        { title: 'Saúde', icon: HeartPulse, onClick: () => navigate('/despesas?category=Saúde') },
        { title: 'Educação', icon: GraduationCap, onClick: () => navigate('/despesas?category=Educação') },
        { title: 'Outras', icon: MoreHorizontal, onClick: () => navigate('/despesas?category=Outros') },
      ],
    },
    {
      title: 'Relatórios de Custos',
      items: [
        { title: 'Custos por Categoria', icon: PieChart, onClick: () => navigate('/relatorios?view=category') },
        { title: 'Custo por Km e Energia', icon: Gauge, onClick: () => navigate('/relatorios?view=km_energy') },
        { title: 'Plataformas e Categorias', icon: Layers3, onClick: () => navigate('/relatorios?view=platforms') },
        { title: 'Resumo Mensal', icon: FileText, onClick: () => navigate('/relatorios?view=monthly') },
      ],
    },
    {
      title: 'Cadastros e Parâmetros',
      items: [
        { title: 'Veículos', icon: Car, onClick: () => navigate('/cadastros/veiculos') },
        { title: 'Plataformas e Categorias', icon: AppWindow, onClick: () => navigate('/cadastros/plataformas') },
        { title: 'Recorrências e Parcelas', icon: CalendarClock, onClick: () => navigate('/cadastros/recorrencias') },
        { title: 'Preferências', icon: Settings2, onClick: () => navigate('/cadastros/preferencias') },
      ],
    },
    {
      title: 'Alertas e Automação',
      items: [
        { title: 'Manutenção por km', icon: Wrench, onClick: () => navigate('/alertas/manutencao') },
        { title: 'Despesas recorrentes', icon: Repeat, onClick: () => navigate('/alertas/despesas') },
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
