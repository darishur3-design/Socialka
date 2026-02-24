// communities.js

// Данные из БД
let communitiesData = [];
let joinedCommunities = new Set();

// Загрузка сообществ из БД
async function loadCommunities() {
    try {
        // Запрос к бэкенду для получения сообществ
        const response = await fetch('http://localhost:8080/api/communities');
        communitiesData = await response.json();
        
        // Данные уже содержат membersCount и eventsCount из SQL запроса!
        // Просто добавляем иконки
        communitiesData = communitiesData.map(community => ({
            ...community,
            iconClass: getIconClass(community.thematics),
            icon: getIconName(community.thematics)
        }));
        
        renderCommunities();
    } catch (error) {
        console.error('Ошибка загрузки сообществ:', error);
        document.getElementById('communitiesGrid').innerHTML = `
            <div style="text-align: center; padding: 50px; color: #ff4444;">
                <i class="fas fa-exclamation-circle"></i> Ошибка загрузки данных
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
            <div class="community-icon ${community.iconClass}">
                <i class="${community.icon}"></i>
            </div>
            <h3 class="community-name">${community.name}</h3>
            <p class="community-theme">${community.thematics}</p>
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
        
        // Открытие модального окна при клике на карточку
        card.addEventListener('click', (e) => {
            if (!e.target.classList.contains('join-btn')) {
                openCommunityModal(community);
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
            
            if (joinedCommunities.has(id)) {
                // Выход из сообщества
                try {
                    await fetch(`http://localhost:8080/api/members_communities/${id}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    });
                    joinedCommunities.delete(id);
                    btn.textContent = 'Вступить';
                    btn.classList.remove('joined');
                    alert(`Вы покинули сообщество "${community.name}"`);
                } catch (error) {
                    console.error('Ошибка при выходе из сообщества:', error);
                }
            } else {
                // Вступление в сообщество
                try {
                    await fetch('http://localhost:8080/api/members_communities', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        },
                        body: JSON.stringify({
                            community_id: id,
                            date_joining: new Date().toISOString().split('T')[0],
                            role_id: 1 // Обычный участник
                        })
                    });
                    joinedCommunities.add(id);
                    btn.textContent = 'Вы вступили';
                    btn.classList.add('joined');
                    alert(`Вы вступили в сообщество "${community.name}"`);
                } catch (error) {
                    console.error('Ошибка при вступлении в сообщество:', error);
                }
            }
        });
    });
}

// Открытие модального окна с деталями сообщества
function openCommunityModal(community) {
    // Устанавливаем иконку
    const modalIcon = document.getElementById('modalIcon');
    modalIcon.className = `modal-icon ${community.iconClass}`;
    modalIcon.innerHTML = `<i class="${community.icon}"></i>`;
    
    document.getElementById('modalName').textContent = community.name;
    document.getElementById('modalTheme').textContent = community.thematics;
    document.getElementById('modalMembers').textContent = community.membersCount || 0;
    document.getElementById('modalEvents').textContent = community.eventsCount || 0;
    document.getElementById('modalDescription').textContent = community.description;
    
    // Настраиваем кнопку в модальном окне
    const joinBtn = document.getElementById('joinFromModal');
    const isJoined = joinedCommunities.has(community.id);
    joinBtn.textContent = isJoined ? 'Вы вступили' : 'Вступить';
    
    joinBtn.onclick = async () => {
        if (joinedCommunities.has(community.id)) {
            // Выход из сообщества
            try {
                await fetch(`http://localhost:8080/api/members_communities/${community.id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                joinedCommunities.delete(community.id);
                joinBtn.textContent = 'Вступить';
                alert(`Вы покинули сообщество "${community.name}"`);
            } catch (error) {
                console.error('Ошибка при выходе из сообщества:', error);
            }
        } else {
            // Вступление в сообщество
            try {
                await fetch('http://localhost:8080/api/members_communities', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({
                        community_id: community.id,
                        date_joining: new Date().toISOString().split('T')[0],
                        role_id: 1
                    })
                });
                joinedCommunities.add(community.id);
                joinBtn.textContent = 'Вы вступили';
                alert(`Вы вступили в сообщество "${community.name}"`);
            } catch (error) {
                console.error('Ошибка при вступлении в сообщество:', error);
            }
        }
        // Обновляем кнопку на карточке
        renderCommunities();
    };
    
    document.getElementById('communityModal').classList.add('active');
}

// Загрузка состояния вступления пользователя
async function loadUserMemberships() {
    try {
        const response = await fetch('http://localhost:8080/api/members_communities/user', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        if (response.ok) {
            const memberships = await response.json();
            joinedCommunities = new Set(memberships.map(m => m.community_id));
        } else {
            // Если пользователь не авторизован или нет членств
            joinedCommunities = new Set();
        }
    } catch (error) {
        console.error('Ошибка загрузки членства:', error);
        joinedCommunities = new Set();
    }
}

// Инициализация
document.addEventListener('DOMContentLoaded', async () => {
    await loadCommunities();
    await loadUserMemberships();
    
    // Модальное окно
    const modal = document.getElementById('communityModal');
    const closeBtn = document.getElementById('closeModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    
    function closeModal() {
        modal.classList.remove('active');
    }
    
    closeBtn.addEventListener('click', closeModal);
    closeModalBtn.addEventListener('click', closeModal);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
});