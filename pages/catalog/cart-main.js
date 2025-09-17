document.addEventListener('DOMContentLoaded', async () => {
    await initProducts();
    initFilters();
    await initCart();
    
    filterAndSortProducts();
});