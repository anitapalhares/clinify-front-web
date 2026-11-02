import { useState } from 'react';
import MainLayout from '../../components/MainLayout';
import { useClasses } from '../../hooks/useClasses';

export default function Turmas() {
  const { turmas, alunos, loading, error, alternarStatusAluno, simularErro, limparErro, esvaziarDados, restaurarDados } = useClasses();
  const [busca, setBusca] = useState('');
  const [turmaSelecionada, setTurmaSelecionada] = useState('todas');

  const alunosFiltrados = alunos.filter((item) => {
    const atendeTurma = turmaSelecionada === 'todas' || item.turma === turmaSelecionada;
    const termo = busca.toLowerCase().trim();
    return atendeTurma && (item.nome.toLowerCase().includes(termo) || item.turma.toLowerCase().includes(termo));
  });

  return (
    <MainLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '26px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ margin: '0 0 6px', fontSize: '32px', color: '#142945', fontWeight: '700' }}>Minhas turmas e alunos</h1>
          <p style={{ margin: 0, color: '#576a80', fontSize: '14px' }}>Acompanhamento das turmas atribuídas ao professor no Clinify.</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button type="button" onClick={esvaziarDados} style={{ padding: '8px 12px', borderRadius: '10px', border: '1px solid #dce5f0', background: '#fff', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>Simular Vazio</button>
          <button type="button" onClick={restaurarDados} style={{ padding: '8px 12px', borderRadius: '10px', border: '1px solid #dce5f0', background: '#fff', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>Restaurar</button>
          <button type="button" onClick={simularErro} style={{ padding: '8px 12px', borderRadius: '10px', border: '1px solid #f1c7d5', background: '#fff0f6', color: '#ba4779', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>Simular Erro (500)</button>
        </div>
      </div>

      {error && (
        <div style={{ background: '#fff0f6', border: '1px solid #f1c7d5', color: '#ba4779', padding: '14px', borderRadius: '14px', marginBottom: '20px', fontSize: '13px' }}>
          <strong>Erro:</strong> {error}
          <button type="button" onClick={limparErro} style={{ marginLeft: '12px', padding: '4px 10px', background: '#ba4779', color: '#fff', border: 0, borderRadius: '6px', cursor: 'pointer' }}>Tentar novamente</button>
        </div>
      )}

      {!loading && !error && turmas.length > 0 && (
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '28px' }}>
          {turmas.map((t) => (
            <article key={t.id} style={{ background: '#fff', border: '1px solid #dce5f0', borderRadius: '20px', padding: '22px', boxShadow: '0 6px 20px rgba(18, 47, 84, 0.04)' }}>
              <p style={{ margin: '0 0 8px', color: '#576a80', fontSize: '12px' }}>{t.nome}</p>
              <p style={{ margin: 0, color: '#123f72', fontSize: '30px', fontWeight: '600' }}>{t.alunosCount}</p>
              <p style={{ margin: '6px 0 0', color: '#576a80', fontSize: '12px' }}>alunos matriculados</p>
            </article>
          ))}
        </section>
      )}

      {/* Barra de Filtro */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '18px', flexWrap: 'wrap' }}>
        <input type="search" placeholder="Buscar aluno..." value={busca} onChange={(e) => setBusca(e.target.value)} style={{ flex: 1, minWidth: '220px', padding: '10px 14px', border: '1px solid #dce5f0', borderRadius: '12px', background: '#fff', fontSize: '13px' }} />
        <select value={turmaSelecionada} onChange={(e) => setTurmaSelecionada(e.target.value)} style={{ padding: '10px 14px', border: '1px solid #dce5f0', borderRadius: '12px', background: '#fff', fontSize: '13px' }}>
          <option value="todas">Todas as turmas</option>
          {turmas.map((t) => <option key={t.id} value={t.nome}>{t.nome}</option>)}
        </select>
      </div>

      {/* Tabela de Alunos (data-table) */}
      {!loading && !error && alunosFiltrados.length === 0 ? (
        <div style={{ background: '#fff', border: '2px dashed #dce5f0', borderRadius: '20px', padding: '40px', textAlign: 'center', color: '#576a80', fontSize: '13px' }}>
          Nenhum aluno encontrado para este filtro.
        </div>
      ) : (
        <div style={{ background: '#fff', border: '1px solid #dce5f0', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 6px 20px rgba(18, 47, 84, 0.04)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: '#eff3f9', borderBottom: '1px solid #dce5f0', color: '#576a80', fontSize: '11px' }}>
                <th style={{ padding: '13px 16px' }}>Aluno</th>
                <th style={{ padding: '13px 16px' }}>Turma</th>
                <th style={{ padding: '13px 16px' }}>Status</th>
                <th style={{ padding: '13px 16px', textAlign: 'right' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {alunosFiltrados.map((a) => (
                <tr key={a.id} style={{ borderBottom: '1px solid #dce5f0' }}>
                  <td style={{ padding: '13px 16px', fontWeight: '600', color: '#142945' }}>{a.nome}</td>
                  <td style={{ padding: '13px 16px', color: '#243a56' }}>{a.turma}</td>
                  <td style={{ padding: '13px 16px' }}>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '999px',
                      fontSize: '11px',
                      fontWeight: '700',
                      background: a.status === 'ativo' ? '#e8f6f1' : '#fff0f6',
                      color: a.status === 'ativo' ? '#087565' : '#ba4779'
                    }}>
                      {a.status === 'ativo' ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td style={{ padding: '13px 16px', textAlign: 'right' }}>
                    <button type="button" onClick={() => alternarStatusAluno(a.id)} style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #dce5f0', background: '#fff', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>
                      {a.status === 'ativo' ? 'Desativar' : 'Ativar'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </MainLayout>
  );
}