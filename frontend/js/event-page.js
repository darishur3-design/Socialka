// Получаем ID из URL
const urlParams = new URLSearchParams(window.location.search);
const eventId = urlParams.get('id');

console.log('Event ID from URL:', eventId);

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
    return dateString; // Возвращаем как есть
}

async function loadEvent() {
    console.log('loadEvent started, eventId:', eventId);
    
    const container = document.getElementById('eventContainer');
    if (!container) {
        console.error('Container not found!');
        return;
    }
    
    if (!eventId) {
        container.innerHTML = `
            <div class="error-message" style="text-align: center; padding: 50px;">
                <i class="fas fa-exclamation-circle" style="font-size: 60px; color: #ff6b6b;"></i>
                <h2>Мероприятие не указано</h2>
                <a href="events.html" class="auth-btn-large" style="display: inline-block; margin-top: 20px;">Вернуться к списку</a>
            </div>
        `;
        return;
    }

    try {
        // Показываем загрузку
        container.innerHTML = `
            <div class="loading" style="text-align: center; padding: 80px;">
                <i class="fas fa-spinner fa-spin" style="font-size: 40px; color: #4f8df5;"></i>
                <p style="margin-top: 20px; color: #666;">Загрузка мероприятия...</p>
            </div>
        `;
        
        console.log('Fetching event data for ID:', eventId);
        
        // Загружаем данные мероприятия
        const response = await fetch(`http://localhost:8080/api/events/${eventId}`);
        
        console.log('Response status:', response.status);
        
        if (!response.ok) {
            throw new Error(`Ошибка загрузки: ${response.status}`);
        }
        
        const event = await response.json();
        console.log('Event data loaded:', event);
        
        // Загружаем данные сообщества (если есть community_id)
        let community = null;
        if (event.community_id) {
            try {
                console.log('Loading community data for ID:', event.community_id);
                const communityResponse = await fetch(`http://localhost:8080/api/communities/${event.community_id}`);
                if (communityResponse.ok) {
                    community = await communityResponse.json();
                    console.log('Community data loaded:', community);
                    community.iconClass = getIconClass(community.thematics);
                    community.icon = getIconName(community.thematics);
                }
            } catch (e) {
                console.log('Error loading community:', e);
            }
        }
        
        // Рендерим страницу
        renderEvent(event, community);
        
    } catch (error) {
        console.error('Error in loadEvent:', error);
        container.innerHTML = `
            <div class="error-message" style="text-align: center; padding: 50px;">
                <i class="fas fa-exclamation-circle" style="font-size: 60px; color: #ff6b6b;"></i>
                <h2>Ошибка загрузки мероприятия</h2>
                <p style="color: #666; margin: 20px;">${error.message}</p>
                <button onclick="location.reload()" class="auth-btn" style="margin: 10px;">Повторить</button>
                <a href="events.html" class="auth-btn-large" style="display: inline-block; margin-top: 10px;">Вернуться к списку</a>
            </div>
        `;
    }
}

