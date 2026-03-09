// Получаем ID из URL
const urlParams = new URLSearchParams(window.location.search);
const communityId = urlParams.get('id');

console.log('Community ID from URL:', communityId);

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
    if (dateString.includes('-') && dateString.length === 10) {
        return dateString;
    }
    try {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    } catch (e) {
        return dateString;
    }
}

async function loadCommunity() {
    console.log('loadCommunity started, communityId:', communityId);
    
    const container = document.getElementById('communityContainer');
    if (!container) {
        console.error('Container not found!');
        return;
    }
    
    if (!communityId) {
        container.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <h2>Сообщество не указано</h2>
                <p>В URL отсутствует ID сообщества</p>
                <a href="organizations.html" class="auth-btn-large">Вернуться к списку</a>
            </div>
        `;
        return;
    }

    try {
        container.innerHTML = `
            <div class="loading">
                <i class="fas fa-spinner"></i> Загрузка сообщества...
            </div>
        `;
        
        console.log('Fetching community data for ID:', communityId);
        
        const response = await fetch(`http://localhost:8080/api/communities/${communityId}`);
        
        console.log('Response status:', response.status);
        
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Сообщество не найдено');
            }
            throw new Error(`Ошибка сервера: ${response.status}`);
        }
        
        const community = await response.json();
        console.log('Community data loaded:', community);
        
        community.iconClass = getIconClass(community.thematics);
        community.icon = getIconName(community.thematics);
        
        let events = [];
        try {
            console.log('Loading events for community:', communityId);
            const eventsResponse = await fetch(`http://localhost:8080/api/events?community_id=${communityId}`);
            if (eventsResponse.ok) {
                events = await eventsResponse.json();
                console.log('Events loaded:', events.length);
            } else {
                console.log('Filter endpoint not available, loading all events');
                const allEventsResponse = await fetch('http://localhost:8080/api/events');
                if (allEventsResponse.ok) {
                    const allEvents = await allEventsResponse.json();
                    events = allEvents.filter(e => e.community_id == communityId);
                    console.log('Filtered events:', events.length);
                }
            }
        } catch (e) {
            console.log('Error loading events:', e);
        }
        
        renderCommunity(community, events);
        
        await loadJoinStatus(community.id);
        
    } catch (error) {
        console.error('Error in loadCommunity:', error);
        container.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <h2>Ошибка загрузки сообщества</h2>
                <p>${error.message}</p>
                <button onclick="location.reload()" class="auth-btn" style="margin: 20px; padding: 10px 30px;">
                    Повторить
                </button>
                <br>
                <a href="organizations.html" class="auth-btn-large">Вернуться к списку</a>
            </div>
        `;
    }
}

function renderCommunity(community, events) {
    const container = document.getElementById('communityContainer');
    
    // Получаем информацию о главе сообщества
    const communityLeader = community.leader || 'Не назначен';
    
    container.innerHTML = `
        <div class="community-page">
            <div class="community-header">
                <div class="community-icon ${community.iconClass}">
                    <i class="${community.icon}"></i>
                </div>
                <div class="community-header-info">
                    <h1 class="community-title">${community.name}</h1>
                    <p class="community-theme">${community.thematics || 'Без тематики'}</p>
                </div>
            </div>
            
            <div class="community-stats-grid">
                <div class="stat-card-large">
                    <div class="stat-value">${community.membersCount || 0}</div>
                    <div class="stat-label">участников</div>
                </div>
                <div class="stat-card-large">
                    <div class="stat-value">${events.length}</div>
                    <div class="stat-label">мероприятий</div>
                </div>
            </div>
            
            <div class="info-card">
                <h3><i class="fas fa-user-tie"></i> Глава сообщества</h3>
                <p style="font-size: 18px; font-weight: 500; color: #4f8df5;">${communityLeader}</p>
            </div>
            
            <div class="info-card">
                <h3><i class="fas fa-info-circle"></i> О сообществе</h3>
                <p>${community.description || 'Нет описания'}</p>
            </div>
            
            <div class="info-card">
                <h3><i class="fas fa-calendar-alt"></i> Мероприятия сообщества</h3>
                <div class="community-events-list" id="communityEventsList">
                    ${renderEventsList(events)}
                </div>
            </div>
            
            <button class="join-btn-large" id="joinCommunityBtn" data-id="${community.id}">
                <i class="fas fa-user-plus"></i> Вступить в сообщество
            </button>
            
            <div id="managementBtnContainer" style="margin-top: 15px;"></div>
        </div>
    `;
    
    const joinBtn = document.getElementById('joinCommunityBtn');
    if (joinBtn) {
        joinBtn.addEventListener('click', toggleJoinCommunity);
    }
}

function renderEventsList(events) {
    if (!events || events.length === 0) {
        return '<p class="placeholder-text">Нет мероприятий</p>';
    }
    
    return events.map(event => `
        <div class="event-item" onclick="location.href='event.html?id=${event.id}'">
            <div>
                <h4>${event.title}</h4>
                <p><i class="far fa-calendar-alt"></i> ${formatDate(event.date)}</p>
            </div>
            <i class="fas fa-chevron-right"></i>
        </div>
    `).join('');
}

async function loadJoinStatus(communityId) {
    try {
        const token = localStorage.getItem('token');
        if (!token) return;
        
        console.log('Checking join status for community:', communityId);
        
        const response = await fetch(`http://localhost:8080/api/members_communities/check?community_id=${communityId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            const isJoined = await response.json();
            console.log('Join status:', isJoined);
            
            const joinBtn = document.getElementById('joinCommunityBtn');
            if (joinBtn) {
                if (isJoined) {
                    joinBtn.innerHTML = '<i class="fas fa-check"></i> Вы в сообществе';
                    joinBtn.classList.add('joined');
                    
                    const managementContainer = document.getElementById('managementBtnContainer');
                    if (managementContainer) {
                        const PROFCOM_ID = 1;
                        
                        if (communityId == PROFCOM_ID) {
                            managementContainer.innerHTML = `
                                <a href="profkom-management.html" class="join-btn-large" style="background: linear-gradient(135deg, #ff8a3d, #ffb347); text-decoration: none; display: block; text-align: center;">
                                    <i class="fas fa-cog"></i> Управление Профкома
                                </a>
                            `;
                        } else {
                            managementContainer.innerHTML = `
                                <a href="community-management.html?id=${communityId}" class="join-btn-large" style="background: linear-gradient(135deg, #28a745, #34ce57); text-decoration: none; display: block; text-align: center;">
                                    <i class="fas fa-cog"></i> Управление сообществом
                                </a>
                            `;
                        }
                    }
                } else {
                    const managementContainer = document.getElementById('managementBtnContainer');
                    if (managementContainer) {
                        managementContainer.innerHTML = '';
                    }
                }
            }
        }
    } catch (error) {
        console.error('Error loading join status:', error);
    }
}

