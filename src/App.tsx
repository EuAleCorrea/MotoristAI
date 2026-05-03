import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
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
import VehiclesPage from './pages/settings/VehiclesPage';
import DepreciationPage from './pages/forms/vehicle/DepreciationFormPage';
import MaintenanceAlertsPage from './pages/settings/MaintenanceAlertsPage';
import OdometerPage from './pages/settings/OdometerPage';
import PhotoNotePage from './pages/settings/PhotoNotePage';
import PlatformsCategoriesPage from './pages/settings/PlatformsCategoriesPage';
import PreferencesPage from './pages/settings/PreferencesPage';
import RecurrencesPage from './pages/settings/RecurrencesPage';
import RecurringExpensesPage from './pages/settings/RecurringExpensesPage';
import VehicleFinancePage from './pages/forms/vehicle/VehicleFinanceFormPage';
import ScrollToTop from './components/ScrollToTop';
import FAQ from './pages/FAQ';
import Support from './pages/Support';
import Reports from './pages/Reports';
import IncomeReportPage from './pages/IncomeReportPage';

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

// ═══════════════════════════════════════════════
// SPRINT 1 — NOVAS IMPORTAÇÕES
// ═══════════════════════════════════════════════
import Trips from './pages/Trips';
import TripFormPage from './pages/forms/TripFormPage';
import VehicleExpensesList from './pages/VehicleExpensesList';
import FamilyExpensesList from './pages/FamilyExpensesList';
import AIAssistant from './pages/AI';
import NewExpenseChoice from './pages/NewExpenseChoice';


