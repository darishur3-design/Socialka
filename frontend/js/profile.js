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
  console.log("Auth state changed, user:", user);
  
  // если не авторизован → показываем сообщение
  if (!user) {
    console.log("Пользователь не авторизован");
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
    console.log("Firebase UID:", user.uid);
    console.log("Token получен");

    // запрос к backend для получения данных пользователя
    console.log(`Запрос к: http://localhost:8080/api/users/${user.uid}`);
    const response = await fetch(
      `http://localhost:8080/api/users/${user.uid}`,
      {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      }
    );

    console.log("Ответ от /api/users/: статус", response.status);

    if (!response.ok) {
      throw new Error(`Ошибка загрузки профиля: ${response.status}`);
    }

    const userData = await response.json();
    console.log("Данные пользователя из /api/users/:", userData);
    
    // Получаем ID пользователя из ответа
    const userId = userData.id;
    console.log("ID пользователя в БД:", userId);

    // ОСНОВНЫЕ ДАННЫЕ
    if (profileName) {
      const fullName = `${userData.firstName || ""} ${userData.lastName || ""}`.trim();
      profileName.textContent = fullName || "Без имени";
      console.log("Установлено имя:", fullName);
    }
    
    if (profileEmail) {
      profileEmail.textContent = userData.email || "—";
    }
    
    // ПОЛУЧАЕМ ЧЛЕНСТВА В СООБЩЕСТВАХ
    let memberships = [];
    let communities = [];
    
    try {
      console.log("Запрос членств в сообществах...");
      const membershipsResponse = await fetch(`http://localhost:8080/api/members_communities/user`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      console.log("Ответ от /api/members_communities/user: статус", membershipsResponse.status);
      
      if (membershipsResponse.ok) {
        memberships = await membershipsResponse.json();
        console.log("Членства в сообществах (RAW):", memberships);
        
        // Загружаем информацию о каждом сообществе
        for (const membership of memberships) {
          // Проверяем, есть ли community_id
          const communityId = membership.community_id || membership.communityId;
          
          if (!communityId) {
            console.warn("Пропускаем членство без community_id:", membership);
            continue;
          }
          
          try {
            console.log(`Загрузка сообщества ID: ${communityId}`);
            const communityResponse = await fetch(`http://localhost:8080/api/communities/${communityId}`);
            
            if (communityResponse.ok) {
              const community = await communityResponse.json();
              console.log(`Загружено сообщество ${communityId}:`, community.name);
              
              // Добавляем информацию о членстве к данным сообщества
              community.userRoleId = membership.role_id;
              communities.push(community);
            } else {
              console.error(`Ошибка загрузки сообщества ${communityId}: статус ${communityResponse.status}`);
            }
          } catch (e) {
            console.error(`Ошибка при загрузке сообщества ${communityId}:`, e);
          }
        }
      }
    } catch (e) {
      console.error("Ошибка при загрузке членств:", e);
    }
    
    // ОТОБРАЖЕНИЕ ДОЛЖНОСТИ (лидер сообщества)
    if (userPosition) {
      // Ищем сообщества, где пользователь является лидером (leader_id совпадает с userId)
      const leaderCommunities = communities.filter(c => c.leader_id && c.leader_id.toString() === userId?.toString());
      
      console.log("Сообщества, где пользователь лидер:", leaderCommunities);
      
      if (leaderCommunities && leaderCommunities.length > 0) {
        // Если пользователь лидер нескольких сообществ, показываем их все
        if (leaderCommunities.length === 1) {
          userPosition.textContent = `Руководитель ${leaderCommunities[0].name}`;
        } else {
          const communityNames = leaderCommunities.map(c => c.name).join(', ');
          userPosition.textContent = `Руководитель (${communityNames})`;
        }
        console.log("Установлена должность:", userPosition.textContent);
      } else {
        // Если пользователь не лидер, показываем прочерк
        userPosition.textContent = "—";
      }
    }
    
    // ОТОБРАЖЕНИЕ РОЛЕЙ
    if (profileRole) {
      profileRole.innerHTML = ''; // Очищаем
      
      const roles = [];
      
      // 1. Проверяем, является ли пользователь руководителем каких-либо сообществ
      for (const community of communities) {
        if (community.leader_id && community.leader_id.toString() === userId?.toString()) {
          roles.push({
            name: 'Руководитель',
            context: community.name,
            color: 'linear-gradient(135deg, #ff8a3d, #ffb347)'
          });
          console.log(`Найдена роль руководителя для сообщества: ${community.name}`);
        }
      }
      
      // 2. Добавляем роли из memberships (если не руководитель)
      for (const membership of memberships) {
        const communityId = membership.community_id || membership.communityId;
        if (!communityId) continue;
        
        const community = communities.find(c => c.id === communityId);
        if (!community) continue;
        
        // Пропускаем, если пользователь уже руководитель этого сообщества
        if (community.leader_id && community.leader_id.toString() === userId?.toString()) {
          continue; // уже добавили как руководителя
        }
        
        // Определяем роль по role_id
        let roleName = 'Участник';
        const roleId = membership.role_id || membership.roleId;
        
        if (roleId === 2) roleName = 'Администратор';
        else if (roleId === 3) roleName = 'Руководитель';
        
        roles.push({
          name: roleName,
          context: community.name,
          color: 'linear-gradient(135deg, #4f8df5, #7ab6ff)'
        });
      }
      
      console.log("Все найденные роли:", roles);
      
      // Отображаем роли
      if (roles.length > 0) {
        roles.forEach(role => {
          const roleSpan = document.createElement('span');
          roleSpan.className = 'role-badge';
          roleSpan.style.background = role.color;
          roleSpan.style.marginRight = '8px';
          roleSpan.style.marginBottom = '8px';
          roleSpan.style.display = 'inline-block';
          roleSpan.style.padding = '6px 15px';
          roleSpan.style.borderRadius = '30px';
          roleSpan.style.color = 'white';
          roleSpan.style.fontWeight = '500';
          roleSpan.style.fontSize = '13px';
          
          roleSpan.textContent = role.context ? 
            `${role.name} (${role.context})` : role.name;
          
          profileRole.appendChild(roleSpan);
        });
      } else {
        // Если нет ролей, показываем базовую
        const defaultRole = document.createElement('span');
        defaultRole.className = 'role-badge';
        defaultRole.style.background = 'linear-gradient(135deg, #4f8df5, #7ab6ff)';
        defaultRole.style.marginRight = '5px';
        defaultRole.style.marginBottom = '5px';
        defaultRole.style.display = 'inline-block';
        defaultRole.style.padding = '6px 15px';
        defaultRole.style.borderRadius = '30px';
        defaultRole.style.color = 'white';
        defaultRole.style.fontWeight = '500';
        defaultRole.style.fontSize = '13px';
        defaultRole.textContent = 'Базовый пользователь';
        profileRole.appendChild(defaultRole);
      }
    }

    // Статистика
    if (statHours) statHours.textContent = userData.hours || 0;
    if (statEvents) statEvents.textContent = userData.eventsCount || 0;
    if (statRating) statRating.textContent = userData.rating || 0;

    // Группа/курс
    if (userGroup) {
      userGroup.textContent = userData.group || "—";
    }

    // Дата рождения
    if (userData.birthdate) {
      if (userBirthdate) {
        userBirthdate.textContent = formatDate(userData.birthdate);
        if (birthdateRow) birthdateRow.style.display = "flex";
      }
      
      const age = calculateAge(userData.birthdate);
      if (age !== null && userAge) {
        userAge.textContent = `${age} лет`;
        if (ageRow) {
          ageRow.style.display = "flex";
          if (birthdateRow) birthdateRow.style.display = "none";
        }
      }
    } else {
      if (userBirthdate) userBirthdate.textContent = "—";
      if (userAge) userAge.textContent = "—";
    }

    // МОИ СООБЩЕСТВА
    if (myCommunities) {
      myCommunities.innerHTML = "";
      
      console.log("Отображение сообществ:", communities);
      
      if (communities && communities.length > 0) {
        communities.forEach(comm => {
          const communityElement = document.createElement('div');
          communityElement.className = 'community-link';
          communityElement.setAttribute('onclick', `location.href='community.html?id=${comm.id}'`);
          communityElement.style.cssText = 'display: flex; align-items: center; gap: 10px; padding: 12px 15px; background: #f8f9fa; border-radius: 12px; cursor: pointer; transition: all 0.2s; margin-bottom: 5px;';
          
          communityElement.innerHTML = `
            <i class="fas fa-users" style="color: #4f8df5; font-size: 16px;"></i>
            <span style="flex: 1; color: #333; font-weight: 500;">${comm.name}</span>
            <i class="fas fa-chevron-right" style="color: #999; font-size: 12px;"></i>
          `;
          
          myCommunities.appendChild(communityElement);
        });
      } else {
        myCommunities.innerHTML = '<div class="event-item placeholder"><i class="fas fa-users"></i><span>Нет сообществ</span></div>';
      }
    }

    // Мои мероприятия (участник)
    if (userEvents) {
      userEvents.innerHTML = '<div class="event-item placeholder"><i class="fas fa-calendar-alt"></i><span>Нет запланированных мероприятий</span></div>';
    }

    // Мои мероприятия (организатор)
    if (organizerEvents) {
      organizerEvents.innerHTML = '<div class="event-item placeholder"><i class="fas fa-user-tie"></i><span>Нет мероприятий</span></div>';
    }

  } catch (err) {
    console.error("ОШИБКА загрузки профиля:", err);
    if (profileName) profileName.textContent = "Ошибка загрузки";
  }
});