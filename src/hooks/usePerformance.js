import { useState } from 'react';

const DADOS_DESEMPENHO_MOCK = {
  metricasGerais: {
    mediaGeral: 82,
    simulacoesConcluidas: 14,
    tempoMedioMinutos: 18,
    casosPendentes: 3
  },
  especialidades: [
    { nome: 'Cardiologia', acertos: 88, questoes: 24, nivel: 'Avançado' },
    { nome: 'Anatomia', acertos: 75, questoes: 18, nivel: 'Intermédio' },
    { nome: 'Pneumologia', acertos: 60, questoes: 12, nivel: 'Básico' },
    { nome: 'Neurologia', acertos: 82, questoes: 15, nivel: 'Avançado' },
    { nome: 'Gastroenterologia', acertos: 90, questoes: 10, nivel: 'Avançado' }
  ],
  historicoAtividades: [
    { data: 'Ontem', atividade: 'Dor Torácica e Suspeita de SCA', nota: 92, status: 'Aprovado' },
    { data: '3 dias atrás', atividade: 'Cefaleia Intensa Inédita', nota: 78, status: 'Aprovado' },
    { data: '1 semana atrás', atividade: 'Dispneia em Sala de Emergência', nota: 84, status: 'Aprovado' }
  ]
};

export function usePerformance() {
  const [dados, setDados] = useState(DADOS_DESEMPENHO_MOCK);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const simularErro = () => {
    setLoading(true);
    setTimeout(() => {
      setError('Falha ao carregar relatórios analíticos de desempenho (Erro 500).');
      setLoading(false);
    }, 400);
  };

  const limparErro = () => setError(null);

  const esvaziarDados = () => {
    setDados({
      metricasGerais: { mediaGeral: 0, simulacoesConcluidas: 0, tempoMedioMinutos: 0, casosPendentes: 0 },
      especialidades: [],
      historicoAtividades: []
    });
  };

  const restaurarDados = () => {
    setDados(DADOS_DESEMPENHO_MOCK);
    limparErro();
  };

  return {
    dados,
    loading,
    error,
    simularErro,
    limparErro,
    esvaziarDados,
    restaurarDados
  };
}