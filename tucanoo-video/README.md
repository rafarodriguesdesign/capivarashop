# Tucanoo acenando

Vídeo do ícone do Tucanoo feito com o vídeo do flamingo como referência. Começa e termina
na pose do logo, com a asa dobrada. No meio, a fresta branca da asa fecha, a asa sai pela
borda da moldura e acena; o tucano pisca, abre o bico e balança a cabeça no ritmo do
aceno. O ritmo foi medido no vídeo do flamingo (um aceno a cada ~0,45 s e uma piscada a
cada ~1,3 s).

- **Pôr do sol no fundo:** o vídeo começa num fim de tarde (céu creme) e o pôr do sol vai
  começando: o céu fica pêssego e rosado, o sol desce por trás do ícone até encostar no
  horizonte e o mar ganha reflexos dourados.
- **Asa sem contorno:** a asa levantada tem a mesma cor do corpo e se funde a ele.
- **Ponta do bico redesenhada:** a borda de baixo do bico desce em curva contínua até a
  ponta do gancho (no desenho original havia um canto vivo). Quando o bico abre, a
  mandíbula de baixo gira inteira em volta do canto da boca e termina numa ponta azul,
  levemente virada para cima, que espelha o gancho de cima.

Como o céu muda do começo ao fim, o primeiro e o último quadro não são iguais: tocado em
loop, o fundo volta para o fim de tarde.

| Arquivo | O que é |
| --- | --- |
| `tucanoo_acenando.mp4` | O vídeo: 1080×1080, 30 fps, 10 s, H.264 |
| `animacao/tucanoo_anim.html` | A animação. Aberta no navegador, roda ao vivo |
| `animacao/render.js` | Gera os quadros PNG da animação com o Chromium |

## Ajustar a animação

No começo do `<script>` de `animacao/tucanoo_anim.html`:

- `T`: duração total, em segundos
- `T_LIFT`: quando a asa começa a levantar (até lá, o logo fica parado)
- `FOLD_NEAR`: perto de quando a asa volta a dobrar
- `WAVE_PERIOD`: duração de um aceno (menor = mais rápido)
- `BLINKS`: momentos das piscadas
- `BEAK` e `OPEN_DEG`: quando o bico abre e quanto

No bloco do pôr do sol:

- `PAL`: cores do céu, do sol, do mar e das nuvens no começo e no fim do vídeo
- `SUN`: caminho do sol (de onde parte e onde termina)

Para ver a animação com fundo liso, sem o pôr do sol, abra a página com `?fundo=FFE3B4`
(qualquer cor em hexadecimal).

## Gerar o vídeo de novo

Precisa do Node.js com Playwright (`npm install playwright` e `npx playwright install chromium`)
e do ffmpeg. Os comandos abaixo rodam dentro da pasta `tucanoo-video`.

1. Gerar os quadros (300 quadros, em 2160 px para suavizar as bordas):

```bash
node animacao/render.js animacao/tucanoo_anim.html quadros 30 2
```

2. Montar o vídeo (reduz para 1080 px):

```bash
ffmpeg -framerate 30 -i quadros/f_%04d.png -f lavfi -i anullsrc=r=48000:cl=stereo -filter_complex "[0:v]scale=1080:1080:flags=lanczos,format=yuv420p[v]" -map "[v]" -map 1:a -c:v libx264 -preset slow -crf 16 -tune animation -r 30 -c:a aac -b:a 96k -shortest -movflags +faststart tucanoo_acenando.mp4
```
