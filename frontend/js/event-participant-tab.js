// event-participant.js
const urlParams = new URLSearchParams(window.location.search);
const eventId = urlParams.get('id');

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
        loadParticipantData();
    }
};

async function loadParticipantData() {
    const container = document.getElementById('participantContainer');
    if (!eventId) return;
    
    container.innerHTML = '<div class="loading">Загрузка...</div>';
    
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:8080/api/events/${eventId}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        const event = await response.json();

        container.innerHTML = `
            <div class="participant-info" style="text-align: center;">
                <div class="qr-code-container" style="background: white; padding: 20px; border-radius: 16px; display: inline-block; margin-bottom: 20px;">
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=event_${event.id}_user" id="qrImage">
                </div>
                
                <div style="background: #f8f9fa; padding: 25px; border-radius: 15px; text-align: left; margin-top: 20px; border: 1px solid #e2e8f0;">
                    <h3 style="color: #4f8df5; margin-bottom: 15px; border-bottom: 2px solid #4f8df5; padding-bottom: 5px;">Полный паспорт мероприятия</h3>
                    <div style="display: grid; gap: 10px; font-size: 0.95rem;">
                        <p><strong>Название:</strong> ${event.title}</p>
                        <p><strong>Цель:</strong> ${event.goal || 'Не указана'}</p>
                        <p><strong>Задачи:</strong> ${event.tasks || 'Не указаны'}</p>
                        <p><strong>Дата и время:</strong> ${event.date} в ${event.time || '10:00'}</p>
                        <p><strong>Место:</strong> ${event.location}</p>
                        <p><strong>Формат:</strong> ${event.format}</p>
                        <p><strong>МТО:</strong> ${event.mto || 'Не требуется'}</p>
                        <p><strong>Печатная продукция:</strong> ${event.printing || 'Не требуется'}</p>
                        <p><strong>Описание:</strong> ${event.description}</p>
                    </div>
                </div>
                
                <button onclick="downloadQRCode()" class="auth-btn" style="margin-top: 20px; width: 100%;">
                    <i class="fas fa-download"></i> Скачать QR-код
                </button>
            </div>
        `;
    } catch (error) {
        container.innerHTML = '<p style="color: red;">Ошибка загрузки полного паспорта</p>';
    }
}