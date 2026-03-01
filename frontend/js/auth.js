import {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "./firebase.js";

import { updateProfile }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// ждём загрузки страницы
document.addEventListener("DOMContentLoaded", () => {

  // ===== элементы =====
  const title = document.getElementById("authTitle");
  const switchBtn = document.getElementById("switchBtn");
  const submitBtn = document.getElementById("submitBtn");
  const repeatPassword = document.getElementById("repeatPassword");
  const nameInput = document.getElementById("nameInput");
  const backBtn = document.getElementById("backBtn");
  const footerText = document.getElementById("footerText");
  const form = document.getElementById("authForm");

  const emailInput = document.getElementById("emailInput");
  const passwordInput = document.getElementById("passwordInput");

  let isRegister = false;

  // ===== ПЕРЕКЛЮЧЕНИЕ РЕЖИМОВ =====
  switchBtn.addEventListener("click", (e) => {
    e.preventDefault();
    isRegister = !isRegister;

    if (isRegister) showRegister();
    else showLogin();
  });

  if (backBtn) backBtn.addEventListener("click", (e) => {
    e.preventDefault();
    showLogin();
  });

  // ===== UI =====
  function showRegister() {
    isRegister = true;

    title.textContent = "Регистрация";
    submitBtn.textContent = "Зарегистрироваться";

    repeatPassword.style.display = "block";
    nameInput.style.display = "block";

    if (backBtn) backBtn.style.display = "flex";

    footerText.textContent = "Уже есть аккаунт?";
    switchBtn.textContent = "Войти";
  }

  function showLogin() {
    isRegister = false;

    title.textContent = "Авторизация";
    submitBtn.textContent = "Войти";

    repeatPassword.style.display = "none";
    nameInput.style.display = "none";

    if (backBtn) backBtn.style.display = "none";

    footerText.textContent = "Нет аккаунта?";
    switchBtn.textContent = "Регистрация";
  }

  // ===== ОТПРАВКА ФОРМЫ =====
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const repeat = repeatPassword.value.trim();
    const fullName = nameInput.value.trim();

    const parts = fullName.split(" ");
    const firstName = parts[0] || "";
    const lastName = parts.slice(1).join(" ") || "";

    try {
      // ================= REGISTRATION =================
      if (isRegister) {
        if (!fullName) {
          alert("Введите имя");
          return;
        }

        if (password !== repeat) {
          alert("Пароли не совпадают");
          return;
        }

        // регистрация в Firebase
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        await updateProfile(userCredential.user, {
          displayName: fullName
        });

        // Firebase token - СОХРАНЯЕМ В localStorage
        const token = await userCredential.user.getIdToken();
        localStorage.setItem('token', token);
        console.log('Токен сохранен при регистрации');

        // отправка в backend
        const response = await fetch("http://localhost:8080/api/users/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            email: email,
            firstName: firstName,
            lastName: lastName
          })
        });

        if (!response.ok) {
          throw new Error("Ошибка регистрации в backend");
        }

        alert("Регистрация успешна");
        window.location.href = "index.html";

      }
      // ================= LOGIN =================
      else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        
        // Firebase token - СОХРАНЯЕМ В localStorage
        const token = await userCredential.user.getIdToken();
        localStorage.setItem('token', token);
        console.log('Токен сохранен при входе');
        
        alert("Вход выполнен");
        window.location.href = "profile.html";
      }

    } catch (error) {
      alert(error.message);
      console.error(error);
    }
  });
});