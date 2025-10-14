import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Car, ArrowLeft } from 'lucide-react';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();

  const formTitles: { [key: string]: string } = {
    '/corridas/nova': 'Nova Corrida',
    '/despesas/nova': 'Nova Despesa',
    '/metas/nova': 'Nova Meta',
    '/cadastros/veiculos': 'Novo Veículo',
    [`/corridas/${params.id}/editar`]: 'Editar Corrida',
    [`/despesas/${params.id}/editar`]: 'Editar Despesa',
    [`/metas/${params.id}/editar`]: 'Editar Meta',
    // Novas despesas de veículo
    '/despesas/veiculo/energia-combustivel': 'Energia / Combustível',
    '/despesas/veiculo/manutencao': 'Manutenção',
    '/despesas/veiculo/pedagio-estacionamento': 'Pedágio / Estacionamento',
    '/despesas/veiculo/financeiro': 'Financeiro do Veículo',
    '/despesas/veiculo/depreciacao': 'Depreciação',
    [`/despesas/veiculo/energia-combustivel/${params.id}/editar`]: 'Editar Abastecimento',
    [`/despesas/veiculo/manutencao/${params.id}/editar`]: 'Editar Manutenção',
    [`/despesas/veiculo/pedagio-estacionamento/${params.id}/editar`]: 'Editar Pedágio/Estacionamento',
    [`/despesas/veiculo/financeiro/${params.id}/editar`]: 'Editar Financeiro',
    [`/despesas/veiculo/depreciacao/${params.id}/editar`]: 'Editar Depreciação',
  };

  const formTitle = formTitles[location.pathname];
  const isFormPage = !!formTitle;

  return (
    <header className="fixed top-0 left-0 right-0 z-30 bg-slate-50/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center h-16">
          {isFormPage ? (
            <div className="w-full flex items-center justify-center">
              <button onClick={() => navigate(-1)} className="absolute left-0 flex items-center text-gray-800">
                <ArrowLeft className="h-6 w-6" />
              </button>
              <h1 className="text-lg font-semibold text-gray-800">
                {formTitle}
              </h1>
            </div>
          ) : (
            <div className="flex items-center">
              <Car className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">MotoristAI</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
