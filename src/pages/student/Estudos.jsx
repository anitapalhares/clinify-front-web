import { useState } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../../components/MainLayout';
import { useStudies } from '../../hooks/useStudies';

const CORES_ICONES = {
  cardiologia: { bg: '#fff0f6', color: '#ba4779', simbolo: '♥' },
  anatomia: { bg: '#f2edfa', color: '#704fb3', simbolo: '🦴' },
  pneumologia: { bg: '#eaf3fd', color: '#185a9c', simbolo: '🫁' },
  neurologia: { bg: '#f2edfa', color: '#704fb3', simbolo: '🧠' },
  gastroenterologia: { bg: '#e8f6f1', color: '#087565', simbolo: '🩺' },
  endocrinologia: { bg: '#fff1e8', color: '#dc7545', simbolo: '🔬' },
  histologia: { bg: '#fff0f6', color: '#ba4779', simbolo: '🧬' }
};

export default function Estudos() {
  const { estudos, loading, error, simularErro, limparErro } = useStudies();

  const [busca, setBusca] = useState('');
  const [filtroEspecialidade, setFiltroEspecialidade] = useState('all');
  const [ordenacao, setOrdenacao] = useState('default');

  const estudosFiltrados = estudos
    .filter((materia) => {
      const atendeEspecialidade =
        filtroEspecialidade === 'all' || materia.especialidade === filtroEspecialidade;
      const atendeBusca = materia.nome.toLowerCase().includes(busca.toLowerCase().trim());
      return atendeEspecialidade && atendeBusca;
    })
    .sort((a, b) => {
      if (ordenacao === 'name') return a.nome.localeCompare(b.nome);
      if (ordenacao === 'semester') return a.semestre - b.semestre;
      if (ordenacao === 'questions') return b.questoes - a.questoes;
      return 0;
    });

  return (
    <MainLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ margin: '0 0 6px', fontSize: '32px', color: '#142945', fontWeight: '700' }}>Área de Estudos</h1>
          <p style={{ margin: 0, color: '#576a80', fontSize: '14px' }}>
            Escolha uma matéria para acessar seus estudos e acompanhar seu progresso
          </p>
        </div>
        <button
          type="button"
          onClick={simularErro}
          style={{ padding: '8px 14px', background: '#fff0f6', border: '1px solid #f1c7d5', color: '#ba4779', borderRadius: '10px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
        >
          Simular Erro (500)
        </button>
      </div>

      {/* Barra de Filtros Original (study-filters) */}
      <section style={{
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        background: '#ffffff',
        border: '1px solid #dce5f0',
        borderRadius: '20px',
        padding: '10px 18px',
        marginBottom: '26px',
        boxShadow: '0 6px 20px rgba(18, 47, 84, 0.04)',
        flexWrap: 'wrap'
      }}>
        <div style={{ flex: '1.4 1 220px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: '#576a80' }}>🔍</span>
          <input
            type="search"
            placeholder="Buscar especialidade…"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            style={{ width: '100%', border: 0, outline: 'none', fontSize: '13px', color: '#243a56', background: 'transparent' }}
          />
        </div>

        <div style={{ width: '1px', height: '24px', background: '#dce5f0' }}></div>

        <div style={{ flex: '1 1 180px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <select
            value={filtroEspecialidade}
            onChange={(e) => setFiltroEspecialidade(e.target.value)}
            style={{ width: '100%', border: 0, outline: 'none', fontSize: '13px', color: '#243a56', background: 'transparent', cursor: 'pointer' }}
          >
            <option value="all">Todas as especialidades</option>
            <option value="cardiologia">Cardiologia</option>
            <option value="anatomia">Anatomia</option>
            <option value="pneumologia">Pneumologia</option>
            <option value="neurologia">Neurologia</option>
            <option value="gastroenterologia">Gastroenterologia</option>
            <option value="endocrinologia">Endocrinologia</option>
            <option value="histologia">Histologia</option>
          </select>
        </div>

        <div style={{ width: '1px', height: '24px', background: '#dce5f0' }}></div>

        <div style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <select
            value={ordenacao}
            onChange={(e) => setOrdenacao(e.target.value)}
            style={{ border: 0, outline: 'none', fontSize: '13px', color: '#243a56', background: 'transparent', cursor: 'pointer' }}
          >
            <option value="default">Ordenar por</option>
            <option value="name">Nome</option>
            <option value="semester">Semestre</option>
            <option value="questions">Quantidade de questões</option>
          </select>
        </div>
      </section>

      {/* Estados de Carregamento e Erro */}
      {loading && <p style={{ textAlign: 'center', padding: '30px', color: '#576a80' }}>Carregando especialidades...</p>}

      {error && !loading && (
        <div style={{ background: '#fff0f6', border: '1px solid #f1c7d5', color: '#ba4779', padding: '16px', borderRadius: '14px', textAlign: 'center', marginBottom: '20px' }}>
          <strong style={{ display: 'block', marginBottom: '8px', fontSize: '13px' }}>{error}</strong>
          <button
            type="button"
            onClick={limparErro}
            style={{ padding: '6px 14px', background: '#ba4779', color: '#fff', border: 0, borderRadius: '8px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
          >
            Tentar novamente
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && estudosFiltrados.length === 0 && (
        <p style={{ textAlign: 'center', padding: '40px 0', color: '#576a80', fontSize: '13px' }}>
          Nenhuma especialidade encontrada para essa busca.
        </p>
      )}

      {/* Grid de Cards (study-grid) */}
      {!loading && !error && estudosFiltrados.length > 0 && (
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
          {estudosFiltrados.map((item) => {
            const icone = CORES_ICONES[item.especialidade] || CORES_ICONES.cardiologia;
            return (
              <article
                key={item.id}
                style={{
                  background: '#ffffff',
                  border: '1px solid #dce5f0',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 6px 20px rgba(18, 47, 84, 0.04)'
                }}
              >
                <Link
                  to={`/estudante/conteudo?especialidade=${item.especialidade}`}
                  style={{
                    flex: 1,
                    padding: '18px',
                    textDecoration: 'none',
                    color: 'inherit',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '18px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '12px',
                      background: icone.bg,
                      color: icone.color,
                      display: 'grid',
                      placeItems: 'center',
                      fontSize: '18px',
                      flexShrink: 0
                    }}>
                      {icone.simbolo}
                    </div>
                    <div>
                      <h2 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#142945' }}>{item.nome}</h2>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px', fontSize: '12px', color: '#576a80' }}>
                        <span style={{ padding: '2px 8px', borderRadius: '999px', background: '#eaf3fd', color: '#123f72', fontWeight: '700' }}>
                          {item.tag}
                        </span>
                        <span>{item.questoes > 0 ? `${item.questoes} questões` : 'Em preparação'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Barra de Progresso */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ flex: 1, height: '7px', background: '#eff3f9', borderRadius: '999px', overflow: 'hidden' }}>
                      <span style={{
                        display: 'block',
                        height: '100%',
                        width: `${item.progresso}%`,
                        background: 'linear-gradient(90deg, #185a9c, #704fb3)',
                        borderRadius: 'inherit'
                      }}></span>
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: '700', color: '#576a80', minWidth: '32px', textAlign: 'right' }}>
                      {item.progresso}%
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', fontSize: '12px', fontWeight: '700', color: '#123f72' }}>
                    <span>Abrir estudos</span>
                    <span style={{ color: '#704fb3', fontSize: '16px' }}>→</span>
                  </div>
                </Link>

                <Link
                  to={`/estudante?materia=${item.especialidade}`}
                  style={{
                    padding: '10px 18px',
                    borderTop: '1px solid #dce5f0',
                    fontSize: '11px',
                    fontWeight: '700',
                    color: '#576a80',
                    textDecoration: 'none',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: '#fafcff'
                  }}
                >
                  <span>Ver casos desta matéria</span>
                  <span style={{ color: '#704fb3', fontSize: '14px' }}>→</span>
                </Link>
              </article>
            );
          })}
        </section>
      )}
    </MainLayout>
  );
}