function App() {
 return (
 <Router>
 <AuthProvider>
 <ScrollToTop />
  <Routes>
  <Route path="/" element={<Login />} />
  <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
  <Route path="/entradas" element={<ProtectedRoute><Layout><Entries /></Layout></ProtectedRoute>} />
  <Route path="/entradas/nova" element={<ProtectedRoute><Layout><EntryFormPage /></Layout></ProtectedRoute>} />
  <Route path="/entradas/:id/editar" element={<ProtectedRoute><Layout><EntryFormPage /></Layout></ProtectedRoute>} />
  <Route path="/despesas" element={<ProtectedRoute><Layout><Expenses /></Layout></ProtectedRoute>} />
  <Route path="/despesas/nova" element={<ProtectedRoute><Layout><NewExpenseChoice /></Layout></ProtectedRoute>} />
  <Route path="/despesas/:id/editar" element={<ProtectedRoute><Layout><ExpenseFormPage /></Layout></ProtectedRoute>} />
  <Route path="/metas" element={<ProtectedRoute><Layout><Goals /></Layout></ProtectedRoute>} />
  <Route path="/metas/nova" element={<ProtectedRoute><Layout><GoalFormPage /></Layout></ProtectedRoute>} />
  <Route path="/metas/:id/editar" element={<ProtectedRoute><Layout><GoalFormPage /></Layout></ProtectedRoute>} />
  <Route path="/ajustes" element={<ProtectedRoute><Layout><Settings /></Layout></ProtectedRoute>} />
  <Route path="/faq" element={<ProtectedRoute><Layout><FAQ /></Layout></ProtectedRoute>} />
  <Route path="/suporte" element={<ProtectedRoute><Layout><Support /></Layout></ProtectedRoute>} />
  <Route path="/relatorios" element={<ProtectedRoute><Layout><Reports /></Layout></ProtectedRoute>} />
  <Route path="/relatorios/comprovante-renda" element={<ProtectedRoute><Layout><IncomeReportPage /></Layout></ProtectedRoute>} />

  {/* ═══ SPRINT 1: Trips (Corridas) ═══ */}
  <Route path="/corridas" element={<ProtectedRoute><Layout><Trips /></Layout></ProtectedRoute>} />
  <Route path="/corridas/nova" element={<ProtectedRoute><Layout><TripFormPage /></Layout></ProtectedRoute>} />
  <Route path="/corridas/:id/editar" element={<ProtectedRoute><Layout><TripFormPage /></Layout></ProtectedRoute>} />

  {/* ═══ SPRINT 1: Listagem de Despesas Veiculares ═══ */}
  <Route path="/despesas/veiculo" element={<ProtectedRoute><Layout><VehicleExpensesList /></Layout></ProtectedRoute>} />

  {/* ═══ SPRINT 1: Listagem de Despesas Familiares ═══ */}
  <Route path="/despesas/familia" element={<ProtectedRoute><Layout><FamilyExpensesList /></Layout></ProtectedRoute>} />

  {/* ═══ SPRINT 1: Assistente IA (substitui placeholder) ═══ */}
  <Route path="/ai" element={<ProtectedRoute><Layout><AIAssistant /></Layout></ProtectedRoute>} />

  {/* Rotas de Políticas (públicas) */}
  <Route path="/politicas/privacidade" element={<PrivacyPolicy />} />
  <Route path="/politicas/termos" element={<TermsOfUse />} />
  <Route path="/politicas/lgpd" element={<LGPD />} />

  {/* Rotas de Despesas do Veículo */}
  <Route path="/despesas/veiculo/energia-combustivel" element={<ProtectedRoute><Layout><EnergyFuelFormPage /></Layout></ProtectedRoute>} />
  <Route path="/despesas/veiculo/energia-combustivel/:id/editar" element={<ProtectedRoute><Layout><EnergyFuelFormPage /></Layout></ProtectedRoute>} />
  <Route path="/despesas/veiculo/manutencao" element={<ProtectedRoute><Layout><MaintenanceFormPage /></Layout></ProtectedRoute>} />
  <Route path="/despesas/veiculo/manutencao/:id/editar" element={<ProtectedRoute><Layout><MaintenanceFormPage /></Layout></ProtectedRoute>} />
  <Route path="/despesas/veiculo/pedagio-estacionamento" element={<ProtectedRoute><Layout><TollParkingFormPage /></Layout></ProtectedRoute>} />
  <Route path="/despesas/veiculo/pedagio-estacionamento/:id/editar" element={<ProtectedRoute><Layout><TollParkingFormPage /></Layout></ProtectedRoute>} />
  <Route path="/despesas/veiculo/financeiro" element={<ProtectedRoute><Layout><VehicleFinancePage /></Layout></ProtectedRoute>} />
  <Route path="/despesas/veiculo/financeiro/:id/editar" element={<ProtectedRoute><Layout><VehicleFinancePage /></Layout></ProtectedRoute>} />
  <Route path="/despesas/veiculo/depreciacao" element={<ProtectedRoute><Layout><DepreciationPage /></Layout></ProtectedRoute>} />
  <Route path="/despesas/veiculo/depreciacao/:id/editar" element={<ProtectedRoute><Layout><DepreciationPage /></Layout></ProtectedRoute>} />

  {/* Rotas de Despesas da Família */}
  <Route path="/despesas/familia/moradia" element={<ProtectedRoute><Layout><HousingFormPage /></Layout></ProtectedRoute>} />
  <Route path="/despesas/familia/moradia/:id/editar" element={<ProtectedRoute><Layout><HousingFormPage /></Layout></ProtectedRoute>} />
  <Route path="/despesas/familia/alimentacao" element={<ProtectedRoute><Layout><FoodFormPage /></Layout></ProtectedRoute>} />
  <Route path="/despesas/familia/alimentacao/:id/editar" element={<ProtectedRoute><Layout><FoodFormPage /></Layout></ProtectedRoute>} />
  <Route path="/despesas/familia/saude" element={<ProtectedRoute><Layout><HealthFormPage /></Layout></ProtectedRoute>} />
  <Route path="/despesas/familia/saude/:id/editar" element={<ProtectedRoute><Layout><HealthFormPage /></Layout></ProtectedRoute>} />
  <Route path="/despesas/familia/educacao" element={<ProtectedRoute><Layout><EducationFormPage /></Layout></ProtectedRoute>} />
  <Route path="/despesas/familia/educacao/:id/editar" element={<ProtectedRoute><Layout><EducationFormPage /></Layout></ProtectedRoute>} />
  <Route path="/despesas/familia/lazer" element={<ProtectedRoute><Layout><LeisureFormPage /></Layout></ProtectedRoute>} />
  <Route path="/despesas/familia/lazer/:id/editar" element={<ProtectedRoute><Layout><LeisureFormPage /></Layout></ProtectedRoute>} />
  <Route path="/despesas/familia/outras" element={<ProtectedRoute><Layout><OtherFormPage /></Layout></ProtectedRoute>} />
  <Route path="/despesas/familia/outras/:id/editar" element={<ProtectedRoute><Layout><OtherFormPage /></Layout></ProtectedRoute>} />

  {/* Rotas de Cadastros e Lançamentos */}
  <Route path="/cadastros/veiculos" element={<ProtectedRoute><Layout><VehiclesPage /></Layout></ProtectedRoute>} />
  <Route path="/lancamentos/odometro" element={<ProtectedRoute><Layout><OdometerPage /></Layout></ProtectedRoute>} />
  <Route path="/lancamentos/nota" element={<ProtectedRoute><Layout><PhotoNotePage /></Layout></ProtectedRoute>} />
  <Route path="/cadastros/plataformas" element={<ProtectedRoute><Layout><PlatformsCategoriesPage /></Layout></ProtectedRoute>} />
  <Route path="/cadastros/recorrencias" element={<ProtectedRoute><Layout><RecurrencesPage /></Layout></ProtectedRoute>} />
  <Route path="/cadastros/preferencias" element={<ProtectedRoute><Layout><PreferencesPage /></Layout></ProtectedRoute>} />
  <Route path="/alertas/manutencao" element={<ProtectedRoute><Layout><MaintenanceAlertsPage /></Layout></ProtectedRoute>} />
  <Route path="/alertas/despesas" element={<ProtectedRoute><Layout><RecurringExpensesPage /></Layout></ProtectedRoute>} />
  </Routes>
 </AuthProvider>
 </Router >
 );
}

export default App;
