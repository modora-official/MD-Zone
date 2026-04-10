(function() {
    // Pastikan script hanya berjalan sekali
    if (window.ModoraAdsInitialized) return;
    window.ModoraAdsInitialized = true;

    // ==============================================
    // BAGIAN A: DEPENDENSI & STYLING (DARK UI)
    // ==============================================
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

    function injectAdblockStyles() {
        const style = document.createElement('style');
        style.innerHTML = `
            :root {
                --bg-card: #1c1c1e; --text-main: #f2f2f7; --text-muted: #8e8e93;
                --accent-red: #ff453a; --accent-red-bg: rgba(255, 69, 58, 0.15);
                --font-main: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
            }
            .modora-ads-wrapper { font-family: var(--font-main); outline: none; -webkit-tap-highlight-color: transparent; }
            .modora-ads-wrapper * { box-sizing: border-box; }
            
            #modoraAdblockOverlay {
                position: fixed; top: 0; left: 0; right: 0; bottom: 0;
                background: rgba(0, 0, 0, 0.65); 
                backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
                display: flex; align-items: center; justify-content: center;
                padding: 20px; z-index: 999999;
                opacity: 0; animation: modoraFadeIn 0.4s forwards ease-out;
                color: var(--text-main);
            }

            .modora-premium-card {
                background: var(--bg-card); border-radius: 24px;
                width: 100%; max-width: 400px; padding: 40px 30px;
                text-align: center; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
                animation: modoraCardScale 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
            }

            @keyframes modoraFadeIn { to { opacity: 1; } }
            @keyframes modoraCardScale { 0% { transform: scale(0.9); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }

            .modora-icon-header {
                width: 64px; height: 64px; background: var(--accent-red-bg); color: var(--accent-red);
                font-size: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
                margin: 0 auto 20px auto; box-shadow: 0 8px 20px rgba(255, 69, 58, 0.2);
            }

            .modora-title { font-size: 22px; font-weight: 700; margin-bottom: 10px; color: var(--text-main); }
            .modora-desc { font-size: 15px; color: var(--text-muted); font-weight: 500; line-height: 1.5; margin-bottom: 28px; }
            .modora-highlight { color: var(--accent-red); font-weight: 600; }

            .modora-action-card {
                display: flex; align-items: center; justify-content: center; text-decoration: none;
                background: var(--accent-red); color: #fff;
                border: none; border-radius: 16px; padding: 16px; cursor: pointer;
                transition: transform 0.2s ease, background 0.2s ease;
            }
            .modora-action-card:hover { background: #ff5e55; transform: scale(1.02); }
            .modora-action-card:active { transform: scale(0.98); }
            
            .modora-btn-icon { font-size: 18px; margin-right: 12px; }
            .modora-ad-title { font-size: 16px; font-weight: 600; }
        `;
        document.head.appendChild(style);
    }

    // ==============================================
    // BAGIAN B: LOGIKA ADBLOCK & POP-UNDER
    // ==============================================
    function showAdblockWarning() {
        injectAdblockStyles();
        
        let userLang = (navigator.language || navigator.userLanguage).substring(0, 2).toLowerCase();
        const t = {
            'id': { title: "Pemblokir Iklan Aktif", desc: "Situs ini berjalan berkat dukungan iklan. Mohon <span class='modora-highlight'>matikan Adblock</span> Anda untuk melanjutkan.", btn: "Saya sudah mematikan Adblock" },
            'en': { title: "Adblock Detected", desc: "We rely on ads to keep this site alive. Please <span class='modora-highlight'>disable your Adblocker</span> to continue.", btn: "I have disabled Adblock" }
        };
        const lang = t[userLang] || t['en'];

        const overlay = document.createElement('div');
        overlay.id = 'modoraAdblockOverlay';
        overlay.className = 'modora-ads-wrapper';
        overlay.innerHTML = `
            <div class="modora-premium-card">
                <div class="modora-icon-header"><i class="fa-solid fa-shield-virus"></i></div>
                <h2 class="modora-title">${lang.title}</h2>
                <p class="modora-desc">${lang.desc}</p>
                <div class="modora-action-card" onclick="location.reload()">
                    <i class="fa-solid fa-rotate-right modora-btn-icon"></i>
                    <div class="modora-ad-title">${lang.btn}</div>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
        document.body.style.overflow = 'hidden';
    }

    function enablePopunder() {
        let isTriggered = false;
        const sponsorUrl = "https://divorceabetpiano.com/kzfd3g5hz9?key=c9375a2b18ee2c1334863091aa2c4e93";
        
        const triggerAd = function(e) {
            if (!isTriggered) {
                isTriggered = true;
                window.open(sponsorUrl, '_blank');
                // Hapus event listener setelah diklik 1 kali
                document.removeEventListener('click', triggerAd);
            }
        };
        
        // Memasang listener di seluruh dokumen (klik sembarang)
        document.addEventListener('click', triggerAd);
    }

    function checkAdBlock() {
        const script = document.createElement('script');
        script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"; 
        
        script.onerror = function() { showAdblockWarning(); };
        script.onload = function() { runDOMCheck(); };
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
                    showAdblockWarning();
                } else {
                    // Jika Adblock tidak aktif, jalankan sistem Pop-under
                    enablePopunder();
                }
                ad.remove();
            }, 250); 
        }
    }

    // ==============================================
    // BAGIAN C: SISTEM IKLAN BANNER (IN-PAGE ADS)
    // ==============================================
    function injectInPageAds() {
        // --- IKLAN 1: DI BAWAH TOMBOL DOWNLOAD ---
        const btnDownload = document.querySelector('.btn-download-huge');
        if (btnDownload && btnDownload.parentNode) {
            const ad1Container = document.createElement('div');
            ad1Container.id = 'container-53773056cf29c22519d850bfd8f749f4';
            ad1Container.style.cssText = 'text-align: center; margin: 20px 0; width: 100%;';
            
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
            wrapper.style.cssText = 'text-align: center; margin: 20px 0; width: 100%; overflow: hidden;';

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
    // BAGIAN D: MEMUAT SCRIPT EKSTERNAL (SHORT.JS)
    // ==============================================
    function injectShortScript() {
        const shortScript = document.createElement('script');
        shortScript.src = '../../../short.js';
        shortScript.type = 'text/javascript';
        document.body.appendChild(shortScript);
    }

    // ==============================================
    // BAGIAN E: INISIALISASI KESELURUHAN
    // ==============================================
    function initAll() {
        loadDependencies();
        injectInPageAds();
        injectShortScript();
        
        // Jeda sebentar sebelum memeriksa Adblock agar halaman selesai render
        setTimeout(checkAdBlock, 1500);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAll);
    } else {
        initAll();
    }

})();
