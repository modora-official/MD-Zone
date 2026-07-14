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
document.addEventListener("DOMContentLoaded", function() {
    // Cari tombol download terakhir untuk menempatkan Tutorial di bawahnya
    const dlWrappers = document.querySelectorAll('div[id^="dl-wrap-"]');
    
    if (dlWrappers.length > 0) {
        const lastDlWrapper = dlWrappers[dlWrappers.length - 1];
        
        // Bikin container baru buat Video Tutorial
        const tutorialSection = document.createElement('div');
        tutorialSection.id = "modora-tutorial-section";
        tutorialSection.innerHTML = `
            <div class="section-title" style="margin-top: 30px;">
                <i class="fa-solid fa-circle-play"></i> TUTORIALS DOWNLOAD
            </div>
            
            <!-- Perhatikan: z-index 2147483647 (maksimal) untuk menembus invisible overlay iklan -->
            <div id="tutorial-video-box" style="position: relative; width: 100%; max-width: 100%; margin: 0 auto 25px; aspect-ratio: 16/9; border-radius: 16px; overflow: hidden; border: 2px solid var(--card-border, #334155); box-shadow: var(--shadow, 0 10px 30px rgba(0,0,0,0.5)); background: var(--bg-card, #1e293b); cursor: pointer; z-index: 2147483647 !important;">
                
                <!-- Thumbnail -->
                <img src="thumb.jpg" alt="Tutorial Thumbnail" style="width: 100%; height: 100%; object-fit: cover; display: block; pointer-events: none;">
                
                <!-- Play Button Overlay -->
                <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; pointer-events: none;">
                    <i class="fa-solid fa-play" style="font-size: 55px; color: white; filter: drop-shadow(0 4px 10px rgba(0,0,0,0.8));"></i>
                </div>
                
                <!-- Video Element (Hidden initially) -->
                <video id="modora-vid-player" src="https://modorazone.com/tutorial.mp4" preload="none" playsinline style="display:none; width: 100%; height: 100%;"></video>
            </div>
        `;
        
        // Injeksi ke HTML tepat di bawah area tombol download
        lastDlWrapper.parentNode.insertBefore(tutorialSection, lastDlWrapper.nextSibling);

        const videoBox = document.getElementById('tutorial-video-box');
        const videoPlayer = document.getElementById('modora-vid-player');

        // --- SISTEM ANTI POP-UNDER LEVEL 2 (CAPTURING PHASE) ---
        // Kita cegat event dari paling luar (window) sebelum script iklan sempat merespon.
        // Parameter 'true' di akhir membuat listener ini berjalan di "Capture Phase", bukan "Bubble Phase".
        ['mousedown', 'mouseup', 'click', 'touchstart', 'touchend'].forEach(evt => {
            window.addEventListener(evt, function(e) {
                // Cek apakah target klik ada di dalam kotak video kita
                if (videoBox && (e.target === videoBox || videoBox.contains(e.target))) {
                    e.stopPropagation(); // Stop iklan baca klik
                }
            }, true); 
        });

        // FUNGSI PLAY & FULLSCREEN
        videoBox.addEventListener('click', (e) => {
            e.preventDefault(); 
            
            // Tampilkan tag video
            videoPlayer.style.display = 'block'; 
            
            // Request Fullscreen otomatis (Support semua jenis browser)
            if (videoPlayer.requestFullscreen) {
                videoPlayer.requestFullscreen();
            } else if (videoPlayer.webkitRequestFullscreen) {
                videoPlayer.webkitRequestFullscreen(); // Safari / iOS
            } else if (videoPlayer.msRequestFullscreen) {
                videoPlayer.msRequestFullscreen(); // IE / Edge lama
            }
            
            // Langsung Mainkan Video
            videoPlayer.play();
        });

        // FUNGSI EXIT FULLSCREEN: Kalo user keluar dari mode fullscreen, otomatis pause & sembunyi
        const handleFullscreenExit = () => {
            const isFullscreen = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
            
            if (!isFullscreen) {
                videoPlayer.pause();
                videoPlayer.style.display = 'none'; // Sembunyikan video biar thumbnail balik
            }
        };

        document.addEventListener('fullscreenchange', handleFullscreenExit);
        document.addEventListener('webkitfullscreenchange', handleFullscreenExit);
        document.addEventListener('mozfullscreenchange', handleFullscreenExit);
        document.addEventListener('MSFullscreenChange', handleFullscreenExit);
    }
});
