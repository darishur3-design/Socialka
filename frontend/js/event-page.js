// Получаем ID из URL
const urlParams = new URLSearchParams(window.location.search);
const eventId = urlParams.get('id');

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
    if (dateString.includes('-')) return dateString;
    
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}

async function loadEvent() {
    if (!eventId) {
        document.getElementById('eventContainer').innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <h2>Мероприятие не указано</h2>
                <a href="events.html" class="auth-btn-large">Вернуться к списку</a>
            </div>
        `;
        return;
    }

    try {
        console.log('Загрузка мероприятия ID:', eventId);
        
        // Загружаем данные мероприятия
        const response = await fetch(`http://localhost:8080/api/events/${eventId}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const event = await response.json();
        console.log('Загружено мероприятие:', event);
        
        // Загружаем данные сообщества
        let community = null;
        try {
            const communityResponse = await fetch(`http://localhost:8080/api/communities/${event.community_id}`);
            if (communityResponse.ok) {
                community = await communityResponse.json();
                community.iconClass = getIconClass(community.thematics);
                community.icon = getIconName(community.thematics);
            }
        } catch (e) {
            console.log('Не удалось загрузить сообщество');
        }
        
        renderEvent(event, community);
        
    } catch (error) {
        console.error('Ошибка загрузки:', error);
        document.getElementById('eventContainer').innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <h2>Ошибка загрузки мероприятия</h2>
                <p>${error.message}</p>
                <a href="events.html" class="auth-btn-large">Вернуться к списку</a>
            </div>
        `;
    }
}

function renderEvent(event, community) {
    const container = document.getElementById('eventContainer');
    const formatClass = event.format === 'Онлайн' ? 'online' : 'offline';
    
    container.innerHTML = `
        <div class="event-page">
            <div class="event-header">
                <h1 class="event-title">${event.title}</h1>
                ${community ? `
                    <a href="community.html?id=${community.id}" class="event-community-link">
                        <i class="fas fa-users"></i>
                        <span>${community.name}</span>
                        <i class="fas fa-chevron-right"></i>
                    </a>
                ` : ''}
            </div>
            
            <div class="event-grid">
                <div class="event-main-info">
                    <div class="info-card">
                        <h3><i class="fas fa-calendar-alt"></i> Дата и время</h3>
                        <p>${formatDate(event.date)} в ${event.time || '00:00'}</p>
                    </div>
                    
                    <div class="info-card">
                        <h3><i class="fas fa-map-marker-alt"></i> Место проведения</h3>
                        <p>${event.location || 'Не указано'}</p>
                    </div>
                    
                    <div class="info-card">
                        <h3><i class="fas fa-tag"></i> Формат</h3>
                        <p><span class="event-tag ${formatClass}">${event.format}</span></p>
                    </div>
                    
                    <div class="info-card">
                        <h3><i class="fas fa-align-left"></i> Описание</h3>
                        <p>${event.description || 'Нет описания'}</p>
                    </div>
                </div>
                
                <div class="event-sidebar">
                    <div class="info-card">
                        <h3><i class="fas fa-user-tie"></i> Ответственный</h3>
                        <p>${event.organizers || 'Не указан'}</p>
                    </div>
                    
                    ${community ? `
                        <div class="info-card">
                            <h3><i class="fas fa-building"></i> Организатор</h3>
                            <a href="community.html?id=${community.id}" class="community-preview">
                                <div class="community-icon ${community.iconClass}">
                                    <i class="${community.icon}"></i>
                                </div>
                                <div>
                                    <h4>${community.name}</h4>
                                    <p>${community.thematics || 'Без тематики'}</p>
                                </div>
                            </a>
                        </div>
                    ` : ''}
                    
                    <button class="register-event-btn" id="registerEventBtn" data-id="${event.id}">
                        <i class="fas fa-check-circle"></i> Записаться
                    </button>
                </div>
            </div>
            
            <div class="similar-events">
                <h3><i class="fas fa-calendar-alt"></i> Похожие мероприятия</h3>
                <p class="placeholder-text">Здесь будут похожие мероприятия</p>
            </div>
        </div>
    `;
    
    // Добавляем обработчик для кнопки записи
    document.getElementById('registerEventBtn').addEventListener('click', toggleRegistration);
}

async function toggleRegistration(e) {
    const btn = e.currentTarget;
    const eventId = btn.dataset.id;
    
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Необходимо авторизоваться');
            window.location.href = 'auth.html';
            return;
        }
        
        // Проверяем текущий статус
        const checkResponse = await fetch(`http://localhost:8080/api/event_participants/check?event_id=${eventId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const isRegistered = checkResponse.ok ? await checkResponse.json() : false;
        
        if (isRegistered) {
            // Отмена регистрации
            const response = await fetch(`http://localhost:8080/api/event_participants/${eventId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                btn.innerHTML = '<i class="fas fa-check-circle"></i> Записаться';
                btn.classList.remove('registered');
                alert('Вы отменили запись');
            }
        } else {
            // Регистрация
            const response = await fetch('http://localhost:8080/api/event_participants', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    event_id: parseInt(eventId),
                    date_registration: new Date().toISOString().split('T')[0],
                    status: 'confirmed'
                })
            });
            
            if (response.ok) {
                btn.innerHTML = '<i class="fas fa-check"></i> Вы записаны';
                btn.classList.add('registered');
                alert('Вы успешно записаны!');
            }
        }
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Произошла ошибка');
    }
}

document.addEventListener('DOMContentLoaded', loadEvent);