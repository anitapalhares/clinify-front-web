export function registrarInteracao(tipo, acao) {
  const user = JSON.parse(localStorage.getItem('clinify_user') || '{}');
  const idUsuario = user.email || 'visitante';
  const chave = `clinify:historico-interacoes:${idUsuario}`;
  const lista = JSON.parse(localStorage.getItem(chave) || '[]');

  lista.push({
    id: `interacao-${Date.now()}-${Math.floor(Math.random() * 100000)}`,
    tipo,
    acao: String(acao).slice(0, 100),
    pagina: window.location.pathname,
    data: new Date().toISOString()
  });

  localStorage.setItem(chave, JSON.stringify(lista.slice(-200)));
}

export function registrarAtividadeConcluida(atividade) {
  const user = JSON.parse(localStorage.getItem('clinify_user') || '{}');
  const idUsuario = user.email || 'visitante';
  const chave = `clinify:historico-atividades:${idUsuario}`;
  const lista = JSON.parse(localStorage.getItem(chave) || '[]');

  const registro = {
    id: atividade.id || `simulado-${Date.now()}`,
    tipo: atividade.tipo || 'simulado',
    recurso: atividade.recurso || 'caso-clinico',
    titulo: atividade.titulo || 'Simulação Clínica',
    estado: 'concluida',
    concluida_em: new Date().toISOString(),
    duracao_segundos: Number(atividade.duracao_segundos) || 0,
    pontuacao: Number(atividade.pontuacao) || 0,
    detalhes: atividade.detalhes || {}
  };

  lista.push(registro);
  localStorage.setItem(chave, JSON.stringify(lista.slice(-100)));
  return registro;
}

export function exportarDadosJSON() {
  registrarInteracao('clique', 'Salvar dados');
  const user = JSON.parse(localStorage.getItem('clinify_user') || '{}');
  const idUsuario = user.email || 'visitante';
  const agora = new Date();
  const nomeArquivo = `clinify_dados_${agora.toISOString().replace(/[:.]/g, '-')}.json`;

  const pacote = {
    versao: 1,
    gerado_em: agora.toISOString(),
    usuario: {
      id: idUsuario,
      nome: user.nome || 'Usuário Clinify',
      email: user.email || '',
      perfil: user.role || 'visitante'
    },
    interacoes: JSON.parse(localStorage.getItem(`clinify:historico-interacoes:${idUsuario}`) || '[]'),
    atividades: JSON.parse(localStorage.getItem(`clinify:historico-atividades:${idUsuario}`) || '[]')
  };

  const blob = new Blob([JSON.stringify(pacote, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = nomeArquivo;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}