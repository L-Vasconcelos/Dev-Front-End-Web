# Auditoria de acessibilidade — WCAG 2.1 nível AA

Auditoria automatizada e de teclado das 4 páginas do site, feita na branch `feature/acessibilidade-wcag` (issue #2).

## Método

| Item | Ferramenta ou critério |
|---|---|
| Regras automáticas | axe-core 4 com as tags `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa` e `best-practice` |
| Navegador | Chromium (Playwright), larguras de 375 px e 1280 px |
| Teclado | Percurso completo com Tab em cada página, verificando ordem e contorno de foco visível |
| Componentes | Menu mobile e modal operados só pelo teclado (Enter, Tab e Esc) |
| Contraste | Fórmula de luminância relativa da WCAG aplicada aos tokens de cor |

## Resultado antes das correções

| Página | Problema | Critério |
|---|---|---|
| `componentes.html` (375 px) | 3 blocos de código com rolagem horizontal não recebiam foco pelo teclado | 2.1.1 Teclado |
| `cadastro.html` | O botão de calendário do campo de data recebia foco sem contorno visível | 2.4.7 Foco visível |
| Todas | O axe não calcula contraste sobre gradiente (título e texto do banner) | Verificação manual |

## Correções

| Arquivo | Alteração |
|---|---|
| `site-ong/componentes.html` | Blocos `pre.codigo` com `tabindex="0"`, `role="region"` e `aria-label` descritivo |
| `site-ong/css/estilo.css` | `input[type="date"]:focus-within` com contorno de 3 px; contorno âmbar em `.codigo:focus-visible` |

## Resultado depois das correções

| Página | Violações axe (375 / 1280 px) | Paradas de Tab | Sem foco visível |
|---|---|---|---|
| `index.html` | 0 / 0 | 11 / 13 | 0 |
| `projetos.html` | 0 / 0 | 17 / 19 | 0 |
| `cadastro.html` | 0 / 0 | 36 / 38 | 0 |
| `componentes.html` | 0 / 0 | 14 / 16 | 0 |

A primeira parada de Tab em todas as páginas é o link "Pular para o conteúdo principal".

## Componentes testados pelo teclado

| Componente | Comportamento verificado |
|---|---|
| Menu mobile | Enter abre (`aria-expanded` passa a `true`), Tab leva ao primeiro link, Esc fecha e devolve o foco ao botão |
| Modal "Limpar formulário" | Enter abre o `dialog`, o foco vai para "Cancelar", Esc fecha e o foco volta ao botão "Limpar formulário" |

## Contraste verificado manualmente

| Combinação | Razão | Exigência AA |
|---|---|---|
| Branco sobre `#14532d` (início do gradiente do banner) | 9.11:1 | 4.5:1 |
| Branco sobre `#166534` (fim do gradiente do banner) | 7.13:1 | 4.5:1 |
| Contorno de foco `#166534` sobre fundo areia `#faf8f3` | 6.72:1 | 3:1 |
| Contorno âmbar `#b45309` sobre fundo areia `#faf8f3` | 4.73:1 | 3:1 |

## Limitação

Não houve teste com leitor de tela real (NVDA ou VoiceOver). A estrutura verificada pelo axe (landmarks, rótulos, regiões `aria-live`) é a base para esse teste, que fica como próximo passo.
