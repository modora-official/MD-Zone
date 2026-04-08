(function() {
    // Pastikan script hanya berjalan sekali
    if (window.ModoraAdsInitialized) return;
    window.ModoraAdsInitialized = true;

    // ==============================================
    // BAGIAN A: SISTEM POP-UP & ANTI-ADBLOCK
    // ==============================================

    // 1. INJEKSI DEPENDENSI (FONT & ICON)
    function loadDependencies() {
        if (!document.querySelector('link[href*="Plus+Jakarta+Sans"]')) {
            const font = document.createElement('link');
            font.rel = 'stylesheet';
            font.href = 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap';
            document.head.appendChild(font);
        }
        if (!document.querySelector('link[href*="font-awesome"]')) {
            const fa = document.createElement('link');
            fa.rel = 'stylesheet';
            fa.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
            document.head.appendChild(fa);
        }
    }

    // 2. INJEKSI CSS STRUKTUR UNTUK OVERLAY
    function injectStyles() {
        const style = document.createElement('style');
        style.innerHTML = `
            :root {
                --bg-card: #1e293b; --text-main: #f8fafc; --text-muted: #94a3b8;
                --border: #334155; --search-bg: #0f172a; --primary: #2563eb; 
                --secondary: #4f46e5; --accent: #ef4444; --gold: #f59e0b;
                --gold-light: #fcd34d; --font-main: 'Plus Jakarta Sans', sans-serif;
            }
            .modora-ads-wrapper { font-family: var(--font-main); outline: none; -webkit-tap-highlight-color: transparent; }
            .modora-ads-wrapper * { box-sizing: border-box; }
            
            #modoraNotifOverlay {
                position: fixed; top: 0; left: 0; right: 0; bottom: 0;
                background: rgba(15, 23, 42, 0.75); 
                backdrop-filter: blur(2px); -webkit-backdrop-filter: blur(2px);
                display: flex; align-items: center; justify-content: center;
                padding: 20px; z-index: 999999; opacity: 1;
                transition: opacity 0.5s ease, visibility 0.5s;
                color: var(--text-main);
            }

            .modora-premium-card {
                background: linear-gradient(160deg, var(--bg-card) 0%, #111827 100%);
                border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 28px;
                width: 100%; max-width: 440px; padding: 45px 35px 35px;
                text-align: center; position: relative; overflow: hidden;
                box-shadow: 0 30px 60px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.06);
                animation: modoraCardPop 0.6s cubic-bezier(0.16, 1, 0.3, 1);
                transition: all 0.4s ease;
            }
            .modora-premium-card::before {
                content: ''; position: absolute; top: 0; left: 0; right: 0; height: 4px;
                background: linear-gradient(90deg, var(--gold), var(--gold-light), var(--gold));
                transition: background 0.4s ease;
            }
            .modora-premium-card.adblock-mode::before { background: linear-gradient(90deg, var(--accent), #fca5a5, var(--accent)); }

            @keyframes modoraCardPop { 0% { opacity: 0; transform: translateY(30px) scale(0.95); } 100% { opacity: 1; transform: translateY(0) scale(1); } }

            .modora-icon-header {
                width: 70px; height: 70px; background: rgba(245, 158, 11, 0.1); color: var(--gold);
                font-size: 30px; border-radius: 22px; display: flex; align-items: center; justify-content: center;
                margin: 0 auto 20px auto; border: 1px solid rgba(245, 158, 11, 0.2);
                box-shadow: 0 10px 25px rgba(245, 158, 11, 0.15); transition: all 0.4s ease;
            }
            .modora-icon-header.adblock-mode { background: rgba(239, 68, 68, 0.1); color: var(--accent); border-color: rgba(239, 68, 68, 0.2); box-shadow: 0 10px 25px rgba(239, 68, 68, 0.15); }

            .modora-title { font-size: 24px; font-weight: 800; margin-bottom: 12px; letter-spacing: -0.5px; transition: color 0.4s; }
            .modora-title.adblock-mode { color: var(--accent); }
            .modora-desc { font-size: 14.5px; color: var(--text-muted); font-weight: 500; line-height: 1.6; margin-bottom: 30px; }
            .modora-highlight { color: var(--text-main); font-weight: 700; }

            .modora-action-card {
                display: flex; align-items: center; text-decoration: none;
                background: rgba(15, 23, 42, 0.6); border: 2px dashed var(--border);
                border-radius: 20px; padding: 20px; position: relative; cursor: pointer;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); animation: modoraPulse 2.5s infinite; text-align: left;
            }
            .modora-action-card:hover { background: rgba(37, 99, 235, 0.1); border-style: solid; border-color: var(--primary); transform: translateY(-4px); box-shadow: 0 12px 30px rgba(37, 99, 235, 0.2); }
            .modora-action-card:active { transform: scale(0.97); }
            .modora-action-card.adblock-mode { background: rgba(239, 68, 68, 0.05); border-color: rgba(239, 68, 68, 0.4); animation: none; }
            .modora-action-card.adblock-mode:hover { background: rgba(239, 68, 68, 0.15); border-color: var(--accent); box-shadow: 0 12px 30px rgba(239, 68, 68, 0.2); }

            @keyframes modoraPulse { 0% { border-color: rgba(51, 65, 85, 0.8); } 50% { border-color: rgba(37, 99, 235, 0.6); } 100% { border-color: rgba(51, 65, 85, 0.8); } }

            .modora-badge {
                position: absolute; top: -10px; right: 20px; background: var(--gold); color: #000;
                font-size: 10px; font-weight: 800; padding: 4px 10px; border-radius: 10px;
                letter-spacing: 0.5px; box-shadow: 0 4px 10px rgba(245, 158, 11, 0.3); display: flex; align-items: center; transition: all 0.4s ease;
            }
            .modora-badge.adblock-mode { background: var(--accent); color: white; box-shadow: 0 4px 10px rgba(239, 68, 68, 0.3); }

            .modora-btn-icon {
                width: 50px; height: 50px; background: linear-gradient(135deg, var(--primary), var(--secondary));
                border-radius: 14px; display: flex; align-items: center; justify-content: center;
                font-size: 20px; color: white; flex-shrink: 0; margin-right: 16px;
                box-shadow: 0 6px 15px rgba(37, 99, 235, 0.3); transition: all 0.4s ease;
            }
            .modora-btn-icon.adblock-mode { background: linear-gradient(135deg, var(--accent), #991b1b); box-shadow: 0 6px 15px rgba(239, 68, 68, 0.3); }

            .modora-ad-info { flex: 1; }
            .modora-ad-title { font-size: 16px; font-weight: 800; color: var(--text-main); margin-bottom: 4px; letter-spacing: -0.2px; }
            .modora-ad-sub { font-size: 13px; color: var(--primary); font-weight: 600; display: flex; align-items: center; gap: 5px; transition: color 0.4s ease; }
            .modora-ad-sub.adblock-mode { color: var(--accent); }

            .modora-status-bar {
                margin-top: 30px; padding-top: 25px; border-top: 1px solid rgba(255, 255, 255, 0.06);
                display: flex; align-items: center; justify-content: center; gap: 12px; color: var(--text-muted); font-size: 13px; font-weight: 600;
            }
            .modora-spinner {
                width: 16px; height: 16px; border: 2px solid rgba(255, 255, 255, 0.1);
                border-top-color: var(--primary); border-radius: 50%; animation: modoraSpin 1s linear infinite;
            }
            .modora-spinner.adblock-mode { border-top-color: var(--accent); animation: none; border: none; font-size: 16px; color: var(--accent); display: flex; align-items: center; justify-content: center; }
            .modora-spinner.adblock-mode::before { content: '\\f071'; font-family: 'Font Awesome 6 Free'; font-weight: 900; }

            @keyframes modoraSpin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        `;
        document.head.appendChild(style);
    }

    // 3. INJEKSI HTML OVERLAY
    function injectHTML() {
        const overlay = document.createElement('div');
        overlay.id = 'modoraNotifOverlay';
        overlay.className = 'modora-ads-wrapper';
        overlay.innerHTML = `
            <div class="modora-premium-card" id="modoraCardContainer">
                <div class="modora-icon-header" id="modoraMainIcon">
                    <i class="fa-solid fa-hand-holding-heart" id="modoraIconElement"></i>
                </div>
                <h2 class="modora-title" id="modoraLangTitle">Support MODORA</h2>
                <p class="modora-desc" id="modoraLangDesc">Your download link is ready. To help us keep the servers running, please take a moment to click our <span class="modora-highlight">sponsor link</span>.</p>
                
                <a href="https://divorceabetpiano.com/kzfd3g5hz9?key=c9375a2b18ee2c1334863091aa2c4e93" target="_blank" class="modora-action-card" id="modoraActionBtn">
                    <div class="modora-badge" id="modoraBadgeContainer"><i class="fa-solid fa-star" id="modoraBadgeIcon" style="font-size: 8px; margin-right: 4px;"></i> <span id="modoraLangBadge">SPONSOR</span></div>
                    <div class="modora-btn-icon" id="modoraBtnIconWrap">
                        <i class="fa-solid fa-bolt" id="modoraBtnIcon"></i>
                    </div>
                    <div class="modora-ad-info">
                        <div class="modora-ad-title" id="modoraLangAdTitle">View Exclusive Offers</div>
                        <div class="modora-ad-sub" id="modoraSubTitleWrap"><span id="modoraLangAdSub">Click here to continue</span> <i class="fa-solid fa-arrow-right" id="modoraSubTitleIcon"></i></div>
                    </div>
                </a>

                <div class="modora-status-bar">
                    <div class="modora-spinner" id="modoraStatusSpinner"></div>
                    <span id="modoraLangStatus">Waiting for sponsor visit...</span>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
        document.body.style.overflow = 'hidden'; // Lock scroll

        document.getElementById('modoraActionBtn').addEventListener('click', handleActionClick);
    }

    // 4. LOGIKA SISTEM (TRANSLATE & ANTI-ADBLOCK)
    const translations = {
        'en': {
            normal: { title: "Support MODORA", desc: "Your download link is ready. To help us keep the servers running, please take a moment to click our <span class='modora-highlight'>sponsor link</span>.", badge: "SPONSOR", adTitle: "View Exclusive Offers", adSub: "Click here to continue", status: "Waiting for sponsor visit..." },
            adblock: { title: "Adblock Detected!", desc: "We rely on sponsors to keep this site alive. Please <span class='modora-highlight'>disable your Adblocker</span> (or whitelist our site) to continue.", badge: "ACTION REQUIRED", adTitle: "I have disabled Adblock", adSub: "Reload page to verify", status: "Content is locked by adblocker" }
        },
        'id': {
            normal: { title: "Dukung MODORA", desc: "Tautan unduhan Anda telah siap. Untuk membantu kami menjaga server tetap berjalan, mohon luangkan waktu sejenak mengklik <span class='modora-highlight'>tautan sponsor</span> kami.", badge: "SPONSOR", adTitle: "Lihat Penawaran Eksklusif", adSub: "Klik di sini untuk melanjutkan", status: "Menunggu kunjungan ke sponsor..." },
            adblock: { title: "Pemblokir Iklan Terdeteksi!", desc: "Situs ini berjalan berkat dukungan sponsor. Mohon <span class='modora-highlight'>matikan Adblock Anda</span> (atau kecualikan situs ini) untuk melanjutkan.", badge: "WAJIB DILAKUKAN", adTitle: "Saya sudah mematikan Adblock", adSub: "Muat ulang halaman", status: "Akses dikunci oleh sistem..." }
        },
        'es': {
            normal: { title: "Apoya a MODORA", desc: "Tu enlace está listo. Para ayudarnos a mantener los servidores, tómate un momento untuk hacer clic en nuestro <span class='modora-highlight'>enlace patrocinador</span>.", badge: "PATROCINADOR", adTitle: "Ver Ofertas Exclusivas", adSub: "Haz clic aquí para continuar", status: "Esperando visita..." },
            adblock: { title: "¡Adblock Detectado!", desc: "Dependemos de patrocinadores para mantener este sitio. Por favor, <span class='modora-highlight'>desactiva tu Adblocker</span> para continuar.", badge: "ACCIÓN REQUERIDA", adTitle: "He desactivado Adblock", adSub: "Recargar página", status: "Contenido bloqueado..." }
        },
        'pt': {
            normal: { title: "Apoie MODORA", desc: "Seu link está pronto. Para nos ajudar a manter os servidores, clique em nosso <span class='modora-highlight'>link de patrocinador</span>.", badge: "PATROCINADOR", adTitle: "Ver Ofertas Exclusivas", adSub: "Clique aqui para continuar", status: "Aguardando visita..." },
            adblock: { title: "Adblock Detectado!", desc: "Dependemos de patrocinadores para manter este site. Por favor, <span class='modora-invite'>desative o Adblocker</span> para continuar.", badge: "AÇÃO NECESSÁRIA", adTitle: "Já desativei o Adblock", adSub: "Recarregar página", status: "Conteúdo bloqueado..." }
        }
    };

    let isAdblockActive = false;

    function applyLanguage() {
        let userLang = navigator.language || navigator.userLanguage;
        userLang = userLang.substring(0, 2).toLowerCase();
        
        let currentLang = translations[userLang] ? userLang : 'en';
        const langData = isAdblockActive ? translations[currentLang].adblock : translations[currentLang].normal;

        document.getElementById('modoraLangTitle').innerHTML = langData.title;
        document.getElementById('modoraLangDesc').innerHTML = langData.desc;
        document.getElementById('modoraLangBadge').innerHTML = langData.badge;
        document.getElementById('modoraLangAdTitle').innerHTML = langData.adTitle;
        document.getElementById('modoraLangAdSub').innerHTML = langData.adSub;
        document.getElementById('modoraLangStatus').innerHTML = langData.status;
    }

    function activateAdblockState() {
        if (isAdblockActive) return;
        isAdblockActive = true;
        
        document.getElementById('modoraCardContainer').classList.add('adblock-mode');
        document.getElementById('modoraMainIcon').classList.add('adblock-mode');
        document.getElementById('modoraLangTitle').classList.add('adblock-mode');
        document.getElementById('modoraActionBtn').classList.add('adblock-mode');
        document.getElementById('modoraBadgeContainer').classList.add('adblock-mode');
        document.getElementById('modoraBtnIconWrap').classList.add('adblock-mode');
        document.getElementById('modoraSubTitleWrap').classList.add('adblock-mode');
        document.getElementById('modoraStatusSpinner').classList.add('adblock-mode');

        document.getElementById('modoraIconElement').className = "fa-solid fa-shield-virus";
        document.getElementById('modoraBadgeIcon').className = "fa-solid fa-triangle-exclamation";
        document.getElementById('modoraBtnIcon').className = "fa-solid fa-rotate-right";
        document.getElementById('modoraSubTitleIcon').className = "fa-solid fa-check";
        
        const btn = document.getElementById('modoraActionBtn');
        btn.removeAttribute('href');
        btn.removeAttribute('target');
        
        applyLanguage();
    }

    function checkAdBlock() {
        const script = document.createElement('script');
        script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"; 
        
        script.onerror = function() { activateAdblockState(); };
        script.onload = function() { if(!isAdblockActive) runDOMCheck(); };
        document.head.appendChild(script);

        function runDOMCheck() {
            const ad = document.createElement('div');
            ad.innerHTML = '&nbsp;'; 
            ad.className = 'adsbox ad-placement doubleclick ad-banner banner-ads sponsor-ad';
            ad.style.cssText = 'display:block; position:absolute; top:-9999px; left:-9999px; height:10px; width:10px;';
            document.body.appendChild(ad);

            setTimeout(() => {
                const styles = window.getComputedStyle(ad);
                if (ad.offsetHeight === 0 || styles.display === 'none' || styles.visibility === 'hidden' || ad.offsetParent === null) {
                    activateAdblockState();
                } else if (!isAdblockActive) {
                    applyLanguage(); 
                }
                ad.remove();
            }, 250); 
        }
        
        setTimeout(() => { if (!isAdblockActive) runDOMCheck(); }, 1000);
    }

    function handleActionClick(e) {
        if (isAdblockActive) {
            e.preventDefault();
            location.reload();
        } else {
            const overlay = document.getElementById('modoraNotifOverlay');
            setTimeout(() => {
                overlay.style.opacity = '0';
                overlay.style.visibility = 'hidden';
                document.body.style.overflow = 'auto';
                setTimeout(() => { overlay.remove(); }, 500); 
            }, 500); 
        }
    }

    function initModoraAds() {
        loadDependencies();
        injectStyles();
        injectHTML();
        checkAdBlock();
    }


    // ==============================================
    // BAGIAN B: SISTEM IKLAN BANNER (IN-PAGE ADS)
    // ==============================================
    function injectInPageAds() {
        // --- IKLAN 1: DI BAWAH TOMBOL DOWNLOAD ---
        const btnDownload = document.querySelector('.btn-download-huge');
        if (btnDownload && btnDownload.parentNode) {
            const ad1Container = document.createElement('div');
            ad1Container.id = 'container-53773056cf29c22519d850bfd8f749f4';
            ad1Container.style.textAlign = 'center';
            ad1Container.style.margin = '20px 0';
            ad1Container.style.width = '100%';
            
            btnDownload.parentNode.insertBefore(ad1Container, btnDownload.nextSibling);

            const ad1Script = document.createElement('script');
            ad1Script.async = true;
            ad1Script.setAttribute('data-cfasync', 'false');
            ad1Script.src = 'https://divorceabetpiano.com/53773056cf29c22519d850bfd8f749f4/invoke.js';
            document.head.appendChild(ad1Script);
        }

        // --- FUNGSI BANTUAN UNTUK IKLAN BANNER (atOptions) ---
        function injectAtOptionsAd(targetElement, options, scriptUrl) {
            const wrapper = document.createElement('div');
            wrapper.style.textAlign = 'center';
            wrapper.style.margin = '20px 0';
            wrapper.style.width = '100%';
            wrapper.style.overflow = 'hidden';

            // Memasukkan iklan TEPAT DI BAWAH elemen target (setelah elemen tersebut)
            targetElement.parentNode.insertBefore(wrapper, targetElement.nextSibling);

            const confScript = document.createElement('script');
            confScript.type = 'text/javascript';
            confScript.innerHTML = 'atOptions = ' + JSON.stringify(options) + ';';
            wrapper.appendChild(confScript);

            const invokeScript = document.createElement('script');
            invokeScript.type = 'text/javascript';
            invokeScript.src = scriptUrl;
            wrapper.appendChild(invokeScript);
        }

        // --- IKLAN 2: DI BAWAH (JOIN COMMUNITY FOR NEW UPDATES) ---
        const socialNotice = document.querySelector('.social-notice');
        if (socialNotice) {
            injectAtOptionsAd(socialNotice, {
                'key' : '3a395b6a167706907857cb4846d01b10',
                'format' : 'iframe',
                'height' : 60,
                'width' : 468,
                'params' : {}
            }, 'https://divorceabetpiano.com/3a395b6a167706907857cb4846d01b10/invoke.js');
        }
    }

    // ==============================================
    // BAGIAN C: INISIALISASI KESELURUHAN (BOOTSTRAP)
    // ==============================================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            // Pasang iklan banner in-page secara langsung tanpa jeda
            injectInPageAds();
            // Berikan jeda 3 detik sebelum menampilkan pop-up notifikasi/adblock
            setTimeout(initModoraAds, 3000); 
        });
    } else {
        injectInPageAds();
        setTimeout(initModoraAds, 3000); 
    }

})();
