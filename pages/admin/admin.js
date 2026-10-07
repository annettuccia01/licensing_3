/*
  Copyright (c) 2026 Цед Анна Викторовна
  Данный исходный код распространяется под лицензией MIT.
  Полный текст лицензии находится в файле LICENSE в корне проекта.
*/

let users = [];
let products = [];
let currentUserId = null;
let currentProductId = null;
const API_URL = 'http://localhost:3000';

// Проверка аутентификации
async function checkAuth() {
    console.log('checkAuth: Проверка аутентификации...');
    const isAuthenticated = localStorage.getItem('isAdminAuthenticated') === 'true';
    console.log('checkAuth: isAdminAuthenticated =', isAuthenticated);

    if (!isAuthenticated) {
        console.log('checkAuth: Пользователь не аутентифицирован, перенаправление на /pages/home/home.html');
        window.location.href = '/pages/home/home.html';
        return;
    }

    // Проверка роли пользователя
    try {
        const userId = localStorage.getItem('currentUserId');
        if (!userId) {
            console.log('checkAuth: ID пользователя не найден, перенаправление на /pages/catalog/catalog.html');
            window.location.href = '/pages/catalog/catalog.html';
            return;
        }

        console.log('checkAuth: Запрос данных пользователя с id', userId);
        const response = await fetch(`${API_URL}/users/${userId}`);
        if (!response.ok) throw new Error(`Ошибка загрузки данных пользователя: ${response.status}`);
        const user = await response.json();

        if (!user.role || (user.role !== 'admin' && user.role !== 'user')) {
            console.error('checkAuth: Некорректная роль пользователя', user.role);
            window.location.href = '/pages/catalog/catalog.html';
            return;
        }

        if (user.role === 'user') {
            console.log('checkAuth: Пользователь не администратор, перенаправление на /pages/catalog/catalog.html');
            window.location.href = '/pages/catalog/catalog.html';
        } else {
            console.log('checkAuth: Пользователь администратор, загрузка данных для админ-панели');
            loadData();
        }
    } catch (error) {
        console.error('checkAuth: Ошибка проверки роли пользователя:', error);
        alert('Не удалось проверить роль пользователя. Проверьте подключение к серверу.');
        window.location.href = '/pages/home/home.html';
    }
}

// Выход
function logout() {
    console.log('logout: Очистка isAdminAuthenticated и перенаправление на /pages/home/home.html');
    localStorage.removeItem('isAdminAuthenticated');
    localStorage.removeItem('currentUserId');
    window.location.href = '/pages/home/home.html';
}

// Загрузка данных из users и products
async function loadData() {
    try {
        console.log('loadData: Запрос пользователей с', `${API_URL}/users`);
        const usersResponse = await fetch(`${API_URL}/users`);
        if (!usersResponse.ok) throw new Error(`Ошибка загрузки пользователей: ${usersResponse.status}`);
        users = await usersResponse.json();
        console.log('loadData: Пользователи загружены', users);

        console.log('loadData: Запрос продуктов с', `${API_URL}/products`);
        const productsResponse = await fetch(`${API_URL}/products`);
        if (!productsResponse.ok) throw new Error(`Ошибка загрузки продуктов: ${productsResponse.status}`);
        products = await productsResponse.json();
        console.log('loadData: Продукты загружены', products);

        renderUserTable();
        renderProductTable();
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        alert('Не удалось загрузить данные. Проверьте доступность сервера.');
    }
}

function showTab(tabId) {
    console.log('showTab: Переключение на вкладку', tabId);
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(tabId).classList.add('active');
    document.querySelector(`.tab-btn[onclick="showTab('${tabId}')"]`).classList.add('active');
}

