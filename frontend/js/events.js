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
        // Загрузка мероприятий
        console.log('Загрузка мероприятий...');
        const eventsResponse = await fetch('http://localhost:8080/api/events');
        
        if (!eventsResponse.ok) {
            throw new Error(`HTTP error! status: ${eventsResponse.status}`);
        }
        
        eventsData = await eventsResponse.json();
        console.log('Загружены мероприятия:', eventsData);
        
        // Загрузка сообществ
        const communitiesResponse = await fetch('http://localhost:8080/api/communities');
        communitiesData = await communitiesResponse.json();
        
        // Загрузка форматов
        const formatsResponse = await fetch('http://localhost:8080/api/formats');
        formatsData = await formatsResponse.json();
        
        // Загружаем данные в фильтры
        loadFiltersData();
        renderEvents();
        
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        document.getElementById('eventsGrid').innerHTML = `
            <div style="text-align: center; padding: 50px; color: #ff4444;">
                <i class="fas fa-exclamation-circle"></i> Ошибка загрузки данных: ${error.message}
                <br><br>
                <button onclick="location.reload()" class="auth-btn" style="padding: 10px 20px;">
                    Повторить
                </button>
            </div>
        `;
    }
}

// Загрузка данных в фильтры
function loadFiltersData() {
    // Загрузка сообществ
    const communityDropdown = document.getElementById('communityDropdown');
    if (communityDropdown) {
        let communityHtml = '<div class="dropdown-item" data-community="all">Все сообщества</div>';
        communitiesData.forEach(community => {
            communityHtml += `<div class="dropdown-item" data-community="${community.name}">${community.name}</div>`;
        });
        communityDropdown.innerHTML = communityHtml;
    }
    
    // Загрузка форматов
    const formatDropdown = document.getElementById('formatDropdown');
    if (formatDropdown) {
        let formatHtml = '<div class="dropdown-item" data-format="all">Все форматы</div>';
        formatsData.forEach(format => {
            formatHtml += `<div class="dropdown-item" data-format="${format.name}">${format.name}</div>`;
        });
        formatDropdown.innerHTML = formatHtml;
    }
    
    // Загрузка мест (уникальные значения из мероприятий)
    const locations = [...new Set(eventsData.map(e => e.location).filter(Boolean))];
    const locationDropdown = document.getElementById('locationDropdown');
    if (locationDropdown) {
        let locationHtml = '<div class="dropdown-item" data-location="all">Все места</div>';
        locations.forEach(location => {
            locationHtml += `<div class="dropdown-item" data-location="${location}">${location}</div>`;
        });
        locationDropdown.innerHTML = locationHtml;
    }
}

// Фильтрация мероприятий
function filterEvents() {
    return eventsData.filter(event => {
        // Фильтр по дате
        if (filters.date && event.date !== filters.date) return false;
        
        // Фильтр по времени
        if (filters.time !== 'all') {
            const hour = parseInt(event.time?.split(':')[0] || '0');
            if (filters.time === 'morning' && hour >= 12) return false;
            if (filters.time === 'day' && (hour < 12 || hour >= 18)) return false;
            if (filters.time === 'evening' && hour < 18) return false;
        }
        
        // Фильтр по сообществу
        if (filters.community !== 'all' && event.community !== filters.community) return false;
        
        // Фильтр по формату
        if (filters.format !== 'all' && event.format !== filters.format) return false;
        
        // Фильтр по месту
        if (filters.location !== 'all' && event.location !== filters.location) return false;
        
        return true;
    });
}

