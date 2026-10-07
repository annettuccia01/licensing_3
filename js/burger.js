/*
  Copyright (c) 2026 Цед Анна Викторовна
  Данный исходный код распространяется под лицензией MIT.
  Полный текст лицензии находится в файле LICENSE в корне проекта.
*/

document.querySelector('.burger').addEventListener('click', () => {
    const menu = document.querySelector('.header_menu');
    menu.classList.toggle('active');
});