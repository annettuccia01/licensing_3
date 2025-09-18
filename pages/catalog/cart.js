const cartIcon = document.getElementById('cart-icon');
const cartCount = document.getElementById('cart-count');
const cartSidebar = document.getElementById('cart-sidebar');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalPrice = document.getElementById('cart-total-price');
const cartClose = document.getElementById('cart-close');
const cartCheckout = document.getElementById('cart-checkout');
const overlay = document.getElementById('overlay');

const API_URL = 'http://localhost:3000/carts';

let cart = { userId: null, items: [] };
let currentUserId = localStorage.getItem('currentUserId');

async function loadCart() {
    if (!currentUserId) {
        console.warn('No user authenticated. Initializing empty cart.');
        cart = { userId: null, items: [] };
        updateCartCount();
        renderCartItems();
        return;
    }

    try {
        const response = await fetch(`${API_URL}?userId_eq=${currentUserId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const carts = await response.json();
        cart = carts.find(c => c.userId === parseInt(currentUserId)) || { userId: parseInt(currentUserId), items: [] };
        console.log('Cart loaded from server for userId', currentUserId, ':', cart);
    } catch (error) {
        console.error('Error loading cart:', error);
        cart = { userId: parseInt(currentUserId), items: [] };
    }
    updateCartCount();
    renderCartItems();
}

async function saveCart() {
    if (!currentUserId) {
        console.error('No user authenticated');
        return false;
    }

    try {
        let url = API_URL;
        let method = 'POST';
        if (cart.id) {
            url = `${API_URL}/${cart.id}`;
            method = 'PUT';
        }

        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(cart)
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const savedCart = await response.json();
        cart = savedCart;
        
        console.log('Cart saved to server for userId', currentUserId, 'Cart data:', cart);
        return true;
    } catch (error) {
        console.error('Error saving cart:', error);
        alert('Не удалось сохранить корзину. Проверьте подключение к серверу или данные в db.json.');
        return false;
    }
}

async function initCart(productsData) {
    if (!cartIcon || !cartCount || !cartSidebar || !cartItemsContainer || !cartTotalPrice || !cartClose || !cartCheckout || !overlay) {
        console.error('One or more cart elements not found:', {
            cartIcon, cartCount, cartSidebar, cartItemsContainer, cartTotalPrice, cartClose, cartCheckout, overlay
        });
        return;
    }

    cartIcon.addEventListener('click', () => {
        console.log('Cart icon clicked');
        toggleCart(true);
    });
    cartClose.addEventListener('click', () => {
        console.log('Close button clicked');
        toggleCart(false);
    });
    overlay.addEventListener('click', () => toggleCart(false));
    cartCheckout.addEventListener('click', checkout);

    window.products = productsData || [];
    console.log('Products set in cart.js:', window.products);

    await loadCart();
}

window.initCart = initCart;
window.addToCart = addToCart;
window.toggleCart = toggleCart;

async function addToCart(productId) {
    if (!currentUserId) {
        console.error('No user authenticated');
        alert('Пожалуйста, войдите в систему для добавления в корзину.');
        return;
    }

    if (!window.products || window.products.length === 0) {
        console.error('Products data not available');
        alert('Данные о продуктах недоступны. Попробуйте перезагрузить страницу.');
        return;
    }

    const product = window.products.find(p => p.id === productId);
    if (!product) {
        console.error('Product not found:', productId);
        return;
    }

    const existingItem = cart.items.find(item => item.productId === productId);
    console.log('Adding to cart, existingItem:', existingItem, 'cart.items:', cart.items);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.items.push({
            productId: product.id,
            name: product.name,
            quantity: 1
        });
    }
    
    const saveSuccess = await saveCart();
    if (saveSuccess) {
        updateCartCount();
        renderCartItems();
    }
}

function updateCartCount() {
    const totalItems = cart.items.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems || '0';
}

function renderCartItems() {
    cartItemsContainer.innerHTML = '';
    
    if (!cart.items || cart.items.length === 0) {
        cartItemsContainer.innerHTML = '<div class="cart-empty">Your cart is empty</div>';
        cartTotalPrice.textContent = '$0.00';
        return;
    }
    
    let totalPrice = 0;
    
    cart.items.forEach(item => {
        const product = window.products.find(p => p.id === item.productId);
        const itemPrice = product ? product.price : 0;

        const itemImg = product ? `/assets/shop/img${product.id}.svg` : '/assets/shop/img0.svg';
        totalPrice += itemPrice * item.quantity;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-image">
                <img src="${itemImg}" alt="${item.name}" onerror="this.src='/assets/shop/img0.svg'; this.onerror=null;">
            </div>
            <div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">$${itemPrice.toFixed(2)}</div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn minus" data-id="${item.productId}">-</button>
                    <span class="quantity-value">${item.quantity}</span>
                    <button class="quantity-btn plus" data-id="${item.productId}">+</button>
                </div>
                <div class="cart-item-remove" data-id="${item.productId}">Remove</div>
            </div>
        `;
        cartItemsContainer.appendChild(cartItem);
    });
    
    cartTotalPrice.textContent = `$${totalPrice.toFixed(2)}`;
    
    document.querySelectorAll('.quantity-btn.minus').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const productId = parseInt(button.getAttribute('data-id'));
            console.log('Minus clicked for productId:', productId);
            updateCartItemQuantity(productId, -1);
        });
    });

    document.querySelectorAll('.quantity-btn.plus').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const productId = parseInt(button.getAttribute('data-id'));
            console.log('Plus clicked for productId:', productId);
            updateCartItemQuantity(productId, 1);
        });
    });

    document.querySelectorAll('.cart-item-remove').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const productId = parseInt(button.getAttribute('data-id'));
            console.log('Remove clicked for productId:', productId);
            removeFromCart(productId);
        });
    });
}

async function updateCartItemQuantity(productId, change) {
    const itemIndex = cart.items.findIndex(item => item.productId === productId);
    
    if (itemIndex !== -1) {
        cart.items[itemIndex].quantity += change;
        console.log('Updating quantity for productId:', productId, 'new quantity:', cart.items[itemIndex].quantity);
        
        if (cart.items[itemIndex].quantity <= 0) {
            cart.items.splice(itemIndex, 1);
        }
        
        const saveSuccess = await saveCart();
        if (saveSuccess) {
            updateCartCount();
            renderCartItems();
        }
    } else {
        console.error('Item not found in cart for productId:', productId);
    }
}

async function removeFromCart(productId) {
    const initialLength = cart.items.length;
    cart.items = cart.items.filter(item => item.productId !== productId);
    console.log('Removing productId:', productId, 'Items before:', initialLength, 'Items after:', cart.items.length);
    
    if (cart.items.length < initialLength) {
        const saveSuccess = await saveCart();
        if (saveSuccess) {
            updateCartCount();
            renderCartItems();
        }
    } else {
        console.error('Remove failed, no item with productId:', productId, 'was found');
    }
}

function toggleCart(open) {
    console.log('Toggling cart, open:', open, 'current state:', cartSidebar.classList.contains('active'));
    if (open) {
        cartSidebar.classList.add('active');
        overlay.classList.add('active');
        renderCartItems();
    } else {
        cartSidebar.classList.remove('active');
        overlay.classList.remove('active');
    }
}

async function checkout() {
    if (!cart.items || cart.items.length === 0) {
        alert('Корзина пуста!');
        return;
    }
    alert('Заказ оформлен! Итого: ' + cartTotalPrice.textContent);
    cart.items = [];
    const saveSuccess = await saveCart();
    if (saveSuccess) {
        updateCartCount();
        renderCartItems();
        toggleCart(false);
    }
}