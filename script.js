// Mobile Navigation
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('nav-hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navbar = document.querySelector('.navbar');

    // Toggle mobile menu
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
            });
        });
    }

    // Navbar scroll effect
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

// Smooth scroll com offset dinâmico (nada fica escondido)
(function(){
  function stickyOffset(){
    const nav  = document.querySelector('.navbar');
    const prog = document.querySelector('.program-nav');
    const navH  = nav  ? nav.offsetHeight  : 0;
    // só somamos a altura do program-nav se estiver visível e "sticky"
    const progStyles = prog ? getComputedStyle(prog) : null;
    const progH = (prog && (progStyles.position === 'sticky' || progStyles.position === 'fixed'))
      ? prog.offsetHeight : 0;
    return navH + progH + 8;
  }

  function scrollToTarget(el){
    const y = el.getBoundingClientRect().top + window.pageYOffset - stickyOffset();
    window.scrollTo({ top: y, behavior: 'smooth' });
  }

  // Links do menu do programa
  document.querySelectorAll('.program-link[href^="#"]').forEach(a=>{
    a.addEventListener('click', (e)=>{
      const t = document.querySelector(a.getAttribute('href'));
      if (!t) return;
      e.preventDefault();
      scrollToTarget(t);
    });
  });

  // Se tiveres outros anchors na página:
  document.querySelectorAll('a[href^="#"]:not(.program-link)').forEach(a=>{
    a.addEventListener('click', (e)=>{
      const t = document.querySelector(a.getAttribute('href'));
      if (!t) return;
      e.preventDefault();
      scrollToTarget(t);
    });
  });

  // Recalcula em resize / rotação
  window.addEventListener('resize', ()=> {
    // opcional: poderias atualizar scroll-margin-top aqui se precisares
  });
})();


