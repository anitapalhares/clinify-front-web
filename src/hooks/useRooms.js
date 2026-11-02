import { useState, useEffect } from 'react';

const SALAS_INICIAIS = [
  {
    codigo: 'MED6A1',
    nome: 'Anamnese de Emergência',
    turma: 'Medicina 6A',
    cenario: 'Cefaleia intensa inédita · Clínica Médica',
    instrucoes: 'Praticar abordagem diagnóstica e busca ativa de sinais de alerta.',
    status: 'aberta',
    criado: new Date().toISOString(),
    tentativas: [
      { id: 't-1', aluno: 'Ana Costa', estado: 'concluída', pontos: 92, segundos: 240, respostas: ['Quando começou a dor?', 'Tomei paracetamol?'] },
      { id: 't-2', aluno: 'Bruno Lima', estado: 'em andamento', pontos: null, segundos: null, respostas: ['Boa tarde, o que sente?'] }
    ]
  }
];

function gerarCodigo(salasExistentes) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let codigo = '';
  do {
    codigo = Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  } while (salasExistentes.some((s) => s.codigo === codigo));
  return codigo;
}

export function useRooms() {
  const [salas, setSalas] = useState(() => {
    const saved = localStorage.getItem('clinify_salas');
    return saved ? JSON.parse(saved) : SALAS_INICIAIS;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    localStorage.setItem('clinify_salas', JSON.stringify(salas));
  }, [salas]);

  const criarSala = ({ nome, turma, instrucoes, cenario }) => {
    const nova = {
      codigo: gerarCodigo(salas),
      nome,
      turma,
      cenario: cenario || 'Cefaleia intensa inédita · Clínica Médica',
      instrucoes: instrucoes || '',
      status: 'aberta',
      criado: new Date().toISOString(),
      tentativas: []
    };
    setSalas((prev) => [nova, ...prev]);
    return nova.codigo;
  };

  const editarSala = (codigo, dadosAtualizados) => {
    setSalas((prev) =>
      prev.map((s) => (s.codigo === codigo ? { ...s, ...dadosAtualizados } : s))
    );
  };

  const alternarStatusSala = (codigo) => {
    setSalas((prev) =>
      prev.map((s) => (s.codigo === codigo ? { ...s, status: s.status === 'aberta' ? 'encerrada' : 'aberta' } : s))
    );
  };

  const excluirSala = (codigo) => {
    setSalas((prev) => prev.filter((s) => s.codigo !== codigo));
  };

  const simularErro = () => {
    setLoading(true);
    setTimeout(() => {
      setError('Falha na comunicação com o serviço de salas (Erro 500).');
      setLoading(false);
    }, 400);
  };

  const limparErro = () => setError(null);

  return {
    salas,
    loading,
    error,
    criarSala,
    editarSala,
    alternarStatusSala,
    excluirSala,
    simularErro,
    limparErro
  };
}