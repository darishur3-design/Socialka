// Получаем ID из URL
const urlParams = new URLSearchParams(window.location.search);
const eventId = urlParams.get('id');

// Добавим отладку
console.log('EventReport: eventId from URL =', eventId);

async function loadReport() {
    if (!eventId) {
        console.error('Event ID not provided in URL');
        document.getElementById('reportContent').innerHTML = `
            <div class="error-message" style="text-align: center; padding: 50px;">
                <i class="fas fa-exclamation-circle" style="font-size: 60px; color: #ff6b6b; margin-bottom: 20px;"></i>
                <h2>Мероприятие не указано</h2>
                <p>В URL отсутствует ID мероприятия</p>
                <a href="events.html" class="auth-btn-large" style="display: inline-block; margin-top: 20px;">Вернуться к списку</a>
            </div>
        `;
        return;
    }
    
    try {
        console.log('Loading report for event ID:', eventId);
        
        // Загружаем данные мероприятия
        const response = await fetch(`http://localhost:8080/api/events/${eventId}`);
        if (!response.ok) {
            throw new Error(`Ошибка загрузки мероприятия: ${response.status}`);
        }
        const event = await response.json();
        console.log('Event loaded:', event);
        
        // Загружаем данные сообщества
        const communityResponse = await fetch(`http://localhost:8080/api/communities/${event.community_id}`);
        const community = await communityResponse.json();
        
        renderReport(event, community);
        
    } catch (error) {
        console.error('Ошибка загрузки:', error);
        document.getElementById('reportContent').innerHTML = `
            <div class="error-message" style="text-align: center; padding: 50px;">
                <i class="fas fa-exclamation-circle" style="font-size: 60px; color: #ff6b6b; margin-bottom: 20px;"></i>
                <h2>Ошибка загрузки отчета</h2>
                <p>${error.message}</p>
                <button onclick="location.reload()" class="auth-btn" style="margin-top: 20px;">Повторить</button>
            </div>
        `;
    }
}

function renderReport(event, community) {
    const reportContent = document.getElementById('reportContent');
    
    reportContent.innerHTML = `
        <div class="passport-header">
            <h1 class="passport-title">${event.title}</h1>
            <p class="passport-subtitle">${community.name}</p>
            <div style="display: flex; gap: 15px; margin-top: 15px;">
                <span><i class="fas fa-calendar"></i> ${event.date}</span>
                <span><i class="fas fa-map-marker-alt"></i> ${event.place}</span>
            </div>
        </div>
        
        <div class="info-section">
            <h3 class="section-title"><i class="fas fa-user-tie"></i> Руководство</h3>
            <div class="info-grid">
                <div class="info-item">
                    <div class="info-label">Руководитель сообщества</div>
                    <div class="info-value">${community.leader || 'Не указан'}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Ответственный</div>
                    <div class="info-value">${event.organizers || 'Не указан'}</div>
                </div>
            </div>
        </div>
        
        <div class="info-section">
            <h3 class="section-title"><i class="fas fa-align-left"></i> Описание</h3>
            <div class="description-box">${event.description || 'Нет описания'}</div>
        </div>
        
        <p class="placeholder-text" style="text-align: center; padding: 30px; color: #999;">
            <i class="fas fa-info-circle"></i> Полная информация из паспорта будет загружена после создания соответствующих таблиц в БД
        </p>
    `;
}

// Сохранение в PDF
document.getElementById('savePdfBtn').addEventListener('click', () => {
    window.print();
});

// Печать
document.getElementById('printBtn').addEventListener('click', () => {
    window.print();
});

document.addEventListener('DOMContentLoaded', loadReport);