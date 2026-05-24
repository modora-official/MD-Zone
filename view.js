import { initializeApp } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";

import {
  getDatabase,
  ref,
  runTransaction
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-database.js";

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

const box = document.createElement("div");

box.className = "modora-views";

box.innerHTML = `
<i class="fa-solid fa-eye"></i>
<span id="views">0</span>
<span>Views</span>
`;

document.body.appendChild(box);

const style = document.createElement("style");

style.innerHTML = `
.modora-views{
  width:100%;
  display:flex;
  justify-content:center;
  align-items:center;
  gap:8px;
  margin:25px 0;
  color:#f8fafc;
  font-size:15px;
  font-weight:700;
  font-family:'Plus Jakarta Sans',sans-serif;
}

.modora-views i{
  color:#94a3b8;
  font-size:14px;
}
`;

document.head.appendChild(style);

const pageName = location.pathname.replace(/\//g, "_");

const viewRef = ref(db, "views/" + pageName);

runTransaction(viewRef, (count) => {
  return (count || 0) + 1;
})
.then((result) => {
  document.getElementById("views").innerText =
    result.snapshot.val().toLocaleString();
});