function renderUserTable(filteredUsers = users) {
    console.log('renderUserTable: Рендеринг пользователей', filteredUsers);
    const tableBody = document.getElementById('userTableBody');
    if (!tableBody) {
        console.error('renderUserTable: Элемент userTableBody не найден');
        return;
    }
    tableBody.innerHTML = '';
    filteredUsers.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.last_name}</td>
            <td>${user.first_name}</td>
            <td>${user.email}</td>
            <td>${user.role === 'admin' ? 'Админ' : 'Пользователь'}</td>
            <td class="actions">
                <button onclick="editUser(${user.id})">Редактировать</button>
                <button class="delete-btn" onclick="confirmDeleteUser(${user.id})">Удалить</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function renderProductTable(filteredProducts = products) {
    console.log('renderProductTable: Рендеринг продуктов', filteredProducts);
    const tableBody = document.getElementById('productTableBody');
    if (!tableBody) {
        console.error('renderProductTable: Элемент productTableBody не найден');
        return;
    }
    tableBody.innerHTML = '';
    filteredProducts.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>${product.brand}</td>
            <td>$${product.price.toFixed(2)}</td>
            <td>${product.rating}</td>
            <td class="actions">
                <button onclick="editProduct(${product.id})">Редактировать</button>
                <button class="delete-btn" onclick="confirmDeleteProduct(${product.id})">Удалить</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function filterUsers() {
    const search = document.getElementById('userSearch').value.toLowerCase();
    const role = document.getElementById('userRoleFilter').value;
    console.log('filterUsers: Поиск =', search, 'Роль =', role);
    let filteredUsers = users;
    if (search) {
        filteredUsers = filteredUsers.filter(u => 
            u.first_name.toLowerCase().includes(search) || 
            u.last_name.toLowerCase().includes(search)
        );
    }
    if (role) {
        filteredUsers = filteredUsers.filter(u => u.role === role);
    }
    renderUserTable(filteredUsers);
}

function filterProducts() {
    const search = document.getElementById('productSearch').value.toLowerCase();
    const category = document.getElementById('productCategoryFilter').value;
    console.log('filterProducts: Поиск =', search, 'Категория =', category);
    let filteredProducts = products;
    if (search) {
        filteredProducts = filteredProducts.filter(p => 
            p.name.toLowerCase().includes(search)
        );
    }
    if (category) {
        filteredProducts = filteredProducts.filter(p => p.category === category);
    }
    renderProductTable(filteredProducts);
}

function openUserModal(userId = null) {
    console.log('openUserModal: Открытие модального окна для userId', userId);
    const modal = document.getElementById('userModal');
    const modalTitle = document.getElementById('userModalTitle');
    const lastNameInput = document.getElementById('userLastName');
    const firstNameInput = document.getElementById('userFirstName');
    const middleNameInput = document.getElementById('userMiddleName');
    const phoneInput = document.getElementById('userPhone');
    const emailInput = document.getElementById('userEmail');
    const birthdateInput = document.getElementById('userBirthdate');
    const nicknameInput = document.getElementById('userNickname');
    const passwordInput = document.getElementById('userPassword');
    const roleSelect = document.getElementById('userRole');

    if (!modal || !modalTitle || !lastNameInput || !firstNameInput || !middleNameInput || 
        !phoneInput || !emailInput || !birthdateInput || !nicknameInput || !passwordInput || !roleSelect) {
        console.error('openUserModal: Один или несколько элементов модального окна не найдены');
        return;
    }

    if (userId) {
        const user = users.find(u => u.id === userId);
        modalTitle.textContent = 'Редактировать пользователя';
        lastNameInput.value = user.last_name;
        firstNameInput.value = user.first_name;
        middleNameInput.value = user.middle_name;
        phoneInput.value = user.phone;
        emailInput.value = user.email;
        birthdateInput.value = user.birthdate;
        nicknameInput.value = user.nickname;
        passwordInput.value = user.password;
        roleSelect.value = user.role;
        currentUserId = userId;
    } else {
        modalTitle.textContent = 'Добавить пользователя';
        lastNameInput.value = '';
        firstNameInput.value = '';
        middleNameInput.value = '';
        phoneInput.value = '';
        emailInput.value = '';
        birthdateInput.value = '';
        nicknameInput.value = '';
        passwordInput.value = '';
        roleSelect.value = 'user';
        currentUserId = null;
    }
    modal.style.display = 'flex';
}

function openProductModal(productId = null) {
    console.log('openProductModal: Открытие модального окна для productId', productId);
    const modal = document.getElementById('productModal');
    const modalTitle = document.getElementById('productModalTitle');
    const nameInput = document.getElementById('productName');
    const categoryInput = document.getElementById('productCategory');
    const brandInput = document.getElementById('productBrand');
    const descriptionInput = document.getElementById('productDescription');
    const quantityValueInput = document.getElementById('productQuantityValue');
    const quantityUnitInput = document.getElementById('productQuantityUnit');
    const priceInput = document.getElementById('productPrice');
    const ratingInput = document.getElementById('productRating');
    const imgInput = document.getElementById('productImg');

    if (!modal || !modalTitle || !nameInput || !categoryInput || !brandInput || 
        !descriptionInput || !quantityValueInput || !quantityUnitInput || !priceInput || !ratingInput || !imgInput) {
        console.error('openProductModal: Один или несколько элементов модального окна не найдены');
        return;
    }

    if (productId) {
        const product = products.find(p => p.id === productId);
        modalTitle.textContent = 'Редактировать продукт';
        nameInput.value = product.name;
        categoryInput.value = product.category;
        brandInput.value = product.brand;
        descriptionInput.value = product.description;
        quantityValueInput.value = product.quantity.value;
        quantityUnitInput.value = product.quantity.unit;
        priceInput.value = product.price;
        ratingInput.value = product.rating;
        imgInput.value = product.img;
        currentProductId = productId;
    } else {
        modalTitle.textContent = 'Добавить продукт';
        nameInput.value = '';
        categoryInput.value = '';
        brandInput.value = '';
        descriptionInput.value = '';
        quantityValueInput.value = '';
        quantityUnitInput.value = '';
        priceInput.value = '';
        ratingInput.value = '';
        imgInput.value = '';
        currentProductId = null;
    }
    modal.style.display = 'flex';
}

function closeModal(modalId) {
    console.log('closeModal: Закрытие модального окна', modalId);
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    } else {
        console.error('closeModal: Элемент модального окна не найден', modalId);
    }
}

