import { useState, useEffect } from 'react';
import MainLayout from '../../components/MainLayout';
import { useRooms } from '../../hooks/useRooms';

export default function Salas() {
  const {
    salas,
    loading,
    error,
    criarSala,
    editarSala,
    alternarStatusSala,
    excluirSala,
    simularErro,
    limparErro
  } = useRooms();

  const [busca, setBusca] = useState('');
  const [statusFiltro, setStatusFiltro] = useState('todas');

  // Estados do Modal de Criar / Editar Sala
  const [modalFormAberto, setModalFormAberto] = useState(false);
  const [codigoEdicao, setCodigoEdicao] = useState('');
  const [formNome, setFormNome] = useState('');
  const [formTurma, setFormTurma] = useState('');
  const [formCenario, setFormCenario] = useState('Cefaleia intensa inédita · Clínica Médica');
  const [formInstrucoes, setFormInstrucoes] = useState('');

  // Estados dos Modais de Análise e QR Code
  const [salaEmAnalise, setSalaEmAnalise] = useState(null);
  const [salaQr, setSalaQr] = useState(null);
  const [copiadoFeedback, setCopiadoFeedback] = useState('');

  useEffect(() => {
    document.body.className = 'pagina-painel pagina-salas';
    return () => {
      document.body.className = '';
    };
  }, []);

  // Indicadores calculados em tempo real
  const totalAbertas = salas.filter((s) => s.status === 'aberta').length;
  const totalTentativas = salas.reduce((acc, s) => acc + (s.tentativas?.length || 0), 0);
  const totalConcluidas = salas.reduce(
    (acc, s) => acc + (s.tentativas?.filter((t) => t.estado === 'concluída').length || 0),
    0
  );

  // Filtro de salas
  const salasFiltradas = salas.filter((s) => {
    const atendeStatus = statusFiltro === 'todas' || s.status === statusFiltro;
    const termo = busca.toLowerCase().trim();
    const atendeBusca =
      s.nome.toLowerCase().includes(termo) ||
      s.turma.toLowerCase().includes(termo) ||
      s.codigo.toLowerCase().includes(termo);
    return atendeStatus && atendeBusca;
  });

  const abrirModalCriar = () => {
    setCodigoEdicao('');
    setFormNome('');
    setFormTurma('');
    setFormCenario('Cefaleia intensa inédita · Clínica Médica');
    setFormInstrucoes('');
    setModalFormAberto(true);
  };

  const abrirModalEditar = (sala) => {
    setCodigoEdicao(sala.codigo);
    setFormNome(sala.nome);
    setFormTurma(sala.turma);
    setFormCenario(sala.cenario || 'Cefaleia intensa inédita · Clínica Médica');
    setFormInstrucoes(sala.instrucoes || '');
    setModalFormAberto(true);
  };

  const fecharModalForm = () => {
    setModalFormAberto(false);
    setCodigoEdicao('');
    setFormNome('');
    setFormTurma('');
    setFormInstrucoes('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formNome.trim() || !formTurma.trim()) return;

    if (codigoEdicao) {
      editarSala(codigoEdicao, {
        nome: formNome.trim(),
        turma: formTurma.trim(),
        cenario: formCenario,
        instrucoes: formInstrucoes.trim()
      });
    } else {
      criarSala({
        nome: formNome.trim(),
        turma: formTurma.trim(),
        cenario: formCenario,
        instrucoes: formInstrucoes.trim()
      });
    }
    fecharModalForm();
  };

  const copiarCodigo = (codigo) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(codigo);
      setCopiadoFeedback(codigo);
      setTimeout(() => setCopiadoFeedback(''), 2000);
    }
  };

  const baixarQrCode = (codigo) => {
    const url = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=CLINIFY:SALA:${codigo}`;
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.download = `qrcode-sala-${codigo}.png`;
    link.click();
  };

  return (
    <MainLayout pageClass="salas-page">
      {/* Cabeçalho da Página de Salas */}
      <header className="salas-cabecalho" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px', marginBottom: '26px' }}>
        <div>
          <p className="salas-eyebrow" style={{ margin: '0 0 6px', fontSize: '11px', fontWeight: '800', color: '#704fb3', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
            SIMULAÇÃO CLÍNICA · PROFESSOR
          </p>
          <h1 style={{ margin: '0 0 6px', fontSize: '32px', color: '#142945', fontWeight: '700' }}>
            Suas salas, sua turma.
          </h1>
          <p style={{ margin: 0, color: '#576a80', fontSize: '14px' }}>
            Prepare uma atividade, compartilhe o código e acompanhe as respostas dos alunos.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={simularErro}
            style={{ padding: '10px 14px', borderRadius: '12px', border: '1px solid #f1c7d5', background: '#fff0f6', color: '#ba4779', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
          >
            Simular Erro (500)
          </button>
          <button
            type="button"
            className="btn btn--primary"
            id="nova-sala"
            onClick={abrirModalCriar}
            style={{ padding: '10px 18px', borderRadius: '12px', border: 0, background: 'linear-gradient(120deg, #123f72, #185a9c)', color: '#fff', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}
          >
            + Criar sala
          </button>
        </div>
      </header>

      {/* Guia Como Funciona (01, 02, 03) */}
      <section className="salas-guia" aria-label="Como funciona" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '22px' }}>
        <div style={{ background: '#fff', border: '1px solid #dce5f0', borderRadius: '16px', padding: '18px' }}>
          <span style={{ fontSize: '11px', fontWeight: '800', color: '#704fb3', display: 'block', marginBottom: '4px' }}>01</span>
          <strong style={{ fontSize: '15px', color: '#142945' }}>Crie uma sala</strong>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#576a80' }}>Dê um nome à atividade e escolha a turma.</p>
        </div>
        <div style={{ background: '#fff', border: '1px solid #dce5f0', borderRadius: '16px', padding: '18px' }}>
          <span style={{ fontSize: '11px', fontWeight: '800', color: '#704fb3', display: 'block', marginBottom: '4px' }}>02</span>
          <strong style={{ fontSize: '15px', color: '#142945' }}>Compartilhe</strong>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#576a80' }}>Os alunos entram com o código ou QR Code.</p>
        </div>
        <div style={{ background: '#fff', border: '1px solid #dce5f0', borderRadius: '16px', padding: '18px' }}>
          <span style={{ fontSize: '11px', fontWeight: '800', color: '#704fb3', display: 'block', marginBottom: '4px' }}>03</span>
          <strong style={{ fontSize: '15px', color: '#142945' }}>Acompanhe a turma</strong>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#576a80' }}>Veja as tentativas e revise as respostas.</p>
        </div>
      </section>

      {/* Resumo dos Indicadores */}
      <section className="salas-indicadores" aria-label="Resumo das salas" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '28px' }}>
        <article style={{ background: '#fff', border: '1px solid #dce5f0', borderRadius: '16px', padding: '18px' }}>
          <span style={{ fontSize: '12px', color: '#576a80', display: 'block' }}>Salas abertas</span>
          <strong id="total-abertas" style={{ fontSize: '28px', color: '#123f72' }}>{totalAbertas}</strong>
        </article>
        <article style={{ background: '#fff', border: '1px solid #dce5f0', borderRadius: '16px', padding: '18px' }}>
          <span style={{ fontSize: '12px', color: '#576a80', display: 'block' }}>Tentativas registradas</span>
          <strong id="total-tentativas" style={{ fontSize: '28px', color: '#123f72' }}>{totalTentativas}</strong>
        </article>
        <article style={{ background: '#fff', border: '1px solid #dce5f0', borderRadius: '16px', padding: '18px' }}>
          <span style={{ fontSize: '12px', color: '#576a80', display: 'block' }}>Simulações concluídas</span>
          <strong id="total-concluidas" style={{ fontSize: '28px', color: '#087565' }}>{totalConcluidas}</strong>
        </article>
      </section>

      {/* Tratamento de Estados: Carregamento e Erro */}
      {loading && (
        <p style={{ textAlign: 'center', padding: '24px', color: '#576a80' }}>Sincronizando salas de simulação...</p>
      )}

      {error && !loading && (
        <div style={{ background: '#fff0f6', border: '1px solid #f1c7d5', color: '#ba4779', padding: '14px 18px', borderRadius: '14px', marginBottom: '20px', fontSize: '13px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span><strong>Erro:</strong> {error}</span>
          <button
            type="button"
            onClick={limparErro}
            style={{ padding: '6px 12px', background: '#ba4779', color: '#fff', border: 0, borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}
          >
            Tentar novamente
          </button>
        </div>
      )}

      {/* Listagem e Filtros de Salas */}
      <section aria-labelledby="minhas-salas">
        <div className="salas-lista-cabecalho" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <h2 id="minhas-salas" style={{ margin: 0, fontSize: '20px', color: '#142945' }}>Minhas salas</h2>
          <span id="salas-contagem" role="status" style={{ fontSize: '12px', color: '#576a80', fontWeight: '700' }}>
            {salasFiltradas.length} {salasFiltradas.length === 1 ? 'sala' : 'salas'}
          </span>
        </div>

        <div className="salas-filtros" style={{ display: 'flex', gap: '14px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <label style={{ flex: '1 1 260px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px', fontWeight: '700', color: '#243a56' }}>
            Buscar sala
            <input
              type="search"
              id="buscar-sala"
              placeholder="Nome, turma ou código"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              style={{ height: '42px', padding: '0 14px', border: '1px solid #dce5f0', borderRadius: '12px', background: '#fff', fontSize: '13px' }}
            />
          </label>

          <label style={{ width: '220px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px', fontWeight: '700', color: '#243a56' }}>
            Status
            <select
              id="status-sala"
              value={statusFiltro}
              onChange={(e) => setStatusFiltro(e.target.value)}
              style={{ height: '42px', padding: '0 14px', border: '1px solid #dce5f0', borderRadius: '12px', background: '#fff', fontSize: '13px' }}
            >
              <option value="todas">Todas as salas</option>
              <option value="aberta">Abertas</option>
              <option value="encerrada">Encerradas</option>
            </select>
          </label>
        </div>

        {/* Estado Vazio */}
        {!loading && salasFiltradas.length === 0 ? (
          <div className="salas-vazio" id="salas-vazio" style={{ background: '#fff', border: '2px dashed #dce5f0', borderRadius: '20px', padding: '44px 24px', textAlign: 'center' }}>
            <span aria-hidden="true" style={{ fontSize: '28px', color: '#704fb3', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>+</span>
            <h3 style={{ margin: '0 0 6px', color: '#142945', fontSize: '18px' }}>Sua próxima atividade começa aqui</h3>
            <p style={{ margin: '0 0 18px', fontSize: '13px', color: '#576a80' }}>
              Crie uma sala para gerar o primeiro código e convidar sua turma.
            </p>
            <button
              className="btn btn--primary"
              type="button"
              onClick={abrirModalCriar}
              style={{ padding: '10px 18px', borderRadius: '12px', border: 0, background: '#185a9c', color: '#fff', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}
            >
              Criar minha primeira sala
            </button>
          </div>
        ) : (
          /* Grid de Cards de Salas */
          <div className="salas-grid" id="salas-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))', gap: '18px' }}>
            {salasFiltradas.map((sala) => {
              const concluidasSala = sala.tentativas?.filter((t) => t.estado === 'concluída').length || 0;
              return (
                <article
                  key={sala.codigo}
                  className="sala-card"
                  style={{ background: '#fff', border: '1px solid #dce5f0', borderRadius: '20px', padding: '22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 6px 20px rgba(18, 47, 84, 0.04)' }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', fontSize: '12px' }}>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '999px',
                        fontWeight: '700',
                        fontSize: '11px',
                        background: sala.status === 'aberta' ? '#e8f6f1' : '#eff3f9',
                        color: sala.status === 'aberta' ? '#087565' : '#576a80'
                      }}>
                        {sala.status === 'aberta' ? '● Aberta para alunos' : '○ Encerrada'}
                      </span>
                      <span style={{ color: '#576a80', fontWeight: '700' }}>{sala.turma}</span>
                    </div>

                    <h3 style={{ margin: '0 0 6px', fontSize: '18px', color: '#142945' }}>{sala.nome}</h3>
                    <p style={{ margin: '0 0 14px', fontSize: '12px', color: '#576a80' }}>{sala.cenario}</p>

                    {/* Bloco do Código e Ações de Convite */}
                    <div className="sala-convite" style={{ background: '#eff3f9', borderRadius: '14px', padding: '14px', textAlign: 'center', marginBottom: '14px' }}>
                      <span style={{ fontSize: '10px', fontWeight: '800', color: '#576a80', display: 'block', letterSpacing: '0.5px' }}>
                        CÓDIGO DA SALA
                      </span>
                      <strong style={{ fontSize: '24px', color: '#123f72', letterSpacing: '2px', display: 'block', margin: '4px 0 10px' }}>
                        {sala.codigo}
                      </strong>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <button
                          type="button"
                          onClick={() => copiarCodigo(sala.codigo)}
                          style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #dce5f0', background: '#fff', fontSize: '11px', fontWeight: '700', color: '#123f72', cursor: 'pointer' }}
                        >
                          {copiadoFeedback === sala.codigo ? '✓ Copiado!' : 'Copiar código'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setSalaQr(sala)}
                          style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #dce5f0', background: '#fff', fontSize: '11px', fontWeight: '700', color: '#704fb3', cursor: 'pointer' }}
                        >
                          QR Code
                        </button>
                      </div>
                    </div>

                    <p style={{ fontSize: '12px', color: '#576a80', margin: '0 0 16px' }}>
                      <strong>{sala.tentativas?.length || 0}</strong> tentativa(s) · <strong>{concluidasSala}</strong> concluída(s)
                    </p>
                  </div>

                  {/* Ações de Gerenciamento da Sala */}
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', paddingTop: '12px', borderTop: '1px solid #eff3f9' }}>
                    <button
                      type="button"
                      onClick={() => setSalaEmAnalise(sala)}
                      style={{ flex: 1, minHeight: '36px', padding: '0 12px', borderRadius: '10px', border: 0, background: '#185a9c', color: '#fff', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
                    >
                      Analisar
                    </button>
                    <button
                      type="button"
                      onClick={() => abrirModalEditar(sala)}
                      style={{ minHeight: '36px', padding: '0 12px', borderRadius: '10px', border: '1px solid #dce5f0', background: '#fff', color: '#123f72', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => alternarStatusSala(sala.codigo)}
                      style={{ minHeight: '36px', padding: '0 12px', borderRadius: '10px', border: '1px solid #dce5f0', background: '#fff', color: '#576a80', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
                    >
                      {sala.status === 'aberta' ? 'Encerrar' : 'Reabrir'}
                    </button>
                    <button
                      type="button"
                      onClick={() => excluirSala(sala.codigo)}
                      style={{ minHeight: '36px', padding: '0 12px', borderRadius: '10px', border: '1px solid #f1c7d5', background: '#fff0f6', color: '#ba4779', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
                    >
                      Excluir
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <p className="salas-nota" style={{ marginTop: '24px', fontSize: '12px', color: '#576a80' }}>
        Compartilhe o código com sua turma e acompanhe as respostas de cada aluno. Encerre a sala quando a atividade terminar.
      </p>

      {/* =========================================================================
          MODAL 1: CRIAR / EDITAR SALA (modal-sala)
          ========================================================================= */}
      {modalFormAberto && (
        <div className="modal-overlay" id="modal-sala" style={{ position: 'fixed', inset: 0, background: 'rgba(8, 38, 58, 0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="modal-box salas-modal" style={{ background: '#fff', padding: '26px', borderRadius: '24px', width: 'min(92vw, 460px)' }}>
            <h2 id="titulo-sala" style={{ margin: '0 0 4px', fontSize: '22px', color: '#142945' }}>
              {codigoEdicao ? 'Editar sala' : 'Criar sala'}
            </h2>
            <p style={{ margin: '0 0 18px', fontSize: '13px', color: '#576a80' }}>
              {codigoEdicao ? `Editando sala ${codigoEdicao}` : 'O código é gerado automaticamente ao salvar.'}
            </p>

            <form id="form-sala" onSubmit={handleSubmit}>
              <div className="modal-field" style={{ marginBottom: '14px' }}>
                <label htmlFor="nome-sala" style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#243a56', marginBottom: '6px' }}>
                  Nome da atividade
                </label>
                <input
                  id="nome-sala"
                  name="nome"
                  required
                  maxLength={80}
                  placeholder="Ex.: Anamnese · Turma 6A"
                  value={formNome}
                  onChange={(e) => setFormNome(e.target.value)}
                  style={{ width: '100%', height: '42px', padding: '0 12px', border: '1px solid #dce5f0', borderRadius: '12px', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div className="modal-field" style={{ marginBottom: '14px' }}>
                <label htmlFor="turma-sala" style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#243a56', marginBottom: '6px' }}>
                  Turma
                </label>
                <input
                  id="turma-sala"
                  name="turma"
                  required
                  maxLength={60}
                  placeholder="Ex.: Medicina 6A"
                  list="turmas-sugeridas"
                  value={formTurma}
                  onChange={(e) => setFormTurma(e.target.value)}
                  style={{ width: '100%', height: '42px', padding: '0 12px', border: '1px solid #dce5f0', borderRadius: '12px', fontSize: '13px', boxSizing: 'border-box' }}
                />
                <datalist id="turmas-sugeridas">
                  <option value="Medicina 6A" />
                  <option value="Medicina 7B" />
                  <option value="Internato Clínica" />
                </datalist>
              </div>

              <div className="modal-field" style={{ marginBottom: '14px' }}>
                <label htmlFor="cenario-sala" style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#243a56', marginBottom: '6px' }}>
                  Caso clínico
                </label>
                <select
                  id="cenario-sala"
                  name="cenario"
                  value={formCenario}
                  onChange={(e) => setFormCenario(e.target.value)}
                  style={{ width: '100%', height: '42px', padding: '0 12px', border: '1px solid #dce5f0', borderRadius: '12px', fontSize: '13px', boxSizing: 'border-box', background: '#fff' }}
                >
                  <option value="Cefaleia intensa inédita · Clínica Médica">Cefaleia intensa inédita · Clínica Médica</option>
                  <option value="Dor no peito após exercício · Cardiologia">Dor no peito após exercício · Cardiologia</option>
                  <option value="Fadiga constante e falta de ar · Pneumologia">Fadiga constante e falta de ar · Pneumologia</option>
                </select>
              </div>

              <div className="modal-field" style={{ marginBottom: '20px' }}>
                <label htmlFor="instrucoes-sala" style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#243a56', marginBottom: '6px' }}>
                  Orientações para os alunos <span style={{ fontWeight: '400', color: '#576a80' }}>(opcional)</span>
                </label>
                <textarea
                  id="instrucoes-sala"
                  name="instrucoes"
                  rows="3"
                  maxLength={1000}
                  placeholder="O que sua turma deve praticar nesta atividade?"
                  value={formInstrucoes}
                  onChange={(e) => setFormInstrucoes(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #dce5f0', borderRadius: '12px', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div className="modal-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  className="btn btn--ghost"
                  onClick={fecharModalForm}
                  style={{ padding: '10px 16px', borderRadius: '12px', border: '1px solid #dce5f0', background: '#fff', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn--primary"
                  id="salvar-sala"
                  style={{ padding: '10px 18px', borderRadius: '12px', border: 0, background: '#185a9c', color: '#fff', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}
                >
                  {codigoEdicao ? 'Salvar alterações' : 'Criar e gerar código'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: ANALISAR SALA E TENTATIVAS DOS ALUNOS (modal-analise)
          ========================================================================= */}
      {salaEmAnalise && (
        <div className="modal-overlay" id="modal-analise" style={{ position: 'fixed', inset: 0, background: 'rgba(8, 38, 58, 0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="modal-box salas-modal salas-modal--analise" style={{ background: '#fff', padding: '26px', borderRadius: '24px', width: 'min(92vw, 560px)', maxHeight: '85vh', overflowY: 'auto' }}>
            <div className="salas-lista-cabecalho" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h2 id="titulo-analise" style={{ margin: 0, fontSize: '20px', color: '#142945' }}>
                Analisar: {salaEmAnalise.nome}
              </h2>
              <button
                type="button"
                className="btn btn--ghost"
                onClick={() => setSalaEmAnalise(null)}
                style={{ padding: '6px 12px', borderRadius: '10px', border: '1px solid #dce5f0', background: '#fff', cursor: 'pointer', fontWeight: '600' }}
              >
                Fechar
              </button>
            </div>

            <div id="conteudo-analise">
              <p style={{ margin: '0 0 14px', fontSize: '13px', color: '#576a80' }}>
                Turma: <strong>{salaEmAnalise.turma}</strong> · Código: <strong>{salaEmAnalise.codigo}</strong> · Status: <strong>{salaEmAnalise.status}</strong>
              </p>

              {salaEmAnalise.instrucoes && (
                <div style={{ padding: '12px 14px', background: '#eff3f9', borderRadius: '12px', marginBottom: '18px', fontSize: '12px', color: '#243a56' }}>
                  <strong>Orientações configuradas:</strong>
                  <p style={{ margin: '4px 0 0' }}>{salaEmAnalise.instrucoes}</p>
                </div>
              )}

              <h3 style={{ fontSize: '15px', color: '#142945', margin: '0 0 12px' }}>
                Tentativas dos alunos ({salaEmAnalise.tentativas?.length || 0})
              </h3>

              {!salaEmAnalise.tentativas || salaEmAnalise.tentativas.length === 0 ? (
                <p style={{ fontSize: '13px', color: '#576a80', padding: '20px', textAlign: 'center', background: '#f6f8fc', borderRadius: '12px' }}>
                  Nenhum aluno ingressou nesta sala até o momento.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {salaEmAnalise.tentativas.map((t) => (
                    <div key={t.id} style={{ padding: '14px', background: '#f6f8fc', border: '1px solid #dce5f0', borderRadius: '14px', fontSize: '13px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <strong style={{ color: '#142945' }}>{t.aluno}</strong>
                        <span style={{
                          padding: '2px 8px',
                          borderRadius: '999px',
                          fontSize: '11px',
                          fontWeight: '700',
                          background: t.estado === 'concluída' ? '#e8f6f1' : '#eaf3fd',
                          color: t.estado === 'concluída' ? '#087565' : '#185a9c'
                        }}>
                          {t.estado} {t.pontos !== null && `· ${t.pontos} pts`}
                        </span>
                      </div>
                      {t.segundos && (
                        <small style={{ display: 'block', color: '#576a80', marginBottom: '6px' }}>
                          Duração: {Math.floor(t.segundos / 60)}m {t.segundos % 60}s
                        </small>
                      )}
                      <div style={{ fontSize: '12px', color: '#576a80', background: '#fff', padding: '8px 10px', borderRadius: '8px', border: '1px solid #eff3f9' }}>
                        <strong>Perguntas realizadas pelo aluno:</strong>{' '}
                        {t.respostas && t.respostas.length > 0 ? t.respostas.join(' | ') : 'Nenhuma fala enviada ainda.'}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3: QR CODE DA SALA (modal-qr)
          ========================================================================= */}
      {salaQr && (
        <div className="modal-overlay" id="modal-qr" style={{ position: 'fixed', inset: 0, background: 'rgba(8, 38, 58, 0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="modal-box salas-modal qr-modal" style={{ background: '#fff', padding: '26px', borderRadius: '24px', width: 'min(92vw, 400px)', textAlign: 'center' }}>
            <div className="salas-lista-cabecalho" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h2 id="titulo-qr" style={{ margin: 0, fontSize: '20px', color: '#142945' }}>QR Code da sala</h2>
              <button
                type="button"
                className="btn btn--ghost"
                onClick={() => setSalaQr(null)}
                style={{ padding: '6px 12px', borderRadius: '10px', border: '1px solid #dce5f0', background: '#fff', cursor: 'pointer', fontWeight: '600' }}
              >
                Fechar
              </button>
            </div>

            <p style={{ fontSize: '13px', color: '#576a80', margin: '0 0 18px' }}>
              Peça aos alunos para lerem este QR Code na tela de Simulação Clínica.
            </p>

            <div
              id="qr-sala"
              className="qr-modal__codigo"
              aria-label="QR Code da sala"
              style={{ width: '200px', height: '200px', margin: '0 auto 14px', padding: '12px', border: '1px solid #dce5f0', borderRadius: '18px', display: 'grid', placeItems: 'center', background: '#fff' }}
            >
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=CLINIFY:SALA:${salaQr.codigo}`}
                alt={`QR Code da sala ${salaQr.codigo}`}
                width="180"
                height="180"
              />
            </div>

            <strong id="qr-sala-codigo" className="qr-modal__texto" style={{ display: 'block', fontSize: '24px', letterSpacing: '3px', color: '#123f72', marginBottom: '20px' }}>
              {salaQr.codigo}
            </strong>

            <div className="modal-actions" style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                type="button"
                className="btn btn--ghost"
                id="baixar-qr"
                onClick={() => baixarQrCode(salaQr.codigo)}
                style={{ flex: 1, padding: '10px 14px', borderRadius: '12px', border: '1px solid #dce5f0', background: '#fff', color: '#123f72', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}
              >
                Baixar QR Code
              </button>
              <button
                type="button"
                className="btn btn--primary"
                id="copiar-qr"
                onClick={() => copiarCodigo(salaQr.codigo)}
                style={{ flex: 1, padding: '10px 14px', borderRadius: '12px', border: 0, background: '#185a9c', color: '#fff', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}
              >
                {copiadoFeedback === salaQr.codigo ? '✓ Copiado!' : 'Copiar código'}
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}