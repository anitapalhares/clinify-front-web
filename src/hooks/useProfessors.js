import { useState, useEffect } from 'react';

const PROFESSORES_MOCK = [
  { id: 'prof-1', nome: 'Prof. Daniel Ribeiro', email: 'daniel.ribeiro@clinify.com', status: 'ativo' },
  { id: 'prof-2', nome: 'Profa. Helena Martins', email: 'helena.martins@clinify.com', status: 'ativo' },
  { id: 'prof-3', nome: 'Prof. Caio Andrade', email: 'caio.andrade@clinify.com', status: 'inativo' }
];

export function useProfessors() {
  const [professores, setProfessores] = useState(() => {
    const saved = localStorage.getItem('clinify_professores');
    return saved ? JSON.parse(saved) : PROFESSORES_MOCK;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    localStorage.setItem('clinify_professores', JSON.stringify(professores));
  }, [professores]);

  const alternarStatus = (id) => {
    setProfessores((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: p.status === 'ativo' ? 'inativo' : 'ativo' } : p))
    );
  };

  const salvarProfessor = ({ id, nome, email }) => {
    if (id) {
      setProfessores((prev) =>
        prev.map((p) => (p.id === id ? { ...p, nome, email } : p))
      );
    } else {
      const novo = {
        id: 'prof-' + Date.now(),
        nome,
        email,
        status: 'ativo'
      };
      setProfessores((prev) => [novo, ...prev]);
    }
  };

  const simularErro = () => {
    setLoading(true);
    setTimeout(() => {
      setError('Falha de comunicação com a base de dados do Administrador (500).');
      setLoading(false);
    }, 400);
  };

  const limparErro = () => setError(null);

  return {
    professores,
    loading,
    error,
    alternarStatus,
    salvarProfessor,
    simularErro,
    limparErro
  };
}