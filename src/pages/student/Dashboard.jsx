import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import MainLayout from '../../components/MainLayout';
import { registrarAtividadeConcluida, registrarInteracao } from '../../utils/telemetry';
import { useStudentProgress } from '../../hooks/useStudentProgress';

const CASOS_INICIAIS = [
  {
    id: 'cefaleia',
    materia: 'neurologia',
    materiaLabel: 'Neurologia · dificuldade alta',
    materiaCor: '#704fb3',
    titulo: 'Cefaleia intensa inédita',
    subtitulo: 'Mulher, 45 anos, cefaleia intensa inédita e sensibilidade à luz',
    dificuldade: 'Difícil',
    paciente: {
      nome: 'Maria da Rosa', idade: 45,
      historico: 'Paciente relata cefaleia holocraniana pulsátil de forte intensidade há 4 dias, com fotofobia e fonofobia. Refere melhora parcial com paracetamol e nega episódios prévios semelhantes.',
      sinaisVitais: { pa: '120/80 mmHg', fc: '72 bpm', temp: '36,5 °C', dor: '8/10 intensa' }
    },
    respostas: {
      inicio: 'Começou há quatro dias e ficou mais forte aos poucos.',
      associados: 'A luz e o barulho pioram muito. Não percebi fraqueza, desmaio ou alteração da fala.',
      intensidade: 'Eu diria que está em 8 de 10 e a dor pulsa na cabeça toda.',
      medicamentos: 'Tomei paracetamol. Melhorou um pouco, mas a dor voltou.',
      padrao: 'Doutor, essa dor na cabeça toda não passa. Fica martelando e qualquer luz piora muito.'
    }
  },
  {
    id: 'cardio-dor',
    materia: 'cardiologia',
    materiaLabel: 'Cardiologia · dificuldade baixa',
    materiaCor: '#ba4779',
    titulo: 'Dor no peito após exercício físico',
    subtitulo: 'Homem, 45 anos, dor no peito após exercício físico (João)',
    dificuldade: 'Fácil',
    paciente: {
      nome: 'João Carlos', idade: 45,
      historico: 'Dor retroesternal em aperto iniciada ao subir escadas. Histórico familiar positivo para cardiopatia isquêmica e hipertensão arterial.',
      sinaisVitais: { pa: '145/90 mmHg', fc: '94 bpm', temp: '36,6 °C', dor: '7/10' }
    },
    respostas: {
      inicio: 'Começou hoje, enquanto eu subia uma escada, e melhorou quando parei.',
      associados: 'Senti um pouco de falta de ar e suor frio, mas não desmaiei.',
      intensidade: 'A dor chegou a 7 de 10, como um aperto no centro do peito.',
      medicamentos: 'Não tomei remédio para essa dor.',
      padrao: 'Tenho pressão alta e meu pai teve problema no coração. Estou preocupado com esse aperto.'
    }
  },
  {
    id: 'pneumo-fadiga',
    materia: 'pneumologia',
    materiaLabel: 'Pneumologia · dificuldade alta',
    materiaCor: '#185a9c',
    titulo: 'Fadiga constante e falta de ar',
    subtitulo: 'Mulher, 28 anos, fadiga constante e falta de ar (Maria)',
    dificuldade: 'Difícil',
    paciente: {
      nome: 'Maria Eduarda', idade: 28,
      historico: 'Dispneia progressiva aos esforços há duas semanas acompanhada de tosse seca persistente.',
      sinaisVitais: { pa: '118/76 mmHg', fc: '88 bpm', temp: '36,4 °C', dor: '3/10' }
    },
    respostas: {
      inicio: 'A falta de ar começou há cerca de duas semanas e está piorando.',
      associados: 'Tenho tosse seca e cansaço ao subir escadas. Não tive desmaio.',
      intensidade: 'Em repouso é leve, mas no esforço chega a 6 de 10.',
      medicamentos: 'Ainda não usei nenhum remédio para isso.',
      padrao: 'Não fumo e não tive uma infecção recente, mas me sinto sem fôlego.'
    }
  },
  {
    id: 'pediatria-febre',
    materia: 'pediatria',
    materiaLabel: 'Pediatria · dificuldade média',
    materiaCor: '#dc7545',
    titulo: 'Febre alta e manchas na pele',
    subtitulo: 'Criança, 8 anos, febre alta, dor de garganta e manchas na pele',
    dificuldade: 'Médio',
    paciente: {
      nome: 'Lucas (Acompanhado)', idade: 8,
      historico: 'Quadro febril agudo iniciado ontem, odinofagia e exantema maculopapular surgido hoje pela manhã.',
      sinaisVitais: { pa: '100/65 mmHg', fc: '104 bpm', temp: '38,6 °C', dor: '5/10' }
    },
    respostas: {
      inicio: 'A febre começou ontem e as manchas apareceram hoje pela manhã.',
      associados: 'A garganta dói e está difícil engolir, mas a criança está respirando bem.',
      intensidade: 'A dor de garganta está em 5 de 10.',
      medicamentos: 'Foi dado antitérmico, com melhora temporária da febre.',
      padrao: 'A vacinação está em dia e não conhecemos alergias.'
    }
  },
  {
    id: 'endo-sede',
    materia: 'endocrinologia',
    materiaLabel: 'Endocrinologia · dificuldade média',
    materiaCor: '#dc7545',
    titulo: 'Polidipsia e perda de peso',
    subtitulo: 'Mulher, 61 anos, muita sede, perda de peso e ferida no pé',
    dificuldade: 'Médio',
    paciente: {
      nome: 'Helena Souza', idade: 61,
      historico: 'Aumento acentuado da sede e diurese no último mês, associado a emagrecimento não intencional e lesão ulcerada em pé direito.',
      sinaisVitais: { pa: '135/85 mmHg', fc: '80 bpm', temp: '36,8 °C', dor: '3/10' }
    },
    respostas: {
      inicio: 'A sede e a vontade de urinar aumentaram no último mês.',
      associados: 'Perdi peso sem tentar e a ferida no pé demora para cicatrizar.',
      intensidade: 'A dor no pé é leve, em torno de 3 de 10.',
      medicamentos: 'Uso remédio para pressão, mas nenhum para glicose.',
      padrao: 'Minha mãe tinha diabetes e estou receosa por causa dessa ferida no pé.'
    }
  },
  {
    id: 'gineco-dor',
    materia: 'ginecologia',
    materiaLabel: 'Ginecologia · dificuldade alta',
    materiaCor: '#ba4779',
    titulo: 'Dor pélvica e sangramento irregular',
    subtitulo: 'Mulher, 32 anos, dor pélvica intensa e sangramento irregular',
    dificuldade: 'Difícil',
    paciente: {
      nome: 'Camila Rocha', idade: 32,
      historico: 'Dor em baixo ventre de forte intensidade há 2 dias associada a sangramento vaginal fora do período menstrual.',
      sinaisVitais: { pa: '110/70 mmHg', fc: '90 bpm', temp: '36,9 °C', dor: '8/10' }
    },
    respostas: {
      inicio: 'A dor começou há dois dias e o sangramento está irregular neste mês.',
      associados: 'Tenho náusea, mas não tive desmaio nem febre alta.',
      intensidade: 'A dor está em 8 de 10 e é mais forte no baixo ventre.',
      medicamentos: 'Tomei um analgésico comum, sem muita melhora.',
      padrao: 'Meu ciclo costuma ser regular, nunca tive uma dor assim.'
    }
  },
  {
    id: 'mental-palpitacoes',
    materia: 'saude-mental',
    materiaLabel: 'Saúde Mental · dificuldade baixa',
    materiaCor: '#704fb3',
    titulo: 'Crise de palpitações e medo intenso',
    subtitulo: 'Jovem, 21 anos, palpitações, medo intenso e sensação de morte',
    dificuldade: 'Fácil',
    paciente: {
      nome: 'Gabriel Alves', idade: 21,
      historico: 'Início súbito há 20 minutos de taquicardia, tremores de extremidades, sudorese e sensação iminente de morte.',
      sinaisVitais: { pa: '130/85 mmHg', fc: '112 bpm', temp: '36,5 °C', dor: '4/10' }
    },
    respostas: {
      inicio: 'Começou de repente, há cerca de vinte minutos.',
      associados: 'Senti falta de ar, tremor e muito medo, mas não desmaiei.',
      intensidade: 'O medo chegou a 9 de 10 e agora está diminuindo.',
      medicamentos: 'Não tomei nenhum medicamento hoje.',
      padrao: 'Já tive uma sensação parecida em uma semana de muitas provas na faculdade.'
    }
  },
  {
    id: 'emergencia-queda',
    materia: 'emergencia',
    materiaLabel: 'Emergência · dificuldade média',
    materiaCor: '#ba4779',
    titulo: 'Trauma por queda de bicicleta',
    subtitulo: 'Homem, 24 anos, queda de bicicleta, confusão e dor abdominal',
    dificuldade: 'Médio',
    paciente: {
      nome: 'Rafael Mendes', idade: 24,
      historico: 'Vítima de queda de bicicleta há 1 hora. Usava capacete, mas refere amnésia lacunar do evento e dor abdominal difusa.',
      sinaisVitais: { pa: '105/68 mmHg', fc: '102 bpm', temp: '36,3 °C', dor: '8/10' }
    },
    respostas: {
      inicio: 'Caí da bicicleta há aproximadamente uma hora.',
      associados: 'Bati a cabeça, fiquei confuso e agora sinto dor na barriga.',
      intensidade: 'A dor abdominal está em 8 de 10 e piora quando me mexo.',
      medicamentos: 'Não tomei nenhum remédio depois da queda.',
      padrao: 'Eu estava de capacete, mas não lembro de todos os detalhes da queda.'
    }
  },
  {
    id: 'neuro-confusao',
    materia: 'neurologia',
    materiaLabel: 'Neurologia · Geriatria',
    materiaCor: '#704fb3',
    titulo: 'Confusão mental súbita em idosa',
    subtitulo: 'Idosa, 78 anos, confusão mental súbita, febre baixa e queda',
    dificuldade: 'Difícil',
    paciente: {
      nome: 'Dona Carmem', idade: 78,
      historico: 'Quadro agudo de desorientação temporal e espacial notado hoje pela família após episódio de queda da própria altura.',
      sinaisVitais: { pa: '128/78 mmHg', fc: '86 bpm', temp: '37,6 °C', dor: '4/10' }
    },
    respostas: {
      inicio: 'Minha família notou a confusão hoje, depois de uma queda em casa.',
      associados: 'Tive febre baixa. Não percebi fraqueza em um lado, mas estou mais sonolenta.',
      intensidade: 'A dor da queda está em 4 de 10.',
      medicamentos: 'Uso remédios de rotina, mas não comecei nenhum novo.',
      padrao: 'Antes de hoje eu estava orientada e fazia minhas atividades normalmente.'
    }
  },
  {
    id: 'anatomia-ombro',
    materia: 'anatomia',
    materiaLabel: 'Anatomia · dificuldade média',
    materiaCor: '#704fb3',
    titulo: 'Dor no ombro ao elevar o braço',
    subtitulo: 'Homem, 34 anos, dor no ombro ao elevar o braço após esforço',
    dificuldade: 'Médio',
    paciente: {
      nome: 'Rodrigo Faro', idade: 34,
      historico: 'Dor na face lateral do ombro direito iniciada após carregar caixas pesadas, com limitação funcional na abdução.',
      sinaisVitais: { pa: '122/80 mmHg', fc: '74 bpm', temp: '36,5 °C', dor: '6/10' }
    },
    respostas: {
      inicio: 'A dor começou ontem, depois que carreguei caixas pesadas.',
      associados: 'Não tive febre nem formigamento, mas sinto fraqueza para levantar o braço.',
      intensidade: 'A dor chega a 6 de 10 quando elevo o braço acima do ombro.',
      medicamentos: 'Usei uma compressa fria, mas ainda não tomei remédio.',
      padrao: 'A dor fica mais na parte lateral do ombro e melhora quando deixo o braço parado.'
    }
  },
  {
    id: 'anatomia-coluna',
    materia: 'anatomia',
    materiaLabel: 'Anatomia · dificuldade alta',
    materiaCor: '#704fb3',
    titulo: 'Lombociatalgia irradiada',
    subtitulo: 'Mulher, 52 anos, dor lombar irradiada para a perna direita',
    dificuldade: 'Difícil',
    paciente: {
      nome: 'Sônia Lima', idade: 52,
      historico: 'Dor lombar aguda há 3 dias irradiada para região glútea e face posterior do membro inferior direito acompanhada de parestesia.',
      sinaisVitais: { pa: '130/82 mmHg', fc: '78 bpm', temp: '36,6 °C', dor: '8/10' }
    },
    respostas: {
      inicio: 'Começou há três dias, depois de passar muito tempo sentada.',
      associados: 'Sinto formigamento na perna direita, mas não perdi o controle da urina nem das fezes.',
      intensidade: 'A dor está em 8 de 10 e piora quando me abaixo.',
      medicamentos: 'Tomei um analgésico comum, com pouca melhora.',
      padrao: 'A dor sai da lombar, passa pelo glúteo e desce pela parte de trás da perna.'
    }
  },
  {
    id: 'gastro-dor',
    materia: 'gastroenterologia',
    materiaLabel: 'Gastroenterologia · dificuldade baixa',
    materiaCor: '#087565',
    titulo: 'Epigastralgia pós-prandial',
    subtitulo: 'Homem, 39 anos, dor na parte superior do abdômen e náusea',
    dificuldade: 'Fácil',
    paciente: {
      nome: 'Marcos Paulo', idade: 39,
      historico: 'Dor em queimação epigástrica há 1 semana, agravada após refeições, associada a plenitude pós-prandial.',
      sinaisVitais: { pa: '120/78 mmHg', fc: '72 bpm', temp: '36,5 °C', dor: '5/10' }
    },
    respostas: {
      inicio: 'Começou há uma semana e aparece principalmente depois das refeições.',
      associados: 'Tenho náusea e sensação de estômago cheio, mas não vomitei sangue.',
      intensidade: 'A queimação fica em torno de 5 de 10.',
      medicamentos: 'Usei um antiácido e melhorei por algumas horas.',
      padrao: 'Tenho comido fora com frequência e tomo bastante café.'
    }
  },
  {
    id: 'histo-biopsia',
    materia: 'histologia',
    materiaLabel: 'Histologia · dificuldade média',
    materiaCor: '#ba4779',
    titulo: 'Orientação sobre laudo de biópsia',
    subtitulo: 'Mulher, 47 anos, dúvidas sobre o resultado de uma biópsia',
    dificuldade: 'Médio',
    paciente: {
      nome: 'Cláudia Silva', idade: 47,
      historico: 'Comparece à consulta para esclarecimento sobre terminologia histopatológica descrita no laudo de biópsia recente.',
      sinaisVitais: { pa: '118/74 mmHg', fc: '70 bpm', temp: '36,4 °C', dor: '1/10' }
    },
    respostas: {
      inicio: 'Recebi o laudo da biópsia hoje e fiquei com dúvidas sobre os termos.',
      associados: 'Não tenho sintomas novos desde a coleta do material.',
      intensidade: 'Sinto apenas um desconforto leve no local, em torno de 1 de 10.',
      medicamentos: 'Não estou usando medicamentos por causa da biópsia.',
      padrao: 'Quero entender como a análise das células e dos tecidos ajuda no diagnóstico.'
    }
  }
];

