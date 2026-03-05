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
    if (!dateString) return '—';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}

// Расчет стажа
function calculateExperience(dateJoining) {
    if (!dateJoining) return '—';
    const join = new Date(dateJoining);
    const now = new Date();
    
    const years = now.getFullYear() - join.getFullYear();
    const months = now.getMonth() - join.getMonth();
    const days = now.getDate() - join.getDate();
    
    let totalMonths = years * 12 + months;
    if (days < 0) totalMonths--;
    
    if (totalMonths >= 12) {
        const totalYears = Math.floor(totalMonths / 12);
        return totalYears + ' ' + getYearWord(totalYears);
    } else if (totalMonths > 0) {
        return totalMonths + ' ' + getMonthWord(totalMonths);
    } else {
        return 'менее месяца';
    }
}

function getYearWord(years) {
    if (years % 10 === 1 && years % 100 !== 11) return 'год';
    if (years % 10 >= 2 && years % 10 <= 4 && (years % 100 < 10 || years % 100 >= 20)) return 'года';
    return 'лет';
}

function getMonthWord(months) {
    if (months % 10 === 1 && months % 100 !== 11) return 'месяц';
    if (months % 10 >= 2 && months % 10 <= 4 && (months % 100 < 10 || months % 100 >= 20)) return 'месяца';
    return 'месяцев';
}

// Загрузка участников сообщества для селекторов
async function loadCommunityMembers() {
    try {
        const response = await fetch(`http://localhost:8080/api/members_communities/community/${communityId}`);
        if (!response.ok) throw new Error('Ошибка загрузки участников');
        const members = await response.json();
        return members;
    } catch (error) {
        console.error('Ошибка загрузки участников:', error);
        return [];
    }
}

async function loadCommunityData() {
    if (!communityId) {
        window.location.href = 'organizations.html';
        return;
    }

    try {
        // Загружаем данные сообщества
        const response = await fetch(`http://localhost:8080/api/communities/${communityId}`);
        if (!response.ok) throw new Error('Ошибка загрузки сообщества');
        const community = await response.json();
        
        document.getElementById('communityName').textContent = community.name;
        document.getElementById('communityTheme').textContent = community.thematics || 'Без тематики';
        
        // Данные о главе сообщества
        document.getElementById('communityLeader').textContent = community.leader || 'Не назначен';
        document.getElementById('communityCreationDate').textContent = 
            community.creationYear ? `${community.creationYear} год` : '—';
        
        const iconClass = getIconClass(community.thematics);
        const iconName = getIconName(community.thematics);
        document.getElementById('communityIcon').className = `community-icon-large ${iconClass}`;
        document.getElementById('communityIcon').innerHTML = `<i class="${iconName}"></i>`;
        
        document.getElementById('backLink').href = `community.html?id=${communityId}`;
        
        // Загружаем участников
        await loadMembers(communityId);
        
        // Загружаем мероприятия
        await loadEvents(communityId);
        
    } catch (error) {
        console.error('Ошибка загрузки:', error);
        alert('Ошибка загрузки данных сообщества');
    }
}

async function loadMembers(communityId) {
    try {
        const response = await fetch(`http://localhost:8080/api/members_communities/community/${communityId}`);
        
        if (!response.ok) {
            throw new Error('Ошибка загрузки участников');
        }
        
        const members = await response.json();
        console.log('Загружены участники:', members);
        
        renderMembers(members);
        
    } catch (error) {
        console.error('Ошибка загрузки участников:', error);
        document.getElementById('membersList').innerHTML = `
            <tr>
                <td colspan="3" style="text-align: center; padding: 30px; color: #666;">
                    <i class="fas fa-exclamation-circle"></i> Ошибка загрузки участников
                </td>
            </tr>
        `;
    }
}

