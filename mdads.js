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
            <div class="section-title" style="margin-top: 35px; margin-bottom: 15px;">
                <i class="fa-solid fa-circle-play"></i> TUTORIALS DOWNLOAD
            </div>
            
            <!-- Tambahan z-index: 99 biar bisa diklik nembus iklan, tapi tetep ngetrigger iklannya -->
            <div id="tutorial-video-container" style="position: relative; width: 100%; aspect-ratio: 16/9; border-radius: 16px; overflow: hidden; border: 1px solid var(--card-border, #334155); box-shadow: 0 10px 30px rgba(0,0,0,0.5); background: #000; cursor: pointer; margin-bottom: 25px; z-index: 99;">
                
                <!-- Thumbnail Cover (Link Absolut) -->
                <img id="tutorial-thumb" src="https://modorazone.com/thumb.png" alt="Tutorial Thumbnail" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; z-index: 1;">
                
                <!-- Play Button Overlay -->
                <div id="tutorial-overlay" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 2;">
                    <i class="fa-solid fa-play" style="font-size: 65px; color: white; filter: drop-shadow(0 4px 10px rgba(0,0,0,0.8));"></i>
                </div>
                
                <!-- HTML5 Native Video -->
                <video id="tutorial-vid" src="https://github.com/modora-official/modora/raw/refs/heads/main/tutorials.mp4" playsinline controls style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 3; display: none;"></video>
            </div>
        `;
        
        // Letakkan tepat di bawah target elemen
        targetElement.parentNode.insertBefore(tutorialDiv, targetElement.nextSibling);

        const container = document.getElementById('tutorial-video-container');
        const video = document.getElementById('tutorial-vid');
        const thumb = document.getElementById('tutorial-thumb');
        const overlay = document.getElementById('tutorial-overlay');

        // Fungsi klik: Hilangkan cover, jalankan video, dan paksa Full Screen
        container.addEventListener('click', function() {
            // Sembunyikan cover & ikon play
            thumb.style.display = 'none';
            overlay.style.display = 'none';
            
            // Tampilkan native player
            video.style.display = 'block';
            
            // Putar Video dengan penanganan error biar browser nggak nge-block
            let playPromise = video.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.log("Auto-play ditahan browser. User harus tap tombol play manual.", error);
                });
            }
            
            // Eksekusi Full Screen (Disesuaikan untuk berbagai browser HP/Desktop)
            if (video.requestFullscreen) {
                video.requestFullscreen();
            } else if (video.webkitEnterFullscreen) {
                video.webkitEnterFullscreen(); // Khusus iPhone/iOS Safari
            } else if (video.webkitRequestFullscreen) {
                video.webkitRequestFullscreen(); // Standar browser webkit lama
            } else if (video.msRequestFullscreen) {
                video.msRequestFullscreen(); // Edge lama
            }
        });

        // Event saat user keluar dari mode Full Screen
        const exitFullscreenHandler = () => {
            const isFullScreen = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement;
            
            // Kalau layarnya udah nggak full screen, kembalikan posisi seperti semula
            if (!isFullScreen && !video.webkitDisplayingFullscreen) {
                video.pause();
                video.style.display = 'none';
                thumb.style.display = 'block';
                overlay.style.display = 'flex';
            }
        };

        // Pasang sensor untuk mendeteksi kapan user keluar dari layar penuh
        document.addEventListener('fullscreenchange', exitFullscreenHandler);
        document.addEventListener('webkitfullscreenchange', exitFullscreenHandler);
        
        // Khusus sensor layar penuh milik iOS
        video.addEventListener('webkitendfullscreen', function() {
            video.pause();
            video.style.display = 'none';
            thumb.style.display = 'block';
            overlay.style.display = 'flex';
        });
    }
}

// ==========================================
// AUTO INITIALIZER
// ==========================================
// Kita pakai 3 lapis perlindungan untuk memastikan fitur ini selalu muncul
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectTutorialSection);
} else {
    injectTutorialSection();
}
// Fallback: Dieksekusi otomatis setelah web sepenuhnya di-load
setTimeout(injectTutorialSection, 800);
