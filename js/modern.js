/**
 * DeccanIDentity Enterprise Client-Side Scripts
 * Lightweight, zero-dependency, ultra-fast JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Dynamic Copyright Year (Client-Side Static Fetch)
  const currentYear = new Date().getFullYear();
  document.querySelectorAll('.current-year, #currentYear').forEach((el) => {
    el.textContent = currentYear;
  });

  // 2. Enterprise Flagship Mobile Drawer & Navigation
  const mobileToggle = document.getElementById('mobileNavToggle');
  const navLinks = document.getElementById('navLinks');
  const navBackdrop = document.getElementById('navBackdrop');

  if (mobileToggle && navLinks) {
    const closeDrawer = () => {
      navLinks.classList.remove('active');
      mobileToggle.classList.remove('is-active');
      mobileToggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('nav-drawer-open');
      if (navBackdrop) {
        navBackdrop.classList.remove('active');
      }
      // Reset mobile accordions
      navLinks.querySelectorAll('.has-dropdown.mobile-open').forEach((item) => {
        item.classList.remove('mobile-open');
        const trigger = item.querySelector('.dropdown-trigger');
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
      });
    };

    const openDrawer = () => {
      navLinks.classList.add('active');
      mobileToggle.classList.add('is-active');
      mobileToggle.setAttribute('aria-expanded', 'true');
      document.body.classList.add('nav-drawer-open');
      if (navBackdrop) {
        navBackdrop.classList.add('active');
      }
    };

    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navLinks.classList.contains('active');
      if (isOpen) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });

    // Close on backdrop tap
    if (navBackdrop) {
      navBackdrop.addEventListener('click', () => {
        closeDrawer();
      });
    }

    // Mobile Accordion toggle for dropdown triggers & chevrons
    navLinks.querySelectorAll('.has-dropdown').forEach((item) => {
      const trigger = item.querySelector('.dropdown-trigger');
      const chevron = item.querySelector('.nav-chevron');

      const handleAccordionToggle = (e) => {
        if (window.innerWidth <= 1040) {
          e.preventDefault();
          e.stopPropagation();
          const wasOpen = item.classList.contains('mobile-open');
          // Close other sibling dropdowns for clean accordion effect
          navLinks.querySelectorAll('.has-dropdown.mobile-open').forEach((sibling) => {
            if (sibling !== item) {
              sibling.classList.remove('mobile-open');
              const sibTrigger = sibling.querySelector('.dropdown-trigger');
              if (sibTrigger) sibTrigger.setAttribute('aria-expanded', 'false');
            }
          });
          item.classList.toggle('mobile-open');
          if (trigger) {
            trigger.setAttribute('aria-expanded', !wasOpen ? 'true' : 'false');
          }
        }
      };

      if (trigger) {
        trigger.addEventListener('click', handleAccordionToggle);
      }
      if (chevron) {
        chevron.addEventListener('click', handleAccordionToggle);
      }
    });

    // Auto-close mobile drawer when clicking destination links (only on mobile)
    navLinks.querySelectorAll('a:not(.dropdown-trigger), .mega-item, .featured-link-pill, .tech-cta-link, .mobile-drawer-btns a, .mobile-contact-pill').forEach((link) => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 1040) {
          closeDrawer();
        }
      });
    });

    // Prevent reload flicker when clicking the link of the currently active page
    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) {
          return;
        }

        const rawCurrent = window.location.pathname.split('/').pop() || 'index.html';
        const currentPath = rawCurrent.toLowerCase();
        const rawTarget = href.split('#')[0].split('?')[0];
        const targetPath = (rawTarget || 'index.html').toLowerCase();

        // Check if target is current page
        const isCurrentPage = currentPath === targetPath ||
          ((currentPath === '' || currentPath === 'index.html') && (targetPath === '' || targetPath === 'index.html'));

        if (isCurrentPage) {
          // If on mobile and it's a dropdown trigger, accordion handler handles it
          if (window.innerWidth <= 1040 && link.classList.contains('dropdown-trigger')) {
            return;
          }
          e.preventDefault();
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
          if (window.innerWidth <= 1040) {
            closeDrawer();
          }
        }
      });
    });

    // Prefetch internal pages on link hover to eliminate network wait & white screen flash
    const prefetchedLinks = new Set();
    const prefetchUrl = (url) => {
      if (!url || prefetchedLinks.has(url)) return;
      if (url.startsWith('#') || url.startsWith('http') || url.startsWith('mailto:') || url.startsWith('tel:')) return;
      prefetchedLinks.add(url);
      const linkTag = document.createElement('link');
      linkTag.rel = 'prefetch';
      linkTag.href = url;
      document.head.appendChild(linkTag);
    };

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('mouseenter', () => {
        const href = link.getAttribute('href');
        if (href) {
          prefetchUrl(href);
        }
      }, { passive: true });
    });

    // Close mobile nav when clicking outside
    document.addEventListener('click', (e) => {
      if (navLinks.classList.contains('active') && !navLinks.contains(e.target) && !mobileToggle.contains(e.target)) {
        closeDrawer();
      }
    });

    // Close drawer on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinks.classList.contains('active')) {
        closeDrawer();
      }
    });

    // Reset on window resize to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 1040 && navLinks.classList.contains('active')) {
        closeDrawer();
      }
    }, { passive: true });
  }

  // 3. Header Scrolled State, Reading Progress Bar & Back To Top Visibility
  const header = document.querySelector('.site-header');
  const backToTop = document.getElementById('backToTop');
  const scrollProgress = document.getElementById('scrollProgress');

  const onScrollHandler = () => {
    const scrollY = window.scrollY;

    // Header Elevation
    if (header) {
      if (scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // Back to Top Button
    if (backToTop) {
      if (scrollY > 350) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }

    // Flagship Reading Scroll Progress Line
    if (scrollProgress) {
      const docElem = document.documentElement;
      const docHeight = docElem.scrollHeight - docElem.clientHeight;
      if (docHeight > 0) {
        const scrolledPct = (scrollY / docHeight) * 100;
        scrollProgress.style.width = Math.min(100, Math.max(0, scrolledPct)) + '%';
      }
    }
  };

  window.addEventListener('scroll', onScrollHandler, { passive: true });
  onScrollHandler();

  // 4. Smooth Back To Top Click
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // 5. Initialize Global Draggable Animated AI Robot Assistant
  initGlobalRobotAssistant();

  // 6. Initialize Independent Draggable WhatsApp
  initDraggableWhatsApp();

  // 7. Initialize Hero Slideshow Carousel
  initHeroSlider();
});

/**
 * Global Draggable Animated AI Robot Assistant
 * - Appears on all pages automatically
 * - Automatic waving greeting animation starts on load
 * - Fully draggable via mouse & touch, clamped inside viewport
 * - Strict refresh reset: always starts at default bottom-right on reload
 * - Discrimination between drag (> 6px) and click (<= 6px)
 * - Interactive AI Assistant modal with suggestions, chat history & responses
 */
