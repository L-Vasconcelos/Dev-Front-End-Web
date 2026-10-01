// Build de produção: gera dist/ a partir de site-ong/ com CSS, JS e HTML minificados.
// Os nomes dos arquivos são mantidos, então as referências nos HTML continuam válidas.
import { build } from 'esbuild';
import { minify } from 'html-minifier-terser';
import { readdir, readFile, writeFile, mkdir, rm, cp, stat } from 'node:fs/promises';
import { join } from 'node:path';
import sharp from 'sharp';
import { optimize } from 'svgo';

const ORIGEM = 'site-ong';
const DESTINO = 'dist';
const NAVEGADORES = ['chrome100', 'edge100', 'firefox100', 'safari15'];

const relatorio = [];
async function medir(arquivo, antes) {
  const depois = (await stat(join(DESTINO, arquivo))).size;
  relatorio.push({ arquivo, antes, depois, reducao: ((1 - depois / antes) * 100).toFixed(1) + '%' });
}

await rm(DESTINO, { recursive: true, force: true });
await mkdir(DESTINO, { recursive: true });

// 1. CSS e JS: esbuild sem empacotar (bundle: false), só minificação e compatibilidade de sintaxe.
//    Os scripts são clássicos e independentes entre si; o esbuild preserva o escopo de cada arquivo.
const css = ['css/estilo.css'];
const js = (await readdir(join(ORIGEM, 'js'))).filter((f) => f.endsWith('.js')).map((f) => 'js/' + f);
for (const arquivo of [...css, ...js]) {
  const antes = (await stat(join(ORIGEM, arquivo))).size;
  await build({
    entryPoints: [join(ORIGEM, arquivo)],
    outfile: join(DESTINO, arquivo),
    bundle: false,
    minify: true,
    target: NAVEGADORES,
    legalComments: 'none',
    logLevel: 'warning',
  });
  await medir(arquivo, antes);
}

// 2. Imagens.
//    SVG (formato servido primeiro pelo <picture>): SVGO remove metadados e encurta caminhos.
//    WebP e PNG (fallbacks): redimensionados para 1x e 2x da largura real de exibição e
//    recomprimidos (WebP qualidade 80; PNG com paleta de 256 cores). O arquivo de 2x mantém o
//    nome original e o de 1x ganha o sufixo da largura (ex.: projeto-renda-600.webp).
const LARGURAS = {
  'equipe-comunitaria': [800, 1600],   // exibida em até 760 px (container estreito)
  'projeto-alimentacao': [600, 1200],  // exibidas em até 572 px (max-height de 300 px)
  'projeto-cultura': [600, 1200],
  'projeto-educacao': [600, 1200],
  'projeto-renda': [600, 1200],
  'logo-semear': [192],                // ícone quadrado, mantido em 192 px
};
const SIZES = {
  'equipe-comunitaria': '(min-width: 800px) 760px, calc(100vw - 2rem)',
  projeto: '(min-width: 640px) 572px, calc(100vw - 2rem)',
};
await mkdir(join(DESTINO, 'img'), { recursive: true });
for (const arquivo of await readdir(join(ORIGEM, 'img'))) {
  const origem = join(ORIGEM, 'img', arquivo);
  const antes = (await stat(origem)).size;
  if (arquivo.endsWith('.svg')) {
    const svg = optimize(await readFile(origem, 'utf8'), { multipass: true });
    await writeFile(join(DESTINO, 'img', arquivo), svg.data);
    await medir('img/' + arquivo, antes);
    continue;
  }
  const [nome, ext] = arquivo.split('.');
  const larguras = LARGURAS[nome] || [];
  for (const [i, largura] of larguras.entries()) {
    const destino = i === larguras.length - 1 ? arquivo : `${nome}-${largura}.${ext}`;
    let img = sharp(origem).resize({ width: largura, withoutEnlargement: true });
    img = ext === 'webp' ? img.webp({ quality: 80, effort: 6 }) : img.png({ palette: true, quality: 80, compressionLevel: 9 });
    await img.toFile(join(DESTINO, 'img', destino));
    if (destino === arquivo) await medir('img/' + arquivo, antes);
  }
  if (!larguras.length) await cp(origem, join(DESTINO, 'img', arquivo));
}

// 3. HTML: remove comentários e espaços, mantendo aspas e atributos ARIA intactos.
const paginas = (await readdir(ORIGEM)).filter((f) => f.endsWith('.html'));
for (const pagina of paginas) {
  const fonte = await readFile(join(ORIGEM, pagina), 'utf8');
  // Fallbacks raster ganham srcset 1x/2x e sizes; imagens lazy decodificam fora da thread principal.
  const html = fonte
    .replace(/<source srcset="img\/([a-z-]+)\.(webp)" type="image\/webp">/g, (m, nome, ext) =>
      LARGURAS[nome]?.length === 2
        ? `<source srcset="img/${nome}-${LARGURAS[nome][0]}.${ext} ${LARGURAS[nome][0]}w, img/${nome}.${ext} ${LARGURAS[nome][1]}w" sizes="${SIZES[nome] || SIZES.projeto}" type="image/webp">`
        : m)
    .replace(/<img src="img\/([a-z-]+)\.png"/g, (m, nome) =>
      LARGURAS[nome]?.length === 2
        ? `<img src="img/${nome}.png" srcset="img/${nome}-${LARGURAS[nome][0]}.png ${LARGURAS[nome][0]}w, img/${nome}.png ${LARGURAS[nome][1]}w" sizes="${SIZES[nome] || SIZES.projeto}"`
        : m)
    .replace(/loading="lazy">/g, 'loading="lazy" decoding="async">');
  const saida = await minify(html, {
    collapseWhitespace: true,
    conservativeCollapse: true,   // mantém um espaço entre elementos inline (evita palavras coladas)
    removeComments: true,
    minifyCSS: true,
    minifyJS: true,
    removeRedundantAttributes: false,
    removeAttributeQuotes: false,
  });
  await writeFile(join(DESTINO, pagina), saida);
  await medir(pagina, Buffer.byteLength(fonte));
}

console.table(relatorio);
const total = relatorio.reduce((s, r) => ({ antes: s.antes + r.antes, depois: s.depois + r.depois }), { antes: 0, depois: 0 });
console.log(`Total: ${total.antes} -> ${total.depois} bytes (-${((1 - total.depois / total.antes) * 100).toFixed(1)}%)`);
