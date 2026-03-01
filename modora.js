document.addEventListener("DOMContentLoaded", function() {
    // 1. Cek Local Storage: Hentikan script jika user sudah pernah menutup pop-up
    if (localStorage.getItem('telegramPopupTutup') === 'true') {
        return; 
    }

    // 2. Data Bahasa
    const langData = {
        en: {
            title: "Join the Community",
            text: "Get the latest updates, request content, and discuss with others in our Telegram group!",
            btnLater: "Later",
            btnJoin: "Join Now"
        },
        id: {
            title: "Join Komunitas",
            text: "Dapatkan info update terbaru, request konten, dan diskusi bareng yang lain di grup Telegram!",
            btnLater: "Nanti",
            btnJoin: "Gabung"
        }
    };

    // Set bahasa default saat pertama kali muncul (bisa diubah ke 'en' kalau mau)
    let currentLang = 'id';

    // 3. Inject CSS bergaya iOS Dark Mode + Styling untuk Tab Bahasa
    const style = document.createElement('style');
    style.innerHTML = `
        .ios-popup-overlay {
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 99999;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s ease;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }
        .ios-popup-overlay.show {
            opacity: 1;
            visibility: visible;
        }
        .ios-popup-box {
            position: relative;
            background: rgba(30, 30, 30, 0.85);
            backdrop-filter: blur(25px);
            -webkit-backdrop-filter: blur(25px);
            width: 280px;
            border-radius: 14px;
            text-align: center;
            color: white;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            transform: scale(1.1);
            transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .ios-popup-overlay.show .ios-popup-box {
            transform: scale(1);
        }
        
        /* --- CSS Tab Bahasa --- */
        .ios-lang-toggle {
            position: absolute;
            top: 12px;
            right: 12px;
            display: flex;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 6px;
            padding: 2px;
        }
        .ios-lang-btn {
            background: transparent;
            border: none;
            color: rgba(255, 255, 255, 0.5);
            font-size: 10px;
            font-weight: 600;
            padding: 4px 8px;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        .ios-lang-btn.active {
            background: rgba(255, 255, 255, 0.25);
            color: white;
            box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        }
        /* ----------------------- */

        .ios-popup-content {
            padding: 28px 16px 18px; /* Padding atas ditambah agar tidak nabrak tab bahasa */
        }
        .ios-popup-icon {
            width: 45px;
            height: 45px;
            margin: 0 auto 12px;
            display: block;
        }
        .ios-popup-title {
            margin: 0 0 6px;
            font-size: 18px;
            font-weight: 600;
            letter-spacing: -0.3px;
        }
        .ios-popup-text {
            margin: 0;
            font-size: 14px;
            line-height: 1.35;
            color: rgba(255, 255, 255, 0.8);
        }
        .ios-popup-buttons {
            display: flex;
            border-top: 0.5px solid rgba(255, 255, 255, 0.15);
        }
        .ios-popup-btn {
            flex: 1;
            background: transparent;
            border: none;
            padding: 14px;
            font-size: 16px;
            color: #0A84FF;
            cursor: pointer;
            font-family: inherit;
            transition: background 0.2s;
        }
        .ios-popup-btn:active {
            background: rgba(255, 255, 255, 0.1);
        }
        .ios-popup-btn.bold {
            font-weight: 600;
        }
        .ios-popup-btn + .ios-popup-btn {
            border-left: 0.5px solid rgba(255, 255, 255, 0.15);
        }
    `;
    document.head.appendChild(style);

    // 4. Inject HTML
    const overlay = document.createElement('div');
    overlay.className = 'ios-popup-overlay';
    overlay.id = 'iosPopupTg';

    overlay.innerHTML = `
        <div class="ios-popup-box">
            <div class="ios-lang-toggle">
                <button class="ios-lang-btn active" id="btnLangId">ID</button>
                <button class="ios-lang-btn" id="btnLangEn">EN</button>
            </div>

            <div class="ios-popup-content">
                <svg class="ios-popup-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.665 3.665c-.733-.314-1.518-.342-2.316-.062L3.922 8.682c-1.472.482-1.524 1.385-.246 1.832l4.026 1.385 1.574 5.253c.184.608.62.775 1.137.288l2.646-2.54 4.545 3.324c.833.456 1.433.222 1.637-.775l2.94-13.804c.307-1.228-.43-1.802-1.516-1.34v.001h-.001z" fill="#0A84FF"/>
                    <path d="M9.522 11.9l6.98-6.17c.34-.306-.073-.473-.526-.17l-8.62 5.48-1.528 5.11 3.694-4.25z" fill="#0066CC"/>
                </svg>
                <h3 class="ios-popup-title" id="textTitle">${langData[currentLang].title}</h3>
                <p class="ios-popup-text" id="textDesc">${langData[currentLang].text}</p>
            </div>
            <div class="ios-popup-buttons">
                <button class="ios-popup-btn" id="iosPopupTolak">${langData[currentLang].btnLater}</button>
                <button class="ios-popup-btn bold" id="iosPopupGabung">${langData[currentLang].btnJoin}</button>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);

    // 5. Deklarasi Elemen
    const popup = document.getElementById('iosPopupTg');
    const btnTolak = document.getElementById('iosPopupTolak');
    const btnGabung = document.getElementById('iosPopupGabung');
    
    // Elemen Teks
    const textTitle = document.getElementById('textTitle');
    const textDesc = document.getElementById('textDesc');
    
    // Elemen Tab Bahasa
    const btnLangId = document.getElementById('btnLangId');
    const btnLangEn = document.getElementById('btnLangEn');

    // 6. Fungsi Ubah Bahasa Secara Real-time
    function ubahBahasa(lang) {
        currentLang = lang;
        
        // Update Teks
        textTitle.innerText = langData[lang].title;
        textDesc.innerText = langData[lang].text;
        btnTolak.innerText = langData[lang].btnLater;
        btnGabung.innerText = langData[lang].btnJoin;

        // Update warna tab aktif
        if(lang === 'id') {
            btnLangId.classList.add('active');
            btnLangEn.classList.remove('active');
        } else {
            btnLangEn.classList.add('active');
            btnLangId.classList.remove('active');
        }
    }

    // Event Listener Tab Bahasa
    btnLangId.addEventListener('click', () => ubahBahasa('id'));
    btnLangEn.addEventListener('click', () => ubahBahasa('en'));

    // 7. Logika Tombol Tutup & Gabung
    function tutupPopup() {
        popup.classList.remove('show');
        localStorage.setItem('telegramPopupTutup', 'true'); // Set Anti-Spam
        
        setTimeout(() => {
            if (popup.parentNode) {
                popup.parentNode.removeChild(popup);
            }
        }, 300);
    }

    btnTolak.addEventListener('click', tutupPopup);
    btnGabung.addEventListener('click', () => {
        window.open('https://t.me/+-Qk8fHCOPVRlNGE9', '_blank');
        tutupPopup();
    });

    // 8. Munculkan popup dengan delay 1.5 detik
    setTimeout(() => {
        popup.classList.add('show');
    }, 1500);
});