function openConfirmModal(type, id, title) {
    console.log(`openConfirmModal: Открытие модального окна подтверждения для ${type} с id`, id);
    const modal = document.getElementById('confirmModal');
    const confirmMessage = document.getElementById('confirmMessage');
    const confirmButton = document.getElementById('confirmButton');

    if (!modal || !confirmMessage || !confirmButton) {
        console.error('openConfirmModal: Один или несколько элементов модального окна не найдены');
        return;
    }

    confirmMessage.textContent = `Вы уверены, что хотите удалить ${type === 'user' ? 'пользователя' : 'продукт'} "${title}"?`;
    confirmButton.onclick = () => type === 'user' ? deleteUser(id) : deleteProduct(id);
    modal.style.display = 'flex';
}

function confirmDeleteUser(id) {
    const user = users.find(u => u.id === id);
    if (user) {
        console.log('confirmDeleteUser: Подтверждение удаления пользователя с id', id);
        openConfirmModal('user', id, `${user.last_name} ${user.first_name}`);
    }
}

function confirmDeleteProduct(id) {
    const product = products.find(p => p.id === id);
    if (product) {
        console.log('confirmDeleteProduct: Подтверждение удаления продукта с id', id);
        openConfirmModal('product', id, product.name);
    }
}

async function saveUser() {
    console.log('saveUser: Сохранение пользователя, currentUserId =', currentUserId);
    const lastName = document.getElementById('userLastName').value;
    const firstName = document.getElementById('userFirstName').value;
    const middleName = document.getElementById('userMiddleName').value;
    const phone = document.getElementById('userPhone').value;
    const email = document.getElementById('userEmail').value;
    const birthdate = document.getElementById('userBirthdate').value;
    const nickname = document.getElementById('userNickname').value;
    const password = document.getElementById('userPassword').value;
    const role = document.getElementById('userRole').value;

    if (!lastName || !firstName || !email || !nickname || !password) {
        console.log('saveUser: Ошибка валидации - не заполнены обязательные поля');
        alert('Пожалуйста, заполните обязательные поля: фамилия, имя, email, никнейм, пароль');
        return;
    }

    const userData = { last_name: lastName, first_name: firstName, middle_name: middleName, phone, email, birthdate, nickname, password, role };

    try {
        if (currentUserId) {
            userData.id = currentUserId;
            console.log('saveUser: Обновление пользователя с id', currentUserId, userData);
            const response = await fetch(`${API_URL}/users/${currentUserId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });
            if (!response.ok) throw new Error(`Не удалось обновить пользователя: ${response.status}`);
            const updatedUser = await response.json();
            const userIndex = users.findIndex(u => u.id === currentUserId);
            users[userIndex] = updatedUser;
            console.log('saveUser: Пользователь успешно обновлен', updatedUser);
        } else {
            console.log('saveUser: Создание нового пользователя', userData);
            const response = await fetch(`${API_URL}/users`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });
            if (!response.ok) throw new Error(`Не удалось добавить пользователя: ${response.status}`);
            const newUser = await response.json();
            users.push(newUser);
            console.log('saveUser: Пользователь успешно создан', newUser);
        }
        renderUserTable();
        closeModal('userModal');
    } catch (error) {
        console.error('Ошибка сохранения пользователя:', error);
        alert('Не удалось сохранить пользователя. Проверьте подключение к серверу.');
    }
}

async function saveProduct() {
    console.log('saveProduct: Сохранение продукта, currentProductId =', currentProductId);
    const name = document.getElementById('productName').value;
    const category = document.getElementById('productCategory').value;
    const brand = document.getElementById('productBrand').value;
    const description = document.getElementById('productDescription').value;
    const quantityValue = parseInt(document.getElementById('productQuantityValue').value);
    const quantityUnit = document.getElementById('productQuantityUnit').value;
    const price = parseFloat(document.getElementById('productPrice').value);
    const rating = parseFloat(document.getElementById('productRating').value);
    const img = document.getElementById('productImg').value;

    if (!name || !category || !brand || !quantityValue || !quantityUnit || !price || !rating) {
        console.log('saveProduct: Ошибка валидации - не заполнены обязательные поля');
        alert('Пожалуйста, заполните все обязательные поля');
        return;
    }

    if (rating < 0 || rating > 5) {
        console.log('saveProduct: Ошибка валидации - некорректный рейтинг', rating);
        alert('Рейтинг должен быть от 0 до 5');
        return;
    }

    const productData = { name, category, brand, description, quantity: { value: quantityValue, unit: quantityUnit }, price, rating, img };

    try {
        if (currentProductId) {
            productData.id = currentProductId;
            console.log('saveProduct: Обновление продукта с id', currentProductId, productData);
            const response = await fetch(`${API_URL}/products/${currentProductId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData)
            });
            if (!response.ok) throw new Error(`Не удалось обновить продукт: ${response.status}`);
            const updatedProduct = await response.json();
            const productIndex = products.findIndex(p => p.id === currentProductId);
            products[productIndex] = updatedProduct;
            console.log('saveProduct: Продукт успешно обновлен', updatedProduct);
        } else {
            console.log('saveProduct: Создание нового продукта', productData);
            const response = await fetch(`${API_URL}/products`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData)
            });
            if (!response.ok) throw new Error(`Не удалось добавить продукт: ${response.status}`);
            const newProduct = await response.json();
            products.push(newProduct);
            console.log('saveProduct: Продукт успешно создан', newProduct);
        }
        renderProductTable();
        closeModal('productModal');
    } catch (error) {
        console.error('Ошибка сохранения продукта:', error);
        alert('Не удалось сохранить продукт. Проверьте подключение к серверу.');
    }
}

