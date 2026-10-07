/*
  Copyright (c) 2026 Цед Анна Викторовна
  Данный исходный код распространяется под лицензией MIT.
  Полный текст лицензии находится в файле LICENSE в корне проекта.
*/

const API_URL = 'http://localhost:3000';

const accessControl = {
    admin: [
        '/pages/home/home.html',
        '/pages/about/about.html',
        '/pages/contact/contact.html',
        '/pages/policies/terms.html',
        '/pages/policies/privacy.html',
        '/pages/policies/shipping.html',
        '/pages/policies/refund.html',
        '/pages/admin/admin.html'
    ],
    user: [
        '/pages/home/home.html',
        '/pages/about/about.html',
        '/pages/contact/contact.html',
        '/pages/policies/terms.html',
        '/pages/policies/privacy.html',
        '/pages/policies/shipping.html',
        '/pages/policies/refund.html',
        '/pages/catalog/catalog.html'
    ],
    guest: [
        '/pages/home/home.html',
        '/pages/about/about.html',
        '/pages/contact/contact.html',
        '/pages/policies/terms.html',
        '/pages/policies/privacy.html',
        '/pages/policies/shipping.html',
        '/pages/policies/refund.html',
        '/pages/register/register.html'
    ]
};

async function getCurrentUser() {
    const currentUserId = localStorage.getItem('currentUserId');
    if (!currentUserId) {
        console.log('No user authenticated, assigning guest role');
        return { role: 'guest' };
    }

    try {
        const response = await fetch(`${API_URL}/users/${currentUserId}`);
        if (!response.ok) {
            console.warn(`User not found for ID: ${currentUserId}, assigning guest role`);
            localStorage.removeItem('currentUserId');
            return { role: 'guest' };
        }
        const user = await response.json();
        console.log('Current user:', user);
        return user;
    } catch (error) {
        console.error('Error fetching user:', error);
        localStorage.removeItem('currentUserId');
        return { role: 'guest' };
    }
}

async function restrictAccess() {
    const user = await getCurrentUser();
    const currentPath = window.location.pathname || '/pages/home/home.html';

    const allowedPaths = accessControl[user.role] || accessControl.guest;

    if (!allowedPaths.includes(currentPath)) {
        console.warn(`Access denied to ${currentPath} for role ${user.role}`);
        if (user.role !== 'guest' && currentPath === '/pages/register/register.html') {
            console.log('Redirecting registered user from register page to home');
            window.location.href = '/pages/home/home.html';
            return;
        }
        const content = document.getElementById('content') || document.body;
        content.innerHTML = `
            <div style="text-align: center; padding: 50px;">
                <h2>Unfortunately you can not access this page, please log into your account or create one if you do not already have one</h2>
                <a href="#" id="open-account-modal">Register</a>
            </div>
        `;
        const openModalBtnInMessage = document.getElementById('open-account-modal');
        if (openModalBtnInMessage) {
            openModalBtnInMessage.addEventListener('click', (e) => {
                e.preventDefault();
                const accountModal = document.getElementById('account-modal');
                if (accountModal && user.role === 'guest') {
                    accountModal.classList.add('active');
                }
            });
        }
    } else {
        console.log(`Access granted to ${currentPath} for role ${user.role}`);
    }

    const accountModal = document.getElementById('account-modal');
    const accountBtn = document.getElementById('account-btn');
    if (user.role !== 'guest') {
        console.log(`Hiding account-modal and account-btn for role ${user.role}`);
        if (accountModal) {
            accountModal.style.display = 'none';
            accountModal.classList.remove('active');
        }
        if (accountBtn) {
            accountBtn.style.display = 'none';
        }
    } else {
        console.log('Account-modal and account-btn available for guest');
        if (accountModal) {
            accountModal.style.display = 'block';
        }
        if (accountBtn) {
            accountBtn.style.display = 'block';
            accountBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (accountModal) {
                    accountModal.classList.add('active');
                }
            });
        }
        const closeModalBtn = document.getElementById('close-modal');
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', () => {
                if (accountModal) {
                    accountModal.classList.remove('active');
                }
            });
        }
        const loginForm = accountModal?.querySelector('#loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const email = loginForm.querySelector('#email').value;
                const password = loginForm.querySelector('#password').value;
                try {
                    const response = await fetch(`${API_URL}/users?email=${encodeURIComponent(email)}&password=${password}`);
                    const users = await response.json();
                    if (users.length > 0) {
                        localStorage.setItem('currentUserId', users[0].id);
                        if (accountModal) {
                            accountModal.classList.remove('active');
                        }
                        window.location.reload();
                    } else {
                        alert('Неверный email или пароль');
                    }
                } catch (error) {
                    console.error('Error logging in:', error);
                    alert('Ошибка входа. Проверьте подключение к серверу.');
                }
            });
        }
    }

    if (!accountModal) {
        console.warn('Account-modal element not found');
    }
    if (!accountBtn) {
        console.warn('Account-btn element not found');
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    await restrictAccess();
});