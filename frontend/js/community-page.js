// Получаем ID из URL
const urlParams = new URLSearchParams(window.location.search);
const communityId = urlParams.get('id');

// Функция для определения класса иконки по тематике
function getIconClass(thematics) {
    if (!thematics) return 'volunteer';
    const theme = thematics.toLowerCase();
    if (theme.includes('волонт') || theme.includes('социальн')) return 'volunteer';
    if (theme.includes('медиа') || theme.includes('фото')) return 'media';
    if (theme.includes('наук') || theme.includes('исслед')) return 'science';
    if (theme.includes('спорт')) return 'sport';
    if (theme.includes('творч') || theme.includes('культур')) return 'culture';
    return 'volunteer';
}

// Функция для определения иконки по тематике
function getIconName(thematics) {
    if (!thematics) return 'fas fa-users';
    const theme = thematics.toLowerCase();
    if (theme.includes('волонт') || theme.includes('социальн')) return 'fas fa-hand-holding-heart';
    if (theme.includes('медиа') || theme.includes('фото')) return 'fas fa-camera';
    if (theme.includes('наук') || theme.includes('исслед')) return 'fas fa-flask';
    if (theme.includes('спорт')) return 'fas fa-futbol';
    if (theme.includes('творч') || theme.includes('культур')) return 'fas fa-paint-brush';
    return 'fas fa-users';
}

// Форматирование даты
function formatDate(dateString) {
    if (!dateString) return '';
    // Если дата уже в формате DD-MM-YYYY
    if (dateString.includes('-') && dateString.length === 10) {
        return dateString;
    }
    // Если дата в формате YYYY-MM-DD
    try {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    } catch (e) {
        return dateString;
    }
}

