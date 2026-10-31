import { useAuth } from '../../context/AuthContext';
import { useSimulation } from '../../hooks/useSimulation';

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const {
    loading,
    error,
    casoAtual,
    etapa,
    pontos,
    feedback,
    concluido,
    carregarCaso,
    responder,
    resetar,
  } = useSimulation();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Barra de Navegação Superior */}
      <header className="border-b border-slate-800 bg-slate-900 px-6 py-4 flex justify-between items-center">
        <div>
          <span className="text-xs uppercase text-emerald-400 tracking-wider font-semibold">
            Hospital Moinhos de Vento
          </span>
          <h1 className="text-xl font-bold text-white">Clinify | Área do Aluno</h1>
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

      {/* Conteúdo Principal */}
      <main className="max-w-4xl w-full mx-auto p-6 flex-1 flex flex-col justify-center">
        {/* Estado 1: Carregamento */}
        {loading && (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-emerald-500 border-t-transparent mb-4"></div>
            <p className="text-slate-400 text-sm">A carregar caso clínico e parâmetros...</p>
          </div>
        )}

        {/* Estado 2: Erro */}
        {error && !loading && (
          <div className="bg-red-950/60 border border-red-800 text-red-200 p-6 rounded-xl text-center space-y-4">
            <p className="font-semibold text-sm">{error}</p>
            <button
              onClick={() => carregarCaso('cardio-101')}
              className="px-4 py-2 bg-red-700 hover:bg-red-600 text-white rounded-lg text-xs font-semibold"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {/* Estado 3: Lista de Casos (Ausência de simulação ativa) */}
        {!casoAtual && !loading && !error && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white">Módulos de Formação Médica</h2>
              <p className="text-slate-400 text-sm mt-1">
                Selecione uma simulação clínica baseada em dados reais anonimizados.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl hover:border-emerald-500/50 transition-colors flex flex-col justify-between">
                <div>
                  <span className="text-xs bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded font-medium">
                    Cardiologia
                  </span>
                  <h3 className="text-lg font-semibold text-white mt-3">
                    Dor Torácica Aguda
                  </h3>
                  <p className="text-slate-400 text-sm mt-2">
                    Conduta diagnóstica e terapêutica inicial em sala de emergência.
                  </p>
                </div>
                <button
                  onClick={() => carregarCaso('cardio-101')}
                  className="mt-6 w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-lg transition-colors"
                >
                  Iniciar Simulação
                </button>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl opacity-50 flex flex-col justify-between">
                <div>
                  <span className="text-xs bg-slate-800 text-slate-400 border border-slate-700 px-2 py-0.5 rounded font-medium">
                    Neurologia (Em breve)
                  </span>
                  <h3 className="text-lg font-semibold text-white mt-3">
                    Acidente Vascular Cerebral
                  </h3>
                  <p className="text-slate-400 text-sm mt-2">
                    Protocolo de atendimento rápido para janela trombolítica.
                  </p>
                </div>
                <button
                  disabled
                  className="mt-6 w-full py-2.5 bg-slate-800 text-slate-500 text-sm font-semibold rounded-lg cursor-not-allowed"
                >
                  Módulo Bloqueado
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Estado 4: Simulação Ativa ou Concluída (Sucesso) */}
        {casoAtual && !loading && (
          <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-xl shadow-lg">
            {!concluido ? (
              <div className="space-y-6">
                <div className="border-b border-slate-800 pb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">
                      {casoAtual.area} • ID: {casoAtual.id}
                    </span>
                    <button
                      onClick={resetar}
                      className="text-xs text-slate-400 hover:text-white transition-colors"
                    >
                      Cancelar simulação
                    </button>
                  </div>
                  <h2 className="text-xl font-bold text-white mt-2">{casoAtual.titulo}</h2>
                  <p className="text-slate-400 text-xs mt-1">
                    <strong>Paciente:</strong> {casoAtual.paciente.nome}, {casoAtual.paciente.idade} anos. {casoAtual.paciente.historico}
                  </p>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-2 font-mono">
                    <span>Etapa {etapa + 1} de {casoAtual.perguntas.length}</span>
                    <span>Acertos: {pontos}</span>
                  </div>
                  <h3 className="text-base font-semibold text-white">
                    {casoAtual.perguntas[etapa].enunciado}
                  </h3>
                </div>

                <div className="space-y-3">
                  {casoAtual.perguntas[etapa].opcoes.map((opcao, index) => (
                    <button
                      key={index}
                      onClick={() => responder(index)}
                      disabled={!!feedback}
                      className="w-full text-left p-3.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-emerald-500 hover:bg-slate-800/40 text-slate-200 text-sm transition-colors disabled:opacity-50"
                    >
                      {opcao}
                    </button>
                  ))}
                </div>

                {feedback && (
                  <div className="p-4 bg-emerald-950/80 border border-emerald-700 text-emerald-200 text-xs rounded-lg animate-pulse">
                    {feedback}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-950 border border-emerald-600 text-emerald-400 text-2xl font-bold">
                  ✓
                </div>
                <h2 className="text-2xl font-bold text-white">Caso Clínico Finalizado</h2>
                <p className="text-slate-300 text-sm">
                  Desempenho: <strong className="text-emerald-400">{pontos}</strong> de {casoAtual.perguntas.length} condutas corretas.
                </p>
                <div className="pt-4">
                  <button
                    onClick={resetar}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg text-sm transition-colors"
                  >
                    Concluir e Voltar aos Módulos
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}