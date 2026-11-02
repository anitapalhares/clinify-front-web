import { Link } from 'react-router-dom';
import MainLayout from '../../components/MainLayout';
import { useProfessors } from '../../hooks/useProfessors';
import { useClasses } from '../../hooks/useClasses';

export default function AdminDashboard() {
  const { professores, loading, error, simularErro, limparErro } = useProfessors();
  const { turmas, alunos } = useClasses();

  return (
    <MainLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '26px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ margin: '0 0 6px', fontSize: '32px', color: '#142945', fontWeight: '700' }}>Dashboard</h1>
          <p style={{ margin: 0, color: '#576a80', fontSize: '14px' }}>Visão geral do Clinify</p>
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
        <div style={{ background: '#fff0f6', border: '1px solid #f1c7d5', color: '#ba4779', padding: '14px', borderRadius: '14px', marginBottom: '20px', fontSize: '13px' }}>
          <strong>Erro:</strong> {error}
          <button type="button" onClick={limparErro} style={{ marginLeft: '12px', padding: '4px 10px', background: '#ba4779', color: '#fff', border: 0, borderRadius: '6px', cursor: 'pointer' }}>
            Tentar novamente
          </button>
        </div>
      )}

      {/* 3 Stat Cards do Admin (stat-grid) */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        <div style={{ background: '#fff', border: '1px solid #dce5f0', borderRadius: '20px', padding: '22px', boxShadow: '0 6px 20px rgba(18, 47, 84, 0.04)' }}>
          <p style={{ margin: '0 0 8px', color: '#576a80', fontSize: '12px' }}>Professores cadastrados</p>
          <p style={{ margin: 0, color: '#123f72', fontSize: '30px', fontWeight: '600' }}>{professores.length}</p>
        </div>
        <div style={{ background: '#fff', border: '1px solid #dce5f0', borderRadius: '20px', padding: '22px', boxShadow: '0 6px 20px rgba(18, 47, 84, 0.04)' }}>
          <p style={{ margin: '0 0 8px', color: '#576a80', fontSize: '12px' }}>Turmas ativas</p>
          <p style={{ margin: 0, color: '#123f72', fontSize: '30px', fontWeight: '600' }}>{turmas.length}</p>
        </div>
        <div style={{ background: '#fff', border: '1px solid #dce5f0', borderRadius: '20px', padding: '22px', boxShadow: '0 6px 20px rgba(18, 47, 84, 0.04)' }}>
          <p style={{ margin: '0 0 8px', color: '#576a80', fontSize: '12px' }}>Alunos matriculados</p>
          <p style={{ margin: 0, color: '#123f72', fontSize: '30px', fontWeight: '600' }}>{alunos.length}</p>
        </div>
      </section>

      {/* Preview da Tabela de Professores */}
      <section>
        <h2 style={{ margin: '0 0 14px', fontSize: '16px', fontWeight: '700', color: '#142945' }}>Professores</h2>
        <div style={{ background: '#fff', border: '1px solid #dce5f0', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 6px 20px rgba(18, 47, 84, 0.04)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: '#eff3f9', borderBottom: '1px solid #dce5f0', color: '#576a80', fontSize: '11px' }}>
                <th style={{ padding: '13px 16px' }}>Nome</th>
                <th style={{ padding: '13px 16px' }}>E-mail</th>
                <th style={{ padding: '13px 16px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {!loading && professores.slice(0, 5).map((p) => (
                <tr key={p.id} style={{ borderBottom: '1px solid #dce5f0' }}>
                  <td style={{ padding: '13px 16px', fontWeight: '600', color: '#142945' }}>{p.nome}</td>
                  <td style={{ padding: '13px 16px', color: '#243a56' }}>{p.email}</td>
                  <td style={{ padding: '13px 16px' }}>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '999px',
                      fontSize: '11px',
                      fontWeight: '700',
                      background: p.status === 'ativo' ? '#e8f6f1' : '#fff0f6',
                      color: p.status === 'ativo' ? '#087565' : '#ba4779'
                    }}>
                      {p.status === 'ativo' ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: '16px' }}>
          <Link
            to="/admin/professores"
            style={{ display: 'inline-flex', alignItems: 'center', minHeight: '38px', padding: '0 14px', borderRadius: '12px', border: '1px solid #dce5f0', background: '#fff', color: '#123f72', fontSize: '12px', fontWeight: '700', textDecoration: 'none' }}
          >
            Gerenciar professores
          </Link>
        </div>
      </section>
    </MainLayout>
  );
}