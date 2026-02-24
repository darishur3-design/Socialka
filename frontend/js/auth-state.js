// auth-state.js
import { auth } from "./firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const headerRight = document.querySelector(".header-right");

onAuthStateChanged(auth, async (user) => {
  if (!headerRight) return;

  if (user) {
    // Пользователь вошёл - создаём блок профиля
    try {
      // Получаем токен для запроса к бэкенду
      const token = await user.getIdToken();
      
      // Запрашиваем данные пользователя с бэкенда
      const response = await fetch(`http://localhost:8080/api/users/${user.uid}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      let userName = user.displayName || "Пользователь";
      
      if (response.ok) {
        const userData = await response.json();
        userName = `${userData.firstName || ""} ${userData.lastName || ""}`.trim() || userName;
      }
      
      // Создаем HTML для профиля
      headerRight.innerHTML = `
        <div class="user-block" id="profileBlock">
          <img src="images/avatar.png" class="avatar-small" id="userAvatar">
          <span class="user-name" id="userName">${userName}</span>
        </div>
        <button id="logoutBtn" class="auth-btn" style="margin-left: 10px; padding: 8px 20px; font-size: 0.9rem;">Выйти</button>
      `;
      
      // Добавляем обработчик для перехода в профиль
      document.getElementById("profileBlock").addEventListener("click", () => {
        window.location.href = "profile.html";
      });
      
      // Добавляем обработчик для выхода
      document.getElementById("logoutBtn").addEventListener("click", async (e) => {
        e.stopPropagation();
        await signOut(auth);
        window.location.href = "index.html";
      });
      
    } catch (error) {
      console.error("Ошибка загрузки профиля:", error);
      
      // Если ошибка, показываем простой профиль
      headerRight.innerHTML = `
        <div class="user-block" id="profileBlock">
          <img src="images/avatar.png" class="avatar-small" id="userAvatar">
          <span class="user-name">${user.displayName || "Пользователь"}</span>
        </div>
        <button id="logoutBtn" class="auth-btn" style="margin-left: 10px; padding: 8px 20px; font-size: 0.9rem;">Выйти</button>
      `;
      
      document.getElementById("profileBlock").addEventListener("click", () => {
        window.location.href = "profile.html";
      });
      
      document.getElementById("logoutBtn").addEventListener("click", async (e) => {
        e.stopPropagation();
        await signOut(auth);
        window.location.href = "index.html";
      });
    }
  } else {
    // Не авторизован - показываем кнопку входа
    headerRight.innerHTML = '<a href="auth.html" class="auth-btn">Авторизация</a>';
  }
});