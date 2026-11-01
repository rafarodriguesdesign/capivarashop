# Tucanoo acenando

Vídeo do ícone do Tucanoo feito com o vídeo do flamingo como referência: a asa sai para
fora da moldura do ícone e acena, o tucano pisca, abre o bico e balança a cabeça no ritmo
do aceno. O ritmo foi medido no vídeo do flamingo (um aceno a cada ~0,45 s e uma piscada a
cada ~1,3 s).

| Arquivo | O que é |
| --- | --- |
| `tucanoo_acenando.mp4` | O vídeo: 1080×1080, 30 fps, 10 s (um loop de 5 s repetido 2 vezes), H.264 |
| `animacao/tucanoo_anim.html` | A animação. Aberta no navegador, roda ao vivo |
| `animacao/render.js` | Gera os quadros PNG da animação com o Chromium |

## Ajustar a animação

No começo do `<script>` de `animacao/tucanoo_anim.html`:

- `WAVES`: quantos acenos cabem em um loop (mais = aceno mais rápido)
- `LOOP`: duração do loop, em segundos
- `BLINKS`: momentos das piscadas
- `BEAK`: momentos em que o bico abre

A cor do fundo é o `fill` do retângulo `outer`.

## Gerar o vídeo de novo

Precisa do Node.js com Playwright (`npm install playwright` e `npx playwright install chromium`)
e do ffmpeg. Os comandos abaixo rodam dentro da pasta `tucanoo-video`.

1. Gerar os quadros de um loop (150 quadros, em 2160 px para suavizar as bordas):

```bash
node animacao/render.js animacao/tucanoo_anim.html quadros 30 2
```

2. Montar o vídeo (repete o loop 2 vezes e reduz para 1080 px):

```bash
ffmpeg -framerate 30 -i quadros/f_%04d.png -f lavfi -i anullsrc=r=48000:cl=stereo -filter_complex "[0:v]loop=loop=1:size=150:start=0,scale=1080:1080:flags=lanczos,format=yuv420p[v]" -map "[v]" -map 1:a -c:v libx264 -preset slow -crf 16 -tune animation -r 30 -c:a aac -b:a 96k -shortest -movflags +faststart tucanoo_acenando.mp4
```

Se mudar o `LOOP`, troque o `size=150` por `LOOP × 30`.
