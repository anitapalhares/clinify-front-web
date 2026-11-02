import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/MainLayout';
import { useStudentProgress } from '../../hooks/useStudentProgress';

const MATERIAS_MODELO = {
  cardiologia: {
    L: 100, A: 3, k: 0.6, tMax: 9,
    cor: '#185a9c',
    observados: [{ t: 1, d: 40 }, { t: 2, d: 50 }, { t: 4, d: 80 }, { t: 6, d: 90 }, { t: 8, d: 100 }]
  },
  anatomia: {
    L: 100, A: 4, k: 0.3, tMax: 9,
    cor: '#704fb3',
    observados: [{ t: 1, d: 25 }, { t: 2, d: 30 }, { t: 5, d: 55 }, { t: 6, d: 60 }, { t: 8, d: 75 }]
  }
};

function desempenho(t, A, k, L) {
  return L / (1 + A * Math.exp(-k * t));
}

function velocidade(t, A, k, L) {
  const D = desempenho(t, A, k, L);
  return k * D * (1 - D / L);
}

function GraficoCurvaSVG({ dados }) {
  const LARGURA = 640, ALTURA = 260;
  const MARGEM = { top: 16, right: 16, bottom: 40, left: 42 };
  const L_UTIL = LARGURA - MARGEM.left - MARGEM.right;
  const A_UTIL = ALTURA - MARGEM.top - MARGEM.bottom;

  const escX = (t) => MARGEM.left + (t / dados.tMax) * L_UTIL;
  const escY = (val) => MARGEM.top + A_UTIL - (val / 110) * A_UTIL;

  const pontos = [];
  for (let t = 0; t <= dados.tMax + 1e-9; t += 0.2) {
    pontos.push(`${t === 0 ? 'M' : 'L'}${escX(t).toFixed(1)},${escY(desempenho(t, dados.A, dados.k, dados.L)).toFixed(1)}`);
  }

  const tInflexao = Math.log(dados.A) / dados.k;
  const xInf = escX(tInflexao).toFixed(1);
  const yInf = escY(dados.L / 2).toFixed(1);
  const yAsintota = escY(dados.L).toFixed(1);

  return (
    <svg viewBox={`0 0 ${LARGURA} ${ALTURA}`} className="grafico-svg" role="img" aria-label="Curva de desempenho">
      {[0, 25, 50, 75, 100].map((v) => (
        <g key={v}>
          <line x1={MARGEM.left} y1={escY(v)} x2={MARGEM.left + L_UTIL} y2={escY(v)} stroke="#dce5f0" strokeWidth="1" />
          <text x={MARGEM.left - 8} y={escY(v)} textAnchor="end" dominantBaseline="middle" fontSize="11" fill="#576a80">{v}</text>
        </g>
      ))}
      {[0, 2, 4, 6, 8].map((t) => (
        <text key={t} x={escX(t)} y={MARGEM.top + A_UTIL + 16} textAnchor="middle" fontSize="11" fill="#576a80">{t}</text>
      ))}
      <line x1={MARGEM.left} y1={yAsintota} x2={MARGEM.left + L_UTIL} y2={yAsintota} stroke="#576a80" strokeWidth="1" strokeDasharray="4 4" />
      <path d={pontos.join(' ')} fill="none" stroke={dados.cor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {dados.observados.map((p, i) => (
        <circle key={i} cx={escX(p.t)} cy={escY(p.d)} r="5" fill="#ffffff" stroke={dados.cor} strokeWidth="2" />
      ))}
      <polygon points={`${xInf},${parseFloat(yInf) - 7} ${parseFloat(xInf) - 6},${parseFloat(yInf) + 5} ${parseFloat(xInf) + 6},${parseFloat(yInf) + 5}`} fill="#ba4779" />
      <text x={LARGURA / 2} y={ALTURA - 6} textAnchor="middle" fontSize="10" fill="#576a80">Atividade (t)</text>
    </svg>
  );
}

function GraficoVelocidadeSVG() {
  const LARGURA = 640, ALTURA = 260;
  const MARGEM = { top: 16, right: 16, bottom: 40, left: 42 };
  const L_UTIL = LARGURA - MARGEM.left - MARGEM.right;
  const A_UTIL = ALTURA - MARGEM.top - MARGEM.bottom;
  const tMax = 9, vMax = 16;

  const escX = (t) => MARGEM.left + (t / tMax) * L_UTIL;
  const escY = (v) => MARGEM.top + A_UTIL - (v / vMax) * A_UTIL;

  const gerarPath = (m) => {
    const pts = [];
    for (let t = 0; t <= tMax + 1e-9; t += 0.2) {
      pts.push(`${t === 0 ? 'M' : 'L'}${escX(t).toFixed(1)},${escY(velocidade(t, m.A, m.k, m.L)).toFixed(1)}`);
    }
    return pts.join(' ');
  };

  return (
    <>
      <svg viewBox={`0 0 ${LARGURA} ${ALTURA}`} className="grafico-svg" role="img" aria-label="Comparativo de velocidade">
        {[0, 4, 8, 12, 16].map((v) => (
          <g key={v}>
            <line x1={MARGEM.left} y1={escY(v)} x2={MARGEM.left + L_UTIL} y2={escY(v)} stroke="#dce5f0" strokeWidth="1" />
            <text x={MARGEM.left - 8} y={escY(v)} textAnchor="end" dominantBaseline="middle" fontSize="11" fill="#576a80">{v}</text>
          </g>
        ))}
        {[0, 2, 4, 6, 8].map((t) => (
          <text key={t} x={escX(t)} y={MARGEM.top + A_UTIL + 16} textAnchor="middle" fontSize="11" fill="#576a80">{t}</text>
        ))}
        <path d={gerarPath(MATERIAS_MODELO.cardiologia)} fill="none" stroke="#123f72" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d={gerarPath(MATERIAS_MODELO.anatomia)} fill="none" stroke="#704fb3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <text x={LARGURA / 2} y={ALTURA - 2} textAnchor="middle" fontSize="10" fill="#576a80">Atividade (t)</text>
      </svg>
      <div className="grafico-legenda">
        <span><i style={{ background: '#123f72' }}></i>Cardiologia</span>
        <span><i style={{ background: '#704fb3' }}></i>Anatomia</span>
      </div>
    </>
  );
}

export default function HomeEstudante() {
  const navigate = useNavigate();

  useEffect(() => {
    document.body.className = 'pagina-inicio';
    return () => { document.body.className = ''; };
  }, []);

  return (
    <MainLayout showSearch={true}>
      <section className="resumo-progresso" aria-label="Seu progresso salvo">
        <h2>Seu progresso</h2>
        <p>Cardiologia: módulo ainda não concluído. Nenhuma simulação finalizada.</p>
      </section>

      <h1 className="page-title">Bem-vindo!</h1>
      <p className="page-subtitle">Continue sua jornada de aprendizado médico</p>

      <div className="stat-grid">
        <div className="stat-card">
          <span className="stat-card__icon stat-card__icon--flame">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2c1 3-3 4-3 8a3 3 0 0 0 6 0c1 1 2 2.5 2 4.5A5 5 0 0 1 7 15c0-5 5-6 5-13Z" />
            </svg>
          </span>
          <span className="stat-card__value">7</span>
          <span className="stat-card__label">Dias consecutivos</span>
          <span className="stat-card__hint">Recorde pessoal</span>
        </div>

        <div className="stat-card">
          <span className="stat-card__icon stat-card__icon--purple">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 21h8" /><path d="M12 17v4" /><path d="M7 4h10v4a5 5 0 0 1-10 0Z" /><path d="M7 5H4v1a4 4 0 0 0 4 4" /><path d="M17 5h3v1a4 4 0 0 1-4 4" />
            </svg>
          </span>
          <span className="stat-card__value">12</span>
          <span className="stat-card__label">Nível atual</span>
          <div className="stat-card__bar"><span className="bar--60"></span></div>
        </div>

        <div className="stat-card">
          <span className="stat-card__icon stat-card__icon--blue">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="3" />
            </svg>
          </span>
          <span className="stat-card__value">75%</span>
          <span className="stat-card__label">Meta diária</span>
        </div>

        <div className="stat-card">
          <span className="stat-card__icon stat-card__icon--lilac">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </span>
          <span className="stat-card__value">89%</span>
          <span className="stat-card__label">Taxa de acertos</span>
          <span className="stat-card__hint stat-card__hint--up">+5% esta semana</span>
        </div>

        <div className="stat-card stat-card--cta">
          <span className="stat-card__cta-label">Desafio Diário</span>
          <button type="button" className="stat-card__cta-btn" onClick={() => navigate('/estudante')}>
            Iniciar
          </button>
        </div>
      </div>

      <section className="evolucao-desempenho" aria-labelledby="evolucao-titulo">
        <div className="evolucao-cabecalho">
          <h2 id="evolucao-titulo">Evolução do seu desempenho</h2>
          <p>Modelo baseado na curva de aprendizado (função logística) a partir das suas atividades em cada matéria</p>
        </div>

        <div className="evolucao-grid">
          <article className="evolucao-card">
            <div className="evolucao-card__head">
              <h3>Cardiologia</h3>
              <span className="evolucao-badge evolucao-badge--rapido">Evolução rápida</span>
            </div>
            <div className="grafico-container">
              <GraficoCurvaSVG dados={MATERIAS_MODELO.cardiologia} />
            </div>
            <ul className="evolucao-metrics">
              <li><strong>97,6%</strong><span>Desempenho atual</span></li>
              <li><strong>t ≈ 1,8</strong><span>Pico de velocidade</span></li>
              <li><strong>Desacelerando</strong><span>Fase atual</span></li>
            </ul>
          </article>

          <article className="evolucao-card">
            <div className="evolucao-card__head">
              <h3>Anatomia</h3>
              <span className="evolucao-badge evolucao-badge--lenta">Evolução gradual</span>
            </div>
            <div className="grafico-container">
              <GraficoCurvaSVG dados={MATERIAS_MODELO.anatomia} />
            </div>
            <ul className="evolucao-metrics">
              <li><strong>73,4%</strong><span>Desempenho atual</span></li>
              <li><strong>t ≈ 4,6</strong><span>Pico de velocidade</span></li>
              <li><strong>Ainda acelerando</strong><span>Fase atual</span></li>
            </ul>
          </article>
        </div>

        <article className="evolucao-card evolucao-card--comparativo">
          <div className="evolucao-card__head">
            <h3>Comparativo: ritmo de evolução (velocidade de aprendizado)</h3>
          </div>
          <div className="grafico-container">
            <GraficoVelocidadeSVG />
          </div>
          <p className="evolucao-nota">
            Em Cardiologia, você já passou pelo pico de ritmo de aprendizado (por volta da atividade 2) e agora está estabilizando perto de 100%. Em Anatomia, o pico de ritmo ainda está por vir (por volta da atividade 5) — ou seja, essa é a matéria com mais espaço para evoluir rápido se você continuar praticando.
          </p>
        </article>
      </section>
    </MainLayout>
  );
}