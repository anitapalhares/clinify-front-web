import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import MainLayout from '../../components/MainLayout';
import { useStudentProgress } from '../../hooks/useStudentProgress';

const CONTEUDOS_POR_MATERIA = {
  cardiologia: {
    especialidade: 'Cardiologia',
    semestre: '6° Semestre',
    tempo: '25 min de leitura',
    tituloPrincipal: 'Síndrome Coronariana',
    tituloDestaque: 'Aguda (SCA)',
    descricao: 'Fisiopatologia da placa aterosclerótica, diagnóstico diferencial da dor torácica na emergência e condutas imediatas de reperfusão.',
    videoTitulo: 'Interpretação rápida do supradesnível de ST no pronto-socorro',
    professorInicial: 'DR',
    professorNome: 'Prof. Daniel Ribeiro',
    professorCargo: 'Preceptor de Cardiologia · Hospital Moinhos de Vento',
    secaoTitulo: 'Abordagem sistematizada na sala de emergência',
    texto1: 'A dor torácica aguda é uma das principais causas de busca por atendimento emergencial. O reconhecimento precoce da isquemia miocárdica crítica depende da integração imediata entre anamnese direcionada, exame físico focado e realização do eletrocardiograma (ECG) de 12 derivações nos primeiros 10 minutos da chegada do paciente.',
    texto2: 'A distinção entre o Infarto Agudo do Miocárdio com Supradesnível do Segmento ST (IAMCSST) e as síndromes sem supradesnível define a urgência da terapia de reperfusão mecânica (angioplastia primária) ou farmacológica (fibrinólise).',
    citacao: 'Na suspeita de IAMCSST, cada minuto de atraso na abertura da artéria culpada representa perda irreversível de miocárdio viável: tempo é músculo.',
    questoes: [
      {
        id: 1,
        enunciado: 'Paciente masculino, 58 anos, chega à emergência com dor retroesternal opressiva irradiada para membro superior esquerdo há 40 minutos. Qual a meta de tempo máxima preconizada pelas diretrizes para realização e leitura do ECG?',
        alternativas: [
          'Até 10 minutos após a admissão hospitalar.',
          'Até 30 minutos, aguardando a coleta prévia de troponina sérica.',
          'Até 60 minutos, após alívio completo da dor com nitrato sublingual.'
        ],
        correta: 0,
        explicacao: 'O tempo porta-ECG inferior a 10 minutos é mandatório para identificar rapidamente casos de oclusão coronariana aguda que exigem reperfusão imediata.'
      },
      {
        id: 2,
        enunciado: 'Qual marcador bioquímico possui maior especificidade e sensibilidade para detecção de necrose miocárdica aguda?',
        alternativas: [
          'Mioglobina sérica.',
          'Troponina cardíaca de alta sensibilidade (hs-cTn).',
          'Creatinoquinase fração MB (CK-MB) isolada.'
        ],
        correta: 1,
        explicacao: 'As troponinas cardíacas ultrassensíveis são os biomarcadores de escolha padrão-ouro para diagnóstico de injúria e infarto miocárdico.'
      }
    ]
  },
  anatomia: {
    especialidade: 'Anatomia',
    semestre: '1° Semestre',
    tempo: '20 min de leitura',
    tituloPrincipal: 'Anatomia Clínica do',
    tituloDestaque: 'Plexo Braquial',
    descricao: 'Organização das raízes medulares C5 a T1, troncos, fascículos e correlação motora e sensitiva nas lesões traumáticas do membro superior.',
    videoTitulo: 'Dissecção anatômica e relações vasculonervosas axilares',
    professorInicial: 'HM',
    professorNome: 'Profa. Helena Martins',
    professorCargo: 'Docente de Morfologia · Faculdade Moinhos de Vento',
    secaoTitulo: 'Correlação anatomoclínica nas lesões do ombro',
    texto1: 'O manguito rotador é formado pelos músculos supraespinal, infraespinal, redondo menor e subescapular. Eles estabilizam a articulação glenoumeral durante a abdução e rotação do braço.',
    texto2: 'Traumas de tração ou compressão subacromial afetam frequentemente o tendão do músculo supraespinal, gerando dor característica no arco médio de elevação do membro superior.',
    citacao: 'A precisão do exame físico ortopédico e neurológico periférico é diretamente proporcional ao domínio da topografia anatômica.',
    questoes: [
      {
        id: 1,
        enunciado: 'Qual músculo é o principal responsável por iniciar os primeiros 15 graus de abdução do braço na articulação do ombro?',
        alternativas: [
          'Músculo deltoide (fibras médias).',
          'Músculo supraespinal.',
          'Músculo redondo maior.'
        ],
        correta: 1,
        explicacao: 'O músculo supraespinal inicia a abdução nos primeiros 15 graus, ponto a partir do qual o músculo deltoide assume a potência principal do movimento.'
      }
    ]
  }
};

