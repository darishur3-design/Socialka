// communities.js

// Данные из БД
let communitiesData = [];
let joinedCommunities = new Set();

// Загрузка сообществ из БД
async function loadCommunities() {
    try {
        console.log('Загрузка сообществ...');
        const response = await fetch('http://localhost:8080/api/communities');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        communitiesData = await response.json();
        console.log('Загружены сообщества:', communitiesData);
        
        renderCommunities();
        
    } catch (error) {
        console.error('Ошибка загрузки сообществ:', error);
        document.getElementById('communitiesGrid').innerHTML = `
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

// Рендер карточек сообществ
function renderCommunities() {
    const grid = document.getElementById('communitiesGrid');
    if (!grid) return;
    
    if (communitiesData.length === 0) {
        grid.innerHTML = '<div style="text-align: center; padding: 50px;">Нет сообществ</div>';
        return;
    }
    
    grid.innerHTML = '';
    
    communitiesData.forEach(community => {
        const isJoined = joinedCommunities.has(community.id);
        
        const card = document.createElement('div');
        card.className = 'community-card';
        card.dataset.id = community.id;
        
        card.innerHTML = `
            <div class="community-icon ${community.iconClass || getIconClass(community.thematics)}">
                <i class="${community.iconName || getIconName(community.thematics)}"></i>
            </div>
            <h3 class="community-name">${community.name}</h3>
            <p class="community-theme">${community.thematics || 'Без тематики'}</p>
            <div class="community-footer">
                <div class="community-stats">
                    <span class="stat"><i class="fas fa-users"></i> ${community.membersCount || 0}</span>
                    <span class="stat"><i class="fas fa-calendar"></i> ${community.eventsCount || 0}</span>
                </div>
                <button class="join-btn ${isJoined ? 'joined' : ''}" data-id="${community.id}">
                    ${isJoined ? 'Вы вступили' : 'Вступить'}
                </button>
            </div>
        `;
        
        card.addEventListener('click', (e) => {
            if (!e.target.classList.contains('join-btn')) {
                window.location.href = `community.html?id=${community.id}`;
            }
        });
        
        grid.appendChild(card);
    });
    
    // Обработчики для кнопок вступления
    document.querySelectorAll('.join-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.stopPropagation();
            const id = parseInt(btn.dataset.id);
            const community = communitiesData.find(c => c.id === id);
            
            // Проверяем авторизацию
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Необходимо авторизоваться');
                window.location.href = 'auth.html';
                return;
            }
            
            if (joinedCommunities.has(id)) {
                // Выход из сообщества
                try {
                    const response = await fetch(`http://localhost:8080/api/members_communities/${id}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    
                    if (response.ok) {
                        joinedCommunities.delete(id);
                        btn.textContent = 'Вступить';
                        btn.classList.remove('joined');
                        alert(`Вы покинули сообщество "${community.name}"`);
                    }
                } catch (error) {
                    console.error('Ошибка при выходе из сообщества:', error);
                    alert('Ошибка при выходе из сообщества');
                }
            } else {
                // Вступление в сообщество
                try {
                    const response = await fetch('http://localhost:8080/api/members_communities', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            community_id: id,
                            date_joining: new Date().toISOString().split('T')[0],
                            role_id: 1 // Обычный участник
                        })
                    });
                    
                    if (response.ok) {
                        joinedCommunities.add(id);
                        btn.textContent = 'Вы вступили';
                        btn.classList.add('joined');
                        alert(`Вы вступили в сообщество "${community.name}"`);
                    }
                } catch (error) {
                    console.error('Ошибка при вступлении в сообщество:', error);
                    alert('Ошибка при вступлении в сообщество');
                }
            }
        });
    });
}

// Загрузка состояния вступления пользователя
async function loadUserMemberships() {
    try {
        const token = localStorage.getItem('token');
        if (!token) return;
        
        const response = await fetch('http://localhost:8080/api/members_communities/user', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            const memberships = await response.json();
            joinedCommunities = new Set(memberships.map(m => m.community_id));
        }
    } catch (error) {
        console.error('Ошибка загрузки членства:', error);
    }
}

// Инициализация
document.addEventListener('DOMContentLoaded', async () => {
    await loadCommunities();
    await loadUserMemberships();
});