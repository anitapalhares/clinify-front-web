import { Link } from 'react-router-dom';
import MainLayout from '../../components/MainLayout';

export default function DesempenhoProfessor() {
  return (
    <MainLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '26px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ margin: '0 0 6px', fontSize: '32px', color: '#142945', fontWeight: '700' }}>Desempenho das turmas</h1>
          <p style={{ margin: 0, color: '#576a80', fontSize: '14px' }}>Resumo do progresso médio nas atividades clínicas.</p>
        </div>
        <Link to="/professor" style={{ padding: '10px 16px', borderRadius: '12px', border: '1px solid #dce5f0', background: '#fff', color: '#123f72', fontSize: '13px', fontWeight: '700', textDecoration: 'none' }}>
          Voltar
        </Link>
      </div>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <article style={{ background: '#fff', border: '1px solid #dce5f0', borderRadius: '20px', padding: '22px', boxShadow: '0 6px 20px rgba(18, 47, 84, 0.04)' }}>
          <p style={{ margin: '0 0 8px', color: '#576a80', fontSize: '12px' }}>Média geral</p>
          <p style={{ margin: 0, color: '#123f72', fontSize: '30px', fontWeight: '600' }}>82%</p>
        </article>
        <article style={{ background: '#fff', border: '1px solid #dce5f0', borderRadius: '20px', padding: '22px', boxShadow: '0 6px 20px rgba(18, 47, 84, 0.04)' }}>
          <p style={{ margin: '0 0 8px', color: '#576a80', fontSize: '12px' }}>Simulações concluídas</p>
          <p style={{ margin: 0, color: '#123f72', fontSize: '30px', fontWeight: '600' }}>55</p>
        </article>
        <article style={{ background: '#fff', border: '1px solid #dce5f0', borderRadius: '20px', padding: '22px', boxShadow: '0 6px 20px rgba(18, 47, 84, 0.04)' }}>
          <p style={{ margin: '0 0 8px', color: '#576a80', fontSize: '12px' }}>Atividades pendentes</p>
          <p style={{ margin: 0, color: '#123f72', fontSize: '30px', fontWeight: '600' }}>12</p>
        </article>
      </section>
    </MainLayout>
  );
}