const REGRAS_RUBRICA = [
  { id: 'acolhimento', label: 'Acolhimento e apresentação empática', palavras: ['ola', 'bom dia', 'boa tarde', 'como posso ajudar', 'entendo', 'compreendo'], feedback: 'Boa abertura: acolhimento e linguagem clara ajudam a conduzir a conversa.' },
  { id: 'anamnese', label: 'Investigação da história da queixa (início, duração, intensidade)', palavras: ['quando', 'comecou', 'inicio', 'duracao', 'intensidade', 'localizacao', 'historia', 'sintomas', 'forte'], feedback: 'Você investigou a história da queixa. Continue organizando as perguntas.' },
  { id: 'sinais de alerta', label: 'Pesquisa ativa de sinais de alerta e gravidade', palavras: ['febre', 'rigidez', 'fraqueza', 'visao', 'confusao', 'desmaio', 'falta de ar', 'suor', 'pior dor'], feedback: 'Você procurou sinais de alerta. Em uma situação real, isso exigiria avaliação profissional.' },
  { id: 'segurança', label: 'Plano de segurança, exames ou encaminhamento supervisionado', palavras: ['avaliacao', 'encaminhar', 'urgencia', 'emergencia', 'supervisao', 'exame', 'retorno', 'ecg', 'tomografia'], feedback: 'Você considerou um encaminhamento ou avaliação supervisionada.' }
];

