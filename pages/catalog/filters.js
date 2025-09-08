const searchInput = document.getElementById('search');
const sortSelect = document.getElementById('sort');
const applyFiltersBtn = document.getElementById('apply-filters');
const resetFiltersBtn = document.getElementById('reset-filters');
const minPriceInput = document.getElementById('min-price');
const maxPriceInput = document.getElementById('max-price');

function initFilters() {
    searchInput.addEventListener('input', () => filterAndSortProducts());
    sortSelect.addEventListener('change', () => filterAndSortProducts());
    applyFiltersBtn.addEventListener('click', () => filterAndSortProducts());
    resetFiltersBtn.addEventListener('click', resetFilters);
}

function filterAndSortProducts(page = 1) {
    const searchTerm = searchInput.value.toLowerCase();
    const sortOption = sortSelect.value;

    const selectedCategories = Array.from(document.querySelectorAll('.category-options input[type="checkbox"]:checked'))
        .map(checkbox => checkbox.value);

    const minPrice = minPriceInput.value ? Number(minPriceInput.value) : 0;
    const maxPrice = maxPriceInput.value ? Number(maxPriceInput.value) : Infinity;

    let filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm) || 
                             product.brand.toLowerCase().includes(searchTerm) ||
                             product.description.toLowerCase().includes(searchTerm);
        const matchesCategory = selectedCategories.includes(product.category);
        const matchesPrice = product.price >= minPrice && product.price <= maxPrice;
        
        return matchesSearch && matchesCategory && matchesPrice;
    });

    if (sortOption === 'price-asc') {
        filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'price-desc') {
        filteredProducts.sort((a, b) => b.price - a.price);
    } else if (sortOption === 'rating-desc') {
        filteredProducts.sort((a, b) => b.rating - a.rating);
    } else if (sortOption === 'rating-asc') {
        filteredProducts.sort((a, b) => a.rating - b.rating);
    } else if (sortOption === 'name-asc') {
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === 'name-desc') {
        filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
    }

    renderProducts(filteredProducts, page);
}

function resetFilters() {
    document.querySelectorAll('.category-options input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = true;
    });
    minPriceInput.value = '';
    maxPriceInput.value = '';
    searchInput.value = '';
    sortSelect.value = 'default';
    filterAndSortProducts();
}