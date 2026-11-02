import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { exportarDadosJSON } from '../utils/telemetry';
import { useStudentProgress } from '../hooks/useStudentProgress';

const MENUS = {
  estudante: [
    { path: '/estudante/inicio', label: 'Início', icon: 'inicio' },
    { path: '/estudante', label: 'Simulação clínica', icon: 'simulacao' },
    { path: '/estudante/estudos', label: 'Estudos', icon: 'estudos' },
    { path: '/estudante/desempenho', label: 'Desempenho', icon: 'desempenho' },
    { path: '/perfil', label: 'Meu perfil', icon: 'perfil' }
  ],
  professor: [
    { path: '/professor', label: 'Início', icon: 'inicio' },
    { path: '/professor/turmas', label: 'Minhas turmas', icon: 'turmas' },
    { path: '/professor/estudo', label: 'Área de estudo', icon: 'estudos' },
    { path: '/professor/desempenho', label: 'Desempenho', icon: 'desempenho' },
    { path: '/professor/salas', label: 'Salas de simulação', icon: 'simulacao' },
    { path: '/perfil', label: 'Meu perfil', icon: 'perfil' }
  ],
  administrador: [
    { path: '/admin', label: 'Início', icon: 'inicio' },
    { path: '/admin/professores', label: 'Professores', icon: 'professores' },
    { path: '/perfil', label: 'Meu perfil', icon: 'perfil' }
  ]
};

function MenuIcon({ name }) {
  const props = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': 'true' };
  switch (name) {
    case 'simulacao':
      return <svg {...props}><path d="M6 3v5a6 6 0 0 0 12 0V3"/><path d="M6 3H4M18 3h2M12 14v3a4 4 0 0 0 8 0v-2"/><circle cx="20" cy="13" r="2"/></svg>;
    case 'estudos':
      return <svg {...props}><path d="M4 5.5A3.5 3.5 0 0 1 7.5 2H11v17H7.5A3.5 3.5 0 0 0 4 22z"/><path d="M20 5.5A3.5 3.5 0 0 0 16.5 2H13v17h3.5A3.5 3.5 0 0 1 20 22z"/></svg>;
    case 'desempenho':
      return <svg {...props}><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></svg>;
    case 'perfil':
      return <svg {...props}><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>;
    case 'turmas':
      return <svg {...props}><circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 20a6 6 0 0 1 12 0M14 15a5 5 0 0 1 7 5"/></svg>;
    case 'professores':
      return <svg {...props}><circle cx="9" cy="7" r="3"/><path d="M3 20a6 6 0 0 1 12 0M16 4h5v10h-5M18 8h1"/></svg>;
    default:
      return <svg {...props}><path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10M9 20v-6h6v6"/></svg>;
  }
}


