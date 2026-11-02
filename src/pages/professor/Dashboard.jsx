import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../../components/MainLayout';
import { useClasses } from '../../hooks/useClasses';
import { useRooms } from '../../hooks/useRooms';

const ATIVIDADES_PADRAO = [
  { id: 'at-1', aluno: 'Ana Costa', acao: 'Concluiu simulação em Cardiologia (92 pts)', quando: 'Há 2 horas' },
  { id: 'at-2', aluno: 'Bruno Lima', acao: 'Iniciou estudo do módulo de Pneumologia', quando: 'Há 4 horas' },
  { id: 'at-3', aluno: 'Luiza Nunes', acao: 'Finalizou caso clínico de Neurologia', quando: 'Ontem' },
  { id: 'at-4', aluno: 'Sofia Prado', acao: 'Respondeu questões de fixação em Anatomia', quando: 'Há 2 dias' }
];

export default function ProfessorDashboard() {
  const { turmas, alunos, loading, error, simularErro, limparErro } = useClasses();
  const { salas } = useRooms();

  useEffect(() => {
    document.body.className = 'pagina-painel';
    return () => {
      document.body.className = '';
    };
  }, []);

  const totalTurmas = turmas.length;
  const totalAlunos = turmas.reduce((acc, t) => acc + (t.alunosCount || 0), 0) || alunos.length;
  const totalSimulacoes = salas.length;

  // Extrai tentativas reais registradas nas salas para exibir no topo da tabela de atividade recente
  const tentativasReais = salas.flatMap((sala) =>
    (sala.tentativas || []).map((t) => ({
      id: t.id,
      aluno: t.aluno,
      acao:
        t.estado === 'concluída'
          ? `Concluiu a sala "${sala.nome}" (${t.pontos ?? 0} pts)`
          : `Ingressou na sala "${sala.nome}" (${sala.codigo})`,
      quando: 'Agora mesmo'
    }))
  );

  const listaAtividades = [...tentativasReais, ...ATIVIDADES_PADRAO].slice(0, 8);

  return (
    <MainLayout pageClass="panel-page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '12px', marginBottom: '26px' }}>
        <div>
          <h1 className="page-title">Olá, professor(a)</h1>
          <p className="page-subtitle" style={{ margin: 0 }}>
            Aqui está um resumo das suas turmas e da atividade recente dos alunos
          </p>
        </div>
        <button
          type="button"
          onClick={simularErro}
          style={{ padding: '8px 14px', borderRadius: '10px', border: '1px solid #f1c7d5', background: '#fff0f6', color: '#ba4779', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
        >
          Simular Erro (500)
        </button>
      </div>

      {error && (
        <div style={{ background: '#fff0f6', border: '1px solid #f1c7d5', color: '#ba4779', padding: '14px 18px', borderRadius: '14px', marginBottom: '20px', fontSize: '13px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span><strong>Erro:</strong> {error}</span>
          <button
            type="button"
            onClick={limparErro}
            style={{ padding: '6px 12px', background: '#ba4779', color: '#fff', border: 0, borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}
          >
            Tentar novamente
          </button>
        </div>
      )}

      {/* Indicadores Principais (stat-grid) */}
      <section className="stat-grid" id="stat-grid">
        <div className="stat-card">
          <p className="stat-card__label" style={{ margin: 0 }}>Turmas ativas</p>
          <p className="stat-card__value" id="stat-turmas" style={{ margin: '4px 0 0', color: '#123f72' }}>
            {loading ? '—' : totalTurmas}
          </p>
        </div>
        <div className="stat-card">
          <p className="stat-card__label" style={{ margin: 0 }}>Alunos matriculados</p>
          <p className="stat-card__value" id="stat-alunos" style={{ margin: '4px 0 0', color: '#123f72' }}>
            {loading ? '—' : totalAlunos}
          </p>
        </div>
        <div className="stat-card">
          <p className="stat-card__label" style={{ margin: 0 }}>Simulações criadas</p>
          <p className="stat-card__value" id="stat-simulacoes" style={{ margin: '4px 0 0', color: '#123f72' }}>
            {loading ? '—' : totalSimulacoes}
          </p>
        </div>
      </section>

      {/* Seção: Minhas Turmas (turmas-preview) */}
      <section className="section-block section-block--spaced" style={{ marginBottom: '32px' }}>
        <div className="section-title-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <h2 className="section-title" style={{ margin: 0, fontSize: '18px', color: '#142945' }}>Minhas turmas</h2>
          <Link
            to="/professor/turmas"
            className="btn btn--ghost btn--sm"
            style={{ padding: '6px 14px', borderRadius: '10px', border: '1px solid #dce5f0', background: '#fff', color: '#123f72', fontSize: '12px', fontWeight: '700', textDecoration: 'none' }}
          >
            Ver todas
          </Link>
        </div>

        <div className="stat-grid" id="turmas-preview" style={{ marginBottom: 0 }}>
          {turmas.map((turma) => (
            <article key={turma.id} className="stat-card">
              <p className="stat-card__label" style={{ margin: 0, fontWeight: '700', color: '#142945' }}>
                {turma.nome}
              </p>
              <p className="stat-card__value" style={{ margin: '4px 0', color: '#185a9c' }}>
                {turma.alunosCount}
              </p>
              <p className="stat-card__label" style={{ margin: 0, fontSize: '12px' }}>
                alunos matriculados · {turma.simulacoes} atividades
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Seção: Atividade Recente (atividade-recente) */}
      <section>
        <h2 className="section-title" style={{ margin: '0 0 14px', fontSize: '18px', color: '#142945' }}>
          Atividade recente
        </h2>
        <div className="data-table-wrap" style={{ background: '#fff', border: '1px solid #dce5f0', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 6px 20px rgba(18, 47, 84, 0.04)' }}>
          <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: '#eff3f9', borderBottom: '1px solid #dce5f0', color: '#576a80', fontSize: '11px' }}>
                <th scope="col" style={{ padding: '13px 16px' }}>Aluno</th>
                <th scope="col" style={{ padding: '13px 16px' }}>Ação</th>
                <th scope="col" style={{ padding: '13px 16px' }}>Quando</th>
              </tr>
            </thead>
            <tbody id="atividade-recente">
              {listaAtividades.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #dce5f0' }}>
                  <td style={{ padding: '13px 16px', fontWeight: '600', color: '#142945' }}>{item.aluno}</td>
                  <td style={{ padding: '13px 16px', color: '#243a56' }}>{item.acao}</td>
                  <td style={{ padding: '13px 16px', color: '#576a80', fontSize: '12px' }}>{item.quando}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </MainLayout>
  );
}