async function toggleJoinCommunity(e) {
    const btn = e.currentTarget;
    const communityId = btn.dataset.id;
    const isJoined = btn.classList.contains('joined');
    
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Необходимо авторизоваться');
            window.location.href = 'auth.html';
            return;
        }
        
        console.log('Toggling membership for community:', communityId);
        console.log('Is joined:', isJoined);
        
        if (isJoined) {
            const response = await fetch(`http://localhost:8080/api/members_communities/${communityId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                btn.innerHTML = '<i class="fas fa-user-plus"></i> Вступить в сообщество';
                btn.classList.remove('joined');
                
                const managementContainer = document.getElementById('managementBtnContainer');
                if (managementContainer) {
                    managementContainer.innerHTML = '';
                }
                
                alert('Вы покинули сообщество');
            } else {
                const error = await response.text();
                console.error('Error leaving:', error);
                alert('Ошибка при выходе из сообщества');
            }
        } else {
            const response = await fetch('http://localhost:8080/api/members_communities', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    community_id: parseInt(communityId),
                    date_joining: new Date().toISOString().split('T')[0],
                    role_id: 1
                })
            });
            
            if (response.ok) {
                btn.innerHTML = '<i class="fas fa-check"></i> Вы в сообществе';
                btn.classList.add('joined');
                
                const managementContainer = document.getElementById('managementBtnContainer');
                if (managementContainer) {
                    managementContainer.innerHTML = `
                        <a href="community-management.html?id=${communityId}" class="join-btn-large" style="background: linear-gradient(135deg, #28a745, #34ce57); text-decoration: none; display: block; text-align: center;">
                            <i class="fas fa-cog"></i> Управление сообществом
                        </a>
                    `;
                }
                
                alert('Вы вступили в сообщество');
            } else {
                const error = await response.text();
                console.error('Error joining:', error);
                alert('Ошибка при вступлении в сообщество');
            }
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Произошла ошибка: ' + error.message);
    }
}

document.addEventListener('DOMContentLoaded', loadCommunity);