async function loadCommunity() {
    if (!communityId) {
        document.getElementById('communityContainer').innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <h2>Сообщество не указано</h2>
                <a href="organizations.html" class="auth-btn-large">Вернуться к списку</a>
            </div>
        `;
        return;
    }

    try {
        console.log('Загрузка сообщества ID:', communityId);
        
        // Загружаем данные сообщества
        const response = await fetch(`http://localhost:8080/api/communities/${communityId}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const community = await response.json();
        console.log('Загружено сообщество:', community);
        
        // Добавляем иконки
        community.iconClass = getIconClass(community.thematics);
        community.icon = getIconName(community.thematics);
        
        // Загружаем мероприятия сообщества
        let events = [];
        try {
            const eventsResponse = await fetch(`http://localhost:8080/api/events?community_id=${communityId}`);
            if (eventsResponse.ok) {
                events = await eventsResponse.json();
            } else {
                // Если нет фильтра по community_id, загружаем все и фильтруем на клиенте
                const allEventsResponse = await fetch('http://localhost:8080/api/events');
                if (allEventsResponse.ok) {
                    const allEvents = await allEventsResponse.json();
                    events = allEvents.filter(e => e.community_id == communityId);
                }
            }
            console.log('Загружены мероприятия:', events);
        } catch (e) {
            console.log('Не удалось загрузить мероприятия:', e);
        }
        
        renderCommunity(community, events);
        
        // Загружаем статус вступления
        await loadJoinStatus(community.id);
        
    } catch (error) {
        console.error('Ошибка загрузки:', error);
        document.getElementById('communityContainer').innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <h2>Ошибка загрузки сообщества</h2>
                <p>${error.message}</p>
                <a href="organizations.html" class="auth-btn-large">Вернуться к списку</a>
            </div>
        `;
    }
}

function renderCommunity(community, events) {
    const container = document.getElementById('communityContainer');
    
    container.innerHTML = `
        <div class="community-page">
            <div class="community-header">
                <div class="community-icon ${community.iconClass}">
                    <i class="${community.icon}"></i>
                </div>
                <div class="community-header-info">
                    <h1 class="community-title">${community.name}</h1>
                    <p class="community-theme">${community.thematics || 'Без тематики'}</p>
                </div>
            </div>
            
            <div class="community-stats-grid">
                <div class="stat-card-large">
                    <div class="stat-value">${community.membersCount || 0}</div>
                    <div class="stat-label">участников</div>
                </div>
                <div class="stat-card-large">
                    <div class="stat-value">${events.length}</div>
                    <div class="stat-label">мероприятий</div>
                </div>
            </div>
            
            <div class="info-card">
                <h3><i class="fas fa-info-circle"></i> О сообществе</h3>
                <p>${community.description || 'Нет описания'}</p>
            </div>
            
            <div class="info-card">
                <h3><i class="fas fa-calendar-alt"></i> Мероприятия сообщества</h3>
                <div class="community-events-list" id="communityEventsList">
                    ${renderEventsList(events)}
                </div>
            </div>
            
            <button class="join-btn-large" id="joinCommunityBtn" data-id="${community.id}">
                <i class="fas fa-user-plus"></i> Вступить в сообщество
            </button>
        </div>
    `;
    
    // Добавляем обработчик для кнопки вступления
    document.getElementById('joinCommunityBtn').addEventListener('click', toggleJoinCommunity);
}

function renderEventsList(events) {
    if (!events || events.length === 0) {
        return '<p class="placeholder-text">Нет мероприятий</p>';
    }
    
    return events.map(event => `
        <div class="event-item" onclick="location.href='event.html?id=${event.id}'">
            <div>
                <h4>${event.title}</h4>
                <p><i class="far fa-calendar-alt"></i> ${formatDate(event.date)}</p>
            </div>
            <i class="fas fa-chevron-right"></i>
        </div>
    `).join('');
}

async function loadJoinStatus(communityId) {
    try {
        const token = localStorage.getItem('token');
        if (!token) return;
        
        // Проверяем, есть ли эндпоинт для проверки статуса
        try {
            const response = await fetch(`http://localhost:8080/api/members_communities/check?community_id=${communityId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                const isJoined = await response.json();
                const joinBtn = document.getElementById('joinCommunityBtn');
                if (joinBtn && isJoined) {
                    joinBtn.innerHTML = '<i class="fas fa-check"></i> Вы в сообществе';
                    joinBtn.classList.add('joined');
                }
            }
        } catch (e) {
            console.log('Эндпоинт проверки не работает, пропускаем');
        }
    } catch (error) {
        console.error('Ошибка загрузки статуса:', error);
    }
}

async function toggleJoinCommunity(e) {
    const btn = e.currentTarget;
    const communityId = btn.dataset.id;
    const isJoined = btn.classList.contains('joined');
    
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Необходимо авторизоваться');
            window.location.href = 'auth.html';
            return;
        }
        
        console.log('Токен:', token);
        console.log('Community ID:', communityId);
        
        if (isJoined) {
            // Выход из сообщества
            const response = await fetch(`http://localhost:8080/api/members_communities/${communityId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                btn.innerHTML = '<i class="fas fa-user-plus"></i> Вступить в сообщество';
                btn.classList.remove('joined');
                alert('Вы покинули сообщество');
            } else {
                const error = await response.text();
                console.error('Ошибка при выходе:', error);
                alert('Ошибка при выходе из сообщества');
            }
        } else {
            // Вступление в сообщество
            const response = await fetch('http://localhost:8080/api/members_communities', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    community_id: parseInt(communityId),
                    date_joining: new Date().toISOString().split('T')[0],
                    role_id: 1
                })
            });
            
            if (response.ok) {
                btn.innerHTML = '<i class="fas fa-check"></i> Вы в сообществе';
                btn.classList.add('joined');
                alert('Вы вступили в сообщество');
            } else {
                const error = await response.text();
                console.error('Ошибка при вступлении:', error);
                alert('Ошибка при вступлении в сообщество');
            }
        }
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Произошла ошибка: ' + error.message);
    }
}

// Загружаем данные при загрузке страницы
document.addEventListener('DOMContentLoaded', loadCommunity);