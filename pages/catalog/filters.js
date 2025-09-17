const searchInput = document.getElementById('search');
const sortSelect = document.getElementById('sort');
const applyFiltersBtn = document.getElementById('apply-filters');
const resetFiltersBtn = document.getElementById('reset-filters');
const minPriceInput = document.getElementById('min-price');
const maxPriceInput = document.getElementById('max-price');

function initFilters() {
    if (!searchInput || !sortSelect || !applyFiltersBtn || !resetFiltersBtn || !minPriceInput || !maxPriceInput) {
        console.error('One or more filter elements not found:', {
            searchInput, sortSelect, applyFiltersBtn, resetFiltersBtn, minPriceInput, maxPriceInput
        });
        return;
    }

    searchInput.addEventListener('input', () => {
        console.log('Search input changed:', searchInput.value);
        filterAndSortProducts();
    });
    sortSelect.addEventListener('change', () => {
        console.log('Sort option changed:', sortSelect.value);
        filterAndSortProducts();
    });
    applyFiltersBtn.addEventListener('click', () => {
        console.log('Apply filters clicked');
        filterAndSortProducts();
    });
    resetFiltersBtn.addEventListener('click', () => {
        console.log('Reset filters clicked');
        resetFilters();
    });
}

function filterAndSortProducts(page = 1) {
    if (!window.products || !Array.isArray(window.products)) {
        console.error('Products data is not available or not an array');
        return;
    }

    const searchTerm = searchInput.value.toLowerCase();
    const sortOption = sortSelect.value;

    const selectedCategories = Array.from(document.querySelectorAll('.category-options input[type="checkbox"]:checked'))
        .map(checkbox => checkbox.value);
    console.log('Selected categories:', selectedCategories);

    const minPrice = minPriceInput.value && !isNaN(Number(minPriceInput.value)) ? Number(minPriceInput.value) : 0;
    const maxPrice = maxPriceInput.value && !isNaN(Number(maxPriceInput.value)) ? Number(maxPriceInput.value) : Infinity;
    console.log('Price range:', { minPrice, maxPrice });

    let filteredProducts = window.products.filter(product => {
        if (!product || typeof product !== 'object') {
            console.warn('Invalid product:', product);
            return false;
        }

        const matchesSearch = (product.name || '').toLowerCase().includes(searchTerm) ||
                             (product.brand || '').toLowerCase().includes(searchTerm) ||
                             (product.description || '').toLowerCase().includes(searchTerm);
        
        const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
        
        const matchesPrice = (typeof product.price === 'number') &&
                            product.price >= minPrice &&
                            product.price <= maxPrice;

        return matchesSearch && matchesCategory && matchesPrice;
    });

    console.log('Filtered products count:', filteredProducts.length);

    if (sortOption === 'price-asc') {
        filteredProducts.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortOption === 'price-desc') {
        filteredProducts.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortOption === 'rating-desc') {
        filteredProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortOption === 'rating-asc') {
        filteredProducts.sort((a, b) => (a.rating || 0) - (b.rating || 0));
    } else if (sortOption === 'name-asc') {
        filteredProducts.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    } else if (sortOption === 'name-desc') {
        filteredProducts.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
    }

    renderProducts(filteredProducts, page);
}

function resetFilters() {
    console.log('Resetting filters');
    document.querySelectorAll('.category-options input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = true;
    });
    minPriceInput.value = '';
    maxPriceInput.value = '';
    searchInput.value = '';
    sortSelect.value = 'default';
    filterAndSortProducts();
}

document.addEventListener('DOMContentLoaded', () => {
    initFilters();
});