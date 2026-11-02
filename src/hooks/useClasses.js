import { useState } from 'react';

const TURMAS_INICIAIS = [
  { id: 'turma-1', nome: 'Medicina 6A', alunosCount: 42, simulacoes: 18 },
  { id: 'turma-2', nome: 'Medicina 7B', alunosCount: 37, simulacoes: 21 },
  { id: 'turma-3', nome: 'Internato Clínica', alunosCount: 29, simulacoes: 16 }
];

const ALUNOS_INICIAIS = [
  { id: 'aluno-1', nome: 'Ana Costa', turma: 'Medicina 6A', status: 'ativo' },
  { id: 'aluno-2', nome: 'Bruno Lima', turma: 'Medicina 7B', status: 'ativo' },
  { id: 'aluno-3', nome: 'Luiza Nunes', turma: 'Internato Clínica', status: 'ativo' },
  { id: 'aluno-4', nome: 'Rafael Melo', turma: 'Medicina 6A', status: 'inativo' },
  { id: 'aluno-5', nome: 'Sofia Prado', turma: 'Medicina 7B', status: 'ativo' }
];

export function useClasses() {
  const [turmas, setTurmas] = useState(TURMAS_INICIAIS);
  const [alunos, setAlunos] = useState(ALUNOS_INICIAIS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const alternarStatusAluno = (id) => {
    setAlunos((prev) =>
      prev.map((aluno) =>
        aluno.id === id
          ? { ...aluno, status: aluno.status === 'ativo' ? 'inativo' : 'ativo' }
          : aluno
      )
    );
  };

  const simularErro = () => {
    setLoading(true);
    setTimeout(() => {
      setError('Falha de sincronização com a base de turmas do Hospital (Erro 500).');
      setLoading(false);
    }, 400);
  };

  const limparErro = () => setError(null);

  const esvaziarDados = () => {
    setTurmas([]);
    setAlunos([]);
  };

  const restaurarDados = () => {
    setTurmas(TURMAS_INICIAIS);
    setAlunos(ALUNOS_INICIAIS);
    limparErro();
  };

  return {
    turmas,
    alunos,
    loading,
    error,
    alternarStatusAluno,
    simularErro,
    limparErro,
    esvaziarDados,
    restaurarDados
  };
}