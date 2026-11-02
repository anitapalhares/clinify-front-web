import { useState } from 'react';

const ESTUDOS_MOCK = [
  {
    id: 'estudo-cardio',
    especialidade: 'cardiologia',
    nome: 'Cardiologia',
    semestre: 6,
    questoes: 3,
    progresso: 62,
    tag: '6° semestre',
    descricao: 'Abordagem inicial de síndromes coronarianas e avaliação eletrocardiográfica.'
  },
  {
    id: 'estudo-anat',
    especialidade: 'anatomia',
    nome: 'Anatomia',
    semestre: 1,
    questoes: 3,
    progresso: 0,
    tag: '1° semestre',
    descricao: 'Anatomia segmentar, plexos nervosos e correlações clínicas.'
  },
  {
    id: 'estudo-pneumo',
    especialidade: 'pneumologia',
    nome: 'Pneumologia',
    semestre: 3,
    questoes: 0,
    progresso: 35,
    tag: '3° semestre',
    descricao: 'Insuficiência respiratória, padrão obstrutivo e ventilação não invasiva.'
  },
  {
    id: 'estudo-neuro',
    especialidade: 'neurologia',
    nome: 'Neurologia',
    semestre: 7,
    questoes: 0,
    progresso: 18,
    tag: '7° semestre',
    descricao: 'Défices focais agudos, escalas neurológicas e janela trombolítica.'
  },
  {
    id: 'estudo-gastro',
    especialidade: 'gastroenterologia',
    nome: 'Gastroenterologia',
    semestre: 4,
    questoes: 0,
    progresso: 80,
    tag: '4° semestre',
    descricao: 'Doença péptica, hemorragia digestiva e conduta em dor abdominal.'
  },
  {
    id: 'estudo-endo',
    especialidade: 'endocrinologia',
    nome: 'Endocrinologia',
    semestre: 5,
    questoes: 0,
    progresso: 47,
    tag: '5° semestre',
    descricao: 'Manejo de diabetes descompensado e distúrbios da tiróide.'
  },
  {
    id: 'estudo-histo',
    especialidade: 'histologia',
    nome: 'Histologia',
    semestre: 1,
    questoes: 0,
    progresso: 93,
    tag: '1° semestre',
    descricao: 'Interpretação de lâminas de biópsia e diferenciação tecidual.'
  }
];

export function useStudies() {
  const [estudos] = useState(ESTUDOS_MOCK);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const simularErro = () => {
    setLoading(true);
    setTimeout(() => {
      setError('Falha ao sincronizar o catálogo de matérias (Erro 500).');
      setLoading(false);
    }, 400);
  };

  const limparErro = () => setError(null);

  return {
    estudos,
    loading,
    error,
    simularErro,
    limparErro
  };
}