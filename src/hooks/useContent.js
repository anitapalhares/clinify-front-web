import { useState } from 'react';

const CONTEUDO_CARDIO = {
  especialidade: 'Cardiologia',
  modulo: 'Módulo 1 · Síndrome Coronariana Aguda (SCA)',
  descricao: 'Diretrizes de atendimento emergencial em dor torácica aguda e interpretação de alterações do segmento ST.',
  docente: 'Prof. Daniel Ribeiro · Médico Cardiologista',
  topicos: [
    {
      titulo: 'Avaliação Inicial e Triagem de Risco',
      texto: 'Todo paciente com dor torácica de padrão anginoso deve realizar eletrocardiograma (ECG) em até 10 minutos após a admissão na emergência hospitalar.'
    },
    {
      titulo: 'Marcadores de Necrose Miocárdica',
      texto: 'A dosagem seriada de troponina ultrassensível é mandatória para estratificação de risco e diferenciação entre angina instável e infarto agudo do miocárdio.'
    }
  ],
  questoes: [
    {
      id: 1,
      enunciado: 'Qual a conduta prioritária imediata para paciente com suspeita de infarto com supradesnível de ST?',
      opcoes: [
        'Aguardar resultado da troponina para decidir internação',
        'Realizar ECG em até 10 minutos e acionar protocolo de reperfusão',
        'Prescrever analgésico oral e liberar para repouso domiciliar'
      ],
      correta: 1,
      justificativa: 'O tempo porta-ECG inferior a 10 minutos é o padrão-ouro das diretrizes para indicar trombólise ou angioplastia primária.'
    }
  ]
};

export function useContent() {
  const [conteudo, setConteudo] = useState(CONTEUDO_CARDIO);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const simularErro = () => {
    setLoading(true);
    setTimeout(() => {
      setError('Falha ao descarregar a aula clínica do servidor (Erro 500).');
      setLoading(false);
    }, 400);
  };

  const limparErro = () => setError(null);

  return {
    conteudo,
    loading,
    error,
    simularErro,
    limparErro
  };
}