import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';

import Login from './pages/auth/Login';
import StudentDashboard from './pages/student/Dashboard';
import ProfessorDashboard from './pages/professor/Dashboard';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rota Pública */}
          <Route path="/login" element={<Login />} />

          {/* Rota Privada - Estudante */}
          <Route element={<ProtectedRoute allowedRole="estudante" />}>
            <Route path="/estudante" element={<StudentDashboard />} />
          </Route>

          {/* Rota Privada - Professor */}
          <Route element={<ProtectedRoute allowedRole="professor" />}>
            <Route path="/professor" element={<ProfessorDashboard />} />
          </Route>

          {/* Redirecionamento Padrão */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}