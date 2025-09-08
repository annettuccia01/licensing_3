const productsContainer = document.getElementById('products-container');
const categoryOptionsContainer = document.getElementById('category-options');

const itemsPerPage = 10;
let currentPage = 1;
let products = [];

async function initProducts() {
    try {
        const response = await fetch('http://localhost:3000/products');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        products = await response.json();
        renderCategoryFilters();
        filterAndSortProducts();
    } catch (error) {
        console.error('Error loading products:', error);
        productsContainer.innerHTML = '<div class="no-results">Error loading products. Please try again later.</div>';
    }
}

function renderCategoryFilters() {
    if (!products || products.length === 0) return;

    const categories = [...new Set(products.map(product => product.category))];
    categoryOptionsContainer.innerHTML = '';
    
    categories.forEach(category => {
        const option = document.createElement('div');
        option.className = 'category-option';
        option.innerHTML = `
            <input type="checkbox" id="cat-${category.replace(/\s+/g, '-').toLowerCase()}" value="${category}" checked>
            <label for="cat-${category.replace(/\s+/g, '-').toLowerCase()}">${category}</label>
        `;
        categoryOptionsContainer.appendChild(option);
    });
}

function renderProducts(productsToRender, page = 1) {
    currentPage = page;
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedProducts = productsToRender.slice(startIndex, endIndex);

    productsContainer.innerHTML = '';

    if (paginatedProducts.length === 0) {
        productsContainer.innerHTML = '<div class="no-results">No products found</div>';
        return;
    }

    paginatedProducts.forEach(product => {
        const fullStars = Math.floor(product.rating);
        const hasHalfStar = product.rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        let starsHtml = '<div class="stars">';
        for (let i = 0; i < fullStars; i++) starsHtml += '<span class="filled">★</span>';
        if (hasHalfStar) starsHtml += '<span class="filled">½</span>';
        for (let i = 0; i < emptyStars; i++) starsHtml += '<span class="empty">★</span>';
        starsHtml += ` <span>(${product.rating.toFixed(1)})</span></div>`;
        
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.img}" alt="${product.name}">
            </div>
            <div class="product-brand">${product.brand}</div>
            <div class="product-title">${product.name}</div>
            <div class="product-category">${product.category}</div>
            ${starsHtml}
            <div class="product-price">$${product.price.toFixed(2)}</div>
            <div class="product-quantity">${product.quantity.value} ${product.quantity.unit}</div>
            <div class="product-description">${product.description}</div>
            <button class="add-to-cart" data-id="${product.id}">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000">
                    <path d="M440-600v-120H320v-80h120v-120h80v120h120v80H520v120h-80ZM280-80q-33 0-56.5-23.5T200-160q0-33 23.5-56.5T280-240q33 0 56.5 23.5T360-160q0 33-23.5 56.5T280-80Zm400 0q-33 0-56.5-23.5T600-160q0-33 23.5-56.5T680-240q33 0 56.5 23.5T760-160q0 33-23.5 56.5T680-80ZM40-800v-80h131l170 360h280l156-280h91L692-482q-11 20-29.5 31T622-440H324l-44 80h480v80H280q-45 0-68.5-39t-1.5-79l54-98-144-304H40Z"/>
                </svg>
                Add to Cart
            </button>
        `;
        productsContainer.appendChild(productCard);
    });

    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const productId = parseInt(button.getAttribute('data-id'));
            addToCart(productId);
            toggleCart(true);
        });
    });

    renderPagination(productsToRender.length, page);
}