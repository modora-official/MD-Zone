document.addEventListener("DOMContentLoaded", function() {

    // ==========================================
    // IKLAN 1: DI BAWAH TOMBOL DOWNLOAD
    // (Menggunakan format Div Container)
    // ==========================================
    const btnDownload = document.querySelector('.btn-download-huge');
    if (btnDownload && btnDownload.parentNode) {
        // Membuat wadah div
        const ad1Container = document.createElement('div');
        ad1Container.id = 'container-53773056cf29c22519d850bfd8f749f4';
        ad1Container.style.textAlign = 'center';
        ad1Container.style.margin = '20px 0';
        ad1Container.style.width = '100%';
        
        // Memasukkan wadah di bawah tombol download
        btnDownload.parentNode.insertBefore(ad1Container, btnDownload.nextSibling);

        // Memanggil script iklan
        const ad1Script = document.createElement('script');
        ad1Script.async = true;
        ad1Script.setAttribute('data-cfasync', 'false');
        ad1Script.src = 'https://divorceabetpiano.com/53773056cf29c22519d850bfd8f749f4/invoke.js';
        document.head.appendChild(ad1Script);
    }


    // ==========================================
    // FUNGSI BANTUAN UNTUK IKLAN ATOPTIONS (GAMEPLAY & SCREENSHOT)
    // ==========================================
    function injectAtOptionsAd(targetElement, options, scriptUrl) {
        // Membuat wadah agar iklan rapi di tengah
        const wrapper = document.createElement('div');
        wrapper.style.textAlign = 'center';
        wrapper.style.margin = '20px 0';
        wrapper.style.width = '100%';
        wrapper.style.overflow = 'hidden';

        // Memasukkan wadah tepat DI ATAS elemen target (Gameplay/Screenshot)
        targetElement.parentNode.insertBefore(wrapper, targetElement);

        // Membuat script konfigurasi (atOptions)
        const confScript = document.createElement('script');
        confScript.type = 'text/javascript';
        confScript.innerHTML = 'atOptions = ' + JSON.stringify(options) + ';';
        wrapper.appendChild(confScript);

        // Membuat script pemanggil iframe iklan
        const invokeScript = document.createElement('script');
        invokeScript.type = 'text/javascript';
        invokeScript.src = scriptUrl;
        wrapper.appendChild(invokeScript);
    }


    // ==========================================
    // MENCARI LOKASI GAMEPLAY & SCREENSHOTS
    // ==========================================
    const sectionHeads = document.querySelectorAll('.section-head');
    
    sectionHeads.forEach(head => {
        const titleText = head.textContent.toLowerCase();
        
        // IKLAN 2: DI ATAS GAMEPLAY (160x600)
        if (titleText.includes('gameplay')) {
            injectAtOptionsAd(head, {
                'key' : 'f1158c60141ee90357dc1f9483b5d6cb',
                'format' : 'iframe',
                'height' : 600,
                'width' : 160,
                'params' : {}
            }, 'https://divorceabetpiano.com/f1158c60141ee90357dc1f9483b5d6cb/invoke.js');
        }

        // IKLAN 3: DI ATAS SCREENSHOTS (468x60)
        if (titleText.includes('screenshots')) {
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
