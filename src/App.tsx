import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/Login';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Entries from './pages/Entries';
import Expenses from './pages/Expenses';
import Goals from './pages/Goals';
import Settings from './pages/Settings';
import EntryFormPage from './pages/forms/EntryFormPage';
import ExpenseFormPage from './pages/forms/ExpenseFormPage';
import GoalFormPage from './pages/forms/GoalFormPage';
import VehiclesPage from './pages/settings/placeholders/VehiclesPage';
import DepreciationPage from './pages/forms/vehicle/DepreciationFormPage';
import MaintenanceAlertsPage from './pages/settings/placeholders/MaintenanceAlertsPage';
import OdometerPage from './pages/settings/placeholders/OdometerPage';
import PhotoNotePage from './pages/settings/placeholders/PhotoNotePage';
import PlatformsCategoriesPage from './pages/settings/PlatformsCategoriesPage';
import PreferencesPage from './pages/settings/placeholders/PreferencesPage';
import RecurrencesPage from './pages/settings/placeholders/RecurrencesPage';
import RecurringExpensesPage from './pages/settings/placeholders/RecurringExpensesPage';
import VehicleFinancePage from './pages/forms/vehicle/VehicleFinanceFormPage';
import ScrollToTop from './components/ScrollToTop';
import FAQ from './pages/FAQ';
import Support from './pages/Support';

// Páginas de Políticas
import PrivacyPolicy from './pages/policies/PrivacyPolicy';
import TermsOfUse from './pages/policies/TermsOfUse';
import LGPD from './pages/policies/LGPD';

// Novas páginas de formulário de despesas do veículo
import EnergyFuelFormPage from './pages/forms/vehicle/EnergyFuelFormPage';
import MaintenanceFormPage from './pages/forms/vehicle/MaintenanceFormPage';
import TollParkingFormPage from './pages/forms/vehicle/TollParkingFormPage';

// Novas páginas de formulário de despesas da família
import HousingFormPage from './pages/forms/family/HousingFormPage';
import FoodFormPage from './pages/forms/family/FoodFormPage';
import HealthFormPage from './pages/forms/family/HealthFormPage';
import EducationFormPage from './pages/forms/family/EducationFormPage';
import LeisureFormPage from './pages/forms/family/LeisureFormPage';
import OtherFormPage from './pages/forms/family/OtherFormPage';


function App() {
  return (
    <Router>
      <AuthProvider>
        <ScrollToTop />
        <Layout>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/entradas" element={<Entries />} />
            <Route path="/entradas/nova" element={<EntryFormPage />} />
            <Route path="/entradas/:id/editar" element={<EntryFormPage />} />
            <Route path="/despesas" element={<Expenses />} />
            <Route path="/despesas/nova" element={<ExpenseFormPage />} />
            <Route path="/despesas/:id/editar" element={<ExpenseFormPage />} />
            <Route path="/metas" element={<Goals />} />
            <Route path="/metas/nova" element={<GoalFormPage />} />
            <Route path="/metas/:id/editar" element={<GoalFormPage />} />
            <Route path="/ajustes" element={<Settings />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/suporte" element={<Support />} />

            {/* Rotas de Políticas */}
            <Route path="/politicas/privacidade" element={<PrivacyPolicy />} />
            <Route path="/politicas/termos" element={<TermsOfUse />} />
            <Route path="/politicas/lgpd" element={<LGPD />} />

            {/* Rotas de Despesas do Veículo */}
            <Route path="/despesas/veiculo/energia-combustivel" element={<EnergyFuelFormPage />} />
            <Route path="/despesas/veiculo/energia-combustivel/:id/editar" element={<EnergyFuelFormPage />} />
            <Route path="/despesas/veiculo/manutencao" element={<MaintenanceFormPage />} />
            <Route path="/despesas/veiculo/manutencao/:id/editar" element={<MaintenanceFormPage />} />
            <Route path="/despesas/veiculo/pedagio-estacionamento" element={<TollParkingFormPage />} />
            <Route path="/despesas/veiculo/pedagio-estacionamento/:id/editar" element={<TollParkingFormPage />} />
            <Route path="/despesas/veiculo/financeiro" element={<VehicleFinancePage />} />
            <Route path="/despesas/veiculo/financeiro/:id/editar" element={<VehicleFinancePage />} />
            <Route path="/despesas/veiculo/depreciacao" element={<DepreciationPage />} />
            <Route path="/despesas/veiculo/depreciacao/:id/editar" element={<DepreciationPage />} />

            {/* Rotas de Despesas da Família */}
            <Route path="/despesas/familia/moradia" element={<HousingFormPage />} />
            <Route path="/despesas/familia/moradia/:id/editar" element={<HousingFormPage />} />
            <Route path="/despesas/familia/alimentacao" element={<FoodFormPage />} />
            <Route path="/despesas/familia/alimentacao/:id/editar" element={<FoodFormPage />} />
            <Route path="/despesas/familia/saude" element={<HealthFormPage />} />
            <Route path="/despesas/familia/saude/:id/editar" element={<HealthFormPage />} />
            <Route path="/despesas/familia/educacao" element={<EducationFormPage />} />
            <Route path="/despesas/familia/educacao/:id/editar" element={<EducationFormPage />} />
            <Route path="/despesas/familia/lazer" element={<LeisureFormPage />} />
            <Route path="/despesas/familia/lazer/:id/editar" element={<LeisureFormPage />} />
            <Route path="/despesas/familia/outras" element={<OtherFormPage />} />
            <Route path="/despesas/familia/outras/:id/editar" element={<OtherFormPage />} />

            {/* Rotas de Cadastros e Lançamentos */}
            <Route path="/cadastros/veiculos" element={<VehiclesPage />} />
            <Route path="/lancamentos/odometro" element={<OdometerPage />} />
            <Route path="/lancamentos/nota" element={<PhotoNotePage />} />
            <Route path="/cadastros/plataformas" element={<PlatformsCategoriesPage />} />
            <Route path="/cadastros/recorrencias" element={<RecurrencesPage />} />
            <Route path="/cadastros/preferencias" element={<PreferencesPage />} />
            <Route path="/alertas/manutencao" element={<MaintenanceAlertsPage />} />
            <Route path="/alertas/despesas" element={<RecurringExpensesPage />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </Router >
  );
}

export default App;