// Обновление активных фильтров
function updateActiveFilters() {
    const container = document.getElementById('activeFilters');
    if (!container) return;
    
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
    if (!grid) return;
    
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
                <h3>${event.title}</h3>
                <div class="event-organizers">
                    <i class="fas fa-users"></i> организаторы: ${event.community || 'Не указаны'}
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
        
        card.addEventListener('click', () => {
            window.location.href = `event.html?id=${event.id}`;
        });
        
        grid.appendChild(card);
    });
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
    
    // Дата фильтр
    const dateFilter = document.getElementById('dateFilter');
    const dateDropdown = document.getElementById('dateDropdown');
    
    if (dateFilter && dateDropdown) {
        dateFilter.addEventListener('click', (e) => {
            e.stopPropagation();
            closeAllDropdowns();
            dateDropdown.classList.toggle('show');
        });
    }
    
    const prevMonth = document.getElementById('prevMonth');
    if (prevMonth) {
        prevMonth.addEventListener('click', (e) => {
            e.stopPropagation();
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderCalendar();
        });
    }
    
    const nextMonth = document.getElementById('nextMonth');
    if (nextMonth) {
        nextMonth.addEventListener('click', (e) => {
            e.stopPropagation();
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderCalendar();
        });
    }
    
    const calendarDays = document.getElementById('calendarDays');
    if (calendarDays) {
        calendarDays.addEventListener('click', (e) => {
            e.stopPropagation();
            const day = e.target.closest('.calendar-day[data-date]');
            if (day) {
                document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected'));
                day.classList.add('selected');
                selectedDate = day.dataset.date;
            }
        });
    }
    
    const applyDate = document.getElementById('applyDate');
    if (applyDate) {
        applyDate.addEventListener('click', (e) => {
            e.stopPropagation();
            if (selectedDate) {
                filters.date = selectedDate;
                dateDropdown.classList.remove('show');
                renderEvents();
                updateActiveFilters();
            }
        });
    }
    
    const clearDate = document.getElementById('clearDate');
    if (clearDate) {
        clearDate.addEventListener('click', (e) => {
            e.stopPropagation();
            selectedDate = null;
            filters.date = null;
            document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected'));
            dateDropdown.classList.remove('show');
            renderEvents();
            updateActiveFilters();
        });
    }
    
    // Время фильтр
    const timeFilter = document.getElementById('timeFilter');
    const timeDropdown = document.getElementById('timeDropdown');
    
    if (timeFilter && timeDropdown) {
        timeFilter.addEventListener('click', (e) => {
            e.stopPropagation();
            closeAllDropdowns();
            timeDropdown.classList.toggle('show');
        });
        
        timeDropdown.addEventListener('click', (e) => {
            e.stopPropagation();
            const item = e.target.closest('.dropdown-item');
            if (item) {
                filters.time = item.dataset.time;
                timeDropdown.classList.remove('show');
                renderEvents();
                updateActiveFilters();
            }
        });
    }
    
    // Сообщество фильтр
    const communityFilter = document.getElementById('communityFilter');
    const communityDropdown = document.getElementById('communityDropdown');
    
    if (communityFilter && communityDropdown) {
        communityFilter.addEventListener('click', (e) => {
            e.stopPropagation();
            closeAllDropdowns();
            communityDropdown.classList.toggle('show');
        });
        
        communityDropdown.addEventListener('click', (e) => {
            e.stopPropagation();
            const item = e.target.closest('.dropdown-item');
            if (item) {
                filters.community = item.dataset.community;
                communityDropdown.classList.remove('show');
                renderEvents();
                updateActiveFilters();
            }
        });
    }
    
    // Формат фильтр
    const formatFilter = document.getElementById('formatFilter');
    const formatDropdown = document.getElementById('formatDropdown');
    
    if (formatFilter && formatDropdown) {
        formatFilter.addEventListener('click', (e) => {
            e.stopPropagation();
            closeAllDropdowns();
            formatDropdown.classList.toggle('show');
        });
        
        formatDropdown.addEventListener('click', (e) => {
            e.stopPropagation();
            const item = e.target.closest('.dropdown-item');
            if (item) {
                filters.format = item.dataset.format;
                formatDropdown.classList.remove('show');
                renderEvents();
                updateActiveFilters();
            }
        });
    }
    
    // Место фильтр
    const locationFilter = document.getElementById('locationFilter');
    const locationDropdown = document.getElementById('locationDropdown');
    
    if (locationFilter && locationDropdown) {
        locationFilter.addEventListener('click', (e) => {
            e.stopPropagation();
            closeAllDropdowns();
            locationDropdown.classList.toggle('show');
        });
        
        locationDropdown.addEventListener('click', (e) => {
            e.stopPropagation();
            const item = e.target.closest('.dropdown-item');
            if (item) {
                filters.location = item.dataset.location;
                locationDropdown.classList.remove('show');
                renderEvents();
                updateActiveFilters();
            }
        });
    }
    
    // Закрытие дропдаунов при клике вне
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.filter-item')) {
            closeAllDropdowns();
        }
    });
});