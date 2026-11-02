import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [isError, setIsError] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const preencherPerfil = (emailTeste) => {
    setEmail(emailTeste);
    setPassword('123456');
    setFeedback('');
    setIsError(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const endereco = email.trim().toLowerCase();

    if (password !== '123456' && password.length < 6) {
      setIsError(true);
      setFeedback('E-mail ou senha incorretos. Confira seus dados e tente novamente.');
      return;
    }

    const userData = login(endereco, password);
    if (userData.role === 'professor') {
      navigate('/professor', { replace: true });
    } else if (userData.role === 'administrador') {
      navigate('/admin', { replace: true });
    } else {
      navigate('/estudante/inicio', { replace: true });
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: 'minmax(320px, 470px) minmax(0, 1fr)', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Inter, sans-serif' }}>
      
      {/* Coluna Esquerda: Brand Panel Institucional */}
      <aside style={{
        display: 'flex',
        alignItems: 'center',
        padding: '64px',
        color: '#ffffff',
        background: 'linear-gradient(145deg, #123f72, #185a9c 76%, #5d62b3)',
        borderTop: '6px solid #704fb3'
      }}>
        <div style={{ maxWidth: '330px' }}>
          <p style={{ margin: '0 0 24px', fontSize: '14px', fontWeight: '600', letterSpacing: '0.4px' }}>
            Hospital Moinhos de Vento
          </p>
          <h1 style={{ margin: '0 0 14px', fontSize: '46px', fontWeight: '700', letterSpacing: '-1.5px', color: '#ffffff' }}>
            Clinify
          </h1>
          <p style={{ margin: 0, maxWidth: '250px', color: '#eaf1ff', fontSize: '15px', lineHeight: 1.7 }}>
            Aprenda. Pratique. Evolua.
          </p>

          <svg viewBox="0 0 320 60" style={{ display: 'block', width: '100%', height: 'auto', marginTop: '56px' }} aria-hidden="true">
            <defs>
              <linearGradient id="pulse-gradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#12a08b" />
                <stop offset="100%" stopColor="#ffffff" />
              </linearGradient>
            </defs>
            <polyline
              fill="none"
              stroke="url(#pulse-gradient)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points="0,30 90,30 105,8 120,52 135,30 175,30 190,14 205,44 220,30 320,30"
            />
          </svg>
        </div>
      </aside>

      {/* Coluna Direita: Form Panel */}
      <main style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 32px', background: 'linear-gradient(180deg, #ffffff, #f6f8fc)' }}>
        <div style={{ width: '100%', maxWidth: '420px', padding: '38px', border: '1px solid #dce5f0', borderRadius: '24px', background: '#ffffff', boxShadow: '0 16px 36px rgba(18, 47, 84, 0.1)' }}>
          <h2 style={{ margin: '0 0 8px', color: '#142945', fontSize: '30px', fontWeight: '650', letterSpacing: '-0.03em' }}>
            Bem-vindo de volta
          </h2>
          <p style={{ margin: '0 0 28px', color: '#576a80', fontSize: '14px', lineHeight: 1.6 }}>
            Entre para continuar seus estudos.
          </p>

          {feedback && (
            <p style={{ marginBottom: '16px', padding: '10px 12px', borderRadius: '10px', fontSize: '13px', background: isError ? '#fff0f6' : '#eaf3fd', color: isError ? '#ba4779' : '#123f72', fontWeight: '600' }}>
              {feedback}
            </p>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label htmlFor="email" style={{ display: 'block', marginBottom: '7px', color: '#243a56', fontSize: '13px', fontWeight: '700' }}>
                E-mail
              </label>
              <input
                type="email"
                id="email"
                required
                placeholder="voce@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', height: '50px', padding: '0 14px', border: '1px solid #dce5f0', borderRadius: '14px', fontSize: '14px', boxSizing: 'border-box', outline: 'none' }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label htmlFor="password" style={{ display: 'block', marginBottom: '7px', color: '#243a56', fontSize: '13px', fontWeight: '700' }}>
                Senha
              </label>
              <input
                type="password"
                id="password"
                required
                minLength={6}
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', height: '50px', padding: '0 14px', border: '1px solid #dce5f0', borderRadius: '14px', fontSize: '14px', boxSizing: 'border-box', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px', marginBottom: '26px', fontSize: '13px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#576a80', cursor: 'pointer' }}>
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} style={{ width: '16px', height: '16px', accentColor: '#704fb3' }} />
                <span>Lembrar meu e-mail</span>
              </label>

              <button
                type="button"
                onClick={() => { setIsError(false); setFeedback('Contas da Sprint: 12345678900@gmail.com | professor@clinify.com | admin@clinify.com (Senha: 123456)'); }}
                style={{ border: 0, padding: 0, background: 'transparent', color: '#123f72', fontWeight: '700', cursor: 'pointer' }}
              >
                Precisa de ajuda?
              </button>
            </div>

            <button
              type="submit"
              style={{ width: '100%', minHeight: '50px', border: 0, borderRadius: '14px', color: '#ffffff', background: 'linear-gradient(120deg, #123f72, #185a9c)', fontSize: '15px', fontWeight: '700', cursor: 'pointer' }}
            >
              Entrar
            </button>
          </form>

          {/* Atalhos Rápidos das Contas Oficiais do login.js */}
          <div style={{ marginTop: '22px', paddingTop: '16px', borderTop: '1px solid #dce5f0', display: 'flex', gap: '6px', justifyContent: 'center' }}>
            <button type="button" onClick={() => preencherPerfil('12345678900@gmail.com')} style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid #dce5f0', background: '#f6f8fc', fontSize: '11px', fontWeight: '700', color: '#123f72', cursor: 'pointer' }}>
              Estudante
            </button>
            <button type="button" onClick={() => preencherPerfil('professor@clinify.com')} style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid #dce5f0', background: '#f6f8fc', fontSize: '11px', fontWeight: '700', color: '#123f72', cursor: 'pointer' }}>
              Professor
            </button>
            <button type="button" onClick={() => preencherPerfil('admin@clinify.com')} style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid #dce5f0', background: '#f6f8fc', fontSize: '11px', fontWeight: '700', color: '#123f72', cursor: 'pointer' }}>
              Admin
            </button>
          </div>

          <p style={{ marginTop: '20px', color: '#576a80', fontSize: '13px', textAlign: 'center' }}>
            Acesse seus estudos, turmas e simulações clínicas.
          </p>
        </div>
      </main>
    </div>
  );
}