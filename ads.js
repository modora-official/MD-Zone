// <script src="../../../ada.js"></script>
// File: ada.js

document.addEventListener("DOMContentLoaded", function() {
    // 1. Menyisipkan CSS untuk pop-up modal (Dark Mode & Clean UI)
    const style = document.createElement('style');
    style.innerHTML = `
        .ad-modal-overlay {
            position: fixed; 
            top: 0; 
            left: 0; 
            width: 100%; 
            height: 100%;
            background: rgba(0, 0, 0, 0.85); /* Latar belakang gelap transparan */
            backdrop-filter: blur(4px); /* Efek blur bergaya iOS */
            display: flex; 
            justify-content: center; 
            align-items: center;
            z-index: 99999;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            opacity: 0;
            transition: opacity 0.3s ease-in-out;
        }
        .ad-modal-content {
            background: #1c1c1e; /* Warna surface dark mode */
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
            background: #0a84ff; /* Aksen biru modern */
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
        .ad-modal-content button.close-btn {
            background: transparent;
            color: #8e8e93;
            border: none;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            padding: 10px;
            width: 100%;
            transition: color 0.2s;
        }
        .ad-modal-content button.close-btn:hover {
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
            <p>Dukung kami dengan mengunjungi tautan sponsor di bawah ini sebelum melanjutkan ke halaman download Anda.</p>
            
            <a href="https://omg10.com/4/10842740" target="_blank" class="ad-link" id="sponsor-link">Buka Tautan Sponsor</a>
            
            <button id="close-ad-btn" class="close-btn">Lanjutkan ke Download &rarr;</button>
        </div>
    `;
    document.body.appendChild(modal);

    // 3. Efek animasi muncul (fade-in)
    setTimeout(() => {
        modal.classList.add('show');
    }, 100);

    // 4. Logika penutupan modal
    const closeBtn = document.getElementById('close-ad-btn');
    const sponsorLink = document.getElementById('sponsor-link');

    // Opsi A: Menutup modal saat tombol 'Lanjutkan ke Download' diklik
    closeBtn.addEventListener('click', function() {
        closeModal();
    });

    // Opsi B: (Opsional) Menutup modal secara otomatis jika user mengklik iklan
    sponsorLink.addEventListener('click', function() {
        setTimeout(() => {
            closeModal();
        }, 500); // Menunggu sebentar sebelum modal hilang
    });

    function closeModal() {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300); // Menyesuaikan dengan durasi transisi CSS
    }
});