function TopbarAvatarSvg({ tipo }) {
  const props = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', width: 18, height: 18 };
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

export default function MainLayout({ children, showSearch = false, pageClass = 'app-content' }) {
  const { user, logout } = useAuth();
  const { progresso } = useStudentProgress();
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const role = user?.role || 'estudante';
  const menuItems = MENUS[role] || MENUS.estudante;
  const initials = role === 'professor' ? 'PR' : role === 'administrador' ? 'AD' : 'ES';

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      const dest = role === 'estudante' ? '/estudante/estudos' : role === 'professor' ? '/professor/turmas' : '/admin/professores';
      navigate(`${dest}?busca=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <div className={`app-shell ${collapsed ? 'is-collapsed' : ''} ${mobileOpen ? 'is-mobile-open' : ''}`}>
      <aside className="sidebar">
        <button
          className="sidebar__toggle"
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? 'Expandir menu' : 'Recolher menu'}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <div className="sidebar__brand">
          <span className="sidebar__mark">C</span>
          <span className="sidebar__brand-text">
            <span className="sidebar__eyebrow">Hospital Moinhos de Vento</span>
            <span className="sidebar__wordmark">Clinify</span>
          </span>
        </div>

        <nav aria-label="Navegação principal">
          <ul className="sidebar__nav">
            {menuItems.map((item) => {
              const active = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`sidebar__link ${active ? 'is-active' : ''}`}
                    aria-current={active ? 'page' : undefined}
                  >
                    <MenuIcon name={item.icon} />
                    <span className="sidebar__link-text">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <button
          type="button"
          onClick={exportarDadosJSON}
          className="sidebar__link sidebar__export"
          aria-label="Salvar dados na pasta do Python"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 3v12M7 10l5 5 5-5" />
            <path d="M4 17v3h16v-3" />
          </svg>
          <span className="sidebar__link-text">Salvar dados</span>
        </button>

        <button
          type="button"
          onClick={logout}
          className="sidebar__link sidebar__login"
          style={{ width: '100%', borderLeft: 0, borderRight: 0, borderBottom: 0, background: 'transparent', cursor: 'pointer', textAlign: 'left' }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M10 4H4v16h6M14 8l4 4-4 4M8 12h10" />
          </svg>
          <span className="sidebar__link-text">Voltar ao login</span>
        </button>
      </aside>

      <div className="sidebar__backdrop" onClick={() => setMobileOpen(false)}></div>

      <div className="app-main">
        <header className="topbar">
          <button
            className="topbar__menu-btn"
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Abrir menu"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="7" x2="20" y2="7" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="17" x2="20" y2="17" />
            </svg>
          </button>

          {showSearch && (
            <div className="topbar__search">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Buscar…"
                aria-label="Buscar"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleSearchKeyDown}
              />
            </div>
          )}

          <div className="topbar__spacer"></div>

          <button
            className="topbar__bell"
            type="button"
            aria-label="Notificações"
            onClick={() => setNotifOpen(!notifOpen)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 8a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6" />
              <path d="M10 20a2 2 0 0 0 4 0" />
            </svg>
            <span className="dot"></span>
          </button>

          <div className="notifications" hidden={!notifOpen}>
            <h4>Notificações</h4>
            <ul>
              <li>Nova mensagem de estudos</li>
              <li>Atualização de desempenho</li>
              <li>Simulação clínica disponível</li>
            </ul>
          </div>

          <Link to="/perfil" className={`topbar__avatar ${location.pathname === '/perfil' ? 'is-active' : ''}`} title="Meu perfil">
            {role === 'estudante' ? (
              <TopbarAvatarSvg tipo={progresso.iconePerfil} />
            ) : (
              <span className="topbar__avatar-initials">{initials}</span>
            )}
          </Link>
        </header>

        <main className={pageClass} id="conteudo-principal">
          {children}
        </main>

        {/* Rodapé Universal com 4 Desenvolvedores, sem Logo e Links para Moinhos e FIAP */}
        <footer style={{ background: '#fff', borderTop: '1px solid #dce5f0', padding: '40px 48px 24px', marginTop: 'auto', fontSize: '13px', color: '#576a80' }}>
          <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '32px', marginBottom: '32px' }}>
            
            {/* Coluna Esquerda: Descrição e Desenvolvedores (4 nomes, sem Instagram) */}
            <div style={{ maxWidth: '520px' }}>
              <p style={{ margin: '0 0 20px', lineHeight: 1.6 }}>
                Transformando a aprendizagem médica através da tecnologia, gamificação e simulações clínicas interativas, aproximando teoria e prática de forma moderna, acessível e inovadora.
              </p>
              
              <strong style={{ display: 'block', color: '#142945', marginBottom: '10px', fontSize: '14px' }}>Desenvolvedores</strong>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 24px' }}>
                <span>• Anita Palhares</span>
                <span>• Kauã Coelho</span>
                <span>• Vitória Kereski</span>
                <span>• Carlos Alberto</span>
              </div>
            </div>

            {/* Coluna Direita: Links Genéricos (Saiba mais...) */}
            <div>
              <strong style={{ display: 'block', color: '#142945', marginBottom: '12px', fontSize: '14px', borderBottom: '1px solid #dce5f0', paddingBottom: '6px' }}>
                Saiba mais...
              </strong>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <li>
                  <a href="https://www.hospitalmoinhos.org.br/institucional" target="_blank" rel="noreferrer" style={{ color: '#185a9c', textDecoration: 'none', fontWeight: '600' }}>
                    Hospital Moinhos de Vento
                  </a>
                </li>
                <li>
                  <a href="https://faculdademoinhos.com.br/" target="_blank" rel="noreferrer" style={{ color: '#185a9c', textDecoration: 'none', fontWeight: '600' }}>
                    Faculdade Moinhos de Vento
                  </a>
                </li>
                <li>
                  <a href="https://www.fiap.com.br" target="_blank" rel="noreferrer" style={{ color: '#185a9c', textDecoration: 'none', fontWeight: '600' }}>
                    FIAP
                  </a>
                </li>
              </ul>
            </div>

          </div>

          {/* Copyright Inferior */}
          <div style={{ maxWidth: '1240px', margin: '0 auto', borderTop: '1px solid #eff3f9', paddingTop: '20px', textAlign: 'center', fontSize: '12px' }}>
            © 2026 Clinify. Todos os direitos reservados.
          </div>
        </footer>
      </div>
    </div>
  );
}