// Program navigation — sem "lutar" com o gesto do utilizador
(function(){
  const menu     = document.querySelector('.program-menu');
  const links    = document.querySelectorAll('.program-link[href^="#"]');
  const sections = Array.from(document.querySelectorAll('.program-section'));
  if (!menu || !links.length || !sections.length) return;

  const nav  = document.querySelector('.navbar');
  const prog = document.querySelector('.program-nav');

  const navH  = () => (nav  ? nav.offsetHeight  : 0);
  const progH = () => (prog ? prog.offsetHeight : 0);

  function progStuck(){
    if (!prog) return false;
    return prog.getBoundingClientRect().top <= navH() + 1;
  }
  function stickyOffset(){
    return navH() + (progStuck() ? progH() : 0) + 8;
  }

  function getCurrentId(){
    const y = Math.ceil(window.scrollY + stickyOffset());
    let id = sections[0].id;
    for (const sec of sections){
      if (sec.offsetTop <= y) id = sec.id; else break;
    }
    return id;
  }

  function setActive(id){
    links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + id));
  }

  // Só recentra quando for preciso (ou em clique)
  function ensureVisible(id, force=false){
    const a = document.querySelector(`.program-link[href="#${id}"]`);
    if (!a) return;
    const sc = menu.getBoundingClientRect();
    const r  = a.getBoundingClientRect();
    const fullyVisible = r.left >= sc.left + 8 && r.right <= sc.right - 8;
    if (force || !fullyVisible){
      a.scrollIntoView({ behavior:'smooth', block:'nearest', inline:'center' });
    }
  }

  // Não recentrar enquanto o utilizador arrasta a barra
  let userDragging = false;
  ['pointerdown','touchstart','mousedown'].forEach(ev =>
    menu.addEventListener(ev, () => userDragging = true, {passive:true})
  );
  ['pointerup','pointercancel','touchend','mouseup','mouseleave'].forEach(ev =>
    menu.addEventListener(ev, () => userDragging = false, {passive:true})
  );

  // Clique nos chips com offset correto
  links.forEach(a=>{
    a.addEventListener('click', (e)=>{
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const y = target.getBoundingClientRect().top + window.pageYOffset - stickyOffset();
      window.scrollTo({ top: y, behavior:'smooth' });
      setActive(target.id);
      ensureVisible(target.id, true); // só em clique
    });
  });

  // Atualiza em scroll/resize sem “saltar” a barra se o utilizador a estiver a mexer
  let ticking = false;
  function onScroll(){
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(()=>{
      const id = getCurrentId();
      setActive(id);
      if (!userDragging) ensureVisible(id, false);
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  window.addEventListener('resize', onScroll);

  // Estado inicial
  window.addEventListener('load', ()=>{
    menu.scrollLeft = 0; // garante que “Educação” começa visível
    const initId = location.hash ? location.hash.slice(1) : getCurrentId();
    setActive(initId);
    if (initId !== sections[0].id) ensureVisible(initId, true);
  });
})();




    // News and Gallery filtering
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Filter items (news or gallery)
            const items = document.querySelectorAll('[data-category]');
            
            items.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 100);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // Gallery Modal
    const galleryItems = document.querySelectorAll('.gallery-item:not(.video-item)');
    const modal = document.getElementById('gallery-modal');
    const modalImage = document.getElementById('modal-image');
    const modalTitle = document.getElementById('modal-title');
    const modalDate = document.getElementById('modal-date');
    const modalClose = document.getElementById('modal-close');
    const modalOverlay = document.getElementById('modal-overlay');
    const modalPrev = document.getElementById('modal-prev');
    const modalNext = document.getElementById('modal-next');

    let currentImageIndex = 0;

    if (galleryItems.length > 0 && modal) {
        galleryItems.forEach((item, index) => {
            item.addEventListener('click', function() {
                currentImageIndex = index;
                openModal();
            });
        });

        function openModal() {
            const currentItem = galleryItems[currentImageIndex];
            const img = currentItem.querySelector('img');
            const overlay = currentItem.querySelector('.gallery-overlay');
            
            modalImage.src = img.src;
            modalTitle.textContent = overlay.querySelector('h3').textContent;
            modalDate.textContent = overlay.querySelector('p').textContent;
            
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }

        function closeModal() {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }

        function nextImage() {
            currentImageIndex = (currentImageIndex + 1) % galleryItems.length;
            openModal();
        }

        function prevImage() {
            currentImageIndex = (currentImageIndex - 1 + galleryItems.length) % galleryItems.length;
            openModal();
        }

        modalClose.addEventListener('click', closeModal);
        modalOverlay.addEventListener('click', closeModal);
        modalNext.addEventListener('click', nextImage);
        modalPrev.addEventListener('click', prevImage);

        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (modal.style.display === 'block') {
                switch(e.key) {
                    case 'Escape':
                        closeModal();
                        break;
                    case 'ArrowRight':
                        nextImage();
                        break;
                    case 'ArrowLeft':
                        prevImage();
                        break;
                }
            }
        });
    }

    

    // Newsletter Form
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = this.querySelector('input[type="email"]');
            const button = this.querySelector('button');
            
            if (email.value.trim() && validateEmail(email.value)) {
                // Simulate subscription
                const originalText = button.textContent;
                button.textContent = 'Subscrito!';
                button.style.background = '#28a745';
                
                setTimeout(() => {
                    button.textContent = originalText;
                    button.style.background = '';
                    email.value = '';
                }, 3000);
            }
        });

        function validateEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }
    }

    // Video Player Simulation
    window.playVideo = function() {
        const videoContainer = document.querySelector('.hero-video-container');
        if (videoContainer) {
            // Simulate video play by showing an alert
            // In a real scenario, you would embed an actual video player
            alert('Vídeo de apresentação seria reproduzido aqui. Em produção, seria integrado um player de vídeo real.');
        }
    };

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.feature-card, .news-card, .proposal-card, .value-card, .volunteer-card, .timeline-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Counter animation for bio highlights
    const numbers = document.querySelectorAll('.number');
    const numberObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateNumber(entry.target);
                numberObserver.unobserve(entry.target);
            }
        });
    });

    numbers.forEach(number => {
        numberObserver.observe(number);
    });

    function animateNumber(element) {
        const targetText = element.textContent;
        const targetNumber = parseInt(targetText.replace(/\D/g, ''));
        const suffix = targetText.replace(/[\d\s]/g, '');
        
        if (isNaN(targetNumber)) return;
        
        let current = 0;
        const increment = targetNumber / 30;
        const duration = 2000;
        const stepTime = duration / 30;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= targetNumber) {
                element.textContent = targetNumber + suffix;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current) + suffix;
            }
        }, stepTime);
    }

    // Add loading states and error handling
    function showLoading(element) {
        element.style.opacity = '0.6';
        element.style.pointerEvents = 'none';
    }

    function hideLoading(element) {
        element.style.opacity = '1';
        element.style.pointerEvents = 'auto';
    }

    // Performance optimization: Lazy load images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => {
        imageObserver.observe(img);
    });

    // Add accessibility improvements
    function improveAccessibility() {

        
        skipLink.addEventListener('focus', function() {
            this.style.top = '0';
        });
        
        skipLink.addEventListener('blur', function() {
            this.style.top = '-40px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);

        // Add main content landmark
        const hero = document.querySelector('.hero, .page-hero');
        if (hero && hero.nextElementSibling) {
            hero.nextElementSibling.id = 'main-content';
        }

        // Improve form labels
        const inputs = document.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            if (!input.getAttribute('aria-label') && !input.labels.length) {
                const label = document.querySelector(`label[for="${input.id}"]`);
                if (label) {
                    input.setAttribute('aria-labelledby', label.id || input.id + '-label');
                }
            }
        });
    }

    // Initialize accessibility improvements
    improveAccessibility();

    // Add search functionality (if needed)
    function addSearch() {
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                const query = this.value.toLowerCase();
                const searchableElements = document.querySelectorAll('[data-searchable]');
                
                searchableElements.forEach(element => {
                    const text = element.textContent.toLowerCase();
                    if (text.includes(query) || query === '') {
                        element.style.display = '';
                    } else {
                        element.style.display = 'none';
                    }
                });
            });
        }
    }

    addSearch();
});

// IDs do teu EmailJS
const EMAILJS_SERVICE_ID  = 'service_6lmch8y';
const EMAILJS_TEMPLATE_ID = 'template_vq2xeab';

// define o destinatário final do e-mail (se o teu template usa "to_email")
const TO_EMAIL = 'apoio@porfamalicao.pt';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const successBox = document.getElementById('form-success');
  const btn = form.querySelector('button[type="submit"]');

  const setError = (id, msg) => {
    const el = document.getElementById(id);
    if (el) el.textContent = msg || '';
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    setError('nome-error'); 
    setError('email-error'); 
    setError('mensagem-error');

    const nome       = form.nome.value.trim();
    const email      = form.email.value.trim();
    const telefone   = form.telefone.value.trim();
    const assuntoRaw = form.assunto.value.trim();
    const mensagem   = form.mensagem.value.trim();
    const newsletter = form.newsletter.checked ? 'Sim' : 'Não';

    let hasError = false;
    if (!nome)  { setError('nome-error', 'Indique o seu nome.'); hasError = true; }
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) { setError('email-error', 'Email inválido.'); hasError = true; }
    if (!mensagem || mensagem.length < 5) { setError('mensagem-error', 'A mensagem deve ter pelo menos 5 caracteres.'); hasError = true; }
    if (hasError) return;

    const oldText = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'A enviar...';

    const assuntoMap = {
      ideias: 'Ideias para a Freguesia',
      sugestao: 'Sugestões de Melhoria',
      críticas: 'Críticas ou Reclamações',
      questões: 'Questões sobre a Candidatura',
      voluntariado: 'Voluntariado / Quero Ajudar',
      outro: 'Outros Assuntos'
    };
    const assunto = assuntoMap[assuntoRaw] || 'Contacto do site';

    // ⚠️ Estes campos têm de existir no Template (ver passo 2)
    const templateParams = {
      // dados
      nome,
      email,
      telefone,
      assunto,
      mensagem,
      newsletter,
      origem: window.location.href,
      data_envio: new Date().toLocaleString(),

      // routing no EmailJS (se o template usa estas variáveis)
      to_email: TO_EMAIL,     // <- destinatário final
      reply_to: email         // <- para poderes "Responder" ao utilizador
    };

    try {
      const res = await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
      console.log('EmailJS OK:', res);
      form.reset();
      if (successBox) successBox.style.display = 'block';
      form.style.display = 'none';
    } catch (err) {
      console.error('EmailJS error (obj):', err);
      // mostra o detalhe do erro para sabermos a causa exacta
      const msg = (err && (err.text || err.message)) ? (err.text || err.message) : 'Falha desconhecida';
      alert('Não foi possível enviar a mensagem: ' + msg);
    } finally {
      btn.disabled = false;
      btn.textContent = oldText;
    }
  });
});

// ACORDEÃO
(function () {
  document.querySelectorAll('.accordion').forEach(acc => {
    const single = acc.dataset.accordion !== 'multiple';

    acc.querySelectorAll('.accordion-item').forEach(item => {
      const btn = item.querySelector('.accordion-trigger');
      const content = item.querySelector('.accordion-content');

      if (!btn || !content) return;

      const setOpen = (open) => {
        item.classList.toggle('open', open);
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        content.style.maxHeight = open ? (content.scrollHeight + 'px') : '0px';
      };

      // inicia fechado
      setOpen(false);

      btn.addEventListener('click', () => {
        const willOpen = !item.classList.contains('open');

        if (single) {
          acc.querySelectorAll('.accordion-item.open').forEach(openItem => {
            const openBtn = openItem.querySelector('.accordion-trigger');
            const openContent = openItem.querySelector('.accordion-content');
            openItem.classList.remove('open');
            if (openBtn) openBtn.setAttribute('aria-expanded', 'false');
            if (openContent) openContent.style.maxHeight = '0px';
          });
        }

        setOpen(willOpen);
      });

      // reajuste de altura ao redimensionar
      window.addEventListener('resize', () => {
        if (item.classList.contains('open')) {
          content.style.maxHeight = content.scrollHeight + 'px';
        }
      });
    });
  });
})();


/* ===== Reels: play/pause ===== */
document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('#reels .reel-card');

  const pauseOthers = (current) => {
    cards.forEach(card => {
      const v = card.querySelector('.reel-media');
      const c = card.querySelector('.reel-ctrl');
      if (v !== current && !v.paused) {
        v.pause();
        c.classList.remove('hidden');
        c.setAttribute('aria-label', 'Reproduzir vídeo');
        c.innerHTML = '<svg viewBox="0 0 24 24" width="44" height="44"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>';
      }
    });
  };

  cards.forEach(card => {
    const video = card.querySelector('.reel-media');
    const ctrl  = card.querySelector('.reel-ctrl');

    video.autoplay = false;
    video.muted = false;  // mete true se quiseres iniciar sem som
    video.loop = true;
    video.pause();

    const setToPlayIcon = () => {
      ctrl.classList.remove('hidden');
      ctrl.setAttribute('aria-label', 'Reproduzir vídeo');
      ctrl.innerHTML = '<svg viewBox="0 0 24 24" width="44" height="44"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>';
    };
    const setToPauseIcon = () => {
      ctrl.classList.add('hidden');
      ctrl.setAttribute('aria-label', 'Pausar vídeo');
      ctrl.innerHTML = '<svg viewBox="0 0 24 24" width="36" height="36"><path d="M6 5h4v14H6zM14 5h4v14h-4z" fill="currentColor"/></svg>';
    };

    const toggle = () => {
      if (video.paused) {
        video.play().then(() => { pauseOthers(video); setToPauseIcon(); })
                    .catch(() => { setToPlayIcon(); });
      } else {
        video.pause();
      }
    };

    ctrl.addEventListener('click', (e) => { e.stopPropagation(); toggle(); });
    video.addEventListener('click', toggle);

    video.addEventListener('play',  setToPauseIcon);
    video.addEventListener('pause', setToPlayIcon);
    video.addEventListener('ended', setToPlayIcon);

    ctrl.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggle(); }
    });
  });
});
