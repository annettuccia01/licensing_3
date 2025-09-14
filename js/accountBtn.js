document.addEventListener('DOMContentLoaded', function() {
    const accountButtons = document.querySelectorAll('.header_change--account');
    accountButtons.forEach(button => {
        button.addEventListener('click', function() {
            window.location.href = '/pages/register/register.html';
        });
    });
});