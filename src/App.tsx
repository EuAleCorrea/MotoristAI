import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Trips from './pages/Trips';
import Expenses from './pages/Expenses';
import Goals from './pages/Goals';
import TripFormPage from './pages/forms/TripFormPage';
import ExpenseFormPage from './pages/forms/ExpenseFormPage';
import GoalFormPage from './pages/forms/GoalFormPage';

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
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