function initGlobalRobotAssistant() {
  if (document.getElementById('globalRobotFab')) return;

  // 1. Inject Robot FAB Button
  const robotFab = document.createElement('button');
  robotFab.type = 'button';
  robotFab.className = 'ask-ai-fab';
  robotFab.id = 'globalRobotFab';
  robotFab.setAttribute('aria-label', 'Open DeccanIDentity AI Assistant');
  robotFab.title = 'Ask AI Robot Assistant (Drag anywhere or click to chat)';
  robotFab.setAttribute('aria-expanded', 'false');

  robotFab.innerHTML = `
    <span class="ask-ai-fab__pulse" aria-hidden="true"></span>
    <div class="ask-ai-robo-character" style="width: 40px; height: 40px;">
      <svg class="ask-ai-robo-svg" viewBox="0 0 100 92" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <filter id="robo-glow-filter" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <linearGradient id="robo-head-metallic" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#ffffff" />
            <stop offset="55%" stop-color="#e2e8f0" />
            <stop offset="100%" stop-color="#94a3b8" />
          </linearGradient>
          <linearGradient id="robo-screen-glass" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#0b1329" />
            <stop offset="100%" stop-color="#030712" />
          </linearGradient>
          <linearGradient id="robo-hand-metallic" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#ffffff" />
            <stop offset="100%" stop-color="#cbd5e1" />
          </linearGradient>
        </defs>

        <!-- Antenna with Signal Waves -->
        <g class="ask-ai-robo-antenna">
          <line x1="42" y1="23" x2="42" y2="12" stroke="#94a3b8" stroke-width="3" stroke-linecap="round" />
          <circle cx="42" cy="10" r="5" fill="#38bdf8" filter="url(#robo-glow-filter)" class="ask-ai-antenna-orb" />
          <circle cx="42" cy="10" r="9" stroke="#38bdf8" stroke-width="1.5" class="ask-ai-antenna-wave" />
        </g>

        <!-- Ears / Audio Pods -->
        <rect x="9" y="39" width="7" height="17" rx="3.5" fill="#64748b" />
        <circle cx="12.5" cy="47.5" r="2.2" fill="#38bdf8" />
        <rect x="68" y="39" width="7" height="17" rx="3.5" fill="#64748b" />
        <circle cx="71.5" cy="47.5" r="2.2" fill="#38bdf8" />

        <!-- Robot Head Outer Shell -->
        <rect x="14" y="23" width="56" height="49" rx="18" fill="url(#robo-head-metallic)" stroke="#cbd5e1" stroke-width="1.5" />
        <path d="M 23 27 Q 42 24 61 27" stroke="rgba(255,255,255,0.85)" stroke-width="2.5" stroke-linecap="round" fill="none" />

        <!-- Dark Visor Screen -->
        <rect x="21" y="31" width="42" height="33" rx="11" fill="url(#robo-screen-glass)" stroke="#1e293b" stroke-width="1" />
        <path d="M 24 34 L 35 34 L 29 60 L 24 60 Z" fill="rgba(255,255,255,0.08)" />

        <!-- Normal Glowing Eyes -->
        <g class="ask-ai-eyes-normal">
          <circle cx="33" cy="45" r="4.3" fill="#38bdf8" filter="url(#robo-glow-filter)" />
          <circle cx="34.5" cy="43.5" r="1.5" fill="#ffffff" />
          <circle cx="51" cy="45" r="4.3" fill="#38bdf8" filter="url(#robo-glow-filter)" />
          <circle cx="52.5" cy="43.5" r="1.5" fill="#ffffff" />
        </g>

        <!-- Happy Squint Eyes -->
        <g class="ask-ai-eyes-happy">
          <path d="M 29 47 Q 33 41 37 47" stroke="#38bdf8" stroke-width="2.8" stroke-linecap="round" fill="none" filter="url(#robo-glow-filter)" />
          <path d="M 47 47 Q 51 41 55 47" stroke="#38bdf8" stroke-width="2.8" stroke-linecap="round" fill="none" filter="url(#robo-glow-filter)" />
        </g>

        <!-- Digital Smile -->
        <path d="M 38 54 Q 42 58 46 54" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" fill="none" filter="url(#robo-glow-filter)" />

        <!-- Blush Cheeks -->
        <ellipse cx="28" cy="52" rx="3" ry="2" fill="rgba(244, 114, 182, 0.65)" class="ask-ai-cheeks" />
        <ellipse cx="56" cy="52" rx="3" ry="2" fill="rgba(244, 114, 182, 0.65)" class="ask-ai-cheeks" />

        <!-- Articulated Waving Hand Assembly: Default Handshake / Greeting Motion -->
        <g class="ask-ai-robo-hand-assembly">
          <path d="M 68 56 Q 77 53 80 43" stroke="#94a3b8" stroke-width="4.5" stroke-linecap="round" fill="none" />
          <ellipse cx="81" cy="38" rx="6.5" ry="7.5" fill="url(#robo-hand-metallic)" stroke="#cbd5e1" stroke-width="1.2" />
          <circle cx="81" cy="38" r="2.2" fill="#38bdf8" filter="url(#robo-glow-filter)" />
          <path d="M 76 39 C 73 37 74 34 77 33" stroke="#94a3b8" stroke-width="2.5" stroke-linecap="round" fill="none" />
          <path d="M 79 32 C 79 27 82 26 83 29" stroke="#94a3b8" stroke-width="2.5" stroke-linecap="round" fill="none" />
          <path d="M 83 31 C 84 26 87 26 87 29" stroke="#94a3b8" stroke-width="2.5" stroke-linecap="round" fill="none" />
          <path d="M 87 33 C 89 29 91 30 90 34" stroke="#94a3b8" stroke-width="2.5" stroke-linecap="round" fill="none" />
        </g>
      </svg>
    </div>
    <span class="ask-ai-fab__signal-dot" aria-hidden="true"></span>
    <span class="ask-ai-fab__tooltip">
      <span class="ask-ai-fab__tooltip-dot"></span>
      <span class="ask-ai-fab__tooltip-text">Ask AI</span>
    </span>
  `;

  document.body.appendChild(robotFab);

  // 2. Inject Assistant Modal Overlay
  const modalOverlay = document.createElement('div');
  modalOverlay.className = 'ask-ai-modal-overlay';
  modalOverlay.id = 'globalRobotModal';
  modalOverlay.setAttribute('aria-hidden', 'true');

  modalOverlay.innerHTML = `
    <div class="ask-ai-window" role="dialog" aria-modal="true" aria-label="DeccanIDentity AI Assistant">
      <div class="ask-ai-header">
        <div class="ask-ai-drag-handle" aria-hidden="true"></div>
        <div class="ask-ai-header__top-row">
          <div class="ask-ai-header__brand">
            <div class="ask-ai-header__avatar">
              <svg width="24" height="24" viewBox="0 0 100 92" fill="none">
                <rect x="14" y="23" width="56" height="49" rx="18" fill="#e2e8f0" />
                <rect x="21" y="31" width="42" height="33" rx="11" fill="#0b1329" />
                <circle cx="33" cy="45" r="4" fill="#38bdf8" />
                <circle cx="51" cy="45" r="4" fill="#38bdf8" />
                <path d="M 38 54 Q 42 58 46 54" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" />
              </svg>
            </div>
            <div class="ask-ai-header__info">
              <div class="ask-ai-header__title">
                DeccanIDentity AI
                <span class="ask-ai-header__badge">● Online</span>
              </div>
              <div class="ask-ai-header__sub">Enterprise Engineering & Solution Guide</div>
            </div>
          </div>
          <button type="button" class="ask-ai-header__close" id="globalRobotClose" aria-label="Close Assistant">✕</button>
        </div>
      </div>

      <div class="ask-ai-body" id="robotChatBody">
        <div class="ask-ai-msg assistant">
          <div class="ask-ai-msg__avatar">
            <svg width="18" height="18" viewBox="0 0 100 92" fill="none">
              <rect x="14" y="23" width="56" height="49" rx="18" fill="#e2e8f0" />
              <rect x="21" y="31" width="42" height="33" rx="11" fill="#0b1329" />
              <circle cx="33" cy="45" r="4" fill="#38bdf8" />
              <circle cx="51" cy="45" r="4" fill="#38bdf8" />
            </svg>
          </div>
          <div class="ask-ai-msg__bubble">
            <p>Hello! 👋 I'm your <strong>DeccanIDentity AI Assistant</strong>. Ask me anything about our Zero-Trust IAM solutions, live websites, mobile apps, or enterprise engineering services!</p>
            <div class="ask-ai-msg__links">
              <a href="https://demo.deccanidentity.in/" target="_blank" class="ask-ai-msg__link-btn"><span>🚀 Websites Showcase</span> <span>↗</span></a>
              <a href="https://apps.deccanidentity.in/" target="_blank" class="ask-ai-msg__link-btn"><span>📱 Apps Showcase</span> <span>↗</span></a>
              <a href="solutions.htm" class="ask-ai-msg__link-btn"><span>🛡️ Solutions Hub</span> <span>→</span></a>
            </div>
          </div>
        </div>
      </div>

      <div class="ask-ai-suggestions" id="robotSuggestions">
        <button type="button" class="ask-ai-chip">Tell me about Websites</button>
        <button type="button" class="ask-ai-chip">What Apps do you have?</button>
        <button type="button" class="ask-ai-chip">Zero-Trust IAM & Okta</button>
        <button type="button" class="ask-ai-chip">Pricing & Quotes</button>
        <button type="button" class="ask-ai-chip">Chat on WhatsApp</button>
      </div>

      <form class="ask-ai-footer" id="robotChatForm">
        <input type="text" class="ask-ai-input" id="robotChatInput" placeholder="Ask about websites, apps, IAM, pricing..." aria-label="Your question for AI" />
        <button type="submit" class="ask-ai-send-btn" id="robotSendBtn" aria-label="Send message">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </form>
    </div>
  `;

  document.body.appendChild(modalOverlay);

  // 3. Draggable Logic with Strict Refresh Reset
  let isDragging = false;
  let hasMoved = false;
  let startX = 0, startY = 0;
  let elemX = 0, elemY = 0;
  let currentPointerId = null;
  let robotPosition = null; // Stored in-memory only. Resets to bottom-right on reload.

  // Window resize bounds clamping
  window.addEventListener('resize', () => {
    if (robotPosition) {
      const rect = robotFab.getBoundingClientRect();
      const padding = 12;
      const maxX = Math.max(padding, window.innerWidth - rect.width - padding);
      const maxY = Math.max(padding, window.innerHeight - rect.height - padding);
      robotPosition.x = Math.min(Math.max(padding, robotPosition.x), maxX);
      robotPosition.y = Math.min(Math.max(padding, robotPosition.y), maxY);
      robotFab.style.left = `${robotPosition.x}px`;
      robotFab.style.top = `${robotPosition.y}px`;
    }
  });

  robotFab.addEventListener('pointerdown', (e) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    const rect = robotFab.getBoundingClientRect();
    startX = e.clientX;
    startY = e.clientY;
    elemX = rect.left;
    elemY = rect.top;
    hasMoved = false;
    currentPointerId = e.pointerId;

    try {
      robotFab.setPointerCapture(e.pointerId);
    } catch (err) {}
    isDragging = true;
  });

  robotFab.addEventListener('pointermove', (e) => {
    if (!isDragging || currentPointerId !== e.pointerId) return;

    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    if (!hasMoved && Math.hypot(dx, dy) > 6) {
      hasMoved = true;
      robotFab.classList.add('is-dragging');
    }

    if (hasMoved) {
      const rect = robotFab.getBoundingClientRect();
      const padding = 12;
      const minX = padding;
      const maxX = Math.max(minX, window.innerWidth - rect.width - padding);
      const minY = padding;
      const maxY = Math.max(minY, window.innerHeight - rect.height - padding);

      const targetX = Math.min(Math.max(minX, elemX + dx), maxX);
      const targetY = Math.min(Math.max(minY, elemY + dy), maxY);

      robotPosition = { x: targetX, y: targetY };
      robotFab.style.position = 'fixed';
      robotFab.style.left = `${targetX}px`;
      robotFab.style.top = `${targetY}px`;
      robotFab.style.right = 'auto';
      robotFab.style.bottom = 'auto';
    }
  });

  const handlePointerEnd = (e) => {
    if (currentPointerId === e.pointerId) {
      try {
        robotFab.releasePointerCapture(e.pointerId);
      } catch (err) {}
      isDragging = false;
      robotFab.classList.remove('is-dragging');
      currentPointerId = null;
    }
  };

  robotFab.addEventListener('pointerup', handlePointerEnd);
  robotFab.addEventListener('pointercancel', handlePointerEnd);

  // Click vs Drag discrimination
  robotFab.addEventListener('click', (e) => {
    if (hasMoved) {
      e.preventDefault();
      e.stopPropagation();
      hasMoved = false;
      return;
    }
    toggleAssistantModal();
  });

  // Assistant Modal open/close controls
  function toggleAssistantModal(forceOpen) {
    const isOpen = modalOverlay.classList.contains('open');
    const shouldOpen = forceOpen !== undefined ? forceOpen : !isOpen;

    if (shouldOpen) {
      modalOverlay.classList.add('open');
      robotFab.classList.add('assistant-open');
      robotFab.setAttribute('aria-expanded', 'true');
      modalOverlay.setAttribute('aria-hidden', 'false');
      document.body.classList.add('ask-ai-open');

      // Adaptive alignment based on robot coordinates
      if (robotPosition && robotPosition.x < window.innerWidth / 2) {
        modalOverlay.classList.add('align-left');
      } else {
        modalOverlay.classList.remove('align-left');
      }

      setTimeout(() => {
        const input = document.getElementById('robotChatInput');
        if (input && window.innerWidth > 640) input.focus();
      }, 150);
    } else {
      modalOverlay.classList.remove('open');
      robotFab.classList.remove('assistant-open');
      robotFab.setAttribute('aria-expanded', 'false');
      modalOverlay.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('ask-ai-open');
    }
  }

  // Close button & overlay click
  const closeBtn = document.getElementById('globalRobotClose');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => toggleAssistantModal(false));
  }

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      toggleAssistantModal(false);
    }
  });

  // Mobile Swipe Down on Header to Close Bottom Sheet
  const modalHeader = modalOverlay.querySelector('.ask-ai-header');
  if (modalHeader) {
    let touchStartY = 0;
    modalHeader.addEventListener('touchstart', (e) => {
      touchStartY = e.touches[0].clientY;
    }, { passive: true });
    modalHeader.addEventListener('touchmove', (e) => {
      const touchCurrentY = e.touches[0].clientY;
      if (touchCurrentY - touchStartY > 50) {
        toggleAssistantModal(false);
      }
    }, { passive: true });
  }

  // Escape key closes modal
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('open')) {
      toggleAssistantModal(false);
    }
  });

  // Stop pointer events inside modal window from dragging the robot
  const modalWindow = modalOverlay.querySelector('.ask-ai-window');
  if (modalWindow) {
    modalWindow.addEventListener('pointerdown', (e) => e.stopPropagation());
  }

  // 4. Chat Message Handling & Knowledge Engine
  const chatForm = document.getElementById('robotChatForm');
  const chatInput = document.getElementById('robotChatInput');
  const chatBody = document.getElementById('robotChatBody');
  const suggestionsBox = document.getElementById('robotSuggestions');

  function appendUserMessage(text) {
    const msg = document.createElement('div');
    msg.className = 'ask-ai-msg user';
    msg.innerHTML = `
      <div class="ask-ai-msg__bubble">
        <p>${escapeHtml(text)}</p>
      </div>
    `;
    chatBody.appendChild(msg);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function appendAssistantResponse(text, links) {
    const msg = document.createElement('div');
    msg.className = 'ask-ai-msg assistant';

    let linksHtml = '';
    if (links && links.length > 0) {
      linksHtml = '<div class="ask-ai-msg__links">';
      links.forEach(l => {
        linksHtml += `<a href="${l.href}" ${l.target ? `target="${l.target}"` : ''} class="ask-ai-msg__link-btn"><span>${l.label}</span> <span>${l.icon || '→'}</span></a>`;
      });
      linksHtml += '</div>';
    }

    msg.innerHTML = `
      <div class="ask-ai-msg__avatar">
        <svg width="18" height="18" viewBox="0 0 100 92" fill="none">
          <rect x="14" y="23" width="56" height="49" rx="18" fill="#e2e8f0" />
          <rect x="21" y="31" width="42" height="33" rx="11" fill="#0b1329" />
          <circle cx="33" cy="45" r="4" fill="#38bdf8" />
          <circle cx="51" cy="45" r="4" fill="#38bdf8" />
        </svg>
      </div>
      <div class="ask-ai-msg__bubble">
        ${text.split('\n').map(p => `<p style="margin: 4px 0;">${escapeHtml(p)}</p>`).join('')}
        ${linksHtml}
      </div>
    `;
    chatBody.appendChild(msg);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function getKnowledgeResponse(query) {
    const q = query.toLowerCase();

    if (q.includes('demo site') || q.includes('template') || q.includes('website') || q.includes('plotmark') || q.includes('villamark')) {
      return {
        text: "We offer 14+ turnkey live website templates across Real Estate (PlotMark, VillaMark, FlatMark), Healthcare (CareMark), SaaS & Tech (TechMark), Education (EduMark), and E-Commerce (ShopMark) with interactive masterplans and WhatsApp lead routing.",
        links: [
          { label: 'Explore Websites', href: 'https://demo.deccanidentity.in/', target: '_blank', icon: '↗' },
          { label: 'PlotMark Demo', href: 'https://demo.deccanidentity.in/demo/plotmark', target: '_blank', icon: '↗' },
          { label: 'Chat on WhatsApp', href: 'https://wa.me/918186035869', target: '_blank', icon: '↗' },
        ]
      };
    }

    if (q.includes('demo app') || q.includes('app') || q.includes('mobile') || q.includes('ios') || q.includes('android') || q.includes('flutter')) {
      return {
        text: "Our Mobile & Cloud App showcase features high-performance cross-platform Flutter and React Native applications, enterprise workforce CRM tools, telehealth booking, and secure PWAs with biometric zero-trust authentication.",
        links: [
          { label: 'Launch Apps Showcase', href: 'https://apps.deccanidentity.in/', target: '_blank', icon: '↗' },
          { label: 'Explore Mobile Engineering', href: 'solutions.htm', icon: '→' },
        ]
      };
    }

    if (q.includes('iam') || q.includes('identity') || q.includes('okta') || q.includes('ping') || q.includes('security') || q.includes('zero trust')) {
      return {
        text: "DeccanIDentity is an enterprise authority in Zero-Trust Identity Access Management. We specialize in PingFederate, Okta, ForgeRock, CyberArk, SAML 2.0, OAuth 2.0/OIDC, adaptive MFA, and PAM lifecycle governance.",
        links: [
          { label: 'Identity Tech Hub', href: 'technology.htm', icon: '→' },
          { label: 'Enterprise IAM Solutions', href: 'solutions.htm', icon: '→' },
        ]
      };
    }

    if (q.includes('price') || q.includes('cost') || q.includes('quote') || q.includes('pricing')) {
      return {
        text: "We offer transparent, upfront packages starting from ₹14,999 for turnkey templates, ₹29,999 for full custom branding with WhatsApp CRM, up to bespoke enterprise full-stack software and cloud engineering.",
        links: [
          { label: 'View Pricing Tiers', href: 'https://demo.deccanidentity.in/pricing', target: '_blank', icon: '↗' },
          { label: 'Get Custom Quote on WhatsApp', href: 'https://wa.me/918186035869', target: '_blank', icon: '↗' },
        ]
      };
    }

    if (q.includes('whatsapp') || q.includes('contact') || q.includes('phone') || q.includes('talk') || q.includes('human')) {
      return {
        text: "You can reach our engineering team directly on WhatsApp at +91 81860 35869 or call +91 90000 35869 / +91 94947 65679. We typically respond within 15 minutes!",
        links: [
          { label: 'Chat on WhatsApp Now', href: 'https://wa.me/918186035869', target: '_blank', icon: '↗' },
          { label: 'Contact Us Form', href: 'contact.htm', icon: '→' },
        ]
      };
    }

    return {
      text: "Thanks for asking! We architect Zero-Trust IAM security, bespoke web and mobile applications, and turnkey website templates. How can our engineering team assist your project today?",
      links: [
        { label: 'Explore Websites', href: 'https://demo.deccanidentity.in/', target: '_blank', icon: '↗' },
        { label: 'Explore Apps', href: 'https://apps.deccanidentity.in/', target: '_blank', icon: '↗' },
        { label: 'Message on WhatsApp', href: 'https://wa.me/918186035869', target: '_blank', icon: '↗' },
      ]
    };
  }

  function handleSend(text) {
    const query = (text || chatInput.value).trim();
    if (!query) return;

    appendUserMessage(query);
    chatInput.value = '';

    // Simulate natural thinking delay
    setTimeout(() => {
      const resp = getKnowledgeResponse(query);
      appendAssistantResponse(resp.text, resp.links);
    }, 380);
  }

  if (chatForm) {
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleSend();
    });
  }

  if (suggestionsBox) {
    suggestionsBox.addEventListener('click', (e) => {
      const chip = e.target.closest('.ask-ai-chip');
      if (chip) {
        handleSend(chip.textContent.trim());
      }
    });
  }

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
}

