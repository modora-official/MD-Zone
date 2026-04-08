document.addEventListener("DOMContentLoaded", function() {
    // 1. Fungsi untuk membuat elemen wadah (container) iklan
    function createAdContainer() {
        const div = document.createElement('div');
        div.id = 'container-53773056cf29c22519d850bfd8f749f4';
        div.style.textAlign = 'center';
        div.style.margin = '20px 0';
        div.style.width = '100%';
        return div;
    }

    // --- POSISI 1: Di bawah tombol Download ---
    const btnDownload = document.querySelector('.btn-download-huge');
    if (btnDownload && btnDownload.parentNode) {
        // insertAfter: masukkan setelah elemen pembungkus tombol (action-top-wrap) atau tombol itu sendiri
        btnDownload.parentNode.insertBefore(createAdContainer(), btnDownload.nextSibling);
    }

    // --- POSISI 2 & 3: Di atas Gameplay dan di atas Screenshot ---
    const sectionHeads = document.querySelectorAll('.section-head');
    sectionHeads.forEach(head => {
        const text = head.textContent.toLowerCase();
        
        // Cek jika teks mengandung "gameplay" atau "screenshots"
        if (text.includes('gameplay') || text.includes('screenshots')) {
            // Masukkan iklan tepat SEBELUM elemen header section tersebut
            head.parentNode.insertBefore(createAdContainer(), head);
        }
    });

    // 2. Injeksi script eksternal iklan ke dalam <head>
    const adScript = document.createElement('script');
    adScript.async = true;
    adScript.setAttribute('data-cfasync', 'false');
    adScript.src = 'https://divorceabetpiano.com/53773056cf29c22519d850bfd8f749f4/invoke.js';
    document.head.appendChild(adScript);
});
