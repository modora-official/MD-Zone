// ==========================================
// MODORA ADS & DYNAMIC COMPONENTS SYSTEM
// ==========================================

function renderModoraAd(adId) {
    switch(adId) {
        case 1:
            // --- Iklan 1 - Script Head ---
            document.write('<script src="https://divorceabetpiano.com/67/b1/9b/67b19bcda13dcfd3eea3c1a2a8f3920a.js"></script>');
            break;
            
        case 7:
            // --- Iklan 7 - Script Body ---
            document.write('<script src="https://divorceabetpiano.com/45/ec/72/45ec7202b42e61ef7004f766c7305b5f.js"></script>');
            break;
    }
}

// ==========================================
// DYNAMIC INJECTION: TUTORIALS DOWNLOAD
// ==========================================
function injectTutorialSection() {
    // Cek agar tidak ter-inject dua kali
    if (document.getElementById('modora-tutorial-section')) return;
    
    // Cari elemen tombol download terakhir untuk patokan penempatan
    const dlWrappers = document.querySelectorAll('div[id^="dl-wrap-"]');
    let targetElement = null;
    
    if (dlWrappers.length > 0) {
        targetElement = dlWrappers[dlWrappers.length - 1];
    } else {
        targetElement = document.getElementById('download-section');
    }
    
    if (targetElement) {
        const tutorialDiv = document.createElement('div');
        tutorialDiv.id = "modora-tutorial-section";
        tutorialDiv.innerHTML = `
            <div class="section-title" style="margin-top: 35px; margin-bottom: 15px; font-weight: bold;">
                <i class="fa-solid fa-circle-play"></i> TUTORIALS DOWNLOAD
            </div>
            
            <!-- Tambahan z-index: 99 biar bisa diklik nembus iklan, tapi tetep ngetrigger iklannya -->
            <div id="tutorial-video-container" style="position: relative; width: 100%; aspect-ratio: 16/9; border-radius: 16px; overflow: hidden; border: 1px solid var(--card-border, #334155); box-shadow: 0 10px 30px rgba(0,0,0,0.5); background: #000; cursor: pointer; margin-bottom: 25px; z-index: 99; -webkit-tap-highlight-color: transparent; outline: none;">
                
                <!-- Thumbnail Cover -->
                <img id="tutorial-thumb" src="https://modorazone.com/thumb.png" alt="Tutorial Thumbnail" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; z-index: 1;">
                
                <!-- Play Button Overlay -->
                <div id="tutorial-overlay" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 2; transition: background 0.3s ease;">
                    <i class="fa-solid fa-play" style="font-size: 65px; color: white; filter: drop-shadow(0 4px 10px rgba(0,0,0,0.8)); transition: transform 0.2s ease;"></i>
                </div>
            </div>
        `;
        
        // Letakkan tepat di bawah target elemen
        targetElement.parentNode.insertBefore(tutorialDiv, targetElement.nextSibling);

        const container = document.getElementById('tutorial-video-container');
        const overlay = document.getElementById('tutorial-overlay');

        // FUNGSI KLIK: Langsung arahkan (redirect/navigate) ke link tujuan
        container.addEventListener('click', function() {
            window.location.href = "../../../../../tutorials";
        });
        
        // Efek hover untuk ikon play (biar terasa interaktif di PC)
        container.addEventListener('mouseenter', () => {
            const playIcon = overlay.querySelector('i');
            if(playIcon) playIcon.style.transform = 'scale(1.1)';
        });
        container.addEventListener('mouseleave', () => {
            const playIcon = overlay.querySelector('i');
            if(playIcon) playIcon.style.transform = 'scale(1)';
        });
    }
}

// ==========================================
// AUTO INITIALIZER
// ==========================================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectTutorialSection);
} else {
    injectTutorialSection();
}
// Fallback: Dieksekusi otomatis setelah web sepenuhnya di-load
setTimeout(injectTutorialSection, 800);
