// event-participant.js
const urlParams = new URLSearchParams(window.location.search);
const eventId = urlParams.get('id');

// Функция переключения вкладок
window.switchTab = function(tabName) {
    const infoTab = document.getElementById('infoTab');
    const participantTab = document.getElementById('participantTab');
    const infoContent = document.getElementById('infoContent');
    const participantContent = document.getElementById('participantContent');
    
    if (tabName === 'info') {
        infoTab.classList.add('active');
        participantTab.classList.remove('active');
        infoContent.classList.add('active');
        participantContent.classList.remove('active');
    } else {
        infoTab.classList.remove('active');
        participantTab.classList.add('active');
        infoContent.classList.remove('active');
        participantContent.classList.add('active');
        
        // Загружаем данные участника
        loadParticipantData();
    }
};

async function loadParticipantData() {
    const container = document.getElementById('participantContainer');
    
    if (!eventId) return;
    
    container.innerHTML = '<div class="loading">Загрузка...</div>';
    
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            container.innerHTML = '<p>Необходимо авторизоваться</p>';
            return;
        }
        
        // Загружаем информацию о мероприятии
        const eventResponse = await fetch(`http://localhost:8080/api/events/${eventId}`);
        const event = await eventResponse.json();
        
        // Загружаем сообщество
        const communityResponse = await fetch(`http://localhost:8080/api/communities/${event.community_id}`);
        const community = await communityResponse.json();
        
        // Загружаем QR-код
        const qrResponse = await fetch(`http://localhost:8080/api/events/${eventId}/participant-qr`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        let qrHtml = '';
        if (qrResponse.ok) {
            const qrData = await qrResponse.json();
            qrHtml = `<img src="${qrData.qrCode}" style="width: 250px; height: 250px; display: block; margin: 0 auto; border-radius: 8px;">`;
        } else {
            qrHtml = '<p style="color: #ff4444;">Ошибка загрузки QR-кода</p>';
        }
        
        container.innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <h2>Ваш QR-код на мероприятие</h2>
                <div style="margin: 20px 0;">
                    ${qrHtml}
                </div>
                <p style="color: #666; margin: 20px;">Предъявите этот код при входе на мероприятие</p>
                
                <div style="background: #f8f9fa; padding: 20px; border-radius: 12px; text-align: left; margin-top: 30px;">
                    <h3>Информация о мероприятии</h3>
                    <p><strong>Название:</strong> ${event.title}</p>
                    <p><strong>Сообщество:</strong> ${community.name}</p>
                    <p><strong>Дата:</strong> ${event.date} ${event.time || '10:00'}</p>
                    <p><strong>Место:</strong> ${event.location || 'Не указано'}</p>
                    <p><strong>Формат:</strong> ${event.format || 'Офлайн'}</p>
                    <p><strong>Описание:</strong> ${event.description || 'Нет описания'}</p>
                </div>
                
                <button onclick="downloadQRCode()" style="margin-top: 20px; padding: 12px 30px; background: #28a745; color: white; border: none; border-radius: 8px; cursor: pointer;">
                    Скачать QR-код
                </button>
            </div>
        `;
        
    } catch (error) {
        console.error('Ошибка:', error);
        container.innerHTML = '<p style="color: #ff4444;">Ошибка загрузки</p>';
    }
}

window.downloadQRCode = function() {
    const qrImg = document.querySelector('#participantContainer img');
    if (!qrImg) return;
    
    const link = document.createElement('a');
    link.download = 'qr-code.png';
    link.href = qrImg.src;
    link.click();
};