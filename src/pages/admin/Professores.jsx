import { useState } from 'react';
import MainLayout from '../../components/MainLayout';
import { useProfessors } from '../../hooks/useProfessors';

export default function Professores() {
  const { professores, loading, error, alternarStatus, salvarProfessor, simularErro, limparErro } = useProfessors();
  const [busca, setBusca] = useState('');
  const [statusFiltro, setStatusFiltro] = useState('all');
  const [modalAberto, setModalAberto] = useState(false);
  const [formId, setFormId] = useState('');
  const [formNome, setFormNome] = useState('');
  const [formEmail, setFormEmail] = useState('');

  const professoresFiltrados = professores.filter((p) => {
    const atendeStatus = statusFiltro === 'all' || p.status === statusFiltro;
    const termo = busca.toLowerCase();
    return atendeStatus && (p.nome.toLowerCase().includes(termo) || p.email.toLowerCase().includes(termo));
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formNome.trim() || !formEmail.trim()) return;
    salvarProfessor({ id: formId, nome: formNome.trim(), email: formEmail.trim() });
    setModalAberto(false);
  };

  return (
    <MainLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '26px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ margin: '0 0 6px', fontSize: '32px', color: '#142945', fontWeight: '700' }}>Gerenciar professores</h1>
          <p style={{ margin: 0, color: '#576a80', fontSize: '14px' }}>Cadastre, edite ou desative o acesso de professores à plataforma</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="button" onClick={simularErro} style={{ padding: '10px 14px', borderRadius: '12px', border: '1px solid #f1c7d5', background: '#fff0f6', color: '#ba4779', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>Simular Erro (500)</button>
          <button type="button" onClick={() => { setFormId(''); setFormNome(''); setFormEmail(''); setModalAberto(true); }} style={{ padding: '10px 18px', borderRadius: '12px', border: 0, background: 'linear-gradient(120deg, #123f72, #185a9c)', color: '#fff', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}>
            + Cadastrar professor
          </button>
        </div>
      </div>

      {error && (
        <div style={{ background: '#fff0f6', border: '1px solid #f1c7d5', color: '#ba4779', padding: '14px', borderRadius: '14px', marginBottom: '20px', fontSize: '13px' }}>
          <strong>Erro:</strong> {error}
          <button type="button" onClick={limparErro} style={{ marginLeft: '12px', padding: '4px 10px', background: '#ba4779', color: '#fff', border: 0, borderRadius: '6px', cursor: 'pointer' }}>Tentar novamente</button>
        </div>
      )}

      {/* Barra panel-toolbar */}
      <section style={{ display: 'flex', alignItems: 'center', gap: '14px', background: '#fff', border: '1px solid #dce5f0', borderRadius: '20px', padding: '10px 16px', marginBottom: '22px' }}>
        <input type="search" placeholder="Buscar por nome ou e-mail…" value={busca} onChange={(e) => setBusca(e.target.value)} style={{ flex: 1, border: 0, outline: 'none', fontSize: '13px' }} />
        <select value={statusFiltro} onChange={(e) => setStatusFiltro(e.target.value)} style={{ border: 0, outline: 'none', fontSize: '13px', cursor: 'pointer' }}>
          <option value="all">Todos os status</option>
          <option value="ativo">Ativos</option>
          <option value="inativo">Inativos</option>
        </select>
      </section>

      {!loading && professoresFiltrados.length === 0 ? (
        <p style={{ textAlign: 'center', padding: '40px 0', color: '#576a80', fontSize: '13px' }}>Nenhum professor encontrado.</p>
      ) : (
        <div style={{ background: '#fff', border: '1px solid #dce5f0', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 6px 20px rgba(18, 47, 84, 0.04)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: '#eff3f9', borderBottom: '1px solid #dce5f0', color: '#576a80', fontSize: '11px' }}>
                <th style={{ padding: '13px 16px' }}>Nome</th>
                <th style={{ padding: '13px 16px' }}>E-mail</th>
                <th style={{ padding: '13px 16px' }}>Status</th>
                <th style={{ padding: '13px 16px', textAlign: 'right' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {professoresFiltrados.map((p) => (
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
                  <td style={{ padding: '13px 16px', textAlign: 'right', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                    <button type="button" onClick={() => { setFormId(p.id); setFormNome(p.nome); setFormEmail(p.email); setModalAberto(true); }} style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #dce5f0', background: '#fff', fontSize: '12px', fontWeight: '700', color: '#123f72', cursor: 'pointer' }}>
                      Editar
                    </button>
                    <button type="button" onClick={() => alternarStatus(p.id)} style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #f1c7d5', background: p.status === 'ativo' ? '#fff5f8' : '#fff', color: p.status === 'ativo' ? '#9f2e4f' : '#123f72', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>
                      {p.status === 'ativo' ? 'Desativar' : 'Ativar'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalAberto && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(8, 38, 58, 0.42)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#fff', padding: '24px', borderRadius: '24px', width: 'min(92vw, 420px)' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '20px', color: '#142945' }}>{formId ? 'Editar professor' : 'Cadastrar professor'}</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: '700', color: '#576a80' }}>Nome completo</label>
                <input type="text" required value={formNome} onChange={(e) => setFormNome(e.target.value)} style={{ width: '100%', padding: '10px 12px', border: '1px solid #dce5f0', borderRadius: '12px', boxSizing: 'border-box' }} />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: '700', color: '#576a80' }}>E-mail</label>
                <input type="email" required value={formEmail} onChange={(e) => setFormEmail(e.target.value)} style={{ width: '100%', padding: '10px 12px', border: '1px solid #dce5f0', borderRadius: '12px', boxSizing: 'border-box' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setModalAberto(false)} style={{ padding: '8px 14px', borderRadius: '10px', border: '1px solid #dce5f0', background: '#fff', cursor: 'pointer' }}>Cancelar</button>
                <button type="submit" style={{ padding: '8px 16px', borderRadius: '10px', border: 0, background: '#185a9c', color: '#fff', fontWeight: '700', cursor: 'pointer' }}>Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </MainLayout>
  );
}