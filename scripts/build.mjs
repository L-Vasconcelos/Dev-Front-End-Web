// Build de produção: gera dist/ a partir de site-ong/ com CSS, JS e HTML minificados.
// Os nomes dos arquivos são mantidos, então as referências nos HTML continuam válidas.
import { build } from 'esbuild';
import { minify } from 'html-minifier-terser';
import { readdir, readFile, writeFile, mkdir, rm, cp, stat } from 'node:fs/promises';
import { join } from 'node:path';

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

// 2. HTML: remove comentários e espaços, mantendo aspas e atributos ARIA intactos.
const paginas = (await readdir(ORIGEM)).filter((f) => f.endsWith('.html'));
for (const pagina of paginas) {
  const fonte = await readFile(join(ORIGEM, pagina), 'utf8');
  const saida = await minify(fonte, {
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

// 3. Imagens: copiadas sem alteração (a otimização é feita na etapa seguinte).
await cp(join(ORIGEM, 'img'), join(DESTINO, 'img'), { recursive: true });

console.table(relatorio);
const total = relatorio.reduce((s, r) => ({ antes: s.antes + r.antes, depois: s.depois + r.depois }), { antes: 0, depois: 0 });
console.log(`Total: ${total.antes} -> ${total.depois} bytes (-${((1 - total.depois / total.antes) * 100).toFixed(1)}%)`);
