import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export function useProfile() {
  const { user, login } = useAuth();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sucesso, setSucesso] = useState(false);

  useEffect(() => {
    if (user) {
      setNome(user.nome || (user.role === 'professor' ? 'Professor Clinify' : 'Estudante Clinify'));
      setEmail(user.email || '');
    }
  }, [user]);

  const atualizarPerfil = (novoNome, novoEmail) => {
    setLoading(true);
    setError(null);
    setSucesso(false);

    setTimeout(() => {
      if (!novoNome.trim() || !novoEmail.trim()) {
        setError('Preencha todos os campos obrigatórios.');
        setLoading(false);
        return;
      }

      const dadosAtualizados = {
        ...user,
        nome: novoNome.trim(),
        email: novoEmail.trim()
      };

      // Atualiza a sessão persistente no AuthContext
      login(dadosAtualizados.email, 'manter-sessao');
      setNome(dadosAtualizados.nome);
      setEmail(dadosAtualizados.email);

      setSucesso(true);
      setLoading(false);
    }, 400);
  };

  const simularErro = () => {
    setLoading(true);
    setTimeout(() => {
      setError('Falha ao gravar as alterações no servidor central (Erro 500).');
      setLoading(false);
    }, 300);
  };

  const limparAvisos = () => {
    setError(null);
    setSucesso(false);
  };

  return {
    nome,
    email,
    role: user?.role || 'estudante',
    loading,
    error,
    sucesso,
    setNome,
    setEmail,
    atualizarPerfil,
    simularErro,
    limparAvisos
  };
}