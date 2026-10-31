import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password) {
      const logged = login(email, password);
      navigate(`/${logged.role}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-950 text-slate-100 font-sans">
      <aside className="w-full md:w-5/12 bg-slate-900 border-b md:border-b-0 md:border-r border-slate-800 p-8 md:p-12 flex flex-col justify-center">
        <div className="max-w-md mx-auto space-y-4">
          <p className="text-xs font-semibold tracking-wider text-emerald-400 uppercase">
            Hospital Moinhos de Vento
          </p>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white">
            Clinify
          </h1>
          <p className="text-slate-400 text-base">
            Aprenda. Pratique. Evolua.
          </p>
          <svg className="w-full h-12 pt-2 text-emerald-400" viewBox="0 0 320 60" fill="none" stroke="currentColor">
            <polyline strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" points="0,30 90,30 105,8 120,52 135,30 175,30 190,14 205,44 220,30 320,30" />
          </svg>
        </div>
      </aside>

      <main className="w-full md:w-7/12 flex items-center justify-center p-8 md:p-12">
        <div className="w-full max-w-md space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-white">Bem-vindo de volta</h2>
            <p className="text-slate-400 text-sm mt-1">Acesse suas simulações e turmas.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-300 block mb-1">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="aluno@clinify.com ou prof@clinify.com"
                required
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-300 block mb-1">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Qualquer senha"
                required
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 transition-colors text-white font-semibold rounded-lg shadow"
            >
              Entrar
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}