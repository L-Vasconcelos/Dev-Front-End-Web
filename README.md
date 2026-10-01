# Instituto Semear — Desenvolvimento Front-End para Web

Site institucional de uma ONG fictícia, o Instituto Semear, desenvolvido na disciplina Desenvolvimento Front-End para Web (CST em Análise e Desenvolvimento de Sistemas). O projeto evoluiu ao longo das Experiências Práticas: estrutura HTML5 semântica, estilização com CSS3, componentes interativos e, por fim, versionamento, acessibilidade e publicação.

## Visão geral

| Página | Conteúdo |
|---|---|
| `index.html` | Apresentação institucional, impacto e formas de apoio |
| `projetos.html` | Quatro projetos sociais, comparativo, doação e voluntariado |
| `cadastro.html` | Formulário de cadastro de voluntários com validação |
| `componentes.html` | Guia visual dos componentes e de suas variantes |

## Tecnologias

| Tecnologia | Uso no projeto |
|---|---|
| HTML5 | Marcação semântica, formulário com validação nativa e atributos ARIA |
| CSS3 | Design system em variáveis, Grid de 12 colunas, Flexbox, media queries mobile-first e animações |
| JavaScript (ES6) | Máscaras e validação do formulário, menu responsivo, alertas, modal e toast |
| API ViaCEP | Preenchimento automático do endereço a partir do CEP |
| Git e GitHub | GitFlow, issues, milestones, pull requests e releases |

## Estrutura de pastas

```
Dev-Front-End-Web/
├── README.md                 Este documento
└── site-ong/
    ├── index.html            Página institucional
    ├── projetos.html         Projetos, doação e voluntariado
    ├── cadastro.html         Formulário de voluntários
    ├── componentes.html      Guia de componentes
    ├── README.md             Detalhes da estrutura HTML (EP1)
    ├── css/estilo.css        Folha de estilos única, organizada por seções
    ├── js/mascaras.js        Máscaras, dígito do CPF, idade mínima e ViaCEP
    ├── js/menu.js            Menu responsivo (hambúrguer, dropdown, tecla Esc)
    ├── js/feedback.js        Toast e modal de confirmação
    └── img/                  Imagens em SVG, WebP e PNG
```

## Pré-requisitos

| Item | Observação |
|---|---|
| Git | Para clonar o repositório |
| Navegador atualizado | Chrome, Edge, Firefox ou Safari |
| Node.js 18 ou superior | Para o build de produção (`npm run build`) e para servir o site localmente |

## Instalação e execução local

**1. Clonar o repositório e entrar na pasta**

```bash
git clone https://github.com/L-Vasconcelos/Dev-Front-End-Web.git
cd Dev-Front-End-Web
```

**2. Abrir o site**

Abrir `site-ong/index.html` no navegador. O site é estático e não exige instalação de pacotes.

**3. Servir por HTTP (recomendado)**

Evita restrições do navegador com arquivos locais e permite testar a consulta ao ViaCEP:

```bash
npx serve site-ong
```

O endereço exibido no terminal (por padrão `http://localhost:3000`) abre o site.

## Build e testes

O build de produção usa **esbuild** (CSS e JavaScript) e **html-minifier-terser** (HTML). Ele gera a pasta `dist/` com os arquivos minificados e os mesmos nomes da origem, então os HTML não precisam de alteração.

```bash
npm install          # instala as dependências de desenvolvimento
npm run build        # gera dist/ e mostra a tabela de redução por arquivo
npm run preview      # serve dist/ em http://localhost:3000
npm run dev          # serve site-ong/ sem build, para desenvolvimento
```

| Arquivo | Antes | Depois | Redução |
|---|---|---|---|
| `css/estilo.css` | 38.1 kB | 25.4 kB | 33.4% |
| `js/mascaras.js` | 10.8 kB | 4.4 kB | 59.1% |
| `js/feedback.js` | 3.2 kB | 1.6 kB | 50.5% |
| `js/menu.js` | 1.5 kB | 0.6 kB | 59.4% |
| 4 páginas HTML | 53.7 kB | 41.3 kB | 23.0% |
| **Total** | **107.4 kB** | **73.3 kB** | **31.7%** |

Testes: os arquivos HTML e CSS são conferidos no [Nu Html Checker](https://validator.w3.org/nu/), mesmo motor do W3C. A acessibilidade foi auditada com axe-core e Playwright, com relatório em [`docs/auditoria-acessibilidade.md`](docs/auditoria-acessibilidade.md). Depois do build, o mesmo teste roda sobre `dist/` para confirmar que máscaras, menu, modal e toast funcionam igual à origem.

## Versionamento

O repositório segue o **GitFlow**:

| Branch | Papel |
|---|---|
| `main` | Versões de lançamento estáveis, marcadas com tag |
| `develop` | Integração do trabalho em andamento e base de toda nova branch |
| `feature/*` | Uma funcionalidade por branch, criada a partir da develop e integrada por pull request |
| `release/*` | Preparação de uma versão antes de subir para a main |
| `hotfix/*` | Correção urgente criada a partir da main e integrada na main e na develop |

Nenhuma alteração entra direto na `main`. Cada pull request descreve o motivo da mudança, traz checklist e é integrado com merge commit, preservando o histórico.

### Padrão de commits

As mensagens seguem o [Conventional Commits](https://www.conventionalcommits.org/pt-br/), no formato `tipo(escopo): descrição`.

| Tipo | Quando usar |
|---|---|
| `feat` | Nova funcionalidade |
| `fix` | Correção de erro |
| `docs` | Documentação |
| `style` | Formatação sem mudança de comportamento |
| `refactor` | Reorganização de código sem mudança de comportamento |
| `perf` | Melhoria de desempenho |

Exemplo: `docs(readme): atualiza status das experiências práticas`.

### Versões

Versionamento semântico no formato `MAIOR.MENOR.CORREÇÃO`. A série 0.x indica projeto em desenvolvimento, e cada Experiência Prática incrementa a versão menor. A versão 1.0.0 marca a publicação em produção.

| Versão | Conteúdo |
|---|---|
| v0.1.0 | EP1: estrutura HTML5 semântica e base de tokens |
| v0.2.0 | EP2: estilização, layout e componentes (pré-lançamento) |
| v1.0.0 | Entrega final: acessibilidade, otimização e deploy (milestone #1) |

## Acompanhamento

As tarefas restantes estão em issues ligadas à milestone v1.0.0: acessibilidade (#2), otimização (#3), documentação (#4) e deploy (#5).

## Autor

Luis Fellipe Vasconcelos Magalhães da Silva — Desenvolvimento Front-End para Web, turma CVCS_EAD_2317034.
