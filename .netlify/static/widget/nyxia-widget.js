/**
 * Nyxia Widget - Script d'intégration
 * 
 * Pour intégrer Nyxia sur votre site, ajoutez ce script :
 * <script src="https://votre-domaine.com/widget/nyxia-widget.js" data-title="Nyxia" defer></script>
 * 
 * Options disponibles (data-attributes):
 * - data-title: Titre du widget (défaut: "Nyxia")
 * - data-position: Position - "bottom-right", "bottom-left" (défaut: "bottom-right")
 * - data-theme: Thème - "dark", "light" (défaut: "dark")
 * - data-welcome: Message de bienvenue personnalisé
 * - data-primary-color: Couleur principale (défaut: "#00D4FF")
 * - data-autopen: Ouvrir automatiquement (défaut: "false")
 */

(function() {
  'use strict';

  // Configuration par défaut
  const DEFAULT_CONFIG = {
    title: 'Nyxia',
    position: 'bottom-right',
    theme: 'dark',
    welcome: 'Salut toi! ✨ Je suis Nyxia, ton assistante mystique. Comment puis-je t\'aider aujourd\'hui?',
    primaryColor: '#00D4FF',
    secondaryColor: '#9D4EDD',
    autoOpen: false,
    chatUrl: window.location.origin
  };

  // Récupérer la configuration depuis les attributs data
  function getConfig() {
    const script = document.currentScript || document.querySelector('script[src*="nyxia-widget"]');
    
    return {
      ...DEFAULT_CONFIG,
      title: script?.dataset?.title || DEFAULT_CONFIG.title,
      position: script?.dataset?.position || DEFAULT_CONFIG.position,
      theme: script?.dataset?.theme || DEFAULT_CONFIG.theme,
      welcome: script?.dataset?.welcome || DEFAULT_CONFIG.welcome,
      primaryColor: script?.dataset?.primaryColor || DEFAULT_CONFIG.primaryColor,
      secondaryColor: script?.dataset?.secondaryColor || DEFAULT_CONFIG.secondaryColor,
      autoOpen: script?.dataset?.autoOpen === 'true',
      chatUrl: script?.dataset?.chatUrl || DEFAULT_CONFIG.chatUrl
    };
  }

  // Créer les styles CSS
  function createStyles(config) {
    const style = document.createElement('style');
    style.id = 'nyxia-widget-styles';
    
    style.textContent = `
      /* Nyxia Widget Styles */
      .nyxia-widget-container {
        position: fixed;
        z-index: 9999;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }
      
      .nyxia-widget-container.bottom-right {
        bottom: 24px;
        right: 24px;
      }
      
      .nyxia-widget-container.bottom-left {
        bottom: 24px;
        left: 24px;
      }
      
      /* Toggle Button */
      .nyxia-toggle-btn {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, ${config.primaryColor}, ${config.secondaryColor});
        box-shadow: 0 4px 20px rgba(0, 212, 255, 0.4);
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
      }
      
      .nyxia-toggle-btn::before {
        content: '';
        position: absolute;
        inset: 2px;
        border-radius: 50%;
        background: linear-gradient(135deg, rgba(255,255,255,0.2), transparent);
      }
      
      .nyxia-toggle-btn:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 30px rgba(0, 212, 255, 0.6);
      }
      
      .nyxia-toggle-btn svg {
        width: 28px;
        height: 28px;
        fill: white;
        filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
      }
      
      .nyxia-toggle-btn.open {
        background: linear-gradient(135deg, ${config.secondaryColor}, ${config.primaryColor});
      }
      
      /* Notification Badge */
      .nyxia-badge {
        position: absolute;
        top: -4px;
        right: -4px;
        width: 20px;
        height: 20px;
        background: #FF4757;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 11px;
        font-weight: bold;
        color: white;
        animation: pulse-badge 2s infinite;
      }
      
      @keyframes pulse-badge {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
      }
      
      /* Chat Window */
      .nyxia-chat-window {
        position: absolute;
        bottom: 80px;
        width: 380px;
        height: 600px;
        max-height: calc(100vh - 120px);
        background: linear-gradient(135deg, #0F172A, #1E1B4B);
        border-radius: 20px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(0, 212, 255, 0.2);
        overflow: hidden;
        opacity: 0;
        visibility: hidden;
        transform: translateY(20px) scale(0.95);
        transition: all 0.3s ease;
        display: flex;
        flex-direction: column;
      }
      
      .nyxia-widget-container.bottom-right .nyxia-chat-window {
        right: 0;
      }
      
      .nyxia-widget-container.bottom-left .nyxia-chat-window {
        left: 0;
      }
      
      .nyxia-chat-window.open {
        opacity: 1;
        visibility: visible;
        transform: translateY(0) scale(1);
      }
      
      /* Chat Header */
      .nyxia-chat-header {
        padding: 16px 20px;
        background: rgba(15, 23, 42, 0.8);
        backdrop-filter: blur(12px);
        border-bottom: 1px solid rgba(0, 212, 255, 0.2);
        display: flex;
        align-items: center;
        gap: 12px;
      }
      
      .nyxia-header-avatar {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        background: linear-gradient(135deg, ${config.primaryColor}, ${config.secondaryColor});
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        box-shadow: 0 0 20px rgba(0, 212, 255, 0.3);
      }
      
      .nyxia-header-info {
        flex: 1;
      }
      
      .nyxia-header-title {
        font-size: 16px;
        font-weight: 600;
        color: white;
        background: linear-gradient(135deg, ${config.primaryColor}, ${config.secondaryColor});
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
      
      .nyxia-header-status {
        font-size: 12px;
        color: #4ADE80;
        display: flex;
        align-items: center;
        gap: 4px;
      }
      
      .nyxia-header-status::before {
        content: '';
        width: 8px;
        height: 8px;
        background: #4ADE80;
        border-radius: 50%;
        animation: pulse-badge 2s infinite;
      }
      
      .nyxia-close-btn {
        width: 32px;
        height: 32px;
        border-radius: 8px;
        border: none;
        background: rgba(255, 255, 255, 0.1);
        color: white;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
      }
      
      .nyxia-close-btn:hover {
        background: rgba(255, 255, 255, 0.2);
      }
      
      /* Chat iframe */
      .nyxia-chat-iframe-container {
        flex: 1;
        position: relative;
        background: #0F172A;
      }
      
      .nyxia-chat-iframe {
        width: 100%;
        height: 100%;
        border: none;
        background: transparent;
      }
      
      /* Powered by */
      .nyxia-powered-by {
        padding: 8px;
        text-align: center;
        font-size: 11px;
        color: rgba(255, 255, 255, 0.4);
        background: rgba(15, 23, 42, 0.9);
        border-top: 1px solid rgba(0, 212, 255, 0.1);
      }
      
      .nyxia-powered-by a {
        color: ${config.primaryColor};
        text-decoration: none;
      }
      
      .nyxia-powered-by a:hover {
        text-decoration: underline;
      }
      
      /* Mobile Responsive */
      @media (max-width: 480px) {
        .nyxia-chat-window {
          width: calc(100vw - 48px);
          height: calc(100vh - 120px);
          bottom: 70px;
        }
        
        .nyxia-widget-container.bottom-right .nyxia-chat-window,
        .nyxia-widget-container.bottom-left .nyxia-chat-window {
          right: auto;
          left: 50%;
          transform: translateX(-50%) translateY(20px) scale(0.95);
        }
        
        .nyxia-chat-window.open {
          transform: translateX(-50%) translateY(0) scale(1);
        }
      }
    `;
    
    return style;
  }

  // Créer le HTML du widget
  function createWidgetHTML(config) {
    const container = document.createElement('div');
    container.className = `nyxia-widget-container ${config.position}`;
    container.id = 'nyxia-widget';
    
    container.innerHTML = `
      <!-- Chat Window -->
      <div class="nyxia-chat-window" id="nyxia-chat-window">
        <div class="nyxia-chat-header">
          <div class="nyxia-header-avatar">🔮</div>
          <div class="nyxia-header-info">
            <div class="nyxia-header-title">${config.title}</div>
            <div class="nyxia-header-status">En ligne • Assistante Mystique</div>
          </div>
          <button class="nyxia-close-btn" id="nyxia-close-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="nyxia-chat-iframe-container">
          <iframe class="nyxia-chat-iframe" src="${config.chatUrl}" title="${config.title}"></iframe>
        </div>
        <div class="nyxia-powered-by">
          Propulsé par <a href="https://www.oznya.com" target="_blank" rel="noopener">Diane Boyer</a>
        </div>
      </div>
      
      <!-- Toggle Button -->
      <button class="nyxia-toggle-btn" id="nyxia-toggle-btn" aria-label="Ouvrir le chat Nyxia">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z"/>
          <circle cx="12" cy="10" r="3"/>
          <path d="M12 14C9.33 14 7.5 15.5 7.5 15.5C7.5 15.5 9.33 17 12 17C14.67 17 16.5 15.5 16.5 15.5C16.5 15.5 14.67 14 12 14Z"/>
        </svg>
      </button>
    `;
    
    return container;
  }

  // Initialiser le widget
  function initWidget() {
    const config = getConfig();
    
    // Ajouter les styles
    if (!document.getElementById('nyxia-widget-styles')) {
      document.head.appendChild(createStyles(config));
    }
    
    // Créer et ajouter le widget
    const widget = createWidgetHTML(config);
    document.body.appendChild(widget);
    
    // Éléments du DOM
    const toggleBtn = document.getElementById('nyxia-toggle-btn');
    const closeBtn = document.getElementById('nyxia-close-btn');
    const chatWindow = document.getElementById('nyxia-chat-window');
    
    let isOpen = false;
    
    // Fonction pour ouvrir/fermer le chat
    function toggleChat() {
      isOpen = !isOpen;
      
      if (isOpen) {
        chatWindow.classList.add('open');
        toggleBtn.classList.add('open');
        toggleBtn.setAttribute('aria-label', 'Fermer le chat Nyxia');
      } else {
        chatWindow.classList.remove('open');
        toggleBtn.classList.remove('open');
        toggleBtn.setAttribute('aria-label', 'Ouvrir le chat Nyxia');
      }
    }
    
    // Event listeners
    toggleBtn.addEventListener('click', toggleChat);
    closeBtn.addEventListener('click', toggleChat);
    
    // Fermer avec Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen) {
        toggleChat();
      }
    });
    
    // Auto-open si configuré
    if (config.autoOpen) {
      setTimeout(() => {
        toggleChat();
      }, 1500);
    }
    
    // API publique
    window.NyxiaWidget = {
      open: () => { if (!isOpen) toggleChat(); },
      close: () => { if (isOpen) toggleChat(); },
      toggle: toggleChat,
      isOpen: () => isOpen
    };
    
    console.log('🔮 Nyxia Widget initialisé');
  }

  // Initialiser quand le DOM est prêt
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWidget);
  } else {
    initWidget();
  }
})();
