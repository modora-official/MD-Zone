import { initializeApp } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";
import { getDatabase, ref, runTransaction } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-database.js";

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

// Styling disamakan 100% dengan .badge-mod, cuma beda warna dan ditambah margin kiri
style.innerHTML = `
.modora-view-badge {
  display: inline-flex;
  align-items: center;
  background: rgba(37, 99, 235, 0.15); /* Warna premium Dark OS (biru transparan) */
  color: #60a5fa; /* Teks biru terang */
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 800;
  gap: 5px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-left: 8px; /* Ini yang bikin dia pas di sebelah kanan badge hijau */
  vertical-align: middle;
}

.modora-view-badge i {
  font-size: 12px;
}
`;

document.head.appendChild(style);

const wrapper = document.createElement("div");
wrapper.className = "modora-view-badge";

// Format teks ngikutin gaya "100% MOD APK"
wrapper.innerHTML = `
  <i class="fa-regular fa-eye"></i>
  <span id="views">0</span> VIEWS
`;

// Cari elemen badge-mod dan taruh views tepat di kanan sebelahnya
const badgeMod = document.querySelector(".badge-mod");

if (badgeMod) {
  // afterend = sisipkan tepat setelah penutup tag elemen target
  badgeMod.insertAdjacentElement("afterend", wrapper);
}

const pageName = location.pathname.replace(/\//g, "_");
const viewRef = ref(db, "views/" + pageName);

runTransaction(viewRef, (count) => {
  return (count || 0) + 1;
})
.then((result) => {
  document.getElementById("views").innerText = result.snapshot.val().toLocaleString();
});
