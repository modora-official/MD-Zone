import { initializeApp }
from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";

import {
  getDatabase,
  ref,
  runTransaction
}
from "https://www.gstatic.com/firebasejs/12.13.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBLef7bGChvtMaDCmCkiv_048A8Fdj2ehY",
  authDomain: "modora-b86c4.firebaseapp.com",
  databaseURL: "https://modora-b86c4-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "modora-b86c4",
  storageBucket: "modora-b86c4.firebasestorage.app",
  messagingSenderId: "792954478651",
  appId: "1:792954478651:web:9888c53a16830a59283c1e"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const style = document.createElement("style");

style.innerHTML = `
/* Wrapper baru agar badge berjajar rapi ke samping */
.modora-badges-wrapper {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap; /* Mencegah elemen bertumpuk jika layar sangat kecil */
}

/* Styling badge views disamakan persis dengan .badge-mod di index.html */
.modora-view-badge {
  display: inline-flex;
  align-items: center;
  background: rgba(37, 99, 235, 0.15); /* Menggunakan warna var(--primary) transparan */
  color: #60a5fa; /* Biru terang agar kontras di Dark OS */
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 800;
  gap: 5px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.modora-view-badge i {
  font-size: 12px;
}
`;

document.head.appendChild(style);

const wrapper = document.createElement("div");
wrapper.className = "modora-view-badge";

// Teks VIEWS disamakan gaya uppercase-nya dengan MOD APK
wrapper.innerHTML = `
  <i class="fa-regular fa-eye"></i>
  <span id="views">0</span> VIEWS
`;

// Cari elemen badge-mod yang sudah ada di HTML
const badgeMod = document.querySelector(".badge-mod");

if (badgeMod) {
  // Buat div container flex baru
  const badgeContainer = document.createElement("div");
  badgeContainer.className = "modora-badges-wrapper";

  // Sisipkan container baru tepat sebelum badge-mod
  badgeMod.parentNode.insertBefore(badgeContainer, badgeMod);
  
  // Pindahkan badge-mod ke dalam container flex
  badgeContainer.appendChild(badgeMod);
  
  // Tambahkan badge views di sebelah kanannya
  badgeContainer.appendChild(wrapper);
}

const pageName = location.pathname.replace(/\//g, "_");
const viewRef = ref(db, "views/" + pageName);

runTransaction(viewRef, (count) => {
  return (count || 0) + 1;
})
.then((result) => {
  document.getElementById("views").innerText = result.snapshot.val().toLocaleString();
});