function renderEvent(event, community) {
    console.log('Rendering event with data:', event);
    
    const container = document.getElementById('eventContainer');
    if (!container) {
        console.error('Container not found!');
        return;
    }
    
    // Определяем класс для формата
    const formatClass = event.format === 'Онлайн' ? 'online' : 'offline';
    
    // Формируем HTML для сообщества
    const communityHtml = community ? `
        <a href="community.html?id=${community.id}" class="event-community-link" style="display: inline-flex; align-items: center; gap: 10px; padding: 10px 20px; background: #f0f0f0; border-radius: 30px; color: #4f8df5; text-decoration: none; margin-top: 15px;">
            <i class="fas fa-users"></i>
            <span>${community.name}</span>
            <i class="fas fa-chevron-right"></i>
        </a>
    ` : '';
    
    const communityPreviewHtml = community ? `
        <div class="info-card" style="background: white; border-radius: 16px; padding: 20px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
            <h3 style="font-size: 16px; color: #666; margin-bottom: 15px;"><i class="fas fa-building" style="color: #4f8df5;"></i> Организатор</h3>
            <a href="community.html?id=${community.id}" style="display: flex; align-items: center; gap: 15px; text-decoration: none; color: inherit;">
                <div style="width: 50px; height: 50px; border-radius: 12px; background: linear-gradient(135deg, #4f8df5, #7ab6ff); display: flex; align-items: center; justify-content: center; color: white; font-size: 24px;">
                    <i class="${community.icon || 'fas fa-users'}"></i>
                </div>
                <div>
                    <h4 style="font-size: 16px; color: #333; margin-bottom: 4px;">${community.name}</h4>
                    <p style="font-size: 13px; color: #666;">${community.thematics || 'Без тематики'}</p>
                </div>
            </a>
        </div>
    ` : '';
    
    container.innerHTML = `
        <div style="padding: 30px; max-width: 1200px; margin: 0 auto;">
            <a href="events.html" style="display: inline-flex; align-items: center; gap: 8px; color: #4f8df5; text-decoration: none; margin-bottom: 20px;">
                <i class="fas fa-arrow-left"></i> К списку мероприятий
            </a>
            
            <div style="background: white; border-radius: 20px; padding: 30px; margin-bottom: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                <h1 style="font-size: 32px; color: #333; margin-bottom: 15px;">${event.title}</h1>
                ${communityHtml}
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 350px; gap: 30px; margin-bottom: 40px;">
                <div style="display: flex; flex-direction: column; gap: 20px;">
                    <div style="background: white; border-radius: 16px; padding: 25px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                        <h3 style="font-size: 16px; color: #666; margin-bottom: 15px;"><i class="fas fa-calendar-alt" style="color: #4f8df5;"></i> Дата и время</h3>
                        <p style="color: #333; font-size: 16px;">${event.date} в ${event.time || '00:00'}</p>
                    </div>
                    
                    <div style="background: white; border-radius: 16px; padding: 25px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                        <h3 style="font-size: 16px; color: #666; margin-bottom: 15px;"><i class="fas fa-map-marker-alt" style="color: #4f8df5;"></i> Место проведения</h3>
                        <p style="color: #333; font-size: 16px;">${event.location || 'Не указано'}</p>
                    </div>
                    
                    <div style="background: white; border-radius: 16px; padding: 25px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                        <h3 style="font-size: 16px; color: #666; margin-bottom: 15px;"><i class="fas fa-tag" style="color: #4f8df5;"></i> Формат</h3>
                        <span style="display: inline-block; padding: 6px 16px; border-radius: 30px; font-size: 14px; background: ${formatClass === 'online' ? '#e8f5e9' : '#e3f2fd'}; color: ${formatClass === 'online' ? '#2e7d32' : '#1976d2'};">${event.format}</span>
                    </div>
                    
                    <div style="background: white; border-radius: 16px; padding: 25px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                        <h3 style="font-size: 16px; color: #666; margin-bottom: 15px;"><i class="fas fa-align-left" style="color: #4f8df5;"></i> Описание</h3>
                        <p style="color: #666; line-height: 1.6;">${event.description || 'Нет описания'}</p>
                    </div>
                </div>
                
                <div>
                    <div style="background: white; border-radius: 16px; padding: 25px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                        <h3 style="font-size: 16px; color: #666; margin-bottom: 15px;"><i class="fas fa-user-tie" style="color: #4f8df5;"></i> Ответственный</h3>
                        <p style="color: #333;">${event.organizers || 'Не указан'}</p>
                    </div>
                    
                    ${communityPreviewHtml}
                    
                    <button id="registerEventBtn" data-id="${event.id}" style="width: 100%; padding: 16px; background: linear-gradient(135deg, #4f8df5, #7ab6ff); color: white; border: none; border-radius: 14px; font-size: 16px; font-weight: 600; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 10px;">
                        <i class="fas fa-check-circle"></i> Записаться
                    </button>
                </div>
            </div>
            
            <div style="background: white; border-radius: 20px; padding: 25px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                <h3 style="font-size: 18px; color: #333; margin-bottom: 20px;"><i class="fas fa-calendar-alt" style="color: #4f8df5;"></i> Похожие мероприятия</h3>
                <p style="color: #999; text-align: center; padding: 30px;">Здесь будут похожие мероприятия</p>
            </div>
        </div>
    `;
    
    // Добавляем обработчик для кнопки записи
    const registerBtn = document.getElementById('registerEventBtn');
    if (registerBtn) {
        registerBtn.addEventListener('click', () => {
            alert('Функция записи на мероприятие в разработке');
        });
    }
}

// Загружаем данные при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM полностью загружен');
    loadEvent();
});