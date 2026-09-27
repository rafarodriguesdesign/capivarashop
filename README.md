# LeveVara

Loja de coisas de capivara para toda a família: pets, bebês, crianças, adolescentes,
adultos, vovós e vovôs. Tem artigos de aniversário e o **Parabéns na Porta**, em que a
equipe vai até a casa do cliente, canta parabéns e coloca uma coroa de capivara no
aniversariante.

**Senha para entrar:** `Capivara` (com C maiúsculo)

## Como abrir

Não precisa instalar nada. Abra o arquivo `index.html` no navegador (dois cliques).

## O que o site tem

- **Portão de senha** na entrada. Depois de entrar, o navegador lembra até a aba ser fechada.
  O link "Sair da loja", no rodapé, tranca de novo.
- **Loja** com 32 produtos e filtro por público: Pets, Bebês, Crianças, Adolescentes,
  Adultos, Vovós e vovôs, Casa e mais.
- **Aniversário de capivara**: coroa, kit festa, topo de bolo, balões, velas, convites,
  chapéus e lembrancinhas.
- **Parabéns na Porta**: três pacotes e um formulário de agendamento (aniversariante, idade,
  dia, horário, endereço, CEP, tamanho da coroa para criança, adulto ou pet, e se é surpresa).
  O agendamento vai para o carrinho junto com os produtos.
- **Carrinho** com quantidades, frete (grátis acima de R$ 199) e total. Ele fica salvo no
  navegador de cada visitante.
- Modo claro e escuro, sempre em tons de caramelo, e layout que funciona no celular.

## Como editar

| O que mudar | Onde |
| --- | --- |
| Senha, WhatsApp da loja, valor do frete | `js/config.js` |
| Produtos, preços, categorias e pacotes do Parabéns na Porta | `js/dados.js` |
| Cores (variáveis no topo do arquivo) e visual | `css/style.css` |
| Textos das seções | `index.html` |

## Receber os pedidos pelo WhatsApp

Hoje o botão "Finalizar pedido" funciona em **modo demonstração**: mostra um número de pedido
e não cobra nada. Para receber os pedidos de verdade, coloque o número da loja em
`js/config.js`:

```js
whatsapp: '5511912345678', // 55 + DDD + número, só dígitos
```

Com isso, o botão vira "Finalizar pelo WhatsApp" e abre uma conversa com a lista de produtos,
os dados do Parabéns na Porta e o total já escritos.

## Publicar no GitHub Pages

1. No GitHub, abra o repositório e vá em **Settings → Pages**.
2. Em **Build and deployment**, escolha **Deploy from a branch**, selecione o branch e a pasta
   `/ (root)` e salve.
3. Em alguns minutos o site fica disponível no endereço mostrado nessa página.

## Sobre a senha

A senha é conferida pelo próprio navegador, com JavaScript. Ela esconde a loja de visitantes
comuns, mas quem abrir o código-fonte da página consegue ler a senha e o conteúdo. Para uma
proteção de verdade, é preciso que o servidor peça a senha (por exemplo, Cloudflare Access ou
a proteção por senha da Netlify ou da Vercel).
