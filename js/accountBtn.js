/*
  Copyright (c) 2026 Цед Анна Викторовна
  Данный исходный код распространяется под лицензией MIT.
  Полный текст лицензии находится в файле LICENSE в корне проекта.
*/

document.addEventListener('DOMContentLoaded', function() {
    const accountButtons = document.querySelectorAll('.header_change--account');
    accountButtons.forEach(button => {
        button.addEventListener('click', function() {
            window.location.href = '/pages/register/register.html';
        });
    });
});