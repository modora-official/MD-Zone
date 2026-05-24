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
.modora-view-wrap{
  display:flex;
  justify-content:center;
  margin:22px 0;
}

.modora-view-box{
  display:flex;
  align-items:center;
  gap:8px;

  padding:10px 16px;

  border-radius:14px;

  background:
  rgba(30,41,59,.75);

  border:
  1px solid rgba(255,255,255,.06);

  backdrop-filter:blur(10px);
  -webkit-backdrop-filter:blur(10px);

  color:#f8fafc;

  font-family:'Plus Jakarta Sans',sans-serif;

  box-shadow:
  0 4px 18px rgba(0,0,0,.22);
}

.modora-view-box i{
  font-size:14px;
  color:#94a3b8;
}

#views{
  font-size:14px;
  font-weight:800;
  color:white;
}

.modora-view-box small{
  font-size:13px;
  font-weight:700;
  color:#94a3b8;
}
`;

document.head.appendChild(style);

const wrapper = document.createElement("div");

wrapper.className = "modora-view-wrap";

wrapper.innerHTML = `
<div class="modora-view-box">

  <i class="fa-regular fa-eye"></i>

  <span id="views">0</span>

  <small>Views</small>

</div>
`;

const target =
document.querySelector(".app-header-detail");

if(target){
  target.insertAdjacentElement(
    "afterend",
    wrapper
  );
}

const pageName =
location.pathname.replace(/\//g, "_");

const viewRef =
ref(db, "views/" + pageName);

runTransaction(viewRef, (count) => {
  return (count || 0) + 1;
})
.then((result) => {

  document.getElementById("views")
  .innerText =
  result.snapshot.val()
  .toLocaleString();

});