/**
 * Independent Draggable WhatsApp Floating Button
 * - Positioned at bottom-left corner
 * - Draggable with mouse & touch, clamped to viewport
 * - Strict refresh reset: resets to bottom-left on page load
 * - Drag (> 6px) does NOT open WhatsApp; Click (<= 6px) opens WhatsApp
 */
function initDraggableWhatsApp() {
  const waBtn = document.querySelector('.floating-whatsapp');
  if (!waBtn) return;

  // Ensure WhatsApp hover tooltip is present
  if (!waBtn.querySelector('.floating-whatsapp__tooltip')) {
    const tooltip = document.createElement('span');
    tooltip.className = 'floating-whatsapp__tooltip';
    tooltip.innerHTML = '<span class="floating-whatsapp__tooltip-dot" aria-hidden="true"></span> WhatsApp';
    waBtn.appendChild(tooltip);
  }

  let isDragging = false;
  let hasMoved = false;
  let startX = 0, startY = 0;
  let elemX = 0, elemY = 0;
  let currentPointerId = null;
  let waPosition = null; // In-memory only; resets on refresh

  window.addEventListener('resize', () => {
    if (waPosition) {
      const rect = waBtn.getBoundingClientRect();
      const padding = 12;
      const maxX = Math.max(padding, window.innerWidth - rect.width - padding);
      const maxY = Math.max(padding, window.innerHeight - rect.height - padding);
      waPosition.x = Math.min(Math.max(padding, waPosition.x), maxX);
      waPosition.y = Math.min(Math.max(padding, waPosition.y), maxY);
      waBtn.style.left = `${waPosition.x}px`;
      waBtn.style.top = `${waPosition.y}px`;
      if (waPosition.x > window.innerWidth / 2) {
        waBtn.classList.add('tooltip-left');
      } else {
        waBtn.classList.remove('tooltip-left');
      }
    }
  });

  waBtn.addEventListener('pointerdown', (e) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    const rect = waBtn.getBoundingClientRect();
    startX = e.clientX;
    startY = e.clientY;
    elemX = rect.left;
    elemY = rect.top;
    hasMoved = false;
    currentPointerId = e.pointerId;

    try {
      waBtn.setPointerCapture(e.pointerId);
    } catch (err) {}
    isDragging = true;
  });

  waBtn.addEventListener('pointermove', (e) => {
    if (!isDragging || currentPointerId !== e.pointerId) return;

    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    if (!hasMoved && Math.hypot(dx, dy) > 6) {
      hasMoved = true;
      waBtn.classList.add('is-dragging');
    }

    if (hasMoved) {
      const rect = waBtn.getBoundingClientRect();
      const padding = 12;
      const minX = padding;
      const maxX = Math.max(minX, window.innerWidth - rect.width - padding);
      const minY = padding;
      const maxY = Math.max(minY, window.innerHeight - rect.height - padding);

      const targetX = Math.min(Math.max(minX, elemX + dx), maxX);
      const targetY = Math.min(Math.max(minY, elemY + dy), maxY);

      waPosition = { x: targetX, y: targetY };
      waBtn.style.position = 'fixed';
      waBtn.style.left = `${targetX}px`;
      waBtn.style.top = `${targetY}px`;
      waBtn.style.right = 'auto';
      waBtn.style.bottom = 'auto';

      if (targetX > window.innerWidth / 2) {
        waBtn.classList.add('tooltip-left');
      } else {
        waBtn.classList.remove('tooltip-left');
      }
    }
  });

  const handlePointerEnd = (e) => {
    if (currentPointerId === e.pointerId) {
      try {
        waBtn.releasePointerCapture(e.pointerId);
      } catch (err) {}
      isDragging = false;
      waBtn.classList.remove('is-dragging');
      currentPointerId = null;
    }
  };

  waBtn.addEventListener('pointerup', handlePointerEnd);
  waBtn.addEventListener('pointercancel', handlePointerEnd);

  waBtn.addEventListener('click', (e) => {
    if (hasMoved) {
      e.preventDefault();
      e.stopPropagation();
      hasMoved = false;
      return;
    }
    // Allow normal click to open WhatsApp URL
  });
}