function renderMembers(members) {
    const sortBy = document.getElementById('memberSort').value;
    
    let sortedMembers = [...members];
    if (sortBy === 'experience') {
        sortedMembers.sort((a, b) => new Date(b.dateJoining) - new Date(a.dateJoining));
    } else if (sortBy === 'events') {
        sortedMembers.sort((a, b) => (b.eventsCount || 0) - (a.eventsCount || 0));
    } else if (sortBy === 'name') {
        sortedMembers.sort((a, b) => a.userName.localeCompare(b.userName));
    }
    
    const tbody = document.getElementById('membersList');
    
    if (sortedMembers.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="3" style="text-align: center; padding: 30px; color: #666;">
                    <i class="fas fa-users"></i> В сообществе пока нет участников
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = sortedMembers.map(member => `
        <tr>
            <td>
                <div class="member-name">
                    <div class="member-avatar">${member.userName ? member.userName.charAt(0) : '?'}</div>
                    ${member.userName || 'Без имени'}
                </div>
            </td>
            <td>${calculateExperience(member.dateJoining)}</td>
            <td>${member.eventsCount || 0}</td>
        </tr>
    `).join('');
}

async function loadEvents(communityId) {
    try {
        const response = await fetch(`http://localhost:8080/api/events?community_id=${communityId}`);
        
        if (!response.ok) {
            throw new Error('Ошибка загрузки мероприятий');
        }
        
        const events = await response.json();
        console.log('Загружены мероприятия:', events);
        
        const eventsList = document.getElementById('eventsList');
        
        if (events.length === 0) {
            eventsList.innerHTML = '<p class="placeholder-text">Нет мероприятий</p>';
            return;
        }
        
        eventsList.innerHTML = events.map(event => {
            const status = event.status || 1;
            const statusClass = status === 2 ? 'approved' : (status === 3 ? 'rejected' : '');
            const statusText = status === 2 ? 'Одобрено' : (status === 3 ? 'Отклонено' : 'На рассмотрении');
            
            return `
                <div class="event-item" onclick="location.href='event.html?id=${event.id}'">
                    <div class="event-info">
                        <h4>${event.title}</h4>
                        <p>
                            <i class="fas fa-users"></i> организаторы: ${event.organizers || 'Профком'}
                            <i class="fas fa-calendar-alt" style="margin-left: 15px;"></i> ${formatDate(event.date)}
                        </p>
                    </div>
                    <span class="event-status ${statusClass}">${statusText}</span>
                </div>
            `;
        }).join('');
        
    } catch (error) {
        console.error('Ошибка загрузки мероприятий:', error);
        document.getElementById('eventsList').innerHTML = `
            <p class="placeholder-text" style="color: #ff4444;">
                <i class="fas fa-exclamation-circle"></i> Ошибка загрузки мероприятий
            </p>
        `;
    }
}

// Модальное окно создания мероприятия
const modal = document.getElementById('eventModal');
const createBtn = document.getElementById('createEventBtn');
const closeBtn = document.getElementById('closeModal');
const eventForm = document.getElementById('eventForm');

if (createBtn) {
    createBtn.addEventListener('click', async () => {
        modal.classList.add('active');
        
        // Загружаем участников для селекторов
        const members = await loadCommunityMembers();
        
        // Заполняем команду мероприятия (если есть)
        const teamContainer = document.getElementById('teamContainer');
        if (teamContainer.children.length === 0) {
            // Добавляем первую строку по умолчанию
            addTeamMemberRow(members);
        }
        
        // Заполняем сценарный план (если есть)
        const timelineContainer = document.getElementById('timelineContainer');
        if (timelineContainer.children.length === 0) {
            // Добавляем две строки по умолчанию
            addTimelineRow(members);
            addTimelineRow(members);
        }
    });
}

if (closeBtn) {
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });
}

if (modal) {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
}

// Функция для добавления строки команды
function addTeamMemberRow(members) {
    const container = document.getElementById('teamContainer');
    const newRow = document.createElement('div');
    newRow.className = 'team-member-row';
    newRow.style.cssText = 'display: grid; grid-template-columns: 1fr 1fr auto; gap: 10px; margin-bottom: 10px;';
    
    let selectHtml = '<select class="team-member-select" style="padding: 12px; border: 1px solid #e0e0e0; border-radius: 12px;">';
    selectHtml += '<option value="">Выберите участника</option>';
    members.forEach(member => {
        selectHtml += `<option value="${member.userId}">${member.userName}</option>`;
    });
    selectHtml += '</select>';
    
    newRow.innerHTML = `
        ${selectHtml}
        <input type="text" class="team-role" placeholder="Зона ответственности">
        <button type="button" class="remove-team-btn" style="background: #ff6b6b; color: white; border: none; width: 30px; height: 30px; border-radius: 8px; cursor: pointer;">×</button>
    `;
    container.appendChild(newRow);
    
    newRow.querySelector('.remove-team-btn').addEventListener('click', () => {
        newRow.remove();
    });
}

// В функции addTimelineRow - убираем value
function addTimelineRow(members) {
    const container = document.getElementById('timelineContainer');
    const newRow = document.createElement('div');
    newRow.className = 'timeline-row';
    newRow.style.cssText = 'display: grid; grid-template-columns: 100px 1fr 1fr 1fr auto; gap: 10px; margin-bottom: 10px;';
    
    let selectHtml = '<select class="timeline-responsible-select" style="padding: 8px; border: 1px solid #e0e0e0; border-radius: 8px;">';
    selectHtml += '<option value="">Ответственный</option>';
    members.forEach(member => {
        selectHtml += `<option value="${member.userId}">${member.userName}</option>`;
    });
    selectHtml += '</select>';
    
    newRow.innerHTML = `
        <input type="text" class="timeline-time" placeholder="Время">
        <input type="text" class="timeline-place" placeholder="Место">
        <input type="text" class="timeline-desc" placeholder="Что происходит">
        ${selectHtml}
        <button type="button" class="remove-timeline-btn" style="background: #ff6b6b; color: white; border: none; width: 30px; height: 30px; border-radius: 8px; cursor: pointer;">×</button>
    `;
    container.appendChild(newRow);
    
    newRow.querySelector('.remove-timeline-btn').addEventListener('click', () => {
        newRow.remove();
    });
}

// При открытии модального окна НЕ добавляем строки по умолчанию
if (createBtn) {
    createBtn.addEventListener('click', async () => {
        modal.classList.add('active');
        
        // Загружаем участников для селекторов, но НЕ добавляем строки автоматически
        const members = await loadCommunityMembers();
        
        // Очищаем контейнеры от возможных старых строк
        document.getElementById('teamContainer').innerHTML = '';
        document.getElementById('timelineContainer').innerHTML = '';
        document.getElementById('budgetContainer').innerHTML = '';
        document.getElementById('mtoContainer').innerHTML = '';
        document.getElementById('printContainer').innerHTML = '';
    });
}

// Динамическое добавление полей формы
document.getElementById('addTeamMemberBtn').addEventListener('click', async () => {
    const members = await loadCommunityMembers();
    addTeamMemberRow(members);
});

document.getElementById('addTimelineBtn').addEventListener('click', async () => {
    const members = await loadCommunityMembers();
    addTimelineRow(members);
});

document.getElementById('addBudgetBtn').addEventListener('click', () => {
    const container = document.getElementById('budgetContainer');
    const newRow = document.createElement('div');
    newRow.className = 'budget-row';
    newRow.style.cssText = 'display: grid; grid-template-columns: 2fr 1fr 1fr 1fr auto; gap: 10px; margin-bottom: 10px;';
    newRow.innerHTML = `
        <input type="text" class="budget-item" placeholder="Статья расходов">
        <input type="number" class="budget-price" placeholder="Цена" min="0">
        <input type="number" class="budget-quantity" placeholder="Кол-во" min="1" value="1">
        <input type="text" class="budget-total" placeholder="Итого" readonly>
        <button type="button" class="remove-budget-btn" style="background: #ff6b6b; color: white; border: none; width: 30px; height: 30px; border-radius: 8px; cursor: pointer;">×</button>
    `;
    container.appendChild(newRow);
    
    newRow.querySelector('.remove-budget-btn').addEventListener('click', () => {
        newRow.remove();
    });
    
    // Расчет итого
    const priceInput = newRow.querySelector('.budget-price');
    const quantityInput = newRow.querySelector('.budget-quantity');
    const totalInput = newRow.querySelector('.budget-total');
    
    function calculateTotal() {
        const price = parseFloat(priceInput.value) || 0;
        const quantity = parseFloat(quantityInput.value) || 0;
        totalInput.value = (price * quantity).toFixed(2);
    }
    
    priceInput.addEventListener('input', calculateTotal);
    quantityInput.addEventListener('input', calculateTotal);
});

document.getElementById('addMtoBtn').addEventListener('click', () => {
    const container = document.getElementById('mtoContainer');
    const newRow = document.createElement('div');
    newRow.className = 'mto-row';
    newRow.style.cssText = 'display: grid; grid-template-columns: 1fr auto; gap: 10px; margin-bottom: 10px;';
    newRow.innerHTML = `
        <input type="text" class="mto-item" placeholder="Наименование">
        <button type="button" class="remove-mto-btn" style="background: #ff6b6b; color: white; border: none; width: 30px; height: 30px; border-radius: 8px; cursor: pointer;">×</button>
    `;
    container.appendChild(newRow);
    
    newRow.querySelector('.remove-mto-btn').addEventListener('click', () => {
        newRow.remove();
    });
});

document.getElementById('addPrintBtn').addEventListener('click', () => {
    const container = document.getElementById('printContainer');
    const newRow = document.createElement('div');
    newRow.className = 'print-row';
    newRow.style.cssText = 'display: grid; grid-template-columns: 2fr 1fr 1fr 1fr 1fr auto; gap: 10px; margin-bottom: 10px;';
    newRow.innerHTML = `
        <input type="text" class="print-name" placeholder="Наименование">
        <input type="text" class="print-format" placeholder="Формат" value="A4">
        <input type="text" class="print-paper" placeholder="Бумага" value="Плотная">
        <input type="number" class="print-price" placeholder="Цена" min="0">
        <input type="number" class="print-quantity" placeholder="Кол-во" min="1" value="1">
        <button type="button" class="remove-print-btn" style="background: #ff6b6b; color: white; border: none; width: 30px; height: 30px; border-radius: 8px; cursor: pointer;">×</button>
    `;
    container.appendChild(newRow);
    
    newRow.querySelector('.remove-print-btn').addEventListener('click', () => {
        newRow.remove();
    });
});

if (eventForm) {
    eventForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Необходимо авторизоваться');
            window.location.href = 'auth.html';
            return;
        }
        
        // Проверяем наличие всех необходимых элементов
        const eventName = document.getElementById('eventName');
        const eventDescription = document.getElementById('eventFullDescription');
        const eventDate = document.getElementById('eventDate');
        const eventPlace = document.getElementById('eventPlace');
        const eventFormat = document.getElementById('eventFormat');
        const eventResponsible = document.getElementById('eventResponsible');
        const responsiblePhone = document.getElementById('responsiblePhone');
        const communityLeader = document.getElementById('communityLeader');
        const eventSmartGoal = document.getElementById('eventSmartGoal');
        const eventDirection = document.getElementById('eventDirection');
        const eventTargetAudience = document.getElementById('eventTargetAudience');
        const eventQuantitative = document.getElementById('eventQuantitative');
        const eventQualitative = document.getElementById('eventQualitative');
        
        // Проверяем, что все обязательные поля существуют
        if (!eventName || !eventDate || !eventPlace || !eventFormat || !eventResponsible) {
            alert('Ошибка: не все поля формы найдены');
            return;
        }
        
        // Собираем данные для основного мероприятия
        const eventData = {
            name: eventName.value,
            description: eventDescription ? eventDescription.value : '',
            date: eventDate.value,
            place: eventPlace.value,
            format_id: parseInt(eventFormat.value),
            community_id: parseInt(communityId),
            responsible: eventResponsible.value,
            responsible_phone: responsiblePhone ? responsiblePhone.value : '',
            community_leader: communityLeader ? communityLeader.value : '',
            smart_goal: eventSmartGoal ? eventSmartGoal.value : '',
            direction_id: eventDirection ? parseInt(eventDirection.value) : 1,
            target_audience: eventTargetAudience ? eventTargetAudience.value : '',
            quantitative: eventQuantitative ? eventQuantitative.value : '',
            qualitative: eventQualitative ? eventQualitative.value : '',
            status: 1 // Отправлено
        };
        
        console.log('Отправляемые данные мероприятия:', eventData);
        
        try {
            // СОЗДАЕМ МЕРОПРИЯТИЕ
            const eventResponse = await fetch('http://localhost:8080/api/events', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(eventData)
            });
            
            if (!eventResponse.ok) {
                const errorText = await eventResponse.text();
                console.error('Ошибка ответа:', eventResponse.status, errorText);
                throw new Error(`Ошибка создания мероприятия: ${eventResponse.status}`);
            }
            
            const createdEvent = await eventResponse.json();
            console.log('Мероприятие создано:', createdEvent);
            
            const newEventId = createdEvent.id || createdEvent.eventId;
            
            if (!newEventId) {
                throw new Error('Не удалось получить ID созданного мероприятия');
            }
            
            alert('Мероприятие успешно создано!');
            modal.classList.remove('active');
            eventForm.reset();
            loadEvents(communityId);
            
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Произошла ошибка: ' + error.message);
        }
    });
}

// Сортировка участников
const sortSelect = document.getElementById('memberSort');
if (sortSelect) {
    sortSelect.addEventListener('change', () => {
        loadMembers(communityId);
    });
}

// Кнопка создания отчета
const reportBtn = document.getElementById('createReportBtn');
if (reportBtn) {
    reportBtn.addEventListener('click', () => {
        // Нужно выбрать мероприятие для отчета
        const events = document.querySelectorAll('.event-item');
        if (events.length === 0) {
            alert('Нет мероприятий для создания отчета');
            return;
        }
        // По умолчанию берем первое мероприятие
        const firstEventId = events[0]?.getAttribute('onclick')?.match(/\d+/)?.[0];
        if (firstEventId) {
            window.location.href = `event-report.html?id=${firstEventId}`;
        } else {
            alert('Не удалось определить ID мероприятия');
        }
    });
}
// Загружаем данные при загрузке страницы
document.addEventListener('DOMContentLoaded', loadCommunityData);
