document.addEventListener('DOMContentLoaded', () => {
    const accountBtn = document.getElementById('account-btn');
    const modal = document.getElementById('account-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const loginForm = document.getElementById('loginForm');
    const loginBtn = document.getElementById('loginBtn');
    const API_URL = 'http://localhost:3000';

    console.log('Инициализация modal.js');

    if (!accountBtn || !modal || !closeModalBtn || !loginForm || !loginBtn) {
        console.error('Ошибка инициализации: Один или несколько элементов не найдены', {
            accountBtn: !!accountBtn,
            modal: !!modal,
            closeModalBtn: !!closeModalBtn,
            loginForm: !!loginForm,
            loginBtn: !!loginBtn
        });
        return;
    }

    // Открытие модального окна
    accountBtn.addEventListener('click', () => {
        console.log('Открытие модального окна входа');
        modal.style.display = 'flex';
    });

    // Закрытие по кнопке
    closeModalBtn.addEventListener('click', () => {
        console.log('Закрытие модального окна входа');
        modal.style.display = 'none';
    });

    // Закрытие при клике вне контента
    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            console.log('Закрытие модального окна по клику вне контента');
            modal.style.display = 'none';
        }
    });

    // Закрытие клавишей Esc
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.style.display === 'flex') {
            console.log('Закрытие модального окна клавишей Esc');
            modal.style.display = 'none';
        }
    });

    const urlParams = new URLSearchParams(window.location.search);
    const queryEmail = urlParams.get('email');
    const queryPassword = urlParams.get('password');
    if (queryEmail && queryPassword) {
        console.log('Обнаружены query-параметры:', { email: queryEmail, password: queryPassword });
        document.getElementById('email').value = queryEmail;
        document.getElementById('password').value = queryPassword;
        authenticate(queryEmail, queryPassword);
    }

    async function authenticate(email, password) {
        console.log('Попытка входа с email:', email, 'password:', password);

        if (!email || !password) {
            console.log('Ошибка входа: Email или пароль пустые');
            alert('Пожалуйста, введите email и пароль');
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            console.log('Ошибка входа: Неверный формат email');
            alert('Неверный формат email');
            return;
        }

        try {
            console.log('Запрос пользователей с', `${API_URL}/users`);
            const response = await fetch(`${API_URL}/users`);
            if (!response.ok) throw new Error(`Ошибка HTTP! Статус: ${response.status} ${response.statusText}`);
            const users = await response.json();
            console.log('Пользователи загружены:', users);

            if (!Array.isArray(users)) {
                console.error('Ошибка: Данные пользователей не в формате массива', users);
                alert('Ошибка сервера: данные пользователей некорректны');
                return;
            }

            if (users.length === 0) {
                console.log('Ошибка входа: Список пользователей пуст');
                alert('Нет зарегистрированных пользователей. Проверьте базу данных.');
                return;
            }

            const user = users.find(u => u.email === email && u.password === password);

            if (user) {
                console.log('Успешный вход: Установка данных в localStorage и перенаправление');
                localStorage.setItem('isAdminAuthenticated', 'true');
                localStorage.setItem('currentUserId', user.id);

                if (user.role === 'user') {
                    console.log('Перенаправление пользователя на /pages/catalog/catalog.html');
                    window.location.href = '/pages/catalog/catalog.html';
                } else if (user.role === 'admin') {
                    console.log('Перенаправление администратора на /pages/admin/admin.html');
                    window.location.href = '/pages/admin/admin.html';
                }
            } else {
                console.log('Ошибка входа: Пользователь не найден или неверные учетные данные');
                alert('Неверный email или пароль.');
            }
        } catch (error) {
            console.error('Ошибка загрузки данных:', error);
            alert('Не удалось подключиться к серверу. Проверьте подключение и консоль для деталей.');
        }
    }

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        console.log('Отправка формы входа');
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();
        authenticate(email, password);
    });
});