/* =========================================================================
   Instituto Semear - Componentes de feedback (toast e modal)
   API por atributos, para reuso sem escrever JavaScript:
     data-toast="Mensagem" data-toast-tipo="sucesso|erro"  -> mostra um toast
     data-modal-abrir="id"                                   -> abre o <dialog>
     dentro do dialog: data-acao="cancelar|confirmar"        -> fecha com esse valor
     data-toast-confirmar="Mensagem" no dialog               -> toast ao confirmar
   Via código: SemearFeedback.toast("Mensagem", "erro")
   ========================================================================= */
(function () {
  'use strict';

  var area = document.querySelector('.toast-area');
  var semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)');

  function toast(mensagem, tipo) {
    if (!area) return;
    var item = document.createElement('div');
    item.className = 'toast toast--' + (tipo === 'erro' ? 'erro' : 'sucesso');

    var texto = document.createElement('p');
    texto.className = 'toast__texto';
    texto.textContent = mensagem;

    var fechar = document.createElement('button');
    fechar.type = 'button';
    fechar.className = 'toast__fechar';
    fechar.setAttribute('aria-label', 'Fechar notificação');
    fechar.textContent = '×';

    item.appendChild(texto);
    item.appendChild(fechar);
    area.appendChild(item);

    var temporizador = setTimeout(remover, 6000);

    function remover() {
      clearTimeout(temporizador);
      if (semMovimento.matches) { item.remove(); return; }
      item.classList.add('toast--saindo');
      item.addEventListener('animationend', function () { item.remove(); }, { once: true });
    }

    fechar.addEventListener('click', remover);
  }

  document.addEventListener('click', function (evento) {
    var gatilhoToast = evento.target.closest('[data-toast]');
    if (gatilhoToast) toast(gatilhoToast.dataset.toast, gatilhoToast.dataset.toastTipo);

    var gatilhoModal = evento.target.closest('[data-modal-abrir]');
    if (gatilhoModal) abrirModal(document.getElementById(gatilhoModal.dataset.modalAbrir));
  });

  function abrirModal(modal) {
    if (!modal || typeof modal.showModal !== 'function') return false;
    modal.returnValue = '';
    modal.showModal();
    return true;
  }

  Array.prototype.forEach.call(document.querySelectorAll('dialog.modal'), function (modal) {
    modal.addEventListener('click', function (evento) {
      // Clique fora da caixa (no fundo escurecido) cancela
      var caixa = modal.getBoundingClientRect();
      var fora = evento.clientX < caixa.left || evento.clientX > caixa.right ||
                 evento.clientY < caixa.top || evento.clientY > caixa.bottom;
      if (evento.target === modal && fora) { modal.close('cancelar'); return; }

      var botao = evento.target.closest('[data-acao]');
      if (botao) modal.close(botao.dataset.acao);
    });

    modal.addEventListener('close', function () {
      if (modal.returnValue === 'confirmar' && modal.dataset.toastConfirmar) {
        toast(modal.dataset.toastConfirmar, 'sucesso');
      }
    });
  });

  window.SemearFeedback = { toast: toast, abrirModal: abrirModal };
})();
