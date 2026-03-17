// home.js
document.addEventListener("DOMContentLoaded", () => {
    const pageTitle = document.getElementById("pageTitle");
    const navButtons = document.querySelectorAll(".nav-btn");

    navButtons.forEach(button => {
        button.addEventListener("click", () => {

            // active состояние
            navButtons.forEach(b => b.classList.remove("active"));
            button.classList.add("active");

            // убираем emoji и лишние символы
            const чистыйТекст = button.textContent
                .replace(/^[^\p{L}]+/gu, "")
                .trim();

            // специальная проверка для кнопки Мероприятия
            if (чистыйТекст === "Мероприятия") {
                window.location.href = "events.html";
                return; // останавливаем выполнение, чтобы не менять заголовок
            }

            // обновляем заголовок для остальных кнопок
            pageTitle.textContent = чистыйТекст;
        });
    });
});

// home.js

async function loadHomeData() {
    try {
        await loadUpcomingEvents();
        await loadCommunitiesStats();
    } catch (error) {
        console.error('Ошибка загрузки данных главной страницы:', error);
    }
}

async function loadUpcomingEvents() {
    try {
        const response = await fetch('http://localhost:8080/api/events');
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
        
        const events = await response.json();
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Фильтруем (статус 2 + не прошедшие), сортируем по дате и берем 2 ближайших
        const upcomingEvents = events
            .filter(event => {
                if (event.status !== 2) return false;
                const eventDate = new Date(event.date);
                eventDate.setHours(0, 0, 0, 0);
                return eventDate >= today;
            })
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(0, 2); 
        
        const container = document.getElementById('upcomingEvents');
        
        if (upcomingEvents.length === 0) {
            container.innerHTML = `
                <div style="background: white; padding: 30px; border-radius: 20px; text-align: center; border: 1px solid #e2e8f0; color: #64748b;">
                    На ближайшее время мероприятий не запланировано
                </div>`;
            return;
        }
        
        const commRes = await fetch('http://localhost:8080/api/communities');
        const communities = await commRes.json();
        
        container.innerHTML = upcomingEvents.map(event => {
            const community = communities.find(c => c.id === event.community_id);
            const formatClass = event.format === 'Онлайн' ? 'online' : 'offline';
            
            const eventDate = new Date(event.date);
            const formattedDate = eventDate.toLocaleDateString('ru-RU', {
                day: 'numeric', month: 'long', year: 'numeric'
            });
            
            return `
                <div class="event-row" onclick="location.href='event.html?id=${event.id}'">
                    <div class="event-info">
                        <span class="event-date-blue"><i class="far fa-calendar-alt"></i> ${formattedDate}</span>
                        <h3>${event.title}</h3>
                        <div class="event-meta">
                            <span><i class="fas fa-users"></i> ${community?.name || 'Сообщество'}</span>
                            <span><i class="fas fa-map-marker-alt"></i> ${event.place || 'Не указано'}</span>
                            <span><i class="fas fa-clock"></i> ${event.time || '10:00'}</span>
                        </div>
                    </div>
                    <div class="event-format ${formatClass}">${event.format || 'Офлайн'}</div>
                </div>
            `;
        }).join('');
        
    } catch (err) {
        console.error(err);
        document.getElementById('upcomingEvents').innerHTML = 'Не удалось загрузить ближайшие события.';
    }
}

async function loadCommunitiesStats() {
    try {
        const res = await fetch('http://localhost:8080/api/communities');
        const data = await res.json();
        document.getElementById('communitiesCount').textContent = data.length;
    } catch (err) {
        document.getElementById('communitiesCount').textContent = '—';
    }
}

document.addEventListener("DOMContentLoaded", () => {
    // Навигация
    const navButtons = document.querySelectorAll(".nav-btn");
    navButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const text = btn.textContent.replace(/^[^\p{L}]+/gu, "").trim();
            if (text === "Мероприятия") window.location.href = "events.html";
            if (text === "Сообщества") window.location.href = "organizations.html";
        });
    });
    
    loadHomeData();
});