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
| Node.js 18 ou superior (opcional) | Apenas para servir o site localmente com `npx serve` |

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

O site roda sem etapa de build. A minificação de CSS e JavaScript e a compressão de imagens estão planejadas na issue #3 e serão documentadas nesta seção quando concluídas.

Validação: os arquivos HTML e CSS são conferidos no [Nu Html Checker](https://validator.w3.org/nu/), mesmo motor do W3C. A acessibilidade será auditada com Lighthouse e axe (issue #2).

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
