import { auth } from "./firebase.js";
import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Получаем все элементы DOM
const profileName = document.getElementById("profileName");
const profileEmail = document.getElementById("profileEmail");
const profileRole = document.getElementById("profileRole");
const studentId = document.getElementById("studentId");
const userPosition = document.getElementById("userPosition");
const studentRow = document.getElementById("studentRow");
const positionRow = document.getElementById("positionRow");
const adminPanel = document.getElementById("adminPanel");
const userEvents = document.getElementById("userEvents");
const profileContainer = document.getElementById("profileContainer");
const notAuth = document.getElementById("notAuth");

onAuthStateChanged(auth, async (user) => {
  // если не авторизован → показываем сообщение
  if (!user) {
    if (profileContainer) profileContainer.style.display = "none";
    if (notAuth) notAuth.style.display = "block";
    return;
  }

  // если авторизован - показываем профиль
  if (profileContainer) profileContainer.style.display = "block";
  if (notAuth) notAuth.style.display = "none";

  try {
    // получаем firebase token
    const token = await user.getIdToken();
    console.log("userId:", user.uid);

    // запрос к backend
    const response = await fetch(
      `http://localhost:8080/api/users/${user.uid}`,
      {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {
      throw new Error("Ошибка загрузки профиля");
    }

    const data = await response.json();

    // ОСНОВНЫЕ ДАННЫЕ - из первой версии
    if (profileName) {
      profileName.textContent =
        `${data.firstName || ""} ${data.lastName || ""}`.trim() || "Без имени";
    }
    
    if (profileEmail) {
      profileEmail.textContent = data.email || "—";
    }
    
    if (profileRole) {
      profileRole.textContent = data.role || "Базовый пользователь";
    }

    // ДОПОЛНИТЕЛЬНАЯ ЛОГИКА - из второй версии
    if (data.role === "student") {
      if (studentId) studentId.textContent = data.studentId || "—";
      if (positionRow) positionRow.classList.add("hidden");
      if (studentRow) studentRow.classList.remove("hidden");
    } else {
      if (userPosition) userPosition.textContent = data.position || "—";
      if (studentRow) studentRow.classList.add("hidden");
      if (positionRow) positionRow.classList.remove("hidden");
      if (adminPanel) adminPanel.classList.remove("hidden");
    }

    // Отображение событий
    if (userEvents) {
      userEvents.innerHTML = ""; // очищаем перед добавлением
      if (data.events && Array.isArray(data.events)) {
        data.events.forEach(e => {
          userEvents.innerHTML += `<li>${e}</li>`;
        });
      }
    }

  } catch (err) {
    console.error("Ошибка загрузки профиля:", err);
    if (profileName) profileName.textContent = "Ошибка загрузки";
  }
});
