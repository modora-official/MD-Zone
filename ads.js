// <script src="../../../ads.js"></script>
// File: ads.js
// File: ada.js

document.addEventListener("DOMContentLoaded", function() {
    // 1. Menyisipkan CSS untuk pop-up modal
    const style = document.createElement('style');
    style.innerHTML = `
        .ad-modal-overlay {
            position: fixed; 
            top: 0; 
            left: 0; 
            width: 100%; 
            height: 100%;
            background: rgba(0, 0, 0, 0.85); 
            backdrop-filter: blur(4px); 
            display: flex; 
            justify-content: center; 
            align-items: center;
            z-index: 99999;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            opacity: 0;
            transition: opacity 0.3s ease-in-out;
        }
        .ad-modal-content {
            background: #1c1c1e; 
            color: #ffffff;
            padding: 30px 20px;
            border-radius: 14px;
            text-align: center;
            max-width: 350px;
            width: 90%;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            transform: scale(0.95);
            transition: transform 0.3s ease-in-out;
        }
        .ad-modal-overlay.show {
            opacity: 1;
        }
        .ad-modal-overlay.show .ad-modal-content {
            transform: scale(1);
        }
        .ad-modal-content h3 {
            margin-top: 0;
            font-size: 18px;
            font-weight: 600;
            color: #f2f2f7;
        }
        .ad-modal-content p {
            font-size: 14px;
            color: #aeaeb2;
            margin-bottom: 25px;
            line-height: 1.5;
        }
        .ad-modal-content a.ad-link {
            display: block;
            background: #0a84ff; 
            color: #fff;
            text-decoration: none;
            font-size: 16px;
            font-weight: 600;
            padding: 12px;
            border-radius: 8px;
            margin-bottom: 15px;
            transition: background 0.2s;
        }
        .ad-modal-content a.ad-link:hover {
            background: #0070e6;
        }
        
        /* State Tombol: Terkunci */
        .ad-modal-content button.close-btn {
            background: transparent;
            color: #48484a; /* Warna redup tanda tidak aktif */
            border: none;
            font-size: 14px;
            font-weight: 500;
            padding: 10px;
            width: 100%;
            cursor: not-allowed; /* Kursor silang/dilarang */
            pointer-events: none; /* Mencegah klik sama sekali */
            transition: color 0.3s;
        }
        
        /* State Tombol: Terbuka (Setelah klik iklan) */
        .ad-modal-content button.close-btn.unlocked {
            color: #8e8e93;
            cursor: pointer;
            pointer-events: auto; /* Mengizinkan klik */
        }
        .ad-modal-content button.close-btn.unlocked:hover {
            color: #ffffff;
        }
    `;
    document.head.appendChild(style);

    // 2. Membuat elemen HTML untuk modal
    const modal = document.createElement('div');
    modal.className = 'ad-modal-overlay';
    modal.innerHTML = `
        <div class="ad-modal-content">
            <h3>Pesan Sponsor</h3>
            <p>Dukung kami dengan mengunjungi tautan sponsor di bawah ini untuk membuka akses halaman download Anda.</p>
            
            <a href="https://omg10.com/4/10842740" target="_blank" class="ad-link" id="sponsor-link">Buka Tautan Sponsor</a>
            
            <button id="close-ad-btn" class="close-btn">
                &#128274; Klik tombol biru di atas terlebih dahulu
            </button>
        </div>
    `;
    document.body.appendChild(modal);

    // 3. Efek animasi muncul
    setTimeout(() => {
        modal.classList.add('show');
    }, 100);

    const closeBtn = document.getElementById('close-ad-btn');
    const sponsorLink = document.getElementById('sponsor-link');
    let isUnlocked = false;

    // 4. Logika Wajib Klik (Reward System)
    sponsorLink.addEventListener('click', function() {
        if (!isUnlocked) {
            isUnlocked = true;
            
            // Ubah tampilan tombol menjadi aktif (Terbuka)
            closeBtn.classList.add('unlocked');
            closeBtn.innerHTML = 'Lanjutkan ke Download &rarr;';
            
            // Tambahkan fungsi untuk menutup modal dan melanjutkan
            closeBtn.addEventListener('click', closeModal);
        }
    });

    function closeModal() {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300); 
    }
});
