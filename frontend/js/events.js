// events.js

// Состояние фильтров
let filters = {
    date: null,
    time: 'all',
    community: 'all',
    format: 'all',
    location: 'all'
};

// Данные из БД
let eventsData = [];
let communitiesData = [];
let formatsData = [];

// Календарь
let currentDate = new Date();
let selectedDate = null;

function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}

function parseDate(dateStr) {
    const [day, month, year] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
}

function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 
                       'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
    
    document.getElementById('currentMonth').textContent = `${monthNames[month]} ${year}`;
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    let startDay = firstDay.getDay();
    if (startDay === 0) startDay = 6;
    else startDay--;
    
    const daysInMonth = lastDay.getDate();
    
    let calendarHtml = '';
    
    for (let i = 0; i < startDay; i++) {
        calendarHtml += '<div class="calendar-day empty"></div>';
    }
    
    for (let d = 1; d <= daysInMonth; d++) {
        const dateStr = formatDate(new Date(year, month, d));
        const isSelected = selectedDate === dateStr;
        calendarHtml += `<div class="calendar-day ${isSelected ? 'selected' : ''}" data-date="${dateStr}">${d}</div>`;
    }
    
    document.getElementById('calendarDays').innerHTML = calendarHtml;
}

// Загрузка данных из БД
async function loadData() {
    try {
        // Загрузка мероприятий с паспортами
        const eventsResponse = await fetch('http://localhost:8080/api/events_passports');
        eventsData = await eventsResponse.json();
        
        // Загрузка сообществ
        const communitiesResponse = await fetch('http://localhost:8080/api/communities');
        communitiesData = await communitiesResponse.json();
        
        // Загрузка форматов
        const formatsResponse = await fetch('http://localhost:8080/api/formats');
        formatsData = await formatsResponse.json();
        
        // Преобразуем даты из БД (в БД они в формате YYYY-MM-DD)
        eventsData = eventsData.map(event => ({
            ...event,
            date: formatDate(new Date(event.date)),
            // Получаем название формата по ID
            format: formatsData.find(f => f.id === event.format_id)?.name || 'Неизвестно',
            // Получаем название сообщества по ID
            community: communitiesData.find(c => c.id === event.community_id)?.name || 'Неизвестно'
        }));
        
        // Загружаем данные в фильтры
        loadFiltersData();
        renderEvents();
        
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        document.getElementById('eventsGrid').innerHTML = `
            <div style="text-align: center; padding: 50px; color: #ff4444;">
                <i class="fas fa-exclamation-circle"></i> Ошибка загрузки данных
            </div>
        `;
    }
}

// Загрузка данных в фильтры
function loadFiltersData() {
    // Загрузка сообществ
    const communityDropdown = document.getElementById('communityDropdown');
    let communityHtml = '<div class="dropdown-item" data-community="all">Все сообщества</div>';
    communitiesData.forEach(community => {
        communityHtml += `<div class="dropdown-item" data-community="${community.name}">${community.name}</div>`;
    });
    communityDropdown.innerHTML = communityHtml;
    
    // Загрузка форматов
    const formatDropdown = document.getElementById('formatDropdown');
    let formatHtml = '<div class="dropdown-item" data-format="all">Все форматы</div>';
    formatsData.forEach(format => {
        formatHtml += `<div class="dropdown-item" data-format="${format.name}">${format.name}</div>`;
    });
    formatDropdown.innerHTML = formatHtml;
    
    // Загрузка мест (уникальные значения из мероприятий)
    const locations = [...new Set(eventsData.map(e => e.place))];
    const locationDropdown = document.getElementById('locationDropdown');
    let locationHtml = '<div class="dropdown-item" data-location="all">Все места</div>';
    locations.forEach(location => {
        locationHtml += `<div class="dropdown-item" data-location="${location}">${location}</div>`;
    });
    locationDropdown.innerHTML = locationHtml;
}

// Фильтрация мероприятий
function filterEvents() {
    return eventsData.filter(event => {
        if (filters.date && event.date !== filters.date) return false;
        
        if (filters.time !== 'all') {
            const hour = parseInt(event.time.split(':')[0]);
            if (filters.time === 'morning' && hour >= 12) return false;
            if (filters.time === 'day' && (hour < 12 || hour >= 18)) return false;
            if (filters.time === 'evening' && hour < 18) return false;
        }
        
        if (filters.community !== 'all' && event.community !== filters.community) return false;
        if (filters.format !== 'all' && event.format !== filters.format) return false;
        if (filters.location !== 'all' && event.place !== filters.location) return false;
        
        return true;
    });
}

