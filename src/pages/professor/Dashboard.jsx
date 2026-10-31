import { useAuth } from '../../context/AuthContext';

export default function ProfessorDashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <header className="border-b border-slate-800 bg-slate-900 px-6 py-4 flex justify-between items-center">
        <div>
          <span className="text-xs uppercase text-emerald-400 tracking-wider font-semibold">Hospital Moinhos de Vento</span>
          <h1 className="text-xl font-bold text-white">Clinify | Área do Docente</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-400">{user?.email}</span>
          <button
            onClick={logout}
            className="px-3 py-1.5 bg-slate-800 hover:bg-red-900/40 text-red-300 border border-slate-700 hover:border-red-700 text-xs font-medium rounded-lg transition-colors"
          >
            Sair
          </button>
        </div>
      </header>

      <main className="max-w-4xl w-full mx-auto p-6 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Gestão Acadêmica</h2>
          <p className="text-slate-400 text-sm mt-1">Acompanhamento de turmas e métricas de desempenho clínico.</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-white">Turma 1º Semestre - Medicina / Saúde</h3>
          <p className="text-slate-400 text-sm mt-2">Taxa média de acerto nas simulações: 82%</p>
        </div>
      </main>
    </div>
  );
}