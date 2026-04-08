document.addEventListener("DOMContentLoaded", function() {

    // ==========================================
    // IKLAN 1: DI BAWAH TOMBOL DOWNLOAD
    // ==========================================
    const btnDownload = document.querySelector('.btn-download-huge');
    if (btnDownload && btnDownload.parentNode) {
        // Buat wadah iklan
        const ad1Container = document.createElement('div');
        ad1Container.id = 'container-53773056cf29c22519d850bfd8f749f4';
        ad1Container.style.textAlign = 'center';
        ad1Container.style.margin = '20px 0';
        ad1Container.style.width = '100%';
        
        // Sisipkan wadah setelah tombol download
        btnDownload.parentNode.insertBefore(ad1Container, btnDownload.nextSibling);

        // Panggil script iklan Adsterra/Network
        const ad1Script = document.createElement('script');
        ad1Script.async = true;
        ad1Script.setAttribute('data-cfasync', 'false');
        ad1Script.src = 'https://divorceabetpiano.com/53773056cf29c22519d850bfd8f749f4/invoke.js';
        document.head.appendChild(ad1Script);
    }

    // ==========================================
    // FUNGSI INJEKSI IKLAN BANNER (atOptions)
    // ==========================================
    function injectAtOptionsAd(targetElement, options, scriptUrl) {
        // Buat bungkus agar iklan berada di tengah
        const wrapper = document.createElement('div');
        wrapper.style.textAlign = 'center';
        wrapper.style.margin = '20px 0';
        wrapper.style.width = '100%';
        wrapper.style.overflow = 'hidden';

        // Sisipkan wadah TEPAT DI ATAS elemen target yang ditentukan
        targetElement.parentNode.insertBefore(wrapper, targetElement);

        // Masukkan konfigurasi opsi iklan
        const confScript = document.createElement('script');
        confScript.type = 'text/javascript';
        confScript.innerHTML = 'atOptions = ' + JSON.stringify(options) + ';';
        wrapper.appendChild(confScript);

        // Panggil script iframe iklan
        const invokeScript = document.createElement('script');
        invokeScript.type = 'text/javascript';
        invokeScript.src = scriptUrl;
        wrapper.appendChild(invokeScript);
    }

    // ==========================================
    // IKLAN 2: DI ATAS PREVIEW GAMEPLAY
    // ==========================================
    const sectionHeads = document.querySelectorAll('.section-head');
    
    sectionHeads.forEach(head => {
        const titleText = head.textContent.toLowerCase();
        
        // Cari elemen judul yang mengandung teks "gameplay"
        if (titleText.includes('gameplay')) {
            // Gunakan script ukuran 468x60 (banner memanjang)
            injectAtOptionsAd(head, {
                'key' : '3a395b6a167706907857cb4846d01b10',
                'format' : 'iframe',
                'height' : 60,
                'width' : 468,
                'params' : {}
            }, 'https://divorceabetpiano.com/3a395b6a167706907857cb4846d01b10/invoke.js');
        }
    });

});