// Обновление активных фильтров
function updateActiveFilters() {
    const container = document.getElementById('activeFilters');
    container.innerHTML = '';
    
    if (filters.date) {
        container.innerHTML += `
            <span class="active-filter">
                ${filters.date} <i class="fas fa-times" onclick="removeFilter('date')"></i>
            </span>
        `;
    }
    
    if (filters.time !== 'all') {
        const timeLabels = { morning: 'Утро', day: 'День', evening: 'Вечер' };
        container.innerHTML += `
            <span class="active-filter">
                ${timeLabels[filters.time]} <i class="fas fa-times" onclick="removeFilter('time')"></i>
            </span>
        `;
    }
    
    if (filters.community !== 'all') {
        container.innerHTML += `
            <span class="active-filter">
                ${filters.community} <i class="fas fa-times" onclick="removeFilter('community')"></i>
            </span>
        `;
    }
    
    if (filters.format !== 'all') {
        container.innerHTML += `
            <span class="active-filter">
                ${filters.format} <i class="fas fa-times" onclick="removeFilter('format')"></i>
            </span>
        `;
    }
    
    if (filters.location !== 'all') {
        container.innerHTML += `
            <span class="active-filter">
                ${filters.location} <i class="fas fa-times" onclick="removeFilter('location')"></i>
            </span>
        `;
    }
}

// Удаление фильтра
window.removeFilter = function(filter) {
    if (filter === 'date') {
        filters.date = null;
        selectedDate = null;
    } else if (filter === 'time') {
        filters.time = 'all';
    } else if (filter === 'community') {
        filters.community = 'all';
    } else if (filter === 'format') {
        filters.format = 'all';
    } else if (filter === 'location') {
        filters.location = 'all';
    }
    renderEvents();
    updateActiveFilters();
};

// Рендер мероприятий
function renderEvents() {
    const grid = document.getElementById('eventsGrid');
    const filtered = filterEvents();
    
    if (filtered.length === 0) {
        grid.innerHTML = '<div style="text-align: center; padding: 50px; color: #666;">Мероприятия не найдены</div>';
        return;
    }
    
    grid.innerHTML = '';
    
    filtered.forEach(event => {
        const formatClass = event.format === 'Онлайн' ? 'online' : 'offline';
        
        const card = document.createElement('div');
        card.className = 'event-card';
        card.dataset.id = event.id;
        
        card.innerHTML = `
            <div class="event-info">
                <h3>${event.name}</h3>
                <div class="event-organizers">
                    <i class="fas fa-users"></i> организаторы: ${event.organizers || 'Не указаны'}
                </div>
                <div class="event-date">
                    <i class="far fa-calendar-alt"></i>
                    <span>${event.date}</span>
                </div>
            </div>
            <div class="event-tags">
                <span class="event-tag ${formatClass}">${event.format}</span>
                <span class="event-tag">${event.community}</span>
            </div>
            <div class="event-arrow">
                <i class="fas fa-chevron-right"></i>
            </div>
        `;
        
        card.addEventListener('click', () => openEventModal(event));
        grid.appendChild(card);
    });
}

function openEventModal(event) {
    document.getElementById('modalTitle').textContent = event.name;
    document.getElementById('modalOrganizers').innerHTML = `<i class="fas fa-users"></i> организаторы: ${event.organizers || 'Не указаны'}`;
    document.getElementById('modalDate').textContent = event.date;
    document.getElementById('modalTime').textContent = event.time || '00:00';
    document.getElementById('modalFormat').textContent = event.format;
    document.getElementById('modalLocation').textContent = event.place;
    document.getElementById('modalDescription').textContent = event.description;
    
    document.getElementById('eventModal').classList.add('active');
}

// Закрытие всех дропдаунов
function closeAllDropdowns() {
    document.querySelectorAll('.dropdown-menu').forEach(menu => {
        menu.classList.remove('show');
    });
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    renderCalendar();
    loadData();
    
    // ... (остальные обработчики событий такие же, как в вашем коде)
});