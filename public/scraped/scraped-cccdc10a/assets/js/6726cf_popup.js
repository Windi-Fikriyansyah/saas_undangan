/**
 * WDP Showlink Popup JavaScript
 * Handles popup functionality, device preview modes, and link scanning
 */
(function() {
    'use strict';

    // Default configuration - will be overridden by WordPress options
    let config = {
        linkKeywords: ['#showlink', '#demo'],
        defaultView: 'desktop',
        visibleDevices: ['desktop', 'tablet-landscape', 'tablet', 'mobile-landscape', 'mobile'],
        preloaderText: 'Harap tunggu...',
        iframeTimeoutMs: 12000,
        scrollOffset: 0,
        whatsapp: {
            show: true,
            number: '62812345678xx',
            message: 'Hai, Admin {site}, saya mau pesan undangan digital dengan tema: {temalink}, mohon dibantu proses ya..'
        },
        footer: {
            show: true,
            tickerText: 'Dapatkan diskon 50% untuk pemesanan tema premium hari ini!',
            tickerSpeed: 5,
            buttonText: 'Klaim Promo',
            buttonLink: 'https://weddingpress.net/wdpshowlink'
        }
    };

    // DOM elements cache
    let elements = {};
    let iframeLoadTimer = null;
    let smoothScrollInitialized = false;

    /**
     * Initialize DOM elements
     */
    const initializeElements = () => {
        elements = {
            popup: document.getElementById('wdpsl-popup'),
            preloader: document.getElementById('wdpsl-preloader'),
            preloaderText: document.getElementById('wdpsl-preloader-text'),
            iframe: document.getElementById('wdpsl-iframe'),
            iframeWrapper: document.getElementById('wdpsl-iframe-wrapper'),
            iframeContainer: document.getElementById('wdpsl-body'),
            closeBtn: document.getElementById('wdpsl-close-btn'),
            desktopBtn: document.getElementById('wdpsl-desktop-btn'),
            tabletBtn: document.getElementById('wdpsl-tablet-btn'),
            tabletLandBtn: document.getElementById('wdpsl-tablet-land-btn'),
            mobileBtn: document.getElementById('wdpsl-mobile-btn'),
            mobileLandBtn: document.getElementById('wdpsl-mobile-land-btn'),
            allDeviceButtons: document.querySelectorAll('.wdpsl-device-button'),
            whatsAppBtn: document.getElementById('wdpsl-whatsapp-btn'),
            footer: document.getElementById('wdpsl-footer'),
            tickerText: document.getElementById('wdpsl-ticker-text'),
            footerBtn: document.getElementById('wdpsl-footer-btn'),
            footerBtnText: document.getElementById('wdpsl-footer-btn-text'),
            retryBtn: document.getElementById('wdpsl-retry-btn')
        };

        if (!elements.popup) {
            console.warn("WDP Showlink: Elemen popup tidak ditemukan.");
            return false;
        }
        
        return true;
    };

    /**
     * Initialize popup from configuration
     */
    const initializeFromConfig = () => {
        if (!elements.popup) return;

        if (elements.preloaderText) {
            elements.preloaderText.textContent = config.preloaderText;
        }
        
        if (elements.whatsAppBtn) {
            elements.whatsAppBtn.style.display = config.whatsapp.show ? 'flex' : 'none';
        }
        
        if (elements.footer) {
            elements.footer.style.display = config.footer.show ? 'flex' : 'none';
            
            if (config.footer.show) {
                if (elements.tickerText) {
                    elements.tickerText.textContent = config.footer.tickerText;
                    elements.tickerText.style.animationDuration = `${config.footer.tickerSpeed}s`;
                }
                
                if (elements.footerBtn) {
                    if (elements.footerBtnText) {
                        elements.footerBtnText.textContent = config.footer.buttonText;
                    }
                    elements.footerBtn.href = config.footer.buttonLink;
                }
            }
        }
        
        if (config.visibleDevices && Array.isArray(config.visibleDevices)) {
            const deviceMap = {
                'desktop': elements.desktopBtn,
                'tablet': elements.tabletBtn,
                'tablet-landscape': elements.tabletLandBtn,
                'mobile': elements.mobileBtn,
                'mobile-landscape': elements.mobileLandBtn
            };
            
            for (const deviceName in deviceMap) {
                const button = deviceMap[deviceName];
                if (button) {
                    button.style.display = config.visibleDevices.includes(deviceName) ? 'flex' : 'none';
                }
            }
        }
    };

    /**
     * Update WhatsApp link with current URL
     */
    const updateWhatsAppLink = (url) => {
        if (!config.whatsapp.show || !config.whatsapp.number || !elements.whatsAppBtn) return;
        
        const cleanUrl = url.split('#')[0];
        const siteTitle = document.title || 'Website';
        const message = config.whatsapp.message
            .replace('{site}', siteTitle)
            .replace('{temalink}', cleanUrl);
        
        elements.whatsAppBtn.href = `https://wa.me/${config.whatsapp.number}?text=${encodeURIComponent(message)}`;
    };

    /**
     * Set active device button
     */
    const setActiveButton = (activeBtn) => {
        elements.allDeviceButtons.forEach(btn => btn.classList.remove('active'));
        if (activeBtn) activeBtn.classList.add('active');
    };

    /**
     * Set preview mode for different devices
     */
    const setPreviewMode = (targetWidth, targetHeight, borderRadius, buttonToActivate) => {
        if (!elements.iframeContainer || !elements.iframeWrapper) return;

        const containerWidth = elements.iframeContainer.clientWidth;
        const containerHeight = elements.iframeContainer.clientHeight;
        
        const scale = Math.min(
            (containerWidth * 0.98) / targetWidth,
            (containerHeight * 0.98) / targetHeight,
            1
        );

        elements.iframeWrapper.style.width = `${targetWidth}px`;
        elements.iframeWrapper.style.height = `${targetHeight}px`;
        elements.iframeWrapper.style.borderRadius = borderRadius;
        elements.iframeWrapper.style.transform = `scale(${scale})`;
        
        setActiveButton(buttonToActivate);
    };

    /**
     * Start iframe loading timeout
     */
    const startIframeTimeout = () => {
        if (iframeLoadTimer) clearTimeout(iframeLoadTimer);
        
        iframeLoadTimer = setTimeout(() => {
            if (elements.iframe && elements.iframe.src && elements.iframe.src !== 'about:blank') {
                if (elements.preloaderText) {
                    elements.preloaderText.textContent = 'Gagal memuat konten. Silakan coba lagi.';
                }
                if (elements.retryBtn) {
                    elements.retryBtn.style.display = 'inline-flex';
                }
            }
        }, config.iframeTimeoutMs || 10000);
    };

    /**
     * Enable smooth scrolling inside the iframe document
     * - Applies CSS scroll-behavior: smooth to html and body
     * - Adds minimal fallback handler for hash anchors if CSS unsupported
     */
    const enableIframeSmoothScroll = () => {
        if (!elements.iframe) return;
        if (smoothScrollInitialized) return;
        try {
            const doc = elements.iframe.contentDocument || elements.iframe.contentWindow?.document;
            if (!doc) return;

            // Apply CSS smooth scrolling
            const html = doc.documentElement;
            const body = doc.body;
            if (html) html.style.scrollBehavior = 'smooth';
            if (body) body.style.scrollBehavior = 'smooth';

            // Inject style for target offset using CSS variable
            const style = doc.createElement('style');
            const offsetPx = parseInt(config.scrollOffset || 0, 10);
            style.textContent = `:root{--wdpsl-offset:${isNaN(offsetPx)?0:offsetPx}px} :target{scroll-margin-top: var(--wdpsl-offset, 0px);} `;
            doc.head && doc.head.appendChild(style);

            // Helper: smooth scroll to ID with offset, regardless of CSS support
            const smoothScrollToId = (id) => {
                if (!id) return;
                const target = doc.getElementById(id) || doc.querySelector(`[name="${id}"]`);
                if (!target) return;
                const prefersReduced = doc.defaultView?.matchMedia && doc.defaultView.matchMedia('(prefers-reduced-motion: reduce)').matches;
                // Determine scrolling element (supports pages that use a custom scroll container)
                const scroller = doc.scrollingElement || doc.documentElement || doc.body;
                const rect = target.getBoundingClientRect();
                const currentScrollTop = scroller.scrollTop || (doc.defaultView?.pageYOffset || 0);
                const offset = parseInt(config.scrollOffset || 0, 10) || 0;
                const top = rect.top + currentScrollTop - offset;
                try {
                    if (prefersReduced) {
                        doc.defaultView?.scrollTo({ top, left: 0, behavior: 'auto' });
                    } else {
                        doc.defaultView?.scrollTo({ top, left: 0, behavior: 'smooth' });
                    }
                } catch (_) {
                    doc.defaultView?.scrollTo(0, top);
                }
            };

            // Intercept anchor clicks inside iframe to enforce smooth + offset
            doc.addEventListener('click', (ev) => {
                const a = ev.target && ev.target.closest ? ev.target.closest('a[href]') : null;
                if (!a) return;
                // Skip external links, downloads, targets, or explicit opt-out
                const href = a.getAttribute('href') || '';
                const isHashOnly = /^#.+/.test(href);
                const hasNoSmooth = a.hasAttribute('data-no-smooth');
                const targetAttr = a.getAttribute('target');
                if (hasNoSmooth || (targetAttr && targetAttr.toLowerCase() === '_blank')) return;

                if (isHashOnly) {
                    const id = href.replace('#', '');
                    const exists = doc.getElementById(id) || doc.querySelector(`[name="${id}"]`);
                    if (!exists) return; // let default if target not found
                    ev.preventDefault();
                    smoothScrollToId(id);
                    // Update hash to keep history and accessibility
                    if (doc.location) {
                        doc.location.hash = id;
                    }
                }
            }, { capture: true });

            // Handle hashchange inside iframe (when scripts set location.hash)
            doc.defaultView?.addEventListener('hashchange', () => {
                const id = (doc.location && doc.location.hash) ? doc.location.hash.replace('#','') : '';
                if (!id) return;
                // Avoid double handling if no target
                const exists = doc.getElementById(id) || doc.querySelector(`[name="${id}"]`);
                if (!exists) return;
                smoothScrollToId(id);
            });
            smoothScrollInitialized = true;

            // If URL already has a hash, scroll to it with offset
            const initialHash = (doc.location && doc.location.hash) ? doc.location.hash.replace('#','') : '';
            if (initialHash) {
                smoothScrollToId(initialHash);
            }
        } catch (e) {
            // Cross-origin iframe: cannot access inner document
            // In this case, rely on the page's own behavior
            console.warn('WDP Showlink: Tidak dapat mengaktifkan smooth scroll di iframe (cross-origin).');
        }
    };

    /**
     * Apply default view based on configuration
     */
    const applyDefaultView = () => {
        const view = config.defaultView;
        switch (view) {
            case 'tablet':
                setPreviewMode(768, 1024, '12px', elements.tabletBtn);
                break;
            case 'mobile':
                setPreviewMode(390, 844, '20px', elements.mobileBtn);
                break;
            case 'tablet-landscape':
                setPreviewMode(1024, 768, '12px', elements.tabletLandBtn);
                break;
            case 'mobile-landscape':
                setPreviewMode(844, 390, '20px', elements.mobileLandBtn);
                break;
            default:
                setPreviewMode(1366, 768, '8px', elements.desktopBtn);
        }
    };

    /**
     * Open popup with specified URL
     */
    const openPopup = (url) => {
        if (!elements.popup || !elements.iframe) return;

        updateWhatsAppLink(url);
        
        // Reset preloader state
        if (elements.preloaderText) {
            elements.preloaderText.textContent = config.preloaderText;
        }
        if (elements.retryBtn) {
            elements.retryBtn.style.display = 'none';
        }
        
        // Show preloader and hide iframe
        if (elements.preloader) {
            elements.preloader.classList.add('visible');
        }
        elements.iframe.style.opacity = '0';
        
        // Show popup
        elements.popup.classList.add('visible');
        elements.popup.setAttribute('aria-hidden', 'false');
        document.body.classList.add('wdpsl-no-scroll');
        
        // Load URL
        elements.iframe.src = url;
        
        // Apply default view after a short delay
        setTimeout(applyDefaultView, 50);
        
        // Focus close button for accessibility
        if (elements.closeBtn) {
            elements.closeBtn.focus();
        }
        
        startIframeTimeout();
    };

    /**
     * Close popup
     */
    const closePopup = () => {
        if (!elements.popup) return;

        elements.popup.classList.remove('visible');
        elements.popup.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('wdpsl-no-scroll');
        
        setTimeout(() => {
            if (elements.iframe) {
                elements.iframe.src = 'about:blank';
            }
            if (elements.preloader) {
                elements.preloader.classList.remove('visible');
            }
            if (elements.retryBtn) {
                elements.retryBtn.style.display = 'none';
            }
        }, 300);
    };

    /**
     * Scan and attach event listeners to matching links
     */
    const scanAndAttachLinks = () => {
        // Handle Elementor widget triggers
        document.querySelectorAll('.wdpsl-showlink-trigger').forEach(trigger => {
            // Remove existing event listeners to prevent duplicates
            trigger.removeEventListener('click', handleLinkClick);
            trigger.addEventListener('click', handleLinkClick);
        });

        // Handle keyword-based links
        if (!config.linkKeywords || !Array.isArray(config.linkKeywords) || config.linkKeywords.length === 0) {
            return;
        }

        document.querySelectorAll('a[href]').forEach(link => {
            // Skip if already handled as Elementor widget
            if (link.classList.contains('wdpsl-showlink-trigger')) {
                return;
            }

            const href = link.getAttribute('href') || '';
            
            // Check if link matches any keyword
            const matched = config.linkKeywords.some(keyword => 
                href.toLowerCase().includes(keyword.toLowerCase())
            );
            
            if (matched) {
                // Remove existing event listeners to prevent duplicates
                link.removeEventListener('click', handleLinkClick);
                link.addEventListener('click', handleLinkClick);
                
                // Add visual indicator (optional)
                link.classList.add('wdpsl-showlink');
            }
        });
    };

    /**
     * Handle link click event
     */
    const handleLinkClick = (e) => {
        // Cek apakah berada di editor Elementor
        if (document.body.classList.contains('elementor-editor-active')) {
            e.preventDefault();
            return; // Tidak membuka popup di editor
        }
        
        e.preventDefault();
        const link = e.currentTarget;
        const targetUrl = link.getAttribute('data-url') || link.href;
        openPopup(targetUrl);
    };

    /**
     * Setup event listeners
     */
    const setupEventListeners = () => {
        if (!elements.popup) return;

        // Close button
        if (elements.closeBtn) {
            elements.closeBtn.addEventListener('click', closePopup);
        }

        // Click outside to close
        if (elements.iframeContainer) {
            elements.iframeContainer.addEventListener('click', (event) => {
                if (event.target === elements.iframeContainer) {
                    closePopup();
                }
            });
        }

        // Device buttons
        if (elements.desktopBtn) {
            elements.desktopBtn.addEventListener('click', () => 
                setPreviewMode(1366, 768, '8px', elements.desktopBtn)
            );
        }
        if (elements.tabletLandBtn) {
            elements.tabletLandBtn.addEventListener('click', () => 
                setPreviewMode(1024, 768, '12px', elements.tabletLandBtn)
            );
        }
        if (elements.tabletBtn) {
            elements.tabletBtn.addEventListener('click', () => 
                setPreviewMode(768, 1024, '12px', elements.tabletBtn)
            );
        }
        if (elements.mobileLandBtn) {
            elements.mobileLandBtn.addEventListener('click', () => 
                setPreviewMode(844, 390, '20px', elements.mobileLandBtn)
            );
        }
        if (elements.mobileBtn) {
            elements.mobileBtn.addEventListener('click', () => 
                setPreviewMode(390, 844, '20px', elements.mobileBtn)
            );
        }

        // Retry button
        if (elements.retryBtn) {
            elements.retryBtn.addEventListener('click', () => {
                const url = elements.iframe.src;
                if (!url || url === 'about:blank') return;

                if (elements.preloaderText) {
                    elements.preloaderText.textContent = config.preloaderText;
                }
                elements.retryBtn.style.display = 'none';
                
                if (elements.preloader) {
                    elements.preloader.classList.add('visible');
                }
                elements.iframe.style.opacity = '0';
                elements.iframe.src = 'about:blank';
                
                setTimeout(() => {
                    elements.iframe.src = url;
                    startIframeTimeout();
                }, 50);
            });
        }

        // Iframe load event
        if (elements.iframe) {
            elements.iframe.addEventListener('load', () => {
                if (elements.iframe.src !== 'about:blank') {
                    if (iframeLoadTimer) clearTimeout(iframeLoadTimer);
                    
                    if (elements.preloader) {
                        elements.preloader.classList.remove('visible');
                    }
                    elements.iframe.style.opacity = '1';
                    
                    if (elements.retryBtn) {
                        elements.retryBtn.style.display = 'none';
                    }

                    // Aktifkan smooth scrolling di dalam halaman iframe
                    enableIframeSmoothScroll();
                }
            });
        }

        // Window resize
        window.addEventListener('resize', () => {
            if (elements.popup && elements.popup.classList.contains('visible')) {
                const activeBtn = document.querySelector('.wdpsl-device-button.active');
                if (activeBtn) {
                    activeBtn.click();
                }
            }
        });

        // Keyboard accessibility
        document.addEventListener('keydown', (e) => {
            if (!elements.popup || !elements.popup.classList.contains('visible')) return;

            // Escape to close
            if (e.key === 'Escape') {
                closePopup();
                return;
            }

            // Tab trap
            if (e.key === 'Tab') {
                const focusable = elements.popup.querySelectorAll(
                    'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
                );
                
                if (!focusable.length) return;

                const first = focusable[0];
                const last = focusable[focusable.length - 1];

                if (e.shiftKey) {
                    if (document.activeElement === first) {
                        e.preventDefault();
                        last.focus();
                    }
                } else {
                    if (document.activeElement === last) {
                        e.preventDefault();
                        first.focus();
                    }
                }
            }
        });
    };

    /**
     * Update configuration from WordPress
     */
    const updateConfig = (newConfig) => {
        config = { ...config, ...newConfig };
        initializeFromConfig();
        scanAndAttachLinks();
    };

    /**
     * Initialize the popup system
     */
    const init = () => {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        // Ambil konfigurasi dari WordPress jika tersedia
        if (window.wdpslConfig) {
            try {
                const opts = window.wdpslConfig.options || {};
                config = { ...config, ...opts };
            } catch (e) {
                console.error('Error loading WDP Showlink config:', e);
            }
        }

        if (!initializeElements()) {
            console.error('WDP Showlink: Failed to initialize elements');
            return;
        }
        
        initializeFromConfig();
        setupEventListeners();
        scanAndAttachLinks();
        
        console.log('WDP Showlink: Initialized successfully');
    };

    // Public API
    window.WDPShowlink = {
        init,
        updateConfig,
        openPopup,
        closePopup,
        scanAndAttachLinks
    };

    // Auto-initialize
    init();

})();