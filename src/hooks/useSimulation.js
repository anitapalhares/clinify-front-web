import { useState } from 'react';

// Base de dados clínica simulada (Hospital Moinhos de Vento)
const CASOS_MOCK = [
  {
    id: 'cardio-101',
    titulo: 'Dor Torácica Aguda em Sala de Emergência',
    area: 'Cardiologia',
    paciente: {
      nome: 'J. M. S.',
      idade: 58,
      historico: 'Hipertenso e tabagista. Relata dor retroesternal em aperto há 40 minutos com irradiação para o membro superior esquerdo.'
    },
    perguntas: [
      {
        enunciado: 'Diante do quadro clínico inicial na triagem, qual é a conduta prioritária imediata?',
        opcoes: [
          'Solicitar radiografia de tórax e aguardar resultado',
          'Realizar Eletrocardiograma (ECG) em até 10 minutos',
          'Prescrever analgésico comum e manter sob observação por 2 horas',
          'Aguardar o resultado da primeira curva de troponina'
        ],
        correta: 1,
        feedback: 'Correto. A diretriz de dor torácica exige ECG em menos de 10 minutos para triagem de IAM com supra de ST.'
      },
      {
        enunciado: 'O ECG evidencia supradesnivelamento do segmento ST em derivações anteriores (V1 a V4). Qual a conduta indicada?',
        opcoes: [
          'Encaminhar para terapia de reperfusão imediata (angioplastia primária)',
          'Administrar sedativo e agendar consulta ambulatorial',
          'Solicitar ecocardiograma transtorácico de rotina em 24h',
          'Dar alta com orientações de repouso'
        ],
        correta: 0,
        feedback: 'Exato. O achado confirma infarto agudo do miocárdio com supra de ST, demandando reperfusão urgente.'
      }
    ]
  }
];

export function useSimulation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [casoAtual, setCasoAtual] = useState(null);
  const [etapa, setEtapa] = useState(0);
  const [pontos, setPontos] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [concluido, setConcluido] = useState(false);

  // Simula requisição assíncrona com tratamento de estados
  const carregarCaso = (id) => {
  setLoading(true);
  setError(null);
  setCasoAtual(null);
  setConcluido(false);
  setEtapa(0);
  setPontos(0);
  setFeedback('');

  setTimeout(() => {
    // Simula erro de conexão se o id for inválido ou forçado para teste
    if (id === 'erro-teste') {
      setError('Falha ao comunicar com o servidor clínico. Tente novamente.');
      setLoading(false);
      return;
    }

    const encontrado = CASOS_MOCK.find((item) => item.id === id);
    if (encontrado) {
      setCasoAtual(encontrado);
    } else {
      // Estado de ausência de dados
      setError('Nenhum dado clínico localizado para os parâmetros informados.');
    }
    setLoading(false);
  }, 600);
};

  const responder = (indiceResposta) => {
    if (!casoAtual) return;

    const questao = casoAtual.perguntas[etapa];
    const acertou = indiceResposta === questao.correta;

    if (acertou) {
      setPontos((prev) => prev + 1);
    }
    setFeedback(questao.feedback);

    setTimeout(() => {
      setFeedback('');
      if (etapa + 1 < casoAtual.perguntas.length) {
        setEtapa((prev) => prev + 1);
      } else {
        setConcluido(true);
      }
    }, 2000);
  };

  const resetar = () => {
    setCasoAtual(null);
    setEtapa(0);
    setPontos(0);
    setConcluido(false);
    setFeedback('');
    setError(null);
  };

  return {
    loading,
    error,
    casoAtual,
    etapa,
    pontos,
    feedback,
    concluido,
    carregarCaso,
    responder,
    resetar,
  };
}