/* =========================================================================
   Instituto Semear - Máscaras de entrada e validações do formulário
   Autor: Luis Fellipe Vasconcelos Magalhaes da Silva
   Sem dependências externas. Complementa a validação nativa do HTML5.
   ========================================================================= */

(function () {
  'use strict';

  /* ---------------------------------------------------------------------
     Utilitários
     --------------------------------------------------------------------- */

  // Remove tudo que não for dígito
  function apenasDigitos(valor) {
    return valor.replace(/\D/g, '');
  }

  // Aplica uma máscara em tempo real preservando a posição lógica do cursor
  function aplicarMascara(campo, formatador) {
    if (!campo) return;

    function processar() {
      var anterior = campo.value;
      var novo = formatador(anterior);
      if (novo !== anterior) {
        campo.value = novo;
      }
    }

    campo.addEventListener('input', processar);
    campo.addEventListener('blur', processar);
  }

  /* ---------------------------------------------------------------------
     Formatadores
     --------------------------------------------------------------------- */

  // 000.000.000-00
  function formatarCPF(valor) {
    var d = apenasDigitos(valor).slice(0, 11);
    if (d.length > 9) return d.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
    if (d.length > 6) return d.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
    if (d.length > 3) return d.replace(/(\d{3})(\d{1,3})/, '$1.$2');
    return d;
  }

  // (00) 00000-0000
  function formatarTelefone(valor) {
    var d = apenasDigitos(valor).slice(0, 11);
    if (d.length > 10) return d.replace(/(\d{2})(\d{5})(\d{1,4})/, '($1) $2-$3');
    if (d.length > 6) return d.replace(/(\d{2})(\d{4})(\d{1,4})/, '($1) $2-$3');
    if (d.length > 2) return d.replace(/(\d{2})(\d{1,5})/, '($1) $2');
    if (d.length > 0) return d.replace(/(\d{1,2})/, '($1');
    return d;
  }

  // 00000-000
  function formatarCEP(valor) {
    var d = apenasDigitos(valor).slice(0, 8);
    if (d.length > 5) return d.replace(/(\d{5})(\d{1,3})/, '$1-$2');
    return d;
  }

  /* ---------------------------------------------------------------------
     Validação de CPF (dígitos verificadores)
     --------------------------------------------------------------------- */

  function cpfValido(cpf) {
    var d = apenasDigitos(cpf);
    if (d.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(d)) return false; // rejeita 111.111.111-11 e similares

    var soma = 0;
    var resto;
    var i;

    for (i = 1; i <= 9; i++) {
      soma += parseInt(d.substring(i - 1, i), 10) * (11 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(d.substring(9, 10), 10)) return false;

    soma = 0;
    for (i = 1; i <= 10; i++) {
      soma += parseInt(d.substring(i - 1, i), 10) * (12 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(d.substring(10, 11), 10)) return false;

    return true;
  }

  /* ---------------------------------------------------------------------
     Elementos
     --------------------------------------------------------------------- */

  var form = document.getElementById('form-voluntario');
  if (!form) return;

  var campoCPF = document.getElementById('cpf');
  var campoTelefone = document.getElementById('telefone');
  var campoCEP = document.getElementById('cep');
  var campoNascimento = document.getElementById('nascimento');
  var campoExperiencia = document.getElementById('experiencia');
  var contador = document.getElementById('contador-experiencia');
  var retorno = document.getElementById('retorno-envio');
  var grupoDisponibilidade = document.getElementById('grupo-disponibilidade');

  /* ---------------------------------------------------------------------
     Máscaras
     --------------------------------------------------------------------- */

  aplicarMascara(campoCPF, formatarCPF);
  aplicarMascara(campoTelefone, formatarTelefone);
  aplicarMascara(campoCEP, formatarCEP);

  /* ---------------------------------------------------------------------
     Validações personalizadas acopladas à API de validação nativa
     --------------------------------------------------------------------- */

  // CPF: formato + dígitos verificadores
  if (campoCPF) {
    campoCPF.addEventListener('input', function () {
      campoCPF.setCustomValidity('');
    });
    campoCPF.addEventListener('blur', function () {
      if (campoCPF.value === '') return;
      if (!cpfValido(campoCPF.value)) {
        campoCPF.setCustomValidity('CPF inválido. Confira os números digitados.');
      } else {
        campoCPF.setCustomValidity('');
      }
      campoCPF.reportValidity();
    });
  }

  // Idade mínima de 18 anos
  if (campoNascimento) {
    campoNascimento.addEventListener('change', function () {
      campoNascimento.setCustomValidity('');
      if (!campoNascimento.value) return;

      var nasc = new Date(campoNascimento.value + 'T00:00:00');
      var hoje = new Date();
      var idade = hoje.getFullYear() - nasc.getFullYear();
      var m = hoje.getMonth() - nasc.getMonth();
      if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) idade--;

      if (idade < 18) {
        campoNascimento.setCustomValidity('É necessário ter 18 anos ou mais para se cadastrar.');
        campoNascimento.reportValidity();
      }
    });
  }

  // Disponibilidade: ao menos um dia marcado
  function validarDisponibilidade() {
    if (!grupoDisponibilidade) return true;
    var caixas = grupoDisponibilidade.querySelectorAll('input[type="checkbox"]');
    var algumMarcado = Array.prototype.some.call(caixas, function (c) { return c.checked; });

    caixas[0].setCustomValidity(algumMarcado ? '' : 'Selecione ao menos um dia da semana.');
    return algumMarcado;
  }

  if (grupoDisponibilidade) {
    grupoDisponibilidade.addEventListener('change', validarDisponibilidade);
  }

  /* ---------------------------------------------------------------------
     Contador de caracteres da área de texto
     --------------------------------------------------------------------- */

  if (campoExperiencia && contador) {
    campoExperiencia.addEventListener('input', function () {
      contador.textContent = campoExperiencia.value.length + ' / 500 caracteres';
    });
  }

  /* ---------------------------------------------------------------------
     Busca de endereço pelo CEP (ViaCEP) - degrada sem quebrar o formulário
     --------------------------------------------------------------------- */

  if (campoCEP) {
    campoCEP.addEventListener('blur', function () {
      var d = apenasDigitos(campoCEP.value);
      if (d.length !== 8) return;

      fetch('https://viacep.com.br/ws/' + d + '/json/')
        .then(function (r) { return r.json(); })
        .then(function (dados) {
          if (dados.erro) {
            campoCEP.setCustomValidity('CEP não encontrado na base dos Correios.');
            campoCEP.reportValidity();
            return;
          }
          campoCEP.setCustomValidity('');
          preencher('logradouro', dados.logradouro);
          preencher('bairro', dados.bairro);
          preencher('cidade', dados.localidade);
          preencher('uf', dados.uf);
          var numero = document.getElementById('numero');
          if (numero) numero.focus();
        })
        .catch(function () {
          // Sem conexão: o usuário preenche manualmente, sem bloquear o envio.
          campoCEP.setCustomValidity('');
        });
    });

    campoCEP.addEventListener('input', function () {
      campoCEP.setCustomValidity('');
    });
  }

  function preencher(id, valor) {
    var el = document.getElementById(id);
    if (el && valor) el.value = valor;
  }

  /* ---------------------------------------------------------------------
     Envio
     --------------------------------------------------------------------- */

  /* ---------------------------------------------------------------------
     Limpar formulário: confirmação em modal e aviso em toast
     --------------------------------------------------------------------- */

  var modalLimpar = document.getElementById('modal-limpar');
  var limparDireto = false;   // true quando o próprio script limpa (após envio)

  function limparTudo() {
    limparDireto = true;
    form.reset();
    limparDireto = false;
    if (contador) contador.textContent = '0 / 500 caracteres';
  }

  form.addEventListener('reset', function (evento) {
    if (limparDireto || !window.SemearFeedback) return;
    if (window.SemearFeedback.abrirModal(modalLimpar)) evento.preventDefault();
  });

  if (modalLimpar) {
    modalLimpar.addEventListener('close', function () {
      if (modalLimpar.returnValue !== 'confirmar') return;
      limparTudo();
      if (retorno) retorno.hidden = true;
      document.getElementById('nome').focus();
      window.SemearFeedback.toast('Formulário limpo. Você pode preencher de novo.', 'sucesso');
    });
  }

  form.addEventListener('submit', function (evento) {
    evento.preventDefault();

    // Revalida o que a API nativa não cobre sozinha
    if (campoCPF && campoCPF.value && !cpfValido(campoCPF.value)) {
      campoCPF.setCustomValidity('CPF inválido. Confira os números digitados.');
    }
    validarDisponibilidade();

    if (!form.checkValidity()) {
      form.reportValidity();
      mostrarRetorno('Existem campos com problemas. Revise os itens destacados.', 'erro');
      return;
    }

    var nome = document.getElementById('nome').value.trim().split(' ')[0];
    var botaoEnviar = form.querySelector('button[type="submit"]');
    var textoOriginal = botaoEnviar.textContent;

    // Estado disabled durante o envio: evita clique duplo e informa que algo está acontecendo
    botaoEnviar.disabled = true;
    botaoEnviar.textContent = 'Enviando...';
    form.setAttribute('aria-busy', 'true');

    // Simulação do tempo de resposta de um servidor (o projeto é só front-end)
    setTimeout(function () {
      mostrarRetorno(
        'Cadastro enviado com sucesso. Obrigado, ' + nome + '! Entraremos em contato pelo e-mail informado.',
        'sucesso'
      );
      limparTudo();
      botaoEnviar.disabled = false;
      botaoEnviar.textContent = textoOriginal;
      form.removeAttribute('aria-busy');
    }, 1200);
  });

  function mostrarRetorno(mensagem, tipo) {
    if (!retorno) return;
    retorno.textContent = mensagem;
    retorno.className = 'retorno retorno--' + tipo;
    retorno.hidden = false;
    retorno.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

})();
