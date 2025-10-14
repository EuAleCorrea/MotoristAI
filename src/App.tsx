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
import DepreciationPage from './pages/settings/placeholders/DepreciationPage';
import MaintenanceAlertsPage from './pages/settings/placeholders/MaintenanceAlertsPage';
import OdometerPage from './pages/settings/placeholders/OdometerPage';
import PhotoNotePage from './pages/settings/placeholders/PhotoNotePage';
import PlatformsCategoriesPage from './pages/settings/placeholders/PlatformsCategoriesPage';
import PreferencesPage from './pages/settings/placeholders/PreferencesPage';
import RecurrencesPage from './pages/settings/placeholders/RecurrencesPage';
import RecurringExpensesPage from './pages/settings/placeholders/RecurringExpensesPage';
import VehicleFinancePage from './pages/settings/placeholders/VehicleFinancePage';


function App() {
  return (
    <Router>
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

          {/* Rotas de Ajustes */}
          <Route path="/cadastros/veiculos" element={<VehiclesPage />} />
          <Route path="/lancamentos/odometro" element={<OdometerPage />} />
          <Route path="/lancamentos/nota" element={<PhotoNotePage />} />
          <Route path="/despesas/veiculo/financeiro" element={<VehicleFinancePage />} />
          <Route path="/despesas/veiculo/depreciacao" element={<DepreciationPage />} />
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
