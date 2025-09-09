document.addEventListener('DOMContentLoaded', () => {
    const accountBtn = document.getElementById('account-btn');
    const modal = document.getElementById('account-modal');
    const closeModalBtn = document.getElementById('close-modal');

    accountBtn.addEventListener('click', () => {
        modal.style.display = 'flex';
    });

    // Закрытие по кнопке
    closeModalBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Закрытие при клике вне контента
    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Закрытие клавишей Esc
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.style.display === 'flex') {
            modal.style.display = 'none';
        }
    });
});