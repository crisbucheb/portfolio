document.addEventListener('DOMContentLoaded', () => {
    // ===============================
    // MENU MOBILE
    // ===============================
    const botaoMenu = document.getElementById('navToggle');
    const linksNavegacao = document.querySelector('.links-navegacao');
  
    if (botaoMenu && linksNavegacao) {
      botaoMenu.addEventListener('click', () => {
        linksNavegacao.classList.toggle('ativa');
      });
  
      // Fecha o menu ao clicar em algum link
      const links = linksNavegacao.querySelectorAll('a');
      if (links.length > 0) {
        links.forEach((link) => {
          link.addEventListener('click', () => {
            linksNavegacao.classList.remove('ativa');
          });
        });
      }
    }
  
    // ===============================
    // ANIMAÇÃO "REVELAR" AO ROLAR
    // ===============================
    const elementosRevelar = document.querySelectorAll('.revelar');
  
    if (elementosRevelar.length > 0 && 'IntersectionObserver' in window) {
      const observador = new IntersectionObserver(
        (entradas) => {
          entradas.forEach((entrada) => {
            if (entrada.isIntersecting) {
              entrada.target.classList.add('visivel');
              observador.unobserve(entrada.target); // anima só uma vez
            }
          });
        },
        {
          threshold: 0.16,
        }
      );
  
      elementosRevelar.forEach((el) => observador.observe(el));
    } else if (elementosRevelar.length > 0) {
      // fallback se o navegador não suportar IntersectionObserver
      elementosRevelar.forEach((el) => el.classList.add('visivel'));
    }
  
    // ===============================
    // MODAL DE CERTIFICADO (IMAGEM)
    // ===============================
    const modalCertificado = document.getElementById('certModal');
    const modalFundo = document.getElementById('modalOverlay');
    const modalFechar = document.getElementById('modalClose');
    const modalImagem = document.getElementById('modalImg');
  
    const cartoesCertificado = document.querySelectorAll('.cartao-certificado');
  
    function abrirModal(srcImagem) {
      if (!modalCertificado || !modalImagem) return;
      modalImagem.src = srcImagem;
      modalCertificado.classList.add('ativo');
    }
  
    function fecharModal() {
      if (!modalCertificado) return;
      modalCertificado.classList.remove('ativo');
      if (modalImagem) {
        modalImagem.src = '';
      }
    }
  
    if (cartoesCertificado.length > 0) {
      cartoesCertificado.forEach((cartao) => {
        const botaoVer = cartao.querySelector('.certificado-botao-ver');
        if (!botaoVer) return;
  
        botaoVer.addEventListener('click', () => {
          const caminhoImg = cartao.getAttribute('data-cert-img');
          if (caminhoImg) {
            abrirModal(caminhoImg);
          }
        });
      });
    }
  
    if (modalFechar) {
      modalFechar.addEventListener('click', fecharModal);
    }
  
    if (modalFundo) {
      modalFundo.addEventListener('click', fecharModal);
    }
  
    document.addEventListener('keydown', (evento) => {
      if (evento.key === 'Escape') {
        fecharModal();
      }
    });
  
    // ===============================
// SCROLL HORIZONTAL DOS CERTIFICADOS (ARRASTE)
// Ajustado para mobile: NÃO bloqueia scroll vertical quando layout é coluna
// ===============================
let carrosselCertificados =
document.querySelector('.grade-certificados.horizontal-scroll') ||
document.querySelector('.grade-certificados');

if (carrosselCertificados) {
let isDown = false;
let startX = 0;
let scrollLeft = 0;

const startDrag = (clientX, target) => {
  // não inicia arraste se clicou em botão/ link (pra não quebrar o clique)
  if (target && target.closest && target.closest('button, a')) return;

  isDown = true;
  carrosselCertificados.classList.add('arrastando');

  const rect = carrosselCertificados.getBoundingClientRect();
  startX = clientX - rect.left;
  scrollLeft = carrosselCertificados.scrollLeft;
};

const moveDrag = (clientX) => {
  if (!isDown) return;
  const rect = carrosselCertificados.getBoundingClientRect();
  const x = clientX - rect.left;
  const walk = (x - startX) * 1.6; // fator de velocidade
  carrosselCertificados.scrollLeft = scrollLeft - walk;
};

const endDrag = () => {
  if (!isDown) return;
  isDown = false;
  carrosselCertificados.classList.remove('arrastando');
};

// Mouse
carrosselCertificados.addEventListener('mousedown', (e) => {
  if (e.button !== 0) return; // só botão esquerdo
  startDrag(e.pageX, e.target);

  // se não clicou em botão/link, previne seleção de texto
  if (!(e.target instanceof Element && e.target.closest('button, a'))) {
    e.preventDefault();
  }
});

carrosselCertificados.addEventListener('mouseleave', endDrag);
window.addEventListener('mouseup', endDrag);

carrosselCertificados.addEventListener('mousemove', (e) => {
  if (!isDown) return;
  e.preventDefault();
  moveDrag(e.pageX);
});

// Touch
carrosselCertificados.addEventListener('touchstart', (e) => {
  const touch = e.touches[0];
  if (!touch) return;
  startDrag(touch.pageX, e.target);
});

carrosselCertificados.addEventListener('touchend', endDrag);
carrosselCertificados.addEventListener('touchcancel', endDrag);

carrosselCertificados.addEventListener(
  'touchmove',
  (e) => {
    if (!isDown) return;
    const touch = e.touches[0];
    if (!touch) return;
    moveDrag(touch.pageX);

    // Só bloqueia scroll vertical se layout horizontal!
    const isColumn = window.getComputedStyle(carrosselCertificados).flexDirection === 'column';
    if (!isColumn) {
      e.preventDefault();
    }
    // Em mobile (coluna), NÃO bloqueia o scroll vertical!
  },
  { passive: false }
);
}
  
    // ===============================
    // TOAST BONITO (FEEDBACK VISUAL)
    // ===============================
    function mostrarToast(mensagem) {
      let overlay = document.querySelector('.toast-copy-overlay');
  
      // cria o elemento só na primeira vez
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'toast-copy-overlay';
        overlay.innerHTML = `
          <div class="toast-copy-card">
            <i class="fa-solid fa-circle-check"></i>
            <span class="toast-copy-texto"></span>
          </div>
        `;
        document.body.appendChild(overlay);
      }
  
      const textoEl = overlay.querySelector('.toast-copy-texto');
      if (textoEl) {
        textoEl.textContent = mensagem;
      }
  
      overlay.classList.add('ativo');
  
      // some depois de 2 segundos
      setTimeout(() => {
        overlay.classList.remove('ativo');
      }, 2000);
    }
  
    // ===============================
    // MENU "FALAR COMIGO"
    // ===============================
    const btnContato = document.getElementById('btnFalarComigo');
    const menuContato = document.getElementById('menuContato');
    const copiarEmail = document.getElementById('copiarEmail');
    const abrirWhats = document.getElementById('abrirWhats');
  
    if (btnContato && menuContato) {
      // abrir/fechar menu
      btnContato.addEventListener('click', (e) => {
        e.preventDefault();
        const aberto = menuContato.style.display === 'block';
        menuContato.style.display = aberto ? 'none' : 'block';
      });
  
      // copiar email (com toast)
      if (copiarEmail) {
        copiarEmail.addEventListener('click', () => {
          navigator.clipboard
            .writeText('cbucheb@sp.gov.br')
            .then(() => {
              menuContato.style.display = 'none';
              mostrarToast('E-mail copiado com sucesso!');
            })
            .catch(() => {
              menuContato.style.display = 'none';
              mostrarToast('Não foi possível copiar. Tente novamente.');
            });
        });
      }
  
      // redirecionar para o WhatsApp
      if (abrirWhats) {
        abrirWhats.addEventListener('click', () => {
          window.open('https://wa.me/5511931524488', '_blank');
          menuContato.style.display = 'none';
        });
      }
  
      // fechar ao clicar fora
      document.addEventListener('click', (ev) => {
        if (
          !btnContato.contains(ev.target) &&
          !menuContato.contains(ev.target)
        ) {
          menuContato.style.display = 'none';
        }
      });
    }
  });
  // Faz a tela subir ao clicar no logo ou no texto "Administração & Gestão Estratégica"
document.addEventListener('DOMContentLoaded', () => {
    const logo = document.querySelector('.marca-logo-img');
    const marcaTexto = document.querySelector('.marca span');
  
    function scrollToTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  
    if (logo) {
      logo.style.cursor = 'pointer';
      logo.addEventListener('click', scrollToTop);
    }
  
    if (marcaTexto) {
      marcaTexto.style.cursor = 'pointer';
      marcaTexto.addEventListener('click', scrollToTop);
    }
  });

  
