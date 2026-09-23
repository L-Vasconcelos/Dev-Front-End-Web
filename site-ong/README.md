# Instituto Semear — Experiência Prática 1 (Front-End)

Projeto front-end desenvolvido para a Experiência Prática 1 da disciplina
Desenvolvimento Front-End para Web (CST em Análise e Desenvolvimento de Sistemas).

## Estrutura de diretórios

```
site-ong/
├── index.html          Página institucional da ONG
├── projetos.html       Projetos sociais, doação e voluntariado
├── cadastro.html       Formulário de cadastro de voluntários
├── css/
│   └── estilo.css      Folha de estilos única, organizada em 10 seções
├── img/                Cada imagem em três formatos: .svg, .webp e .png
│   ├── logo-semear.svg | .webp | .png
│   ├── equipe-comunitaria.svg | .webp | .png
│   ├── projeto-educacao.svg | .webp | .png
│   ├── projeto-alimentacao.svg | .webp | .png
│   ├── projeto-renda.svg | .webp | .png
│   └── projeto-cultura.svg | .webp | .png
└── js/
    └── mascaras.js     Máscaras de entrada e validações complementares
```

## Como executar

Abrir `index.html` em qualquer navegador. Não há dependências externas nem build.

## Tags semânticas utilizadas

| Tag | Uso no projeto |
|---|---|
| `<header>` | Topo fixo com marca e navegação principal, repetido nas três páginas |
| `<nav>` | Menu principal, sumário interno da página de projetos e navegação do rodapé |
| `<main>` | Conteúdo único e central de cada página (um por documento) |
| `<section>` | Blocos temáticos com título próprio (quem somos, impacto, formulário) |
| `<article>` | Conteúdo autossuficiente: cada projeto social e cada cartão institucional |
| `<aside>` | Bloco complementar "Como apoiar" na página inicial |
| `<figure>` / `<figcaption>` | Imagens dos projetos com legenda associada |
| `<footer>` | Rodapé com contato, mapa do site e transparência |
| `<address>` | Dados de contato da organização |
| `<fieldset>` / `<legend>` | Agrupamento lógico dos campos do formulário |
| `<dl>` / `<dt>` / `<dd>` | Lista de canais de doação, cada canal ligado à sua descrição |
| `<table>` / `<caption>` | Comparativo dos programas, com cabeçalhos de linha e coluna |
| `<ol>` | Etapas sequenciais de entrada do voluntário |

## Hierarquia de títulos

- `<h1>` — um por página, identificando o assunto do documento
- `<h2>` — seções principais do `<main>` e títulos do rodapé
- `<h3>` — cada projeto ou cartão dentro de uma seção
- `<h4>` — subdivisões internas de um projeto (objetivo, público, resultados)
- `<h5>` — detalhamento final (como participar como voluntário)

A sequência não pula níveis, o que permite que leitores de tela naveguem pelo
índice de cabeçalhos e que os mecanismos de busca interpretem a relevância
relativa do conteúdo.

## Validações nativas aplicadas (cadastro.html)

| Campo | Recurso nativo |
|---|---|
| Nome | `required`, `minlength="6"`, `maxlength="80"` |
| CPF | `required`, `pattern="\d{3}\.\d{3}\.\d{3}-\d{2}"`, `title`, `maxlength` |
| Nascimento | `type="date"`, `min`, `max` |
| E-mail | `type="email"`, `required`, `maxlength` |
| Telefone | `type="tel"`, `pattern="\(\d{2}\)\s\d{5}-\d{4}"` |
| CEP | `pattern="\d{5}-\d{3}"`, `autocomplete="postal-code"` |
| UF / Projeto | `<select required>` com opção vazia inicial |
| Turno | `<input type="radio" required>` |
| Horas semanais | `type="number"`, `min="2"`, `max="40"`, `step="1"` |
| Aceite LGPD | `<input type="checkbox" required>` |

## Validações complementares em JavaScript

- Máscaras progressivas de CPF, telefone e CEP aplicadas durante a digitação
- Conferência dos dois dígitos verificadores do CPF, via `setCustomValidity()`
- Idade mínima de 18 anos calculada a partir da data de nascimento
- Exigência de ao menos um dia marcado em disponibilidade semanal
- Preenchimento automático do endereço pela API ViaCEP, com degradação
  silenciosa quando não há conexão
- Contador de caracteres da área de texto e mensagem de retorno com
  `role="status"` e `aria-live="polite"`

## Acessibilidade

- `lang="pt-BR"` declarado no documento
- Link de salto para o conteúdo principal, visível ao receber foco
- Todo campo possui `<label>` associado por `for`/`id`
- Textos de apoio ligados aos campos por `aria-describedby`
- `aria-current="page"` no item de menu da página atual
- Imagens servidas por `<picture>`, com SVG e WebP como fontes e PNG de fallback
- Imagens decorativas com `alt=""` e imagens informativas com `alt` descritivo
- `width` e `height` declarados em todas as imagens, evitando deslocamento de layout
- Contraste dos textos sobre fundo verde acima de 4.5:1
- Foco visível personalizado via `:focus-visible`

## Conformidade

Os três arquivos HTML, os seis arquivos SVG e a folha de estilos foram submetidos
ao Nu Html Checker (mesmo motor do W3C Markup Validation Service) e retornaram
**zero erros e zero avisos**.
