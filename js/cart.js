const cartIcon = document.getElementById('cart-icon');
const cartCount = document.getElementById('cart-count');
const cartSidebar = document.getElementById('cart-sidebar');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalPrice = document.getElementById('cart-total-price');
const cartClose = document.getElementById('cart-close');
const cartCheckout = document.getElementById('cart-checkout');
const overlay = document.getElementById('overlay');

let cart = JSON.parse(localStorage.getItem('cart')) || [];

function initCart() {
    cartIcon.addEventListener('click', () => toggleCart());
    cartClose.addEventListener('click', () => toggleCart());
    overlay.addEventListener('click', () => toggleCart());
    cartCheckout.addEventListener('click', checkout);
    updateCartCount();
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) {
        console.error('Product not found:', productId);
        return;
    }

    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            img: product.img,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    renderCartItems();
}

function updateCartCount() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
}

function renderCartItems() {
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="cart-empty">Your cart is empty</div>';
        cartTotalPrice.textContent = '$0.00';
        return;
    }
    
    let totalPrice = 0;
    
    cart.forEach(item => {
        totalPrice += item.price * item.quantity;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.img}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn minus" data-id="${item.id}">-</button>
                    <span class="quantity-value">${item.quantity}</span>
                    <button class="quantity-btn plus" data-id="${item.id}">+</button>
                </div>
                <div class="cart-item-remove" data-id="${item.id}">Remove</div>
            </div>
        `;
        cartItemsContainer.appendChild(cartItem);
    });
    
    cartTotalPrice.textContent = `$${totalPrice.toFixed(2)}`;
    
    document.querySelectorAll('.quantity-btn.minus').forEach(button => {
        button.addEventListener('click', () => {
            const productId = parseInt(button.getAttribute('data-id'));
            updateCartItemQuantity(productId, -1);
        });
    });
    
    document.querySelectorAll('.quantity-btn.plus').forEach(button => {
        button.addEventListener('click', () => {
            const productId = parseInt(button.getAttribute('data-id'));
            updateCartItemQuantity(productId, 1);
        });
    });
    
    document.querySelectorAll('.cart-item-remove').forEach(button => {
        button.addEventListener('click', () => {
            const productId = parseInt(button.getAttribute('data-id'));
            removeFromCart(productId);
        });
    });
}

function updateCartItemQuantity(productId, change) {
    const itemIndex = cart.findIndex(item => item.id === productId);
    
    if (itemIndex !== -1) {
        cart[itemIndex].quantity += change;
        
        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        renderCartItems();
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    renderCartItems();
}

function toggleCart(forceOpen = false) {
    if (forceOpen) {
        cartSidebar.classList.add('active');
        overlay.classList.add('active');
    } else {
        cartSidebar.classList.toggle('active');
        overlay.classList.toggle('active');
    }
    renderCartItems();
}

function checkout() {
    alert('Order placed! Total: ' + cartTotalPrice.textContent);
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    renderCartItems();
    toggleCart();
}