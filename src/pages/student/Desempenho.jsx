import MainLayout from '../../components/MainLayout';
import { usePerformance } from '../../hooks/usePerformance';

export default function Desempenho() {
  const {
    dados,
    loading,
    error,
    simularErro,
    limparErro,
    esvaziarDados,
    restaurarDados
  } = usePerformance();

  const semRegistos = dados.especialidades.length === 0;

  return (
    <MainLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ margin: '0 0 6px', fontSize: '32px', color: '#142945', fontWeight: '700' }}>Meu Desempenho</h1>
          <p style={{ margin: 0, color: '#576a80', fontSize: '14px' }}>
            Acompanhe suas estatísticas de aprendizado e evolução clínica
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button type="button" onClick={esvaziarDados} style={{ padding: '7px 12px', borderRadius: '10px', border: '1px solid #dce5f0', background: '#fff', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>
            Simular Vazio
          </button>
          <button type="button" onClick={restaurarDados} style={{ padding: '7px 12px', borderRadius: '10px', border: '1px solid #dce5f0', background: '#fff', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>
            Restaurar
          </button>
          <button type="button" onClick={simularErro} style={{ padding: '7px 12px', borderRadius: '10px', border: '1px solid #f1c7d5', background: '#fff0f6', color: '#ba4779', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>
            Simular Erro (500)
          </button>
        </div>
      </div>

      {/* Box de Resumo Salvo (igual ao injetado pelo components.js) */}
      <section style={{ padding: '16px', marginBottom: '24px', background: '#eaf3fd', borderLeft: '4px solid #185a9c', borderRadius: '14px' }}>
        <h2 style={{ margin: '0 0 6px', fontSize: '15px', color: '#142945' }}>Seu progresso</h2>
        <p style={{ margin: 0, fontSize: '13px', color: '#243a56' }}>
          Cardiologia: módulo em andamento. Última simulação registrada: 88 pontos.
        </p>
      </section>

      {loading && <p style={{ textAlign: 'center', padding: '30px', color: '#576a80' }}>Carregando estatísticas...</p>}

      {error && !loading && (
        <div style={{ background: '#fff0f6', border: '1px solid #f1c7d5', color: '#ba4779', padding: '16px', borderRadius: '14px', textAlign: 'center', marginBottom: '20px' }}>
          <strong style={{ display: 'block', marginBottom: '8px', fontSize: '13px' }}>{error}</strong>
          <button type="button" onClick={limparErro} style={{ padding: '6px 14px', background: '#ba4779', color: '#fff', border: 0, borderRadius: '8px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>
            Tentar novamente
          </button>
        </div>
      )}

      {!loading && !error && semRegistos && (
        <div style={{ textAlign: 'center', padding: '44px', border: '2px dashed #dce5f0', borderRadius: '20px', background: '#fff' }}>
          <p style={{ margin: 0, fontWeight: '700', color: '#142945' }}>Nenhuma estatística registrada até o momento.</p>
          <span style={{ fontSize: '12px', color: '#576a80' }}>Conclua simulações clínicas para gerar seu relatório de evolução.</span>
        </div>
      )}

      {!loading && !error && !semRegistos && (
        <>
          {/* 4 Stat Cards Originais */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '28px' }}>
            <div style={{ background: '#fff', border: '1px solid #dce5f0', borderRadius: '14px', padding: '18px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ width: '36px', height: '36px', borderRadius: '12px', background: '#eaf3fd', color: '#185a9c', display: 'grid', placeItems: 'center', fontWeight: 'bold' }}>🏆</span>
              <strong style={{ fontSize: '24px', color: '#142945' }}>Nível 12</strong>
              <span style={{ fontSize: '13px', color: '#576a80' }}>Nível de Experiência</span>
              <div style={{ height: '7px', background: '#eff3f9', borderRadius: '999px', overflow: 'hidden', marginTop: '6px' }}>
                <span style={{ display: 'block', width: '60%', height: '100%', background: '#704fb3' }}></span>
              </div>
              <small style={{ fontSize: '12px', color: '#576a80', marginTop: '4px' }}>2.400 / 4.000 XP para o Nível 13</small>
            </div>

            <div style={{ background: '#fff', border: '1px solid #dce5f0', borderRadius: '14px', padding: '18px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ width: '36px', height: '36px', borderRadius: '12px', background: '#fff2df', color: '#9f5b12', display: 'grid', placeItems: 'center', fontWeight: 'bold' }}>✨</span>
              <strong style={{ fontSize: '24px', color: '#142945' }}>14.400</strong>
              <span style={{ fontSize: '13px', color: '#576a80' }}>XP Total Acumulado</span>
              <small style={{ fontSize: '12px', color: '#087565', fontWeight: '700', marginTop: '6px' }}>+850 XP esta semana</small>
            </div>

            <div style={{ background: '#fff', border: '1px solid #dce5f0', borderRadius: '14px', padding: '18px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ width: '36px', height: '36px', borderRadius: '12px', background: '#fff0f5', color: '#ba4779', display: 'grid', placeItems: 'center', fontWeight: 'bold' }}>✓</span>
              <strong style={{ fontSize: '24px', color: '#142945' }}>89%</strong>
              <span style={{ fontSize: '13px', color: '#576a80' }}>Taxa de Acertos</span>
              <small style={{ fontSize: '12px', color: '#576a80', marginTop: '6px' }}>Média das últimas 10 simulações</small>
            </div>

            <div style={{ background: '#fff', border: '1px solid #dce5f0', borderRadius: '14px', padding: '18px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ width: '36px', height: '36px', borderRadius: '12px', background: '#f2edfa', color: '#704fb3', display: 'grid', placeItems: 'center', fontWeight: 'bold' }}>⏱</span>
              <strong style={{ fontSize: '24px', color: '#142945' }}>38</strong>
              <span style={{ fontSize: '13px', color: '#576a80' }}>Simulações Concluídas</span>
              <small style={{ fontSize: '12px', color: '#576a80', marginTop: '6px' }}>Tempo médio: 14 min</small>
            </div>
          </div>

          {/* Seção: Áreas Mais Simuladas */}
          <section style={{ background: '#fff', border: '1px solid #dce5f0', borderRadius: '14px', padding: '24px', boxShadow: '0 6px 20px rgba(18, 47, 84, 0.04)' }}>
            <div style={{ marginBottom: '22px' }}>
              <h2 style={{ margin: 0, fontSize: '17px', fontWeight: '700', color: '#142945' }}>Áreas Mais Simuladas</h2>
              <span style={{ display: 'block', marginTop: '4px', fontSize: '13px', color: '#576a80' }}>
                Distribuição por especialidade clínica
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { nome: 'Cardiologia', texto: '14 simulações (37%)', pct: 37 },
                { nome: 'Neurologia', texto: '10 simulações (26%)', pct: 26 },
                { nome: 'Pediatria', texto: '7 simulações (18%)', pct: 18 },
                { nome: 'Clínica Médica', texto: '5 simulações (13%)', pct: 13 },
                { nome: 'Pneumologia', texto: '2 simulações (6%)', pct: 6 }
              ].map((esp) => (
                <div key={esp.nome} style={{ display: 'grid', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ fontWeight: '700', color: '#142945' }}>{esp.nome}</span>
                    <span style={{ color: '#576a80' }}>{esp.texto}</span>
                  </div>
                  <div style={{ width: '100%', height: '9px', background: '#eff3f9', border: '1px solid #dce5f0', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{ width: `${esp.pct}%`, height: '100%', background: '#704fb3', borderRadius: 'inherit' }}></div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </MainLayout>
  );
}