function normalizar(texto) {
  return (texto || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export default function StudentDashboard() {
  const [searchParams] = useSearchParams();
  const { registrarSimulacaoRealizada } = useStudentProgress();

  const [casos, setCasos] = useState(CASOS_INICIAIS);
  const [casoAtivo, setCasoAtivo] = useState(null);

  // Vinculação com Sala do Professor
  const [nomeAlunoSala, setNomeAlunoSala] = useState('');
  const [codigoSalaInput, setCodigoSalaInput] = useState('');
  const [salaConectada, setSalaConectada] = useState(null);
  const [tentativaSalaId, setTentativaSalaId] = useState(null);
  const [feedbackSala, setFeedbackSala] = useState('');

  // Modais Extras: QR Code e Clinify AI
  const [modalQrAberto, setModalQrAberto] = useState(false);
  const [modalAiAberto, setModalAiAberto] = useState(false);
  const [aiDescricao, setAiDescricao] = useState('');
  const [aiMateria, setAiMateria] = useState('neurologia');
  const [aiDificuldade, setAiDificuldade] = useState('Médio');

  // Filtros do Catálogo
  const [materiaFiltro, setMateriaFiltro] = useState(searchParams.get('materia') || 'todas');
  const [buscaTexto, setBuscaTexto] = useState('');
  const [dificuldadeFiltro, setDificuldadeFiltro] = useState('all');

  // Estados da Consulta Simulada
  const [mensagens, setMensagens] = useState([]);
  const [inputFala, setInputFala] = useState('');
  const [pontos, setPontos] = useState(64);
  const [criteriosAtingidos, setCriteriosAtingidos] = useState([]);
  const [tempoSegundos, setTempoSegundos] = useState(0);
  const [anotacoes, setAnotacoes] = useState('');
  
  // Controle da Tela de Resumo de Conclusão
  const [casoFinalizado, setCasoFinalizado] = useState(false);

  const chatThreadRef = useRef(null);

  useEffect(() => {
    const matUrl = searchParams.get('materia');
    if (matUrl) setMateriaFiltro(matUrl);
  }, [searchParams]);

  useEffect(() => {
    let timer;
    if (casoAtivo && !casoFinalizado) {
      timer = setInterval(() => setTempoSegundos((t) => t + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [casoAtivo, casoFinalizado]);

  useEffect(() => {
    chatThreadRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensagens]);

  const formatarTempo = (seg) => {
    const min = String(Math.floor(seg / 60)).padStart(2, '0');
    const s = String(seg % 60).padStart(2, '0');
    return `${min}:${s}`;
  };

  const iniciarCaso = (caso, salaInfo = null, tentativaId = null) => {
    registrarInteracao('simulacao', `Iniciou caso ${caso.id}`);
    setCasoAtivo(caso);
    setSalaConectada(salaInfo);
    setTentativaSalaId(tentativaId);
    setMensagens([{ autor: 'patient', texto: caso.respostas.padrao }]);
    setPontos(64);
    setCriteriosAtingidos([]);
    setTempoSegundos(0);
    setAnotacoes('');
    setCasoFinalizado(false);
  };

  const handleEntrarSala = (e) => {
    e.preventDefault();
    setFeedbackSala('');
    const codigoLimpo = codigoSalaInput.trim().toUpperCase();
    const nomeLimpo = nomeAlunoSala.trim();

    if (!nomeLimpo || codigoLimpo.length < 4) {
      setFeedbackSala('Preencha seu nome e o código da sala.');
      return;
    }

    const salasSalvas = JSON.parse(localStorage.getItem('clinify_salas') || '[]');
    const salaEncontrada = salasSalvas.find((s) => s.codigo.toUpperCase() === codigoLimpo);

    if (!salaEncontrada) {
      setFeedbackSala('Sala não encontrada. Verifique o código com seu professor.');
      return;
    }
    if (salaEncontrada.status !== 'aberta') {
      setFeedbackSala('Esta sala já foi encerrada pelo professor.');
      return;
    }

    const novaTentativa = {
      id: 'tent-' + Date.now(),
      aluno: nomeLimpo,
      estado: 'em andamento',
      inicio: new Date().toISOString(),
      respostas: [],
      pontos: null,
      segundos: null
    };

    salaEncontrada.tentativas.push(novaTentativa);
    localStorage.setItem('clinify_salas', JSON.stringify(salasSalvas));

    const casoDaSala = casos[0];
    iniciarCaso(casoDaSala, salaEncontrada, novaTentativa.id);
  };

  const handleCriarCasoIA = (e) => {
    e.preventDefault();
    if (aiDescricao.trim().length < 10) return;

    const novoCaso = {
      id: 'ai-' + Date.now(),
      materia: aiMateria,
      materiaLabel: `${aiMateria.toUpperCase()} · Caso Personalizado IA`,
      materiaCor: '#704fb3',
      titulo: 'Caso Clínico Personalizado (Clinify AI)',
      subtitulo: aiDescricao.trim(),
      dificuldade: aiDificuldade,
      paciente: {
        nome: 'Paciente Simulado IA',
        idade: 50,
        historico: aiDescricao.trim(),
        sinaisVitais: { pa: '125/82 mmHg', fc: '82 bpm', temp: '36,7 °C', dor: '6/10' }
      },
      respostas: {
        inicio: 'Os sintomas começaram exatamente como descrito na triagem e continuam me incomodando.',
        associados: 'Além da queixa principal, sinto ansiedade por não saber o diagnóstico.',
        intensidade: 'O incômodo está moderado a forte agora, cerca de 6 de 10.',
        medicamentos: 'Ainda não tomei medicação específica hoje.',
        padrao: `Olá doutor(a). ${aiDescricao.trim()}`
      }
    };

    setCasos((prev) => [novoCaso, ...prev]);
    setModalAiAberto(false);
    setAiDescricao('');
    iniciarCaso(novoCaso);
  };

  const handleEnviarFala = (e) => {
    e.preventDefault();
    if (!inputFala.trim() || casoFinalizado) return;

    const fala = inputFala.trim();
    const falaNorm = normalizar(fala);
    const novasMsgs = [...mensagens, { autor: 'doctor', texto: fala }];

    let respPaciente = casoAtivo.respostas.padrao;
    if (falaNorm.includes('quando') || falaNorm.includes('comecou') || falaNorm.includes('inicio') || falaNorm.includes('tempo')) {
      respPaciente = casoAtivo.respostas.inicio;
    } else if (falaNorm.includes('febre') || falaNorm.includes('fraqueza') || falaNorm.includes('falta de ar') || falaNorm.includes('nausea') || falaNorm.includes('desmaio') || falaNorm.includes('sintoma') || falaNorm.includes('luz')) {
      respPaciente = casoAtivo.respostas.associados;
    } else if (falaNorm.includes('intensidade') || falaNorm.includes('quanto doi') || falaNorm.includes('0 a 10') || falaNorm.includes('zero a dez') || falaNorm.includes('forte')) {
      respPaciente = casoAtivo.respostas.intensidade;
    } else if (falaNorm.includes('remedio') || falaNorm.includes('medicamento') || falaNorm.includes('tomou') || falaNorm.includes('tratamento')) {
      respPaciente = casoAtivo.respostas.medicamentos;
    }
    novasMsgs.push({ autor: 'patient', texto: respPaciente });

    const novosCrit = [...criteriosAtingidos];
    const feedbacks = [];
    REGRAS_RUBRICA.forEach((regra) => {
      if (!novosCrit.includes(regra.id) && regra.palavras.some((p) => falaNorm.includes(p))) {
        novosCrit.push(regra.id);
        feedbacks.push(regra.feedback);
      }
    });

    const novosPontos = Math.min(100, pontos + (novosCrit.length - criteriosAtingidos.length) * 9);
    if (feedbacks.length > 0) {
      novasMsgs.push({ autor: 'ai-feedback', texto: feedbacks.join(' ') });
    }

    if (salaConectada && tentativaSalaId) {
      const salasSalvas = JSON.parse(localStorage.getItem('clinify_salas') || '[]');
      const sIdx = salasSalvas.findIndex((s) => s.codigo === salaConectada.codigo);
      if (sIdx >= 0) {
        const tIdx = salasSalvas[sIdx].tentativas.findIndex((t) => t.id === tentativaSalaId);
        if (tIdx >= 0) {
          salasSalvas[sIdx].tentativas[tIdx].respostas.push(fala);
          localStorage.setItem('clinify_salas', JSON.stringify(salasSalvas));
        }
      }
    }

    setCriteriosAtingidos(novosCrit);
    setPontos(novosPontos);
    setMensagens(novasMsgs);
    setInputFala('');
  };

  // Acionamento direto ao clicar no botão de finalizar caso roxo embaixo
  const executarFinalizacaoCaso = () => {
    setCasoFinalizado(true);

    registrarAtividadeConcluida({
      id: `simulado-${Date.now()}`,
      tipo: 'simulado',
      recurso: casoAtivo.id,
      titulo: casoAtivo.titulo,
      duracao_segundos: tempoSegundos,
      pontuacao: pontos,
      detalhes: { criterios: criteriosAtingidos, anotacoes }
    });

    registrarSimulacaoRealizada({
      titulo: casoAtivo.titulo,
      materia: casoAtivo.materia,
      pontos
    });

    if (salaConectada && tentativaSalaId) {
      const salasSalvas = JSON.parse(localStorage.getItem('clinify_salas') || '[]');
      const sIdx = salasSalvas.findIndex((s) => s.codigo === salaConectada.codigo);
      if (sIdx >= 0) {
        const tIdx = salasSalvas[sIdx].tentativas.findIndex((t) => t.id === tentativaSalaId);
        if (tIdx >= 0) {
          salasSalvas[sIdx].tentativas[tIdx].estado = 'concluída';
          salasSalvas[sIdx].tentativas[tIdx].pontos = pontos;
          salasSalvas[sIdx].tentativas[tIdx].segundos = tempoSegundos;
          localStorage.setItem('clinify_salas', JSON.stringify(salasSalvas));
        }
      }
    }
  };

  const casosFiltrados = casos.filter((c) => {
    const atendeMat = materiaFiltro === 'todas' || c.materia === materiaFiltro;
    const atendeDif =
      dificuldadeFiltro === 'all' ||
      (dificuldadeFiltro === 'easy' && c.dificuldade === 'Fácil') ||
      (dificuldadeFiltro === 'medium' && c.dificuldade === 'Médio') ||
      (dificuldadeFiltro === 'hard' && c.dificuldade === 'Difícil');
    const termo = normalizar(buscaTexto);
    const atendeBusca =
      normalizar(c.titulo).includes(termo) ||
      normalizar(c.subtitulo).includes(termo) ||
      normalizar(c.paciente.nome).includes(termo);
    return atendeMat && atendeDif && atendeBusca;
  });

  // ============================================================================
  // TELA 1: CONSULTA SIMULADA (ou Tela de Sucesso se casoFinalizado for true)
  // ============================================================================
  if (casoAtivo) {
    
    // TELA DE SUCESSO APÓS CLICAR EM FINALIZAR CASO
    if (casoFinalizado) {
      return (
        <div style={{ minHeight: '100vh', background: '#f6f8fc', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Inter, sans-serif' }}>
          <div style={{ background: '#fff', border: '1px solid #dce5f0', borderRadius: '24px', padding: '40px', maxWidth: '500px', width: '100%', textAlign: 'center', boxShadow: '0 16px 36px rgba(18, 47, 84, 0.08)' }}>
            
            <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#087565', margin: '0 0 16px', letterSpacing: '-0.5px' }}>
              Caso Finalizado
            </h1>
            
            <p style={{ fontSize: '15px', color: '#576a80', margin: '0 0 24px' }}>
              Parabéns por concluir o atendimento do caso <strong>{casoAtivo.titulo}</strong>.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '30px' }}>
              <div style={{ background: '#f2edfa', padding: '16px', borderRadius: '16px' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', color: '#704fb3', display: 'block', textTransform: 'uppercase' }}>XP Ganho</span>
                <strong style={{ fontSize: '28px', color: '#704fb3' }}>+150 XP</strong>
              </div>
              <div style={{ background: '#eff3f9', padding: '16px', borderRadius: '16px' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', color: '#576a80', display: 'block', textTransform: 'uppercase' }}>Tempo Total</span>
                <strong style={{ fontSize: '28px', color: '#123f72' }}>{formatarTempo(tempoSegundos)}</strong>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setCasoAtivo(null)}
              style={{ width: '100%', minHeight: '48px', border: 0, borderRadius: '14px', background: 'linear-gradient(120deg, #123f72, #185a9c)', color: '#fff', fontSize: '15px', fontWeight: '700', cursor: 'pointer' }}
            >
              Voltar à lista de casos
            </button>
          </div>
        </div>
      );
    }

    // TELA NORMAL DE CHAT DA CONSULTA
    return (
      <div style={{ minHeight: '100vh', background: '#f6f8fc', padding: '0 24px 28px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Inter, sans-serif' }}>
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: '74px', borderBottom: '1px solid #dce5f0', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#123f72', color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 'bold' }}>C</span>
            <div>
              <small style={{ color: '#704fb3', fontSize: '11px', fontWeight: '700', display: 'block' }}>Clinify</small>
              <strong style={{ fontSize: '15px', color: '#142945' }}>Consulta simulada</strong>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {salaConectada && (
              <span style={{ padding: '6px 12px', borderRadius: '999px', background: '#e8f6f1', color: '#087565', fontSize: '11px', fontWeight: '700' }}>
                Sala: {salaConectada.codigo} ({salaConectada.turma})
              </span>
            )}
            <button
              type="button"
              onClick={() => setCasoAtivo(null)}
              style={{ padding: '8px 12px', borderRadius: '10px', border: 0, background: '#eaf3fd', color: '#123f72', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}
            >
              ← Voltar aos casos
            </button>
          </div>
        </header>

        {salaConectada?.instrucoes && (
          <div style={{ marginBottom: '18px', padding: '14px 18px', background: '#fff', border: '1px solid #dce5f0', borderLeft: '4px solid #185a9c', borderRadius: '14px' }}>
            <strong style={{ fontSize: '12px', color: '#142945', display: 'block' }}>Orientações do Professor ({salaConectada.nome}):</strong>
            <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#576a80' }}>{salaConectada.instrucoes}</p>
          </div>
        )}

        <main style={{ display: 'grid', gridTemplateColumns: 'minmax(350px, 420px) minmax(0, 1fr)', gap: '22px', alignItems: 'start' }}>
          
          {/* COLUNA ESQUERDA */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <span style={{ color: '#704fb3', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase' }}>CONTEXTO DO CASO</span>
              <strong style={{ display: 'block', color: '#142945', fontSize: '13px' }}>Conheça a pessoa antes de responder</strong>
            </div>

            <section style={{ background: '#fff', border: '1px solid #dce5f0', borderRadius: '20px', padding: '18px' }}>
              <h2 style={{ margin: '0 0 8px', fontSize: '18px', color: '#142945' }}>{casoAtivo.paciente.nome}, {casoAtivo.paciente.idade} anos</h2>
              <p style={{ margin: 0, fontSize: '13px', color: '#576a80', lineHeight: 1.55 }}>{casoAtivo.paciente.historico}</p>
            </section>

            <details open style={{ background: '#fff', border: '1px solid #dce5f0', borderRadius: '20px', overflow: 'hidden' }}>
              <summary style={{ padding: '14px 16px', cursor: 'pointer', fontWeight: '700', fontSize: '14px', color: '#142945', borderBottom: '1px solid #dce5f0' }}>
                ❤️ Sinais vitais (4 medidas registradas)
              </summary>
              <dl style={{ margin: 0, padding: '12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div style={{ background: '#eff3f9', padding: '10px', borderRadius: '11px' }}>
                  <dt style={{ fontSize: '10px', color: '#576a80', fontWeight: '700' }}>PA</dt>
                  <dd style={{ margin: '2px 0 0', fontSize: '13px', fontWeight: '800', color: '#142945' }}>{casoAtivo.paciente.sinaisVitais.pa}</dd>
                </div>
                <div style={{ background: '#eff3f9', padding: '10px', borderRadius: '11px' }}>
                  <dt style={{ fontSize: '10px', color: '#576a80', fontWeight: '700' }}>FC</dt>
                  <dd style={{ margin: '2px 0 0', fontSize: '13px', fontWeight: '800', color: '#142945' }}>{casoAtivo.paciente.sinaisVitais.fc}</dd>
                </div>
                <div style={{ background: '#eff3f9', padding: '10px', borderRadius: '11px' }}>
                  <dt style={{ fontSize: '10px', color: '#576a80', fontWeight: '700' }}>Temperatura</dt>
                  <dd style={{ margin: '2px 0 0', fontSize: '13px', fontWeight: '800', color: '#142945' }}>{casoAtivo.paciente.sinaisVitais.temp}</dd>
                </div>
                <div style={{ background: '#eff3f9', padding: '10px', borderRadius: '11px' }}>
                  <dt style={{ fontSize: '10px', color: '#576a80', fontWeight: '700' }}>Dor</dt>
                  <dd style={{ margin: '2px 0 0', fontSize: '13px', fontWeight: '800', color: '#ba4779' }}>{casoAtivo.paciente.sinaisVitais.dor}</dd>
                </div>
              </dl>
            </details>

            <section style={{ padding: '14px 12px 10px', borderRadius: '20px', border: '1px solid #dce5f0', background: 'linear-gradient(145deg, #eef3f8, #e4eaf1)' }}>
              <div style={{ padding: '7px', border: '2px solid #263848', borderRadius: '13px 13px 7px 7px', background: '#263848' }}>
                <div style={{ padding: '12px', borderRadius: '7px', background: '#fbfcfd' }}>
                  <label htmlFor="clinicalNotes" style={{ display: 'block', marginBottom: '6px', color: '#576a80', fontSize: '10px', fontWeight: '700' }}>
                    PRONTUÁRIO · REGISTRE OS ACHADOS IMPORTANTES
                  </label>
                  <textarea
                    id="clinicalNotes"
                    rows="5"
                    value={anotacoes}
                    onChange={(e) => setAnotacoes(e.target.value)}
                    placeholder="Ex.: Queixa principal, início dos sintomas, sinais de alerta, hipóteses e próximos passos..."
                    style={{ width: '100%', padding: '10px', border: '1px solid #dce5f0', borderRadius: '7px', fontSize: '12px', boxSizing: 'border-box', outline: 'none' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '9px', color: '#576a80' }}>
                    <span>Salvo automaticamente</span>
                    <span>{anotacoes.length} / 4000</span>
                  </div>
                </div>
              </div>
              <div style={{ height: '8px', background: 'linear-gradient(#aebbc5, #82929f)', borderRadius: '0 0 8px 8px' }}></div>
            </section>
          </aside>

          {/* COLUNA DIREITA: Chat da Simulação com o Botão de Finalizar embaixo e Roxo */}
          <section style={{ background: '#fff', border: '1px solid #dce5f0', borderRadius: '20px', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 130px)', minHeight: '610px', overflow: 'hidden' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px', padding: '22px 26px 16px', borderBottom: '1px solid #dce5f0' }}>
              <div>
                <span style={{ color: casoAtivo.materiaCor, fontSize: '12px', fontWeight: '750' }}>● {casoAtivo.materiaLabel}</span>
                <h1 style={{ margin: '8px 0 4px', fontSize: '26px', color: '#142945' }}>{casoAtivo.titulo}</h1>
                <p style={{ margin: 0, fontSize: '13px', color: '#576a80' }}>
                  Converse com o paciente virtual, investigue a queixa e explique seus próximos passos.
                </p>
              </div>

              <div style={{ display: 'flex', border: '1px solid #dce5f0', borderRadius: '13px', background: '#eff3f9', padding: '4px' }}>
                <div style={{ minWidth: '70px', textAlign: 'center', padding: '4px 8px' }}>
                  <span style={{ fontSize: '10px', color: '#576a80', fontWeight: '700', display: 'block' }}>Tempo</span>
                  <strong style={{ fontSize: '17px', color: '#123f72' }}>{formatarTempo(tempoSegundos)}</strong>
                </div>
                <div style={{ minWidth: '70px', textAlign: 'center', padding: '4px 8px', borderLeft: '1px solid #dce5f0' }}>
                  <span style={{ fontSize: '10px', color: '#576a80', fontWeight: '700', display: 'block' }}>Pontos</span>
                  <strong style={{ fontSize: '17px', color: '#123f72' }}>{pontos}</strong>
                </div>
              </div>
            </header>

            {/* Thread de conversa */}
            <div style={{ flex: 1, padding: '24px 28px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '13px' }}>
              {mensagens.map((m, i) => (
                <article
                  key={i}
                  style={{
                    maxWidth: '78%',
                    padding: '13px 16px',
                    borderRadius: '17px',
                    fontSize: '14px',
                    lineHeight: 1.55,
                    alignSelf: m.autor === 'doctor' ? 'flex-end' : 'flex-start',
                    background: m.autor === 'doctor' ? '#123f72' : m.autor === 'ai-feedback' ? '#e8f6f1' : '#eff3f9',
                    color: m.autor === 'doctor' ? '#ffffff' : '#243a56',
                    border: m.autor === 'ai-feedback' ? '1px solid #cfe9e0' : 'none'
                  }}
                >
                  <strong style={{ display: 'block', marginBottom: '4px', fontSize: '11px', color: m.autor === 'doctor' ? 'rgba(255,255,255,0.78)' : m.autor === 'ai-feedback' ? '#087565' : '#576a80' }}>
                    {m.autor === 'doctor' ? 'Você' : m.autor === 'ai-feedback' ? 'Clinify AI · feedback' : 'Paciente'}
                  </strong>
                  {m.texto}
                </article>
              ))}
              <div ref={chatThreadRef} />
            </div>

            {/* Caixa de Fala e o Botão de Finalizar Caso embaixou e roxo */}
            <div style={{ padding: '14px 26px 18px', borderTop: '1px solid #dce5f0', background: '#fff' }}>
              <form onSubmit={handleEnviarFala} style={{ marginBottom: '14px' }}>
                <label htmlFor="caseReply" style={{ display: 'block', marginBottom: '6px', color: '#142945', fontSize: '12px', fontWeight: '750' }}>
                  Sua fala
                </label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
                  <textarea
                    id="caseReply"
                    rows="2"
                    value={inputFala}
                    onChange={(e) => setInputFala(e.target.value)}
                    placeholder="Escreva o que você diria ao paciente..."
                    style={{ width: '100%', padding: '12px 14px', border: '1px solid #bfcddd', borderRadius: '14px', background: '#f6f8fc', fontSize: '14px', outline: 'none', resize: 'none' }}
                  />
                  <button
                    type="submit"
                    style={{ width: '52px', height: '52px', flexShrink: 0, border: 0, borderRadius: '14px', background: '#123f72', color: '#fff', fontSize: '18px', cursor: 'pointer' }}
                  >
                    ➤
                  </button>
                </div>
              </form>

              {/* Botão Finalizar Caso em baixo, roxo e direto ao resultado */}
              <button
                type="button"
                onClick={executarFinalizacaoCaso}
                style={{ width: '100%', minHeight: '44px', border: 0, borderRadius: '12px', background: '#704fb3', color: '#fff', fontSize: '14px', fontWeight: '750', cursor: 'pointer', boxShadow: '0 4px 12px rgba(112, 79, 179, 0.2)' }}
              >
                Finalizar caso
              </button>
            </div>
          </section>
        </main>
      </div>
    );
  }
  // ============================================================================
  // TELA 2: CATÁLOGO DE SIMULAÇÃO CLÍNICA (casos.html do Estudante)
  // ============================================================================
  return (
    <MainLayout>
      <div style={{ marginBottom: '22px' }}>
        <h1 style={{ margin: 0, fontSize: '32px', color: '#142945', fontWeight: '700' }}>Simulação Clínica</h1>
      </div>

      {/* Formulário de Entrada em Sala ao Vivo (case-code) */}
      <form onSubmit={handleEntrarSala} style={{ background: '#ffffff', border: '1px solid #dce5f0', borderRadius: '20px', padding: '24px', marginBottom: '30px', boxShadow: '0 6px 20px rgba(18, 47, 84, 0.04)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <span style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#eaf3fd', color: '#185a9c', display: 'grid', placeItems: 'center', fontSize: '18px' }}>🔐</span>
          <div>
            <span style={{ fontSize: '11px', fontWeight: '800', color: '#087565', textTransform: 'uppercase' }}>● Sala ao vivo</span>
            <h2 style={{ margin: '2px 0 0', fontSize: '18px', color: '#142945' }}>Entre na consulta da sua turma</h2>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#243a56', marginBottom: '6px' }}>
              1. Como devemos chamar você?
            </label>
            <input
              type="text"
              required
              placeholder="Digite seu nome"
              value={nomeAlunoSala}
              onChange={(e) => setNomeAlunoSala(e.target.value)}
              style={{ width: '100%', height: '44px', padding: '0 14px', border: '1px solid #dce5f0', borderRadius: '12px', fontSize: '13px', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#243a56', marginBottom: '6px' }}>
              2. Código da sala (ex: MED6A1)
            </label>
            <input
              type="text"
              required
              placeholder="ABC123"
              maxLength={12}
              value={codigoSalaInput}
              onChange={(e) => setCodigoSalaInput(e.target.value.toUpperCase())}
              style={{ width: '100%', height: '44px', padding: '0 14px', border: '1px solid #dce5f0', borderRadius: '12px', fontSize: '13px', boxSizing: 'border-box', textTransform: 'uppercase' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setModalQrAberto(true)}
            style={{ minHeight: '44px', padding: '0 16px', borderRadius: '12px', border: '1px solid #dce5f0', background: '#fff', color: '#123f72', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}
          >
            📷 Ler QR Code
          </button>
          <button
            type="submit"
            style={{ minHeight: '44px', padding: '0 20px', borderRadius: '12px', border: 0, background: 'linear-gradient(120deg, #123f72, #185a9c)', color: '#fff', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}
          >
            Entrar e começar →
          </button>
        </div>

        {feedbackSala && (
          <p style={{ margin: '12px 0 0', fontSize: '12px', color: '#ba4779', fontWeight: '700' }}>{feedbackSala}</p>
        )}
      </form>

      {/* Filtro Rápido por Matérias em Estudo */}
      <section style={{ marginBottom: '24px' }}>
        <h2 style={{ margin: '0 0 6px', fontSize: '17px', color: '#142945' }}>Matérias em estudo</h2>
        <p style={{ margin: '0 0 12px', fontSize: '13px', color: '#576a80' }}>
          Filtre os casos pelas matérias da sua área de estudos. Selecione novamente para ver todos.
        </p>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[
            ['todas', 'Todas'],
            ['cardiologia', 'Cardiologia'],
            ['anatomia', 'Anatomia'],
            ['pneumologia', 'Pneumologia'],
            ['neurologia', 'Neurologia'],
            ['gastroenterologia', 'Gastroenterologia'],
            ['endocrinologia', 'Endocrinologia'],
            ['histologia', 'Histologia']
          ].map(([id, label]) => {
            const ativo = materiaFiltro === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setMateriaFiltro(ativo && id !== 'todas' ? 'todas' : id)}
                style={{
                  padding: '8px 14px',
                  borderRadius: '12px',
                  border: `1px solid ${ativo ? '#185a9c' : '#dce5f0'}`,
                  background: ativo ? '#eaf3fd' : '#ffffff',
                  color: ativo ? '#123f72' : '#243a56',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Barra de Busca e Dificuldade */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap' }}>
        <input
          type="search"
          placeholder="Buscar paciente, sintoma..."
          value={buscaTexto}
          onChange={(e) => setBuscaTexto(e.target.value)}
          style={{ flex: 1, minWidth: '220px', height: '42px', padding: '0 14px', border: '1px solid #dce5f0', borderRadius: '12px', background: '#fff', fontSize: '13px' }}
        />
        <select
          value={dificuldadeFiltro}
          onChange={(e) => setDificuldadeFiltro(e.target.value)}
          style={{ height: '42px', padding: '0 14px', border: '1px solid #dce5f0', borderRadius: '12px', background: '#fff', fontSize: '13px' }}
        >
          <option value="all">Todas as dificuldades</option>
          <option value="easy">Fácil</option>
          <option value="medium">Médio</option>
          <option value="hard">Difícil</option>
        </select>
        <button
          type="button"
          onClick={() => { setMateriaFiltro('todas'); setBuscaTexto(''); setDificuldadeFiltro('all'); }}
          style={{ height: '42px', padding: '0 14px', borderRadius: '12px', border: '1px solid #dce5f0', background: '#fff', color: '#576a80', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
        >
          Limpar filtros
        </button>
      </div>

      <p style={{ margin: '0 0 14px', fontSize: '12px', fontWeight: '700', color: '#576a80' }}>
        {casosFiltrados.length} caso(s) encontrado(s)
      </p>

      {/* Lista dos 13 Casos Clínicos */}
      {casosFiltrados.length === 0 ? (
        <div style={{ background: '#fff', border: '2px dashed #dce5f0', borderRadius: '20px', padding: '40px', textAlign: 'center' }}>
          <p style={{ margin: 0, fontWeight: '700', color: '#142945' }}>Nenhum caso encontrado com esses filtros.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingBottom: '70px' }}>
          {casosFiltrados.map((caso) => (
            <article
              key={caso.id}
              style={{
                background: '#ffffff',
                border: '1px solid #dce5f0',
                borderRadius: '18px',
                padding: '18px 22px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '18px',
                boxShadow: '0 4px 14px rgba(18, 47, 84, 0.03)',
                flexWrap: 'wrap'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, minWidth: '240px' }}>
                <div style={{ width: '46px', height: '46px', borderRadius: '50%', background: '#eaf3fd', color: caso.materiaCor, display: 'grid', placeItems: 'center', fontWeight: '800', fontSize: '16px', flexShrink: 0 }}>
                  {caso.paciente.nome.charAt(0)}
                </div>
                <div>
                  <small style={{ fontSize: '11px', fontWeight: '700', color: caso.materiaCor, textTransform: 'uppercase' }}>
                    {caso.materia} · Caso disponível
                  </small>
                  <h2 style={{ margin: '4px 0 6px', fontSize: '16px', color: '#142945' }}>{caso.subtitulo}</h2>
                  <span style={{
                    padding: '3px 9px',
                    borderRadius: '999px',
                    fontSize: '11px',
                    fontWeight: '700',
                    background: caso.dificuldade === 'Difícil' ? '#fff0f6' : caso.dificuldade === 'Médio' ? '#fff1e8' : '#e8f6f1',
                    color: caso.dificuldade === 'Difícil' ? '#ba4779' : caso.dificuldade === 'Médio' ? '#dc7545' : '#087565'
                  }}>
                    {caso.dificuldade}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => iniciarCaso(caso)}
                style={{ minHeight: '42px', padding: '0 20px', borderRadius: '12px', border: 0, background: '#185a9c', color: '#fff', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}
              >
                Iniciar
              </button>
            </article>
          ))}
        </div>
      )}

      {/* Botão Flutuante "Clinify AI · Criar meu caso" (floating-ai) */}
      <button
        type="button"
        onClick={() => setModalAiAberto(true)}
        style={{
          position: 'fixed',
          bottom: '26px',
          right: '28px',
          zIndex: 40,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '12px 18px',
          borderRadius: '999px',
          border: '1px solid #704fb3',
          background: 'linear-gradient(135deg, #123f72, #704fb3)',
          color: '#ffffff',
          boxShadow: '0 14px 32px rgba(18, 47, 84, 0.25)',
          cursor: 'pointer'
        }}
      >
        <span style={{ fontSize: '18px' }}>✨</span>
        <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
          <strong style={{ display: 'block', fontSize: '13px' }}>Clinify AI</strong>
          <small style={{ fontSize: '10px', opacity: 0.9 }}>Criar meu caso</small>
        </div>
        <span>↗</span>
      </button>

      {/* Modal Clinify AI (ai-modal) */}
      {modalAiAberto && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(8, 38, 58, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#fff', padding: '28px', borderRadius: '24px', width: 'min(92vw, 480px)', position: 'relative' }}>
            <span style={{ fontSize: '11px', fontWeight: '800', color: '#704fb3', textTransform: 'uppercase' }}>
              CLINIFY AI · PRÁTICA PERSONALIZADA
            </span>
            <h2 style={{ margin: '6px 0 8px', fontSize: '22px', color: '#142945' }}>Crie seu caso clínico</h2>
            <p style={{ margin: '0 0 18px', fontSize: '13px', color: '#576a80' }}>
              Descreva o cenário que deseja praticar. A simulação será montada com as suas escolhas.
            </p>

            <form onSubmit={handleCriarCasoIA}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#243a56', marginBottom: '6px' }}>
                  Características do caso
                </label>
                <textarea
                  rows="4"
                  required
                  minLength={10}
                  value={aiDescricao}
                  onChange={(e) => setAiDescricao(e.target.value)}
                  placeholder="Ex.: pessoa idosa com tontura há dois dias, histórico de quedas e dificuldade para explicar os sintomas"
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #dce5f0', borderRadius: '12px', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#243a56', marginBottom: '6px' }}>Matéria</label>
                  <select value={aiMateria} onChange={(e) => setAiMateria(e.target.value)} style={{ width: '100%', height: '40px', padding: '0 10px', border: '1px solid #dce5f0', borderRadius: '10px', fontSize: '13px' }}>
                    <option value="cardiologia">Cardiologia</option>
                    <option value="anatomia">Anatomia</option>
                    <option value="pneumologia">Pneumologia</option>
                    <option value="neurologia">Neurologia</option>
                    <option value="gastroenterologia">Gastroenterologia</option>
                    <option value="endocrinologia">Endocrinologia</option>
                    <option value="histologia">Histologia</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#243a56', marginBottom: '6px' }}>Dificuldade</label>
                  <select value={aiDificuldade} onChange={(e) => setAiDificuldade(e.target.value)} style={{ width: '100%', height: '40px', padding: '0 10px', border: '1px solid #dce5f0', borderRadius: '10px', fontSize: '13px' }}>
                    <option value="Fácil">Fácil</option>
                    <option value="Médio">Média</option>
                    <option value="Difícil">Difícil</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setModalAiAberto(false)} style={{ padding: '10px 16px', borderRadius: '12px', border: '1px solid #dce5f0', background: '#fff', cursor: 'pointer' }}>
                  Cancelar
                </button>
                <button type="submit" style={{ padding: '10px 18px', borderRadius: '12px', border: 0, background: '#704fb3', color: '#fff', fontWeight: '700', cursor: 'pointer' }}>
                  Gerar e iniciar caso →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Leitor de QR Code (modal-leitor-qr) */}
      {modalQrAberto && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(8, 38, 58, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#fff', padding: '24px', borderRadius: '24px', width: 'min(92vw, 420px)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: '800', color: '#704fb3', textTransform: 'uppercase' }}>CONVITE DO PROFESSOR</span>
                <h2 style={{ margin: '2px 0 0', fontSize: '20px', color: '#142945' }}>Ler QR Code</h2>
              </div>
              <button type="button" onClick={() => setModalQrAberto(false)} style={{ padding: '6px 12px', borderRadius: '10px', border: '1px solid #dce5f0', background: '#fff', cursor: 'pointer' }}>
                Fechar
              </button>
            </div>
            <p style={{ fontSize: '13px', color: '#576a80' }}>
              Selecione uma imagem do QR Code gerado pelo professor ou use o código padrão da turma ativa.
            </p>
            <div style={{ background: '#eff3f9', borderRadius: '16px', padding: '28px', textAlign: 'center', margin: '16px 0' }}>
              <p style={{ margin: 0, fontSize: '12px', color: '#576a80' }}>
                Para teste imediato sem câmera física, clique abaixo para preencher o código da sala aberta:
              </p>
              <button
                type="button"
                onClick={() => {
                  setCodigoSalaInput('MED6A1');
                  setNomeAlunoSala('Estudante Clinify');
                  setModalQrAberto(false);
                }}
                style={{ marginTop: '12px', padding: '10px 16px', borderRadius: '10px', border: 0, background: '#185a9c', color: '#fff', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
              >
                Detectar QR Code (Sala MED6A1)
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}