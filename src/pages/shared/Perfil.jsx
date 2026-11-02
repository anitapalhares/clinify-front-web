import { useEffect } from 'react';
import MainLayout from '../../components/MainLayout';
import { useProfile } from '../../hooks/useProfile';
import { useStudentProgress } from '../../hooks/useStudentProgress';

const ICONES_DISPONIVEIS = [
  { id: 'plant', label: 'Semente Clínica', minNivel: 1 },
  { id: 'heart', label: 'Cardio Vital', minNivel: 1 },
  { id: 'brain', label: 'Sinapse Neural', minNivel: 2 },
  { id: 'trophy', label: 'Destaque HMV', minNivel: 3 }
];

function PerfilAvatarSvg({ tipo }) {
  const props = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', width: 22, height: 22 };
  if (tipo === 'heart') {
    return <svg {...props}><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/></svg>;
  }
  if (tipo === 'brain') {
    return <svg {...props}><circle cx="12" cy="12" r="8"/><path d="M12 8v8M8 12h8"/></svg>;
  }
  if (tipo === 'trophy') {
    return <svg {...props}><path d="M8 21h8M12 17v4M7 4h10v4a5 5 0 0 1-10 0Z"/></svg>;
  }
  return (
    <svg {...props}>
      <path d="M12 22v-9" />
      <path d="M12 13c-4.5 0-7-3-7-7 4.5 0 7 3 7 7Z" />
      <path d="M12 13c4.5 0 7-3 7-7-4.5 0-7 3-7 7Z" />
    </svg>
  );
}

export default function Perfil() {
  const {
    nome,
    email,
    role,
    loading,
    error,
    sucesso,
    setNome,
    setEmail,
    atualizarPerfil,
    limparAvisos
  } = useProfile();

  const { progresso, alterarIconePerfil } = useStudentProgress();

  useEffect(() => {
    document.body.className = 'pagina-painel';
    return () => { document.body.className = ''; };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    atualizarPerfil(nome, email);
  };

  const xpNoNivelAtual = progresso.xp % 250;
  const xpFaltante = 250 - xpNoNivelAtual;

  return (
    <MainLayout pageClass="panel-page perfil-estudante">
      <div className="page-header">
        <div>
          <h1 className="page-title">Meu perfil</h1>
          <p className="page-subtitle">Seu perfil, sua evolução e suas conquistas.</p>
        </div>
      </div>

      {error && (
        <div style={{ background: '#fff0f6', border: '1px solid #f1c7d5', color: '#ba4779', padding: '14px', marginBottom: '20px', borderRadius: '14px', fontSize: '13px' }}>
          <strong>Erro:</strong> {error}
          <button type="button" onClick={limparAvisos} style={{ marginLeft: '12px' }}>Fechar</button>
        </div>
      )}

      {sucesso && !error && (
        <div style={{ background: '#e8f6f1', border: '1px solid #b7e1cd', color: '#087565', padding: '14px', marginBottom: '20px', borderRadius: '14px', fontSize: '13px', fontWeight: '700' }}>
          Perfil atualizado com sucesso.
        </div>
      )}

      <div className="perfil-organizacao">
        <form className="stat-card profile-card" onSubmit={handleSubmit}>
          <div className="profile-summary">
            <div className="profile-avatar">
              <PerfilAvatarSvg tipo={progresso.iconePerfil} />
            </div>
            <div>
              <p className="profile-name">{nome || 'Estudante Clinify'}</p>
              <p className="profile-email">{email || '12345678900@gmail.com'}</p>
            </div>
          </div>

          <a className="perfil-colecao-link" href="#colecao-icones">Escolher ícone do perfil</a>
          <h2 className="perfil-dados-titulo">Seus dados</h2>

          <div className="modal-field">
            <label htmlFor="perfil-nome">Nome</label>
            <input
              type="text"
              id="perfil-nome"
              required
              minLength={2}
              value={nome}
              onChange={(e) => { limparAvisos(); setNome(e.target.value); }}
            />
          </div>

          <div className="modal-field">
            <label htmlFor="perfil-email">E-mail</label>
            <input
              type="email"
              id="perfil-email"
              required
              value={email}
              onChange={(e) => { limparAvisos(); setEmail(e.target.value); }}
            />
          </div>

          <button type="submit" className="btn btn--primary" disabled={loading}>
            Salvar alterações
          </button>
        </form>

        {role === 'estudante' && (
          <section id="colecao-icones" className="jornada-card" tabIndex="-1" aria-label="Níveis e conquistas">
            <div className="jornada-cabecalho">
              <div>
                <p className="jornada-selo">Sua jornada Clinify</p>
                <h2>Cada prática conta.</h2>
                <p>Transforme sua dedicação em novas conquistas.</p>
              </div>
              <span className="jornada-nivel">Nível {progresso.nivel}</span>
            </div>

            <div className="jornada-numeros">
              <div>
                <strong>{progresso.xp}</strong>
                <span>XP acumulado</span>
              </div>
              <div>
                <strong>{progresso.casosConcluidos}</strong>
                <span>Casos concluídos</span>
              </div>
              <div>
                <strong>{progresso.modulosConcluidos.length}</strong>
                <span>Módulos concluídos</span>
              </div>
            </div>

            <label htmlFor="xp-progress" style={{ fontSize: '12px', fontWeight: '700', color: '#243a56' }}>
              {xpFaltante} XP para o nível {progresso.nivel + 1}
            </label>
            <progress id="xp-progress" value={xpNoNivelAtual} max="250"></progress>

            <div className="jornada-proximo">
              <strong>Próxima conquista:</strong>{' '}
              {progresso.casosConcluidos === 0
                ? 'Conclua 1 caso clínico'
                : progresso.modulosConcluidos.length === 0
                ? 'Conclua 1 módulo de estudo'
                : 'Alcance o próximo nível de residência'}
            </div>

            {/* Seletor de Ícones do Perfil */}
            <div style={{ margin: '18px 0', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {ICONES_DISPONIVEIS.map((ic) => {
                const liberado = progresso.nivel >= ic.minNivel;
                const ativo = progresso.iconePerfil === ic.id;
                return (
                  <button
                    key={ic.id}
                    type="button"
                    disabled={!liberado}
                    onClick={() => alterarIconePerfil(ic.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 12px',
                      borderRadius: '12px',
                      border: ativo ? '2px solid #704fb3' : '1px solid #dce5f0',
                      background: !liberado ? '#eff3f9' : ativo ? '#f2edfa' : '#fff',
                      color: !liberado ? '#8ea0ae' : '#142945',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: liberado ? 'pointer' : 'not-allowed'
                    }}
                  >
                    <span style={{ width: '20px', height: '20px', display: 'grid', placeItems: 'center' }}>
                      <PerfilAvatarSvg tipo={ic.id} />
                    </span>
                    <span>{ic.label} {!liberado && `(Nível ${ic.minNivel})`}</span>
                  </button>
                );
              })}
            </div>

            <details className="jornada-ajuda">
              <summary style={{ cursor: 'pointer', fontSize: '13px', fontWeight: '700', color: '#123f72' }}>
                Como ganhar XP?
              </summary>
              <p className="jornada-regras" style={{ fontSize: '13px', color: '#576a80', marginTop: '8px', lineHeight: 1.5 }}>
                Você ganha +100 XP ao marcar módulos de estudo como concluídos e até +100 XP ao finalizar simulações clínicas com pacientes virtuais.
              </p>
            </details>
          </section>
        )}
      </div>
    </MainLayout>
  );
}