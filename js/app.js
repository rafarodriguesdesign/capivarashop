/* LeveVara: portão de senha, vitrine, carrinho e agendamento do Parabéns na Porta. */
(() => {
  'use strict';

  const CONFIG = window.LEVEVARA_CONFIG;
  const { categorias, produtos, pacotes } = window.LEVEVARA_DADOS;

  document.documentElement.lang = 'pt-BR';

  const $ = (seletor, raiz = document) => raiz.querySelector(seletor);
  const reais = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
  const semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const centavos = (valor) => Math.round(valor * 100) / 100;

  const produtoPorId = Object.fromEntries(produtos.map((p) => [p.id, p]));
  const pacotePorId = Object.fromEntries(pacotes.map((p) => [p.id, p]));
  const categoriaPorId = Object.fromEntries(categorias.map((c, indice) => [c.id, { ...c, indice }]));

  function escapar(texto) {
    const trocas = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
    return String(texto).replace(/[&<>"']/g, (c) => trocas[c]);
  }

  // Armazenamento pode falhar (aba anônima, bloqueio): nesse caso o site
  // funciona normalmente, só não lembra da senha nem do carrinho.
  const guardado = {
    ler(onde, chave, padrao) {
      try {
        const valor = window[onde].getItem(chave);
        return valor === null ? padrao : JSON.parse(valor);
      } catch {
        return padrao;
      }
    },
    gravar(onde, chave, valor) {
      try {
        window[onde].setItem(chave, JSON.stringify(valor));
      } catch {
        /* sem armazenamento */
      }
    },
    apagar(onde, chave) {
      try {
        window[onde].removeItem(chave);
      } catch {
        /* sem armazenamento */
      }
    }
  };

  function dataISO(data) {
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    return `${data.getFullYear()}-${mes}-${dia}`;
  }
  const dataBR = (iso) => iso.split('-').reverse().join('/');

  // Ilustrações ------------------------------------------------------------

  const COROA = '<use href="#coroa" x="153" y="8" width="46" height="31" transform="rotate(-8 176 38)"></use>';

  function tintDe(categoriaId) {
    return categoriaId === 'aniversario' ? 'festa' : String(categoriaPorId[categoriaId].indice % 4);
  }

  function ilustracao({ categoria, emoji }) {
    const coroa = categoria === 'aniversario' ? COROA : '';
    const item = emoji ? `<span class="thumb-emoji" aria-hidden="true">${emoji}</span>` : '';
    return `<svg viewBox="0 0 220 160" aria-hidden="true" focusable="false"><use href="#capi"></use>${coroa}</svg>${item}`;
  }

  // Vitrine ----------------------------------------------------------------

  const catalogo = produtos.filter((p) => p.categoria !== 'aniversario');
  const festa = produtos.filter((p) => p.categoria === 'aniversario');
  let filtro = 'todos';

  function cartaoProduto(p) {
    return `
      <article class="produto">
        <div class="thumb" data-tint="${tintDe(p.categoria)}">${ilustracao(p)}</div>
        <div class="produto-corpo">
          <p class="produto-cat">${escapar(categoriaPorId[p.categoria].nome)}</p>
          <h3 class="produto-nome">${escapar(p.nome)}</h3>
          <p class="produto-desc">${escapar(p.descricao)}</p>
          <div class="produto-rodape">
            <span class="preco">${reais.format(p.preco)}</span>
            <button type="button" class="botao botao-pequeno" data-adicionar="${p.id}" aria-label="Adicionar ${escapar(p.nome)} ao carrinho">Adicionar</button>
          </div>
        </div>
      </article>`;
  }

  function desenharFiltros() {
    const opcoes = [
      { id: 'todos', nome: 'Todos', faixa: `${catalogo.length} produtos` },
      ...categorias.filter((c) => c.id !== 'aniversario')
    ];
    $('#filtros').innerHTML = opcoes.map((c) => `
      <button type="button" class="chip" data-filtro="${c.id}" aria-pressed="${c.id === filtro}">
        <span class="chip-nome">${escapar(c.nome)}</span>
        <span class="chip-faixa">${escapar(c.faixa)}</span>
      </button>`).join('');
  }

  function desenharVitrine() {
    const lista = filtro === 'todos' ? catalogo : catalogo.filter((p) => p.categoria === filtro);
    $('#grade-loja').innerHTML = lista.map(cartaoProduto).join('');
    const para = filtro === 'todos' ? 'toda a família' : categoriaPorId[filtro].para;
    $('#resultado').textContent = `${lista.length} ${lista.length === 1 ? 'produto' : 'produtos'} para ${para}.`;
    document.querySelectorAll('#filtros [data-filtro]').forEach((chip) => {
      chip.setAttribute('aria-pressed', String(chip.dataset.filtro === filtro));
    });
  }

  // Carrinho ---------------------------------------------------------------

  const CHAVE_CARRINHO = 'levevara:carrinho';
  let carrinho = carregarCarrinho();
  let confirmado = false;

  function carregarCarrinho() {
    const salvo = guardado.ler('localStorage', CHAVE_CARRINHO, []);
    if (!Array.isArray(salvo)) return [];
    return salvo.filter((item) => item && (
      item.tipo === 'servico'
        ? Boolean(pacotePorId[item.pacote] && item.detalhes)
        : Boolean(produtoPorId[item.id] && item.qtd > 0)
    ));
  }

  function salvarCarrinho() {
    guardado.gravar('localStorage', CHAVE_CARRINHO, carrinho);
    desenharCarrinho();
  }

  function adicionarProduto(id) {
    const existente = carrinho.find((item) => item.tipo === 'produto' && item.id === id);
    if (existente) existente.qtd += 1;
    else carrinho.push({ chave: `p:${id}`, tipo: 'produto', id, qtd: 1 });
    salvarCarrinho();
    avisar(`${produtoPorId[id].nome} foi para o carrinho.`);
  }

  function mudarQuantidade(chave, delta) {
    const item = carrinho.find((i) => i.chave === chave);
    if (!item) return;
    item.qtd += delta;
    if (item.qtd <= 0) carrinho = carrinho.filter((i) => i !== item);
    salvarCarrinho();
  }

  function remover(chave) {
    carrinho = carrinho.filter((i) => i.chave !== chave);
    salvarCarrinho();
  }

  function precoItem(item) {
    return item.tipo === 'servico' ? pacotePorId[item.pacote].preco : produtoPorId[item.id].preco * item.qtd;
  }

  function calcularTotais() {
    const somar = (tipo) => centavos(carrinho.filter((i) => i.tipo === tipo).reduce((soma, i) => soma + precoItem(i), 0));
    const produtosSub = somar('produto');
    const servicosSub = somar('servico');
    const frete = produtosSub > 0 && produtosSub < CONFIG.freteGratisAcima ? CONFIG.frete : 0;
    return { produtosSub, servicosSub, frete, total: centavos(produtosSub + servicosSub + frete) };
  }

  function descreverServico(d) {
    const partes = [
      `Para ${d.aniversariante}, ${d.idade} ${Number(d.idade) === 1 ? 'ano' : 'anos'}`,
      `${dataBR(d.data)} às ${d.hora}`,
      `${d.endereco}, CEP ${d.cep}`,
      `Coroa tamanho ${d.coroa.toLowerCase()}`
    ];
    if (d.surpresa) partes.push('É surpresa');
    return partes;
  }

  function itemCarrinho(item) {
    if (item.tipo === 'servico') {
      const pacote = pacotePorId[item.pacote];
      return `
        <li class="item">
          <div class="thumb thumb-mini" data-tint="festa">${ilustracao({ categoria: 'aniversario', emoji: '🎶' })}</div>
          <div>
            <p class="item-nome">Parabéns na Porta: ${escapar(pacote.nome)}</p>
            <ul class="item-detalhes">${descreverServico(item.detalhes).map((parte) => `<li>${escapar(parte)}</li>`).join('')}</ul>
          </div>
          <div class="item-lado">
            <span class="item-total">${reais.format(pacote.preco)}</span>
            <button type="button" class="link-botao" data-remover="${item.chave}" aria-label="Remover Parabéns na Porta para ${escapar(item.detalhes.aniversariante)}">Remover</button>
          </div>
        </li>`;
    }
    const p = produtoPorId[item.id];
    return `
      <li class="item">
        <div class="thumb thumb-mini" data-tint="${tintDe(p.categoria)}">${ilustracao(p)}</div>
        <div>
          <p class="item-nome">${escapar(p.nome)}</p>
          <p class="item-detalhe">${reais.format(p.preco)} cada</p>
          <div class="qtd" role="group" aria-label="Quantidade de ${escapar(p.nome)}">
            <button type="button" data-chave="${item.chave}" data-qtd="-1" aria-label="Tirar um">−</button>
            <span>${item.qtd}</span>
            <button type="button" data-chave="${item.chave}" data-qtd="1" aria-label="Pôr mais um">+</button>
          </div>
        </div>
        <div class="item-lado">
          <span class="item-total">${reais.format(precoItem(item))}</span>
          <button type="button" class="link-botao" data-remover="${item.chave}" aria-label="Remover ${escapar(p.nome)}">Remover</button>
        </div>
      </li>`;
  }

  function desenharCarrinho() {
    const quantidade = carrinho.reduce((soma, i) => soma + i.qtd, 0);
    $('#contador').textContent = quantidade;
    $('#botao-carrinho').setAttribute('aria-label', `Carrinho, ${quantidade} ${quantidade === 1 ? 'item' : 'itens'}`);

    const vazio = carrinho.length === 0;
    $('#carrinho-confirmado').hidden = !confirmado;
    $('#carrinho-vazio').hidden = confirmado || !vazio;
    $('#carrinho-lista').hidden = confirmado || vazio;
    $('#carrinho-pe').hidden = confirmado || vazio;

    $('#carrinho-lista').innerHTML = carrinho.map(itemCarrinho).join('');
    if (vazio) return;

    const t = calcularTotais();
    $('#linha-produtos').hidden = t.produtosSub === 0;
    $('#t-produtos').textContent = reais.format(t.produtosSub);
    $('#linha-servicos').hidden = t.servicosSub === 0;
    $('#t-servicos').textContent = reais.format(t.servicosSub);
    $('#linha-frete').hidden = t.produtosSub === 0;
    $('#t-frete').textContent = t.frete === 0 ? 'Grátis' : reais.format(t.frete);
    const falta = centavos(CONFIG.freteGratisAcima - t.produtosSub);
    $('#nota-frete').hidden = !(t.produtosSub > 0 && falta > 0);
    $('#nota-frete').textContent = `Faltam ${reais.format(falta)} em produtos para o frete sair grátis.`;
    $('#t-total').textContent = reais.format(t.total);
    if (CONFIG.whatsapp) $('#finalizar-whats').href = linkWhatsApp(t);
  }

  function linkWhatsApp(t) {
    const linhas = ['Olá, LeveVara! Quero fazer este pedido:', ''];
    carrinho.forEach((item) => {
      if (item.tipo === 'produto') {
        const p = produtoPorId[item.id];
        linhas.push(`• ${item.qtd}x ${p.nome}: ${reais.format(precoItem(item))}`);
        return;
      }
      const d = item.detalhes;
      linhas.push(`• Parabéns na Porta, pacote ${pacotePorId[item.pacote].nome}: ${reais.format(precoItem(item))}`);
      descreverServico(d).forEach((parte) => linhas.push(`   ${parte}`));
      linhas.push(`   Contato: ${d.contratante}, ${d.telefone}`);
      if (d.recado) linhas.push(`   Recado: ${d.recado}`);
    });
    linhas.push('');
    if (t.produtosSub > 0) linhas.push(`Frete: ${t.frete === 0 ? 'grátis' : reais.format(t.frete)}`);
    linhas.push(`Total: ${reais.format(t.total)}`);
    return `https://wa.me/${CONFIG.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(linhas.join('\n'))}`;
  }

  function finalizarPedido() {
    const t = calcularTotais();
    const itens = carrinho.reduce((soma, i) => soma + i.qtd, 0);
    const temServico = carrinho.some((i) => i.tipo === 'servico');
    $('#numero-pedido').textContent = `LV-${Math.floor(1000 + Math.random() * 9000)}`;
    $('#confirmado-resumo').textContent =
      `${itens} ${itens === 1 ? 'item' : 'itens'}, total de ${reais.format(t.total)}.` +
      (temServico ? ' A equipe do Parabéns na Porta vai confirmar o horário pelo telefone informado.' : '');
    carrinho = [];
    confirmado = true;
    salvarCarrinho();
    $('#carrinho-confirmado .botao').focus();
  }

  // Gaveta do carrinho -----------------------------------------------------

  const gaveta = $('#carrinho');
  const veu = $('#fundo-carrinho');
  let focoAntes = null;
  let tempoFechar;

  function areasFora(inerte) {
    ['#topo', '#inicio', '.rodape'].forEach((seletor) => { $(seletor).inert = inerte; });
  }

  function abrirCarrinho() {
    clearTimeout(tempoFechar);
    focoAntes = document.activeElement;
    confirmado = false;
    desenharCarrinho();
    gaveta.hidden = false;
    veu.hidden = false;
    void gaveta.offsetWidth; // aplica o estado inicial antes da transição
    gaveta.classList.add('aberta');
    veu.classList.add('aberto');
    areasFora(true);
    document.body.classList.add('travado');
    $('#fechar-carrinho').focus();
  }

  function fecharCarrinho() {
    if (gaveta.hidden) return;
    gaveta.classList.remove('aberta');
    veu.classList.remove('aberto');
    areasFora(false);
    document.body.classList.remove('travado');
    tempoFechar = setTimeout(() => {
      gaveta.hidden = true;
      veu.hidden = true;
    }, semMovimento ? 0 : 260);
    if (focoAntes && document.contains(focoAntes)) focoAntes.focus({ preventScroll: true });
  }

  // Aviso rápido -----------------------------------------------------------

  let tempoAviso;
  function avisar(texto) {
    const toast = $('#toast');
    toast.textContent = texto;
    toast.classList.add('visivel');
    clearTimeout(tempoAviso);
    tempoAviso = setTimeout(() => toast.classList.remove('visivel'), 2600);
  }

  // Parabéns na Porta ------------------------------------------------------

  function cartaoPacote(p) {
    return `
      <article class="pacote" data-pacote="${p.id}">
        <h3>${escapar(p.nome)}</h3>
        <p class="pacote-preco">${reais.format(p.preco)}</p>
        <p class="pacote-meta">${escapar(p.equipe)} · ${escapar(p.duracao)}</p>
        <ul>${p.itens.map((i) => `<li>${escapar(i)}</li>`).join('')}</ul>
        <button type="button" class="botao" data-escolher="${p.id}" aria-pressed="false">Escolher este pacote</button>
      </article>`;
  }

  function marcarPacote(id) {
    document.querySelectorAll('.pacote').forEach((cartao) => {
      const escolhido = cartao.dataset.pacote === id;
      cartao.dataset.escolhido = String(escolhido);
      const botao = $('[data-escolher]', cartao);
      botao.setAttribute('aria-pressed', String(escolhido));
      botao.textContent = escolhido ? 'Pacote escolhido' : 'Escolher este pacote';
    });
  }

  function montarAgendamento() {
    const selectPacote = $('#f-pacote');
    selectPacote.innerHTML = pacotes
      .map((p) => `<option value="${p.id}">${escapar(p.nome)} (${reais.format(p.preco)})</option>`)
      .join('');
    $('#lista-pacotes').innerHTML = pacotes.map(cartaoPacote).join('');
    marcarPacote(selectPacote.value);

    const amanha = new Date();
    amanha.setDate(amanha.getDate() + 1);
    $('#f-data').min = dataISO(amanha);

    selectPacote.addEventListener('change', () => marcarPacote(selectPacote.value));

    $('#lista-pacotes').addEventListener('click', (evento) => {
      const botao = evento.target.closest('[data-escolher]');
      if (!botao) return;
      selectPacote.value = botao.dataset.escolher;
      marcarPacote(selectPacote.value);
      $('#form-agendar').scrollIntoView({ behavior: semMovimento ? 'auto' : 'smooth', block: 'start' });
      $('#f-aniversariante').focus({ preventScroll: true });
    });

    $('#form-agendar').addEventListener('submit', (evento) => {
      evento.preventDefault();
      const form = evento.target;
      const dados = new FormData(form);
      const texto = (nome) => String(dados.get(nome) || '').trim();
      const cep = texto('cep').replace(/\D/g, '');
      const detalhes = {
        aniversariante: texto('aniversariante'),
        idade: texto('idade'),
        data: texto('data'),
        hora: texto('hora'),
        endereco: texto('endereco'),
        cep: `${cep.slice(0, 5)}-${cep.slice(5)}`,
        coroa: texto('coroa'),
        surpresa: dados.get('surpresa') === 'sim',
        contratante: texto('contratante'),
        telefone: texto('telefone'),
        recado: texto('recado')
      };
      const pacote = pacotePorId[texto('pacote')];
      carrinho.push({ chave: `s:${Date.now()}`, tipo: 'servico', pacote: pacote.id, qtd: 1, detalhes });
      salvarCarrinho();

      $('#agendar-status').textContent =
        `${pacote.nome} para ${detalhes.aniversariante} em ${dataBR(detalhes.data)} às ${detalhes.hora} está no carrinho.`;
      form.reset();
      selectPacote.value = pacote.id;
      marcarPacote(pacote.id);
      abrirCarrinho();
    });
  }

  // Montagem da loja -------------------------------------------------------

  function preencherTextos() {
    const menorPacote = Math.min(...pacotes.map((p) => p.preco));
    document.querySelectorAll('[data-texto="frete-gratis"]').forEach((el) => { el.textContent = reais.format(CONFIG.freteGratisAcima); });
    document.querySelectorAll('[data-texto="parabens-desde"]').forEach((el) => { el.textContent = reais.format(menorPacote); });
    $('#ano').textContent = new Date().getFullYear();

    const temWhats = Boolean(CONFIG.whatsapp);
    $('#finalizar-whats').hidden = !temWhats;
    $('#finalizar').hidden = temWhats;
    $('#nota-demo').hidden = temWhats;
  }

  function montarLoja() {
    preencherTextos();
    desenharFiltros();
    desenharVitrine();
    $('#grade-festa').innerHTML = festa.map(cartaoProduto).join('');
    montarAgendamento();
    desenharCarrinho();

    $('#filtros').addEventListener('click', (evento) => {
      const chip = evento.target.closest('[data-filtro]');
      if (!chip) return;
      filtro = chip.dataset.filtro;
      desenharVitrine();
    });

    $('#site').addEventListener('click', (evento) => {
      const alvo = evento.target;
      const adicionar = alvo.closest('[data-adicionar]');
      if (adicionar) {
        adicionarProduto(adicionar.dataset.adicionar);
        return;
      }
      const qtd = alvo.closest('[data-qtd]');
      if (qtd) {
        const { chave } = qtd.dataset;
        const delta = Number(qtd.dataset.qtd);
        mudarQuantidade(chave, delta);
        const mesmoBotao = $(`[data-chave="${chave}"][data-qtd="${delta}"]`);
        (mesmoBotao || $('#fechar-carrinho')).focus();
        return;
      }
      const remove = alvo.closest('[data-remover]');
      if (remove) {
        remover(remove.dataset.remover);
        $('#fechar-carrinho').focus();
        return;
      }
      if (alvo.closest('[data-fechar-carrinho]')) fecharCarrinho();
    });

    $('#botao-carrinho').addEventListener('click', abrirCarrinho);
    veu.addEventListener('click', fecharCarrinho);
    $('#finalizar').addEventListener('click', finalizarPedido);
    document.addEventListener('keydown', (evento) => {
      if (evento.key === 'Escape' && !gaveta.hidden) fecharCarrinho();
    });
  }

  // Portão de senha --------------------------------------------------------

  const CHAVE_ENTRADA = 'levevara:entrou';
  const portao = $('#portao');
  const site = $('#site');
  const formSenha = $('#form-senha');
  const campoSenha = $('#senha');
  const erroSenha = $('#senha-erro');
  let lojaMontada = false;

  function entrar({ focar }) {
    portao.hidden = true;
    site.hidden = false;
    document.documentElement.classList.add('entrou');
    if (!lojaMontada) {
      montarLoja();
      lojaMontada = true;
    }
    if (focar) $('#titulo-hero').focus({ preventScroll: true });
  }

  function sair() {
    fecharCarrinho();
    guardado.apagar('sessionStorage', CHAVE_ENTRADA);
    site.hidden = true;
    portao.hidden = false;
    campoSenha.value = '';
    window.scrollTo(0, 0);
    campoSenha.focus();
  }

  formSenha.addEventListener('submit', (evento) => {
    evento.preventDefault();
    if (campoSenha.value.trim() === CONFIG.senha) {
      erroSenha.hidden = true;
      campoSenha.removeAttribute('aria-invalid');
      guardado.gravar('sessionStorage', CHAVE_ENTRADA, true);
      entrar({ focar: true });
      return;
    }
    erroSenha.hidden = false;
    campoSenha.setAttribute('aria-invalid', 'true');
    campoSenha.select();
    formSenha.classList.remove('balancar');
    void formSenha.offsetWidth; // reinicia a animação
    formSenha.classList.add('balancar');
  });

  campoSenha.addEventListener('input', () => {
    erroSenha.hidden = true;
    campoSenha.removeAttribute('aria-invalid');
  });

  $('#sair').addEventListener('click', sair);

  if (guardado.ler('sessionStorage', CHAVE_ENTRADA, false)) entrar({ focar: false });
})();
