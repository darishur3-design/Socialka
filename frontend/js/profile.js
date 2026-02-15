import { auth } from "./firebase.js";
import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const profileName = document.getElementById("profileName");
const profileEmail = document.getElementById("profileEmail");
const profileRole = document.getElementById("profileRole");

onAuthStateChanged(auth, async (user) => {

  // если не авторизован → на страницу входа
  if (!user) {
    window.location.href = "auth.html";
    return;
  }

  try {

    // получаем firebase token
    const token = await user.getIdToken();

    console.log("userId:", user.uid);

    // запрос к backend
    const response = await fetch(
      `http://localhost:8080/api/users/${user.uid}`,
      {
        headers: {
          "Authorization": token
        }
      }
    );

    if (!response.ok) {
      throw new Error("Ошибка загрузки профиля");
    }

    const data = await response.json();

    // безопасный вывод данных
    profileName.textContent =
      `${data.firstName || ""} ${data.lastName || ""}`.trim() || "Без имени";

    profileEmail.textContent =
      data.email || "—";

    profileRole.textContent =
      data.role || "Базовый пользователь";

  } catch (err) {
    console.error("Ошибка загрузки профиля:", err);
  }
});
