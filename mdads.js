// ==========================================
// MODORA ADS & DYNAMIC COMPONENTS SYSTEM
// ==========================================

function renderModoraAd(adId) {
    switch(adId) {
        case 1:
            // --- Iklan 1 - Script Head ---
            document.write('<script src="https://divorceabetpiano.com/67/b1/9b/67b19bcda13dcfd3eea3c1a2a8f3920a.js"></script>');
            break;
            
        case 2:
            // --- Iklan 2 - ukuran 320x50 ---
            document.write('<script> atOptions = { "key" : "2139bb0bcc42a03b2434aed0b391acf3", "format" : "iframe", "height" : 50, "width" : 320, "params" : {} }; </script>');
            document.write('<script src="https://divorceabetpiano.com/2139bb0bcc42a03b2434aed0b391acf3/invoke.js"></script>');
            break;
            
        case 3:
            // --- Iklan 3 - ukuran 468x60 ---
            document.write('<script> atOptions = { "key" : "3a395b6a167706907857cb4846d01b10", "format" : "iframe", "height" : 60, "width" : 468, "params" : {} }; </script>');
            document.write('<script src="https://divorceabetpiano.com/3a395b6a167706907857cb4846d01b10/invoke.js"></script>');
            break;
            
        case 4:
            // --- Iklan 4 - ukuran 728x90 ---
            document.write('<script> atOptions = { "key" : "57933ea88c2fb6be24407e7918624e2d", "format" : "iframe", "height" : 90, "width" : 728, "params" : {} }; </script>');
            document.write('<script src="https://divorceabetpiano.com/57933ea88c2fb6be24407e7918624e2d/invoke.js"></script>');
            break;
            
        case 5:
            // --- Iklan 5 - Native Async ---
            document.write('<script async="async" data-cfasync="false" src="https://divorceabetpiano.com/53773056cf29c22519d850bfd8f749f4/invoke.js"></script>');
            document.write('<div id="container-53773056cf29c22519d850bfd8f749f4"></div>');
            break;
            
        case 6:
            // --- Iklan 6 - ukuran 300x250 ---
            document.write('<script> atOptions = { "key" : "a6e2777fb180c83683a51931383325df", "format" : "iframe", "height" : 250, "width" : 300, "params" : {} }; </script>');
            document.write('<script src="https://divorceabetpiano.com/a6e2777fb180c83683a51931383325df/invoke.js"></script>');
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