async function editUser(id) {
    console.log('editUser: Редактирование пользователя с id', id);
    openUserModal(id);
}

async function editProduct(id) {
    console.log('editProduct: Редактирование продукта с id', id);
    openProductModal(id);
}

async function deleteUser(id) {
    console.log('deleteUser: Удаление пользователя с id', id);
    try {
        const response = await fetch(`${API_URL}/users/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error(`Не удалось удалить пользователя: ${response.status}`);
        users = users.filter(u => u.id !== id);
        console.log('deleteUser: Пользователь успешно удален');
        renderUserTable();
        closeModal('confirmModal');
    } catch (error) {
        console.error('Ошибка удаления пользователя:', error);
        alert('Не удалось удалить пользователя. Проверьте подключение к серверу.');
    }
}

async function deleteProduct(id) {
    console.log('deleteProduct: Удаление продукта с id', id);
    try {
        const response = await fetch(`${API_URL}/products/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error(`Не удалось удалить продукт: ${response.status}`);
        products = products.filter(p => p.id !== id);
        console.log('deleteProduct: Продукт успешно удален');
        renderProductTable();
        closeModal('confirmModal');
    } catch (error) {
        console.error('Ошибка удаления продукта:', error);
        alert('Не удалось удалить продукт. Проверьте подключение к серверу.');
    }
}

document.addEventListener('DOMContentLoaded', checkAuth);