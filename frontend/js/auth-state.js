import { auth } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {

  const authBtn = document.querySelector(".auth-btn");

  // если кнопки нет — выходим
  if (!authBtn) return;

  const currentPath = window.location.pathname;

  onAuthStateChanged(auth, (user) => {

    // меняем кнопку ТОЛЬКО на странице профиля
    if (currentPath.includes("profile.html")) {

      if (user) {
        authBtn.textContent = "Профиль";
        authBtn.href = "profile.html";
      } else {
        authBtn.textContent = "Авторизация";
        authBtn.href = "auth.html";
      }

    }

  });

});
