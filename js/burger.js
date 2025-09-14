document.querySelector('.burger').addEventListener('click', () => {
    const menu = document.querySelector('.header_menu');
    menu.classList.toggle('active');
});