/**
 * Hero Slideshow Carousel (Management, Planning, Development, Training & Support)
 * - Fits within the hero right column replacing mockup card
 * - Slides continuously with pause on hover/focus
 * - Prev/Next navigation arrows and indicator dots
 * - Touch swipe support
 */
function initHeroSlider() {
  const slider = document.getElementById('heroSliderCard');
  if (!slider) return;

  const track = document.getElementById('heroSliderTrack');
  const slides = slider.querySelectorAll('.hero-slide');
  const prevBtn = document.getElementById('heroSliderPrev');
  const nextBtn = document.getElementById('heroSliderNext');
  const dots = slider.querySelectorAll('.hero-slider-dot');

  if (!track || slides.length === 0) return;

  let currentIndex = 0;
  const totalSlides = slides.length;
  let autoplayTimer = null;
  let progressInterval = null;
  const autoplayDelay = 4500;
  const counterEl = document.getElementById('sliderCounterCurr');
  const progressFill = document.getElementById('heroSliderProgress');

  function updateProgress(startTime) {
    if (!progressFill) return;
    clearInterval(progressInterval);
    progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, (elapsed / autoplayDelay) * 100);
      progressFill.style.width = `${pct}%`;
      if (pct >= 100) {
        clearInterval(progressInterval);
      }
    }, 50);
  }

  function goToSlide(index) {
    if (index < 0) {
      currentIndex = totalSlides - 1;
    } else if (index >= totalSlides) {
      currentIndex = 0;
    } else {
      currentIndex = index;
    }

    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    // Update active class on slides for pop animation
    slides.forEach((slide, idx) => {
      slide.classList.toggle('active', idx === currentIndex);
    });

    // Update Counter
    if (counterEl) {
      counterEl.textContent = String(currentIndex + 1).padStart(2, '0');
    }

    // Update Indicator Dots
    dots.forEach((dot, idx) => {
      const isActive = idx === currentIndex;
      dot.classList.toggle('active', isActive);
      dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    // Reset progress
    if (progressFill) {
      progressFill.style.width = '0%';
    }
  }

  function startAutoplay() {
    stopAutoplay();
    const startTime = Date.now();
    updateProgress(startTime);
    autoplayTimer = setInterval(() => {
      goToSlide(currentIndex + 1);
      updateProgress(Date.now());
    }, autoplayDelay);
  }

  function stopAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
    if (progressInterval) {
      clearInterval(progressInterval);
      progressInterval = null;
    }
    if (progressFill) {
      progressFill.style.width = '0%';
    }
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      goToSlide(currentIndex - 1);
      startAutoplay();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      goToSlide(currentIndex + 1);
      startAutoplay();
    });
  }

  dots.forEach((dot, idx) => {
    dot.addEventListener('click', (e) => {
      e.preventDefault();
      goToSlide(idx);
      startAutoplay();
    });
  });

  // Pause on hover / focus
  slider.addEventListener('mouseenter', stopAutoplay);
  slider.addEventListener('mouseleave', startAutoplay);
  slider.addEventListener('focusin', stopAutoplay);
  slider.addEventListener('focusout', startAutoplay);

  // Touch swipe support
  let touchStartX = 0;
  let touchEndX = 0;

  slider.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    stopAutoplay();
  }, { passive: true });

  slider.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        goToSlide(currentIndex - 1);
      } else {
        goToSlide(currentIndex + 1);
      }
    }
    startAutoplay();
  }, { passive: true });

  // Keyboard navigation
  slider.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      goToSlide(currentIndex - 1);
      startAutoplay();
    } else if (e.key === 'ArrowRight') {
      goToSlide(currentIndex + 1);
      startAutoplay();
    }
  });

  goToSlide(0);
  startAutoplay();
}
