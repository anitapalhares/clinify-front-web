import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

// Páginas de Autenticação e Partilhadas
import Login from './pages/auth/Login';
import Perfil from './pages/shared/Perfil';

// Páginas do Estudante
import StudentDashboard from './pages/student/Dashboard';
import Estudos from './pages/student/Estudos';
import Desempenho from './pages/student/Desempenho';
import ConteudoAula from './pages/student/ConteudoAula';
import HomeEstudante from './pages/student/HomeEstudante';

// Páginas do Professor
import ProfessorDashboard from './pages/professor/Dashboard';
import Salas from './pages/professor/Salas';
import Turmas from './pages/professor/Turmas';
import EstudoProfessor from './pages/professor/EstudoProfessor';
import DesempenhoProfessor from './pages/professor/DesempenhoProfessor';

// Páginas do Administrador
import Professores from './pages/admin/Professores';
import AdminDashboard from './pages/admin/Dashboard';


export default function App() {
  return (
    <Routes>

      <Route path="/login" element={<Login />} />

      <Route path="/perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />

      {/* Rotas Estudante */}
      <Route path="/estudante/inicio" element={<ProtectedRoute allowedRoles={['estudante']}><HomeEstudante /></ProtectedRoute>} />
      <Route path="/estudante" element={<ProtectedRoute allowedRoles={['estudante']}><StudentDashboard /></ProtectedRoute>} />
      <Route path="/estudante/estudos" element={<ProtectedRoute allowedRoles={['estudante']}><Estudos /></ProtectedRoute>} />
      <Route path="/estudante/desempenho" element={<ProtectedRoute allowedRoles={['estudante']}><Desempenho /></ProtectedRoute>} />
      <Route path="/estudante/conteudo" element={<ProtectedRoute allowedRoles={['estudante']}><ConteudoAula /></ProtectedRoute>} />

      {/* Rotas Professor */}
      <Route path="/professor" element={<ProtectedRoute allowedRoles={['professor']}><ProfessorDashboard /></ProtectedRoute>} />
      <Route path="/professor/turmas" element={<ProtectedRoute allowedRoles={['professor']}><Turmas /></ProtectedRoute>} />
      <Route path="/professor/estudo" element={<ProtectedRoute allowedRoles={['professor']}><EstudoProfessor /></ProtectedRoute>} />
      <Route path="/professor/desempenho" element={<ProtectedRoute allowedRoles={['professor']}><DesempenhoProfessor /></ProtectedRoute>} />
      <Route path="/professor/salas" element={<ProtectedRoute allowedRoles={['professor']}><Salas /></ProtectedRoute>} />

      {/* Rotas Administrador */}
      <Route path="/admin" element={<ProtectedRoute allowedRoles={['administrador']}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/professores" element={<ProtectedRoute allowedRoles={['administrador']}><Professores /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}