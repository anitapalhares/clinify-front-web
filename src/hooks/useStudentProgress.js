import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'clinify_student_progress';

const INITIAL_PROGRESS = {
  xp: 0,
  nivel: 1,
  casosConcluidos: 0,
  modulosConcluidos: [],
  ultimaSimulacao: null,
  progressoMaterias: {
    cardiologia: 0,
    anatomia: 0,
    pneumologia: 0,
    neurologia: 0,
    gastroenterologia: 0,
    endocrinologia: 0,
    histologia: 0
  },
  iconePerfil: 'plant'
};

export function useStudentProgress() {
  const [progresso, setProgresso] = useState(() => {
    try {
      const salvo = localStorage.getItem(STORAGE_KEY);
      return salvo ? { ...INITIAL_PROGRESS, ...JSON.parse(salvo) } : INITIAL_PROGRESS;
    } catch {
      return INITIAL_PROGRESS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progresso));
    } catch (e) {
      console.error(e);
    }
  }, [progresso]);

  const concluirModuloEstudo = useCallback((especialidade) => {
    setProgresso((prev) => {
      const modulos = prev.modulosConcluidos || [];
      const jaConcluido = modulos.includes(especialidade);
      const novosModulos = jaConcluido ? modulos : [...modulos, especialidade];
      const ganhoXp = jaConcluido ? 20 : 100;
      const novoXp = (prev.xp || 0) + ganhoXp;
      const novoNivel = Math.floor(novoXp / 250) + 1;

      return {
        ...prev,
        xp: novoXp,
        nivel: novoNivel,
        modulosConcluidos: novosModulos,
        progressoMaterias: {
          ...(prev.progressoMaterias || {}),
          [especialidade]: 100
        }
      };
    });
  }, []);

  const registrarSimulacaoRealizada = useCallback(({ titulo, materia, pontos }) => {
    setProgresso((prev) => {
      const ganhoXp = Math.max(50, Number(pontos) || 60);
      const novoXp = (prev.xp || 0) + ganhoXp;
      const novoNivel = Math.floor(novoXp / 250) + 1;
      const matKey = (materia || 'cardiologia').toLowerCase();
      const progAtual = (prev.progressoMaterias && prev.progressoMaterias[matKey]) || 0;

      return {
        ...prev,
        xp: novoXp,
        nivel: novoNivel,
        casosConcluidos: (prev.casosConcluidos || 0) + 1,
        ultimaSimulacao: {
          titulo,
          materia: matKey,
          pontos,
          data: new Date().toISOString()
        },
        progressoMaterias: {
          ...(prev.progressoMaterias || {}),
          [matKey]: Math.min(100, progAtual + 50)
        }
      };
    });
  }, []);

  const alterarIconePerfil = useCallback((novoIcone) => {
    setProgresso((prev) => ({ ...prev, iconePerfil: novoIcone }));
  }, []);

  const cardioConcluido = (progresso.modulosConcluidos || []).includes('cardiologia');
  const txtModulo = cardioConcluido
    ? 'Cardiologia: módulo concluído.'
    : 'Cardiologia: módulo ainda não concluído.';
  const txtSim = progresso.ultimaSimulacao
    ? `Última simulação: ${progresso.ultimaSimulacao.titulo} (${progresso.ultimaSimulacao.pontos} pts).`
    : 'Nenhuma simulação finalizada.';
  const textoResumo = `${txtModulo} ${txtSim}`;

  return {
    progresso,
    concluirModuloEstudo,
    registrarSimulacaoRealizada,
    alterarIconePerfil,
    textoResumo
  };
}