/* =========================================================================
   Instituto Semear - Menu responsivo (hambúrguer)
   Aprimoramento progressivo: sem JavaScript o menu aparece aberto e usável.
   Com JavaScript, a classe .menu--pronto ativa o modo recolhido no celular.
   ========================================================================= */
(function () {
  var menu = document.querySelector('.menu');
  if (!menu) return;

  var botao = menu.querySelector('.menu__botao');
  var lista = menu.querySelector('.menu__lista');
  var desktop = window.matchMedia('(min-width: 768px)');

  menu.classList.add('menu--pronto');

  function definirAberto(aberto) {
    botao.setAttribute('aria-expanded', String(aberto));
  }

  botao.addEventListener('click', function () {
    definirAberto(botao.getAttribute('aria-expanded') !== 'true');
  });

  // Esc fecha o menu e devolve o foco ao botão
  document.addEventListener('keydown', function (evento) {
    if (evento.key === 'Escape' && botao.getAttribute('aria-expanded') === 'true') {
      definirAberto(false);
      botao.focus();
    }
  });

  // Escolher um link fecha o menu (importante nas âncoras da mesma página)
  lista.addEventListener('click', function (evento) {
    if (evento.target.closest('a')) definirAberto(false);
  });

  // Ao passar para o layout de desktop, o estado do celular é descartado
  desktop.addEventListener('change', function (evento) {
    if (evento.matches) definirAberto(false);
  });
})();
