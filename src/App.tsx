import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Trips from './pages/Trips';
import Expenses from './pages/Expenses';
import Goals from './pages/Goals';
import Settings from './pages/Settings';
import TripFormPage from './pages/forms/TripFormPage';
import ExpenseFormPage from './pages/forms/ExpenseFormPage';
import GoalFormPage from './pages/forms/GoalFormPage';
import VehiclesPage from './pages/settings/placeholders/VehiclesPage';
import DepreciationPage from './pages/forms/vehicle/DepreciationFormPage';
import MaintenanceAlertsPage from './pages/settings/placeholders/MaintenanceAlertsPage';
import OdometerPage from './pages/settings/placeholders/OdometerPage';
import PhotoNotePage from './pages/settings/placeholders/PhotoNotePage';
import PlatformsCategoriesPage from './pages/settings/placeholders/PlatformsCategoriesPage';
import PreferencesPage from './pages/settings/placeholders/PreferencesPage';
import RecurrencesPage from './pages/settings/placeholders/RecurrencesPage';
import RecurringExpensesPage from './pages/settings/placeholders/RecurringExpensesPage';
import VehicleFinancePage from './pages/forms/vehicle/VehicleFinanceFormPage';
import ScrollToTop from './components/ScrollToTop';

// Novas páginas de formulário de despesas do veículo
import EnergyFuelFormPage from './pages/forms/vehicle/EnergyFuelFormPage';
import MaintenanceFormPage from './pages/forms/vehicle/MaintenanceFormPage';
import TollParkingFormPage from './pages/forms/vehicle/TollParkingFormPage';


function App() {
  return (
    <Router>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/corridas" element={<Trips />} />
          <Route path="/corridas/nova" element={<TripFormPage />} />
          <Route path="/corridas/:id/editar" element={<TripFormPage />} />
          <Route path="/despesas" element={<Expenses />} />
          <Route path="/despesas/nova" element={<ExpenseFormPage />} />
          <Route path="/despesas/:id/editar" element={<ExpenseFormPage />} />
          <Route path="/metas" element={<Goals />} />
          <Route path="/metas/nova" element={<GoalFormPage />} />
          <Route path="/metas/:id/editar" element={<GoalFormPage />} />
          <Route path="/ajustes" element={<Settings />} />

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
    </Router>
  );
}

export default App;