export default function ConteudoAula() {
  const { progresso, concluirModuloEstudo } = useStudentProgress();
  const jaConcluido = progresso.modulosConcluidos.includes(chave);
  const [searchParams] = useSearchParams();
  const chave = searchParams.get('especialidade') || 'cardiologia';
  const aula = CONTEUDOS_POR_MATERIA[chave] || CONTEUDOS_POR_MATERIA.cardiologia;

  const [respostas, setRespostas] = useState({});
  const [corrigido, setCorrigido] = useState(false);
  const [moduloConcluido, setModuloConcluido] = useState(false);

  const selecionarOpcao = (qId, index) => {
    setRespostas((prev) => ({ ...prev, [qId]: index }));
    setCorrigido(false);
  };

  return (
    <MainLayout>
      <div style={{ maxWidth: '960px', margin: '0 auto', paddingBottom: '60px' }}>
        
        {/* Breadcrumb */}
        <nav style={{ display: 'flex', gap: '8px', fontSize: '12px', color: '#576a80', marginBottom: '28px' }}>
          <Link to="/estudante/estudos" style={{ color: '#185a9c', textDecoration: 'none', fontWeight: '700' }}>Estudos</Link>
          <span>/</span>
          <span>{aula.especialidade}</span>
          <span>/</span>
          <span>Conteúdo Teórico</span>
        </nav>

        {/* Cabeçalho da Aula */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '24px', marginBottom: '32px', flexWrap: 'wrap' }}>
          <div>
            <p style={{ margin: '0 0 8px', color: '#704fb3', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {aula.especialidade} · MÓDULO OFICIAL
            </p>
            <h1 style={{ margin: 0, fontSize: '42px', color: '#142945', fontWeight: '700', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
              {aula.tituloPrincipal} <em style={{ color: '#185a9c', fontStyle: 'normal' }}>{aula.tituloDestaque}</em>
            </h1>
            <p style={{ maxWidth: '580px', margin: '18px 0 0', color: '#576a80', fontSize: '15px', lineHeight: 1.7 }}>
              {aula.descricao}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', fontSize: '12px', color: '#576a80', fontWeight: '600' }}>
            <span style={{ background: '#eff3f9', padding: '6px 12px', borderRadius: '999px' }}>{aula.semestre}</span>
            <span style={{ background: '#eff3f9', padding: '6px 12px', borderRadius: '999px' }}>{aula.tempo}</span>
          </div>
        </header>

        {/* Video Placeholder (lesson-video) */}
        <section style={{ marginBottom: '28px' }}>
          <div style={{
            width: '100%',
            height: '380px',
            borderRadius: '18px',
            border: '1px solid #dce5f0',
            background: 'linear-gradient(135deg, #eaf3fd 0%, #f2edfa 100%)',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 6px 20px rgba(18, 47, 84, 0.06)'
          }}>
            <button
              type="button"
              onClick={() => alert('Reproduzindo videoaula institucional Clinify.')}
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                border: 0,
                background: '#ffffff',
                color: '#185a9c',
                fontSize: '22px',
                cursor: 'pointer',
                boxShadow: '0 12px 28px rgba(18, 47, 84, 0.14)'
              }}
            >
              ▶
            </button>
            <div style={{ position: 'absolute', bottom: '24px', left: '28px' }}>
              <span style={{ color: '#704fb3', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', display: 'block' }}>
                VIDEOAULA CLÍNICA
              </span>
              <strong style={{ color: '#142945', fontSize: '16px' }}>{aula.videoTitulo}</strong>
            </div>
          </div>
        </section>

        {/* Bloco do Professor */}
        <section style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 0 32px', borderBottom: '1px solid #dce5f0' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#185a9c', color: '#fff', display: 'grid', placeItems: 'center', fontWeight: '800', fontSize: '14px' }}>
            {aula.professorInicial}
          </div>
          <div>
            <p style={{ margin: '0 0 2px', fontSize: '11px', color: '#576a80' }}>Conteúdo revisado por</p>
            <h2 style={{ margin: '0 0 2px', fontSize: '15px', color: '#142945' }}>{aula.professorNome}</h2>
            <p style={{ margin: 0, fontSize: '12px', color: '#576a80' }}>{aula.professorCargo}</p>
          </div>
        </section>

        {/* Corpo Teórico e Highlight */}
        <article style={{ maxWidth: '760px', margin: '48px auto' }}>
          <h2 style={{ margin: '0 0 20px', fontSize: '30px', color: '#142945', fontWeight: '600' }}>{aula.secaoTitulo}</h2>
          <p style={{ color: '#576a80', fontSize: '15px', lineHeight: 1.85, marginBottom: '18px' }}>{aula.texto1}</p>
          <p style={{ color: '#576a80', fontSize: '15px', lineHeight: 1.85 }}>{aula.texto2}</p>

          <div style={{ marginTop: '32px', padding: '24px', borderLeft: '4px solid #704fb3', borderRadius: '14px', background: '#f2edfa' }}>
            <span style={{ color: '#704fb3', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase' }}>PONTO-CHAVE DA DIRETRIZ</span>
            <p style={{ margin: '8px 0 0', color: '#142945', fontSize: '18px', fontWeight: '600', lineHeight: 1.5 }}>
              "{aula.citacao}"
            </p>
          </div>
        </article>

        {/* Acordeão de Questões (questions-section) */}
        <section style={{ marginTop: '48px' }}>
          <details open style={{ borderTop: '1px solid #dce5f0', borderBottom: '1px solid #dce5f0' }}>
            <summary style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '22px 0', cursor: 'pointer', listStyle: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#eaf3fd', color: '#123f72', display: 'grid', placeItems: 'center', fontSize: '12px', fontWeight: '800' }}>
                  0{aula.questoes.length}
                </span>
                <h2 style={{ margin: 0, fontSize: '26px', color: '#142945', fontWeight: '600' }}>Questões de Fixação</h2>
              </div>
              <span style={{ color: '#185a9c', fontSize: '18px', fontWeight: 'bold' }}>▼</span>
            </summary>

            <div style={{ paddingBottom: '32px' }}>
              {aula.questoes.map((q, idx) => {
                const escolhida = respostas[q.id];
                const acertou = escolhida === q.correta;
                return (
                  <div key={q.id} style={{ padding: '24px 0', borderTop: '1px solid #dce5f0' }}>
                    <span style={{ color: '#704fb3', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase' }}>
                      QUESTÃO 0{idx + 1}
                    </span>
                    <h3 style={{ margin: '10px 0 18px', fontSize: '15px', color: '#142945', lineHeight: 1.6 }}>
                      {q.enunciado}
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {q.alternativas.map((alt, aIdx) => {
                        const selecionada = escolhida === aIdx;
                        const letra = ['A', 'B', 'C'][aIdx];
                        return (
                          <button
                            key={aIdx}
                            type="button"
                            onClick={() => selecionarOpcao(q.id, aIdx)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              padding: '12px 16px',
                              border: `1px solid ${selecionada ? '#704fb3' : '#dce5f0'}`,
                              borderRadius: '14px',
                              background: selecionada ? '#f2edfa' : '#ffffff',
                              color: '#243a56',
                              fontSize: '13px',
                              textAlign: 'left',
                              cursor: 'pointer'
                            }}
                          >
                            <span style={{
                              width: '28px',
                              height: '28px',
                              borderRadius: '50%',
                              background: selecionada ? '#704fb3' : '#eaf3fd',
                              color: selecionada ? '#ffffff' : '#123f72',
                              display: 'grid',
                              placeItems: 'center',
                              fontSize: '11px',
                              fontWeight: '800',
                              flexShrink: 0
                            }}>
                              {letra}
                            </span>
                            <span>{alt}</span>
                          </button>
                        );
                      })}
                    </div>

                    {corrigido && escolhida !== undefined && (
                      <div style={{
                        marginTop: '14px',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        fontSize: '13px',
                        background: acertou ? '#e8f6f1' : '#fff2df',
                        color: acertou ? '#087565' : '#915612'
                      }}>
                        <strong>{acertou ? 'Correto!' : 'Atenção:'}</strong> {q.explicacao}
                      </div>
                    )}
                  </div>
                );
              })}

              <button
                type="button"
                onClick={() => setCorrigido(true)}
                style={{ marginTop: '12px', padding: '10px 20px', borderRadius: '12px', border: 0, background: '#185a9c', color: '#fff', fontSize: '13px', fontWeight: '800', cursor: 'pointer' }}
              >
                Verificar respostas
              </button>
            </div>
          </details>
        </section>

        {/* Bloco Finalizar Módulo (finish-module) */}
        <section style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '24px',
          marginTop: '48px',
          padding: '28px',
          border: '1px solid #dce5f0',
          borderRadius: '18px',
          background: '#ffffff',
          boxShadow: '0 6px 20px rgba(18, 47, 84, 0.04)',
          flexWrap: 'wrap'
        }}>
          <div>
            <h2 style={{ margin: '0 0 6px', fontSize: '24px', color: '#142945', fontWeight: '600' }}>
              {moduloConcluido ? 'Módulo Concluído!' : 'Concluir estudo deste módulo'}
            </h2>
            <p style={{ margin: 0, fontSize: '13px', color: '#576a80' }}>
              {moduloConcluido
                ? 'O seu progresso foi atualizado na barra da disciplina.'
                : 'Registe a conclusão para atualizar o seu painel de desempenho.'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setModuloConcluido(true)}
            onClick={() => {
              setModuloConcluido(true);
              concluirModuloEstudo(chave);
            }}
            style={{
              padding: '12px 22px',
              borderRadius: '14px',
              border: 0,
              background: moduloConcluido ? '#087565' : '#185a9c',
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: '800',
              cursor: 'pointer'
            }}
          >
            {moduloConcluido ? '✓ Concluído' : 'Marcar como concluído →'}
          </button>
        </section>

      </div>
    </MainLayout>
  );
}