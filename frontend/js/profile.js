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

// НОВЫЕ ЭЛЕМЕНТЫ
const userGroup = document.getElementById("userGroup");
const userBirthdate = document.getElementById("userBirthdate");
const userAge = document.getElementById("userAge");
const myCommunities = document.getElementById("myCommunities");
const organizerEvents = document.getElementById("organizerEvents");
const birthdateRow = document.getElementById("birthdateRow");
const ageRow = document.getElementById("ageRow");

// Статистика
const statHours = document.getElementById("statHours");
const statEvents = document.getElementById("statEvents");
const statRating = document.getElementById("statRating");

// Функция для форматирования даты
function formatDate(dateString) {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
}

// Функция для вычисления возраста
function calculateAge(birthdate) {
    if (!birthdate) return null;
    const today = new Date();
    const birth = new Date(birthdate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    return age;
}

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

    // ОСНОВНЫЕ ДАННЫЕ
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

    // Статистика
    if (statHours) statHours.textContent = data.hours || 0;
    if (statEvents) statEvents.textContent = data.eventsCount || 0;
    if (statRating) statRating.textContent = data.rating || 0;

    // ДОПОЛНИТЕЛЬНАЯ ЛОГИКА
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

    // === НОВЫЕ ПОЛЯ ===
    
    // Группа/курс
    if (userGroup) {
        userGroup.textContent = data.group || "—";
    }

    // Дата рождения или возраст
    if (data.birthdate) {
        if (userBirthdate) {
            userBirthdate.textContent = formatDate(data.birthdate);
            if (birthdateRow) birthdateRow.style.display = "flex";
        }
        
        const age = calculateAge(data.birthdate);
        if (age !== null && userAge) {
            userAge.textContent = `${age} лет`;
            if (ageRow) {
                ageRow.style.display = "flex";
                // Можно скрыть дату рождения, если показываем возраст
                if (birthdateRow) birthdateRow.style.display = "none";
            }
        }
    } else {
        if (userBirthdate) userBirthdate.textContent = "—";
        if (userAge) userAge.textContent = "—";
    }

    // Мои сообщества
    if (myCommunities) {
      myCommunities.innerHTML = "";
      if (data.communities && data.communities.length > 0) {
        data.communities.forEach(comm => {
          const communityElement = document.createElement('div');
          communityElement.className = 'community-link';
          communityElement.setAttribute('onclick', `location.href='community.html?id=${comm.id}'`);
          communityElement.innerHTML = `
            <i class="fas fa-users"></i>
            <span>${comm.name}</span>
            <i class="fas fa-chevron-right" style="margin-left: auto; color: #999; font-size: 12px;"></i>
          `;
          myCommunities.appendChild(communityElement);
        });
      } else {
        myCommunities.innerHTML = '<div class="event-item placeholder"><i class="fas fa-users"></i><span>Нет сообществ</span></div>';
      }
    }

    // Мои мероприятия (участник)
    if (userEvents) {
      userEvents.innerHTML = "";
      if (data.events && data.events.length > 0) {
        data.events.forEach(event => {
          const eventElement = document.createElement('div');
          eventElement.className = 'event-link';
          eventElement.setAttribute('onclick', `location.href='event.html?id=${event.id}'`);
          eventElement.innerHTML = `
            <i class="fas fa-calendar-alt"></i>
            <div style="flex: 1;">
              <div style="font-weight: 500;">${event.name}</div>
              <div style="font-size: 12px; color: #666;">${event.date || ''}</div>
            </div>
            <i class="fas fa-chevron-right" style="color: #999; font-size: 12px;"></i>
          `;
          userEvents.appendChild(eventElement);
        });
      } else {
        userEvents.innerHTML = '<div class="event-item placeholder"><i class="fas fa-calendar-alt"></i><span>Нет запланированных мероприятий</span></div>';
      }
    }

    // Мероприятия где пользователь организатор
    if (organizerEvents) {
      organizerEvents.innerHTML = "";
      if (data.organizerEvents && data.organizerEvents.length > 0) {
        data.organizerEvents.forEach(event => {
          const eventElement = document.createElement('div');
          eventElement.className = 'event-link';
          eventElement.setAttribute('onclick', `location.href='event.html?id=${event.id}'`);
          eventElement.innerHTML = `
            <i class="fas fa-user-tie"></i>
            <div style="flex: 1;">
              <div style="font-weight: 500;">${event.name}</div>
              <div style="font-size: 12px; color: #666;">${event.date || ''}</div>
            </div>
            <i class="fas fa-chevron-right" style="color: #999; font-size: 12px;"></i>
          `;
          organizerEvents.appendChild(eventElement);
        });
      } else {
        organizerEvents.innerHTML = '<div class="event-item placeholder"><i class="fas fa-user-tie"></i><span>Нет мероприятий</span></div>';
      }
    }

  } catch (err) {
    console.error("Ошибка загрузки профиля:", err);
    if (profileName) profileName.textContent = "Ошибка загрузки";
  }
});