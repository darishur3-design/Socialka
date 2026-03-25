// Состояние приложения
let events = [];
let communities = [];
let formats = [];
let youthPolicies = [];
let currentEventId = null;
let currentStatusFilter = 'all';
let currentCommunityFilter = 'all';
let searchQuery = '';
let selectedEvents = new Set();

// Статусы мероприятий
const STATUS = {
    SENT: 1,
    APPROVED: 2,
    REJECTED: 3
};

const STATUS_TEXT = {
    1: { text: 'Отправлено', class: 'status-sent' },
    2: { text: 'Принято', class: 'status-approved' },
    3: { text: 'Отклонено', class: 'status-rejected' }
};

// Загрузка данных
async function loadData() {
    try {
        console.log('Загрузка данных для Профкома...');
        
        const eventsResponse = await fetch('http://localhost:8080/api/events');
        events = await eventsResponse.json();
        console.log('Загружены мероприятия:', events);
        
        const communitiesResponse = await fetch('http://localhost:8080/api/communities');
        communities = await communitiesResponse.json();
        console.log('Загружены сообщества:', communities);
        
        const formatsResponse = await fetch('http://localhost:8080/api/formats');
        formats = await formatsResponse.json();
        
        updateCommunityFilter();
        renderEvents();
        updateStats();
        
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        showError('Не удалось загрузить данные');
    }
}

function updateCommunityFilter() {
    const select = document.getElementById('communityFilter');
    if (!select) return;
    
    select.innerHTML = '<option value="all">Все сообщества</option>';
    
    communities.forEach(community => {
        select.innerHTML += `<option value="${community.id}">${community.name}</option>`;
    });
}

function updateStats() {
    const total = events.length;
    const sent = events.filter(e => e.status === STATUS.SENT).length;
    const approved = events.filter(e => e.status === STATUS.APPROVED).length;
    const rejected = events.filter(e => e.status === STATUS.REJECTED).length;
    
    const statTotal = document.getElementById('statTotal');
    const statSent = document.getElementById('statSent');
    const statApproved = document.getElementById('statApproved');
    const statRejected = document.getElementById('statRejected');
    
    if (statTotal) statTotal.textContent = total;
    if (statSent) statSent.textContent = sent;
    if (statApproved) statApproved.textContent = approved;
    if (statRejected) statRejected.textContent = rejected;
}

function filterEvents() {
    return events.filter(event => {
        if (currentStatusFilter !== 'all' && event.status !== parseInt(currentStatusFilter)) {
            return false;
        }
        
        if (currentCommunityFilter !== 'all' && event.community_id !== parseInt(currentCommunityFilter)) {
            return false;
        }
        
        if (searchQuery && !event.title.toLowerCase().includes(searchQuery.toLowerCase())) {
            return false;
        }
        
        return true;
    });
}

function renderEvents() {
    const tbody = document.getElementById('eventsList');
    if (!tbody) return;
    
    const filtered = filterEvents();
    
    if (filtered.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 50px; color: #666;">
                    <i class="fas fa-inbox"></i> Нет мероприятий
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = filtered.map(event => {
        const community = communities.find(c => c.id === event.community_id);
        const status = STATUS_TEXT[event.status] || { text: 'Неизвестно', class: '' };
        const isSelected = selectedEvents.has(event.id) ? 'checked' : '';
        
        return `
            <tr>
                <td style="width: 30px; text-align: center;">
                    <input type="checkbox" class="event-checkbox" data-id="${event.id}" ${isSelected} style="width: 16px; height: 16px; cursor: pointer;">
                </td>
                <td>${event.id}</td>
                <td><strong>${event.title}</strong></td>
                <td><span class="community-tag">${community?.name || 'Неизвестно'}</span></td>
                <td>${event.date || 'Не указана'}</td>
                <td>${event.place || 'Не указано'}</td>
                <td><span class="event-status ${status.class}">${status.text}</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn view" onclick="viewEventDetails(${event.id})">
                            <i class="fas fa-eye"></i>
                        </button>
                        ${event.status === STATUS.SENT ? `
                            <button class="action-btn approve" onclick="updateEventStatus(${event.id}, ${STATUS.APPROVED})">
                                <i class="fas fa-check"></i>
                            </button>
                            <button class="action-btn reject" onclick="updateEventStatus(${event.id}, ${STATUS.REJECTED})">
                                <i class="fas fa-times"></i>
                            </button>
                        ` : ''}
                    </div>
                </td>
            </tr>
        `;
    }).join('');
    
    updateSelectedCount();
}

function updateSelectedCount() {
    const checkboxes = document.querySelectorAll('.event-checkbox:checked');
    selectedEvents = new Set(Array.from(checkboxes).map(cb => parseInt(cb.dataset.id)));
    
    const selectedCountEl = document.getElementById('selectedCount');
    if (selectedCountEl) {
        selectedCountEl.textContent = `Выбрано: ${selectedEvents.size}`;
    }
    
    const bulkApproveBtn = document.getElementById('bulkApproveBtn');
    const bulkRejectBtn = document.getElementById('bulkRejectBtn');
    
    if (bulkApproveBtn && bulkRejectBtn) {
        if (selectedEvents.size > 0) {
            bulkApproveBtn.disabled = false;
            bulkRejectBtn.disabled = false;
        } else {
            bulkApproveBtn.disabled = true;
            bulkRejectBtn.disabled = true;
        }
    }
}

async function updateEventStatus(eventId, newStatus) {
    if (!confirm(`Изменить статус мероприятия на "${STATUS_TEXT[newStatus].text}"?`)) {
        return;
    }
    
    try {
        const token = localStorage.getItem('token');
        console.log('Updating event:', eventId, 'to status:', newStatus);
        
        const response = await fetch(`http://localhost:8080/api/events/${eventId}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status: newStatus })
        });
        
        console.log('Response status:', response.status);
        const responseText = await response.text();
        console.log('Response:', responseText);
        
        if (response.ok) {
            const event = events.find(e => e.id === eventId);
            if (event) {
                event.status = newStatus;
            }
            
            renderEvents();
            updateStats();
            closeDetailsModal();
            
            alert(`Статус изменен на "${STATUS_TEXT[newStatus].text}"`);
        } else {
            throw new Error(`Ошибка обновления статуса: ${responseText}`);
        }
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Не удалось изменить статус: ' + error.message);
    }
}

async function viewEventDetails(eventId) {
    try {
        console.log('Загрузка деталей мероприятия:', eventId);
        
        const eventResponse = await fetch(`http://localhost:8080/api/events/${eventId}`);
        if (!eventResponse.ok) throw new Error('Ошибка загрузки мероприятия');
        const event = await eventResponse.json();
        console.log('Детали мероприятия:', event);
        
        let community = null;
        if (event.community_id) {
            const communityResponse = await fetch(`http://localhost:8080/api/communities/${event.community_id}`);
            if (communityResponse.ok) {
                community = await communityResponse.json();
            }
        }
        
        const status = STATUS_TEXT[event.status] || { text: 'Неизвестно', class: '' };
        
        const formatDate = (dateString) => {
            if (!dateString) return 'Не указана';
            return dateString;
        };
        
        let mtoText = 'Нет';
        if (event.mto) {
            if (typeof event.mto === 'boolean') mtoText = event.mto ? 'Да' : 'Нет';
            else if (typeof event.mto === 'string' && event.mto) mtoText = event.mto;
            else if (Array.isArray(event.mto) && event.mto.length > 0) mtoText = event.mto.map(i => i.name || i).join(', ');
        }
        
        let printText = 'Нет';
        if (event.printing) {
            if (typeof event.printing === 'boolean') printText = event.printing ? 'Да' : 'Нет';
            else if (typeof event.printing === 'string' && event.printing) printText = event.printing;
            else if (Array.isArray(event.printing) && event.printing.length > 0) printText = event.printing.map(p => p.name || p).join(', ');
        }
        
        const eventPlace = event.location || event.place || 'Не указано';
        
        let detailsHtml = `
            <div style="font-family: inherit;">
                <div style="display: grid; gap: 12px;">
                    <div class="passport-item">
                        <div class="passport-label">НАЗВАНИЕ</div>
                        <div class="passport-value-large">${event.title || 'Не указано'}</div>
                    </div>
                    
                    <div class="passport-item">
                        <div class="passport-label">СООБЩЕСТВО</div>
                        <div class="passport-value">${community?.name || 'Не указано'}</div>
                    </div>
                    
                    <div class="passport-item">
                        <div class="passport-label">РУКОВОДИТЕЛЬ СООБЩЕСТВА</div>
                        <div class="passport-value">${event.community_leader || community?.leader || 'Не указан'}</div>
                    </div>
                    
                    <div class="passport-item">
                        <div class="passport-label">ОТВЕТСТВЕННЫЙ</div>
                        <div class="passport-value">${event.responsible_name || event.responsible || 'Не указан'}</div>
                    </div>
                    
                    <div class="passport-item">
                        <div class="passport-label">ДАТА И ВРЕМЯ</div>
                        <div class="passport-value">${formatDate(event.date)} ${event.time || '10:00'}</div>
                    </div>
                    
                    <div class="passport-item">
                        <div class="passport-label">МЕСТО</div>
                        <div class="passport-value">${eventPlace}</div>
                    </div>
                    
                    <div class="passport-item">
                        <div class="passport-label">ФОРМАТ</div>
                        <div class="passport-value">${event.format || 'Офлайн'}</div>
                    </div>
                    
                    <div class="passport-item">
                        <div class="passport-label">ЦЕЛЬ (SMART)</div>
                        <div class="passport-value">${event.smart_goal || 'Не указана'}</div>
                    </div>
                    
                    <div class="passport-item">
                        <div class="passport-label">ЦЕЛЕВАЯ АУДИТОРИЯ</div>
                        <div class="passport-value">${event.target_audience || 'Не указана'}</div>
                    </div>
                    
                    <div class="passport-item">
                        <div class="passport-label">КОЛИЧЕСТВЕННЫЕ ПОКАЗАТЕЛИ</div>
                        <div class="passport-value">${event.quantitative || 'Не указаны'}</div>
                    </div>
                    
                    <div class="passport-item">
                        <div class="passport-label">КАЧЕСТВЕННЫЕ ПОКАЗАТЕЛИ</div>
                        <div class="passport-value">${event.qualitative || 'Не указаны'}</div>
                    </div>
                    
                    <div class="passport-item">
                        <div class="passport-label">МТО</div>
                        <div class="passport-value">${mtoText}</div>
                    </div>
                    
                    <div class="passport-item">
                        <div class="passport-label">ПЕЧАТНАЯ ПРОДУКЦИЯ</div>
                        <div class="passport-value">${printText}</div>
                    </div>
                    
                    <div class="passport-item">
                        <div class="passport-label">СТАТУС МЕРОПРИЯТИЯ</div>
                        <div class="passport-value">
                            <span class="event-status ${status.class}" style="display: inline-block; padding: 4px 12px; border-radius: 20px;">${status.text}</span>
                        </div>
                    </div>
                    
                    <div class="passport-item">
                        <div class="passport-label">ОПИСАНИЕ МЕРОПРИЯТИЯ</div>
                        <div class="description-box">
                            ${event.description || 'Нет описания'}
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('detailsTitle').textContent = 'Паспорт мероприятия';
        document.getElementById('detailsContent').innerHTML = detailsHtml;
        
        const actionsDiv = document.getElementById('detailsActions');
        if (event.status === STATUS.SENT) {
            actionsDiv.style.display = 'flex';
            const approveBtn = document.getElementById('approveEventBtn');
            const rejectBtn = document.getElementById('rejectEventBtn');
            if (approveBtn) approveBtn.style.display = 'block';
            if (rejectBtn) rejectBtn.style.display = 'block';
            document.getElementById('approveEventBtn').onclick = () => updateEventStatus(eventId, STATUS.APPROVED);
            document.getElementById('rejectEventBtn').onclick = () => updateEventStatus(eventId, STATUS.REJECTED);
        } else {
            actionsDiv.style.display = 'flex';
            const approveBtn = document.getElementById('approveEventBtn');
            const rejectBtn = document.getElementById('rejectEventBtn');
            if (approveBtn) approveBtn.style.display = 'none';
            if (rejectBtn) rejectBtn.style.display = 'none';
        }
        
        document.getElementById('detailsModal').classList.add('active');
        
    } catch (error) {
        console.error('Ошибка загрузки деталей:', error);
        alert('Не удалось загрузить детали мероприятия: ' + error.message);
    }
}

function closeDetailsModal() {
    const modal = document.getElementById('detailsModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function showError(message) {
    const tbody = document.getElementById('eventsList');
    if (!tbody) return;
    
    tbody.innerHTML = `
        <tr>
            <td colspan="8" style="text-align: center; padding: 50px; color: #ff4444;">
                <i class="fas fa-exclamation-circle"></i> ${message}
            </td>
        </tr>
    `;
}

async function bulkApprove() {
    if (selectedEvents.size === 0) return;
    
    if (!confirm(`Одобрить ${selectedEvents.size} мероприятий?`)) return;
    
    const token = localStorage.getItem('token');
    let success = 0;
    let failed = 0;
    
    for (const eventId of selectedEvents) {
        try {
            const response = await fetch(`http://localhost:8080/api/events/${eventId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: STATUS.APPROVED })
            });
            
            if (response.ok) {
                const event = events.find(e => e.id === eventId);
                if (event) event.status = STATUS.APPROVED;
                success++;
            } else {
                failed++;
            }
        } catch (error) {
            console.error('Ошибка:', error);
            failed++;
        }
    }
    
    alert(`Одобрено: ${success}, ошибок: ${failed}`);
    selectedEvents.clear();
    renderEvents();
    updateStats();
}

async function bulkReject() {
    if (selectedEvents.size === 0) return;
    
    if (!confirm(`Отклонить ${selectedEvents.size} мероприятий?`)) return;
    
    const token = localStorage.getItem('token');
    let success = 0;
    let failed = 0;
    
    for (const eventId of selectedEvents) {
        try {
            const response = await fetch(`http://localhost:8080/api/events/${eventId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: STATUS.REJECTED })
            });
            
            if (response.ok) {
                const event = events.find(e => e.id === eventId);
                if (event) event.status = STATUS.REJECTED;
                success++;
            } else {
                failed++;
            }
        } catch (error) {
            console.error('Ошибка:', error);
            failed++;
        }
    }
    
    alert(`Отклонено: ${success}, ошибок: ${failed}`);
    selectedEvents.clear();
    renderEvents();
    updateStats();
}

function exportToCSV() {
    const filtered = filterEvents();
    
    if (filtered.length === 0) {
        alert('Нет данных для экспорта');
        return;
    }
    
    const headers = ['ID', 'Название', 'Сообщество', 'Дата', 'Место', 'Статус'];
    
    const rows = filtered.map(event => {
        const community = communities.find(c => c.id === event.community_id);
        const status = STATUS_TEXT[event.status]?.text || 'Неизвестно';
        
        return [
            event.id,
            event.title,
            community?.name || 'Неизвестно',
            event.date || '',
            event.place || '',
            status
        ];
    });
    
    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', `meropriyatiya_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// ========== ФУНКЦИИ ДЛЯ ФОРМЫ СОЗДАНИЯ МЕРОПРИЯТИЯ ==========

async function loadCommunityMembers(communityId) {
    try {
        const response = await fetch(`http://localhost:8080/api/members_communities/community/${communityId}`);
        if (!response.ok) throw new Error('Ошибка загрузки участников');
        const members = await response.json();
        console.log('Загружены участники сообщества:', members);
        return members;
    } catch (error) {
        console.error('Ошибка загрузки участников:', error);
        return [];
    }
}

function addTeamMemberRow(members) {
    const container = document.getElementById('teamContainer');
    if (!container) return;
    
    const newRow = document.createElement('div');
    newRow.className = 'team-member-row';
    newRow.style.cssText = 'display: grid; grid-template-columns: 1fr 1fr auto; gap: 10px; margin-bottom: 10px;';
    
    let selectHtml = '<select class="team-member-select" style="padding: 8px; border: 1px solid #e0e0e0; border-radius: 8px;">';
    selectHtml += '<option value="">Выберите участника</option>';
    members.forEach(member => {
        selectHtml += `<option value="${member.userId}">${member.userName}</option>`;
    });
    selectHtml += '</select>';
    
    newRow.innerHTML = `
        ${selectHtml}
        <input type="text" class="team-role" placeholder="Зона ответственности">
        <button type="button" class="remove-row-btn"><i class="fas fa-times"></i></button>
    `;
    container.appendChild(newRow);
    
    newRow.querySelector('.remove-row-btn').addEventListener('click', () => {
        newRow.remove();
    });
}

function addTimelineRow(members) {
    const container = document.getElementById('timelineContainer');
    if (!container) return;
    
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
        <button type="button" class="remove-row-btn"><i class="fas fa-times"></i></button>
    `;
    container.appendChild(newRow);
    
    newRow.querySelector('.remove-row-btn').addEventListener('click', () => {
        newRow.remove();
    });
}

function addBudgetRow() {
    const container = document.getElementById('budgetContainer');
    if (!container) return;
    
    const newRow = document.createElement('div');
    newRow.className = 'budget-row';
    newRow.style.cssText = 'display: grid; grid-template-columns: 2fr 1fr 1fr 1fr auto; gap: 10px; margin-bottom: 10px;';
    newRow.innerHTML = `
        <input type="text" class="budget-item" placeholder="Статья расходов">
        <input type="number" class="budget-price" placeholder="Цена" min="0">
        <input type="number" class="budget-quantity" placeholder="Кол-во" min="1" value="1">
        <input type="text" class="budget-total" placeholder="Итого" readonly>
        <button type="button" class="remove-row-btn"><i class="fas fa-times"></i></button>
    `;
    container.appendChild(newRow);
    
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
    
    newRow.querySelector('.remove-row-btn').addEventListener('click', () => {
        newRow.remove();
    });
}

function addMtoRow() {
    const container = document.getElementById('mtoContainer');
    if (!container) return;
    
    const newRow = document.createElement('div');
    newRow.className = 'mto-row';
    newRow.style.cssText = 'display: grid; grid-template-columns: 1fr auto; gap: 10px; margin-bottom: 10px;';
    newRow.innerHTML = `
        <input type="text" class="mto-item" placeholder="Наименование">
        <button type="button" class="remove-row-btn"><i class="fas fa-times"></i></button>
    `;
    container.appendChild(newRow);
    
    newRow.querySelector('.remove-row-btn').addEventListener('click', () => {
        newRow.remove();
    });
}

function addPrintRow() {
    const container = document.getElementById('printContainer');
    if (!container) return;
    
    const newRow = document.createElement('div');
    newRow.className = 'print-row';
    newRow.style.cssText = 'display: grid; grid-template-columns: 2fr 1fr 1fr 1fr 1fr auto; gap: 10px; margin-bottom: 10px;';
    newRow.innerHTML = `
        <input type="text" class="print-name" placeholder="Наименование">
        <input type="text" class="print-format" placeholder="Формат" value="A4">
        <input type="text" class="print-paper" placeholder="Бумага" value="Плотная">
        <input type="number" class="print-price" placeholder="Цена" min="0">
        <input type="number" class="print-quantity" placeholder="Кол-во" min="1" value="1">
        <button type="button" class="remove-row-btn"><i class="fas fa-times"></i></button>
    `;
    container.appendChild(newRow);
    
    newRow.querySelector('.remove-row-btn').addEventListener('click', () => {
        newRow.remove();
    });
}

// ========== МОДАЛЬНОЕ ОКНО СОЗДАНИЯ ЗАЯВКИ ==========

const eventModal = document.getElementById('eventModal');
const createEventBtn = document.getElementById('createEventBtn');
const closeModalBtn = document.getElementById('closeModal');
const cancelModalBtn = document.getElementById('cancelModalBtn');
const eventForm = document.getElementById('eventForm');

if (createEventBtn) {
    createEventBtn.addEventListener('click', async () => {
        eventModal.classList.add('active');
        
        const communitySelect = document.getElementById('eventCommunity');
        if (communitySelect) {
            communitySelect.innerHTML = '<option value="">Выберите сообщество</option>';
            communities.forEach(community => {
                communitySelect.innerHTML += `<option value="${community.id}">${community.name}</option>`;
            });
        }
        
        document.getElementById('teamContainer').innerHTML = '';
        document.getElementById('timelineContainer').innerHTML = '';
        document.getElementById('budgetContainer').innerHTML = '';
        document.getElementById('mtoContainer').innerHTML = '';
        document.getElementById('printContainer').innerHTML = '';
        
        const responsibleSelect = document.getElementById('eventResponsible');
        const leaderSelect = document.getElementById('communityLeader');
        if (responsibleSelect) responsibleSelect.innerHTML = '<option value="">Выберите ответственного</option>';
        if (leaderSelect) leaderSelect.innerHTML = '<option value="">Выберите руководителя</option>';
    });
}

document.getElementById('eventCommunity')?.addEventListener('change', async (e) => {
    const communityId = e.target.value;
    if (!communityId) return;
    
    const members = await loadCommunityMembers(communityId);
    console.log('Участники выбранного сообщества:', members);
    
    const responsibleSelect = document.getElementById('eventResponsible');
    if (responsibleSelect) {
        responsibleSelect.innerHTML = '<option value="">Выберите ответственного</option>';
        members.forEach(member => {
            responsibleSelect.innerHTML += `<option value="${member.id}">${member.userName}</option>`;
        });
    }
    
    const leaderSelect = document.getElementById('communityLeader');
    if (leaderSelect) {
        leaderSelect.innerHTML = '<option value="">Выберите руководителя</option>';
        members.forEach(member => {
            leaderSelect.innerHTML += `<option value="${member.id}">${member.userName}</option>`;
        });
    }
});

document.getElementById('addTeamMemberBtn')?.addEventListener('click', async () => {
    const communityId = document.getElementById('eventCommunity')?.value;
    if (!communityId) {
        alert('Сначала выберите сообщество');
        return;
    }
    const members = await loadCommunityMembers(communityId);
    addTeamMemberRow(members);
});

document.getElementById('addTimelineBtn')?.addEventListener('click', async () => {
    const communityId = document.getElementById('eventCommunity')?.value;
    if (!communityId) {
        alert('Сначала выберите сообщество');
        return;
    }
    const members = await loadCommunityMembers(communityId);
    addTimelineRow(members);
});

document.getElementById('addBudgetBtn')?.addEventListener('click', addBudgetRow);
document.getElementById('addMtoBtn')?.addEventListener('click', addMtoRow);
document.getElementById('addPrintBtn')?.addEventListener('click', addPrintRow);

if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
        eventModal.classList.remove('active');
        eventForm.reset();
    });
}

if (cancelModalBtn) {
    cancelModalBtn.addEventListener('click', () => {
        eventModal.classList.remove('active');
        eventForm.reset();
    });
}

if (eventModal) {
    eventModal.addEventListener('click', (e) => {
        if (e.target === eventModal) {
            eventModal.classList.remove('active');
            eventForm.reset();
        }
    });
}

// ========== ОТПРАВКА ФОРМЫ ==========
if (eventForm) {
    eventForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Необходимо авторизоваться');
            window.location.href = 'auth.html';
            return;
        }
        
        // Получаем значения полей
        const eventName = document.getElementById('eventName');
        const eventDescription = document.getElementById('eventFullDescription');
        const eventDate = document.getElementById('eventDate');
        const eventTime = document.getElementById('eventTime');
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
        const eventCommunity = document.getElementById('eventCommunity');
        
        // Получаем имя руководителя
        const leaderSelect = document.getElementById('communityLeader');
        const leaderName = leaderSelect.options[leaderSelect.selectedIndex]?.text || '';
        
        // Получаем имя ответственного
        const responsibleSelect = document.getElementById('eventResponsible');
        const responsibleName = responsibleSelect.options[responsibleSelect.selectedIndex]?.text || '';
        
        if (!eventName || !eventDate || !eventPlace || !eventFormat || !eventResponsible || !eventCommunity) {
            alert('Ошибка: не все поля формы найдены');
            return;
        }
        
        // Проверяем заполнение обязательных полей
        if (!eventName.value.trim()) {
            alert('Введите название мероприятия');
            return;
        }
        if (!eventDate.value) {
            alert('Выберите дату проведения');
            return;
        }
        if (!eventPlace.value.trim()) {
            alert('Введите место проведения');
            return;
        }
        if (!eventResponsible.value) {
            alert('Выберите ответственного');
            return;
        }
        if (!responsiblePhone.value.trim()) {
            alert('Введите телефон ответственного');
            return;
        }
        if (!eventSmartGoal.value.trim()) {
            alert('Введите цель мероприятия (по SMART)');
            return;
        }
        if (!eventTargetAudience.value.trim()) {
            alert('Введите целевую аудиторию');
            return;
        }
        if (!eventQuantitative.value.trim()) {
            alert('Введите количественные показатели');
            return;
        }
        if (!eventQualitative.value.trim()) {
            alert('Введите качественные показатели');
            return;
        }
        
        // Формируем данные для отправки
        const eventData = {
            name: eventName.value,
            description: eventDescription ? eventDescription.value : '',
            date: eventDate.value,
            time: eventTime ? eventTime.value : '10:00',
            place: eventPlace.value,
            format_id: parseInt(eventFormat.value),
            community_id: parseInt(eventCommunity.value),
            responsible: parseInt(eventResponsible.value),
            responsible_phone: responsiblePhone.value,
            community_leader: leaderName,
            smart_goal: eventSmartGoal.value,
            direction_id: eventDirection ? parseInt(eventDirection.value) : 1,
            target_audience: eventTargetAudience.value,
            quantitative: eventQuantitative.value,
            qualitative: eventQualitative.value,
            event_level: 1,
            community_role_id: 1,
            status: 1
        };
        
        console.log('Отправляемые данные мероприятия:', eventData);
        
        try {
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
            
            alert('Заявка успешно отправлена!');
            eventModal.classList.remove('active');
            eventForm.reset();
            
            document.getElementById('teamContainer').innerHTML = '';
            document.getElementById('timelineContainer').innerHTML = '';
            document.getElementById('budgetContainer').innerHTML = '';
            document.getElementById('mtoContainer').innerHTML = '';
            document.getElementById('printContainer').innerHTML = '';
            
            await loadData();
            
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Произошла ошибка: ' + error.message);
        }
    });
}

// ========== ИНИЦИАЛИЗАЦИЯ ==========

document.addEventListener('DOMContentLoaded', async () => {
    console.log('profkom-management.js загружен');
    await loadData();
    
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentStatusFilter = tab.dataset.status;
            renderEvents();
        });
    });
    
    const selectAll = document.getElementById('selectAll');
    if (selectAll) {
        selectAll.addEventListener('change', (e) => {
            const checkboxes = document.querySelectorAll('.event-checkbox');
            checkboxes.forEach(cb => {
                cb.checked = e.target.checked;
            });
            updateSelectedCount();
        });
    }
    
    const eventsList = document.getElementById('eventsList');
    if (eventsList) {
        eventsList.addEventListener('change', (e) => {
            if (e.target.classList.contains('event-checkbox')) {
                updateSelectedCount();
                
                const allCheckboxes = document.querySelectorAll('.event-checkbox');
                const checkedCheckboxes = document.querySelectorAll('.event-checkbox:checked');
                const selectAll = document.getElementById('selectAll');
                if (selectAll) {
                    selectAll.checked = allCheckboxes.length === checkedCheckboxes.length;
                }
            }
        });
    }
    
    const bulkApproveBtn = document.getElementById('bulkApproveBtn');
    if (bulkApproveBtn) {
        bulkApproveBtn.addEventListener('click', bulkApprove);
    }
    
    const bulkRejectBtn = document.getElementById('bulkRejectBtn');
    if (bulkRejectBtn) {
        bulkRejectBtn.addEventListener('click', bulkReject);
    }
    
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportToCSV);
    }
    
    const statusFilter = document.getElementById('statusFilter');
    if (statusFilter) {
        statusFilter.addEventListener('change', (e) => {
            currentStatusFilter = e.target.value;
            renderEvents();
        });
    }
    
    const communityFilter = document.getElementById('communityFilter');
    if (communityFilter) {
        communityFilter.addEventListener('change', (e) => {
            currentCommunityFilter = e.target.value;
            renderEvents();
        });
    }
    
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value;
            renderEvents();
        });
    }
    
    const closeDetailsModalBtn = document.getElementById('closeDetailsModal');
    if (closeDetailsModalBtn) {
        closeDetailsModalBtn.addEventListener('click', closeDetailsModal);
    }
    
    const closeDetailsBtn = document.getElementById('closeDetailsBtn');
    if (closeDetailsBtn) {
        closeDetailsBtn.addEventListener('click', closeDetailsModal);
    }
    
    const detailsModal = document.getElementById('detailsModal');
    if (detailsModal) {
        detailsModal.addEventListener('click', (e) => {
            if (e.target === detailsModal) {
                closeDetailsModal();
            }
        });
    }
});

window.viewEventDetails = viewEventDetails;
window.updateEventStatus = updateEventStatus;
window.closeDetailsModal = closeDetailsModal;