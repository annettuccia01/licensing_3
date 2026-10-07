/*
  Copyright (c) 2026 Цед Анна Викторовна
  Данный исходный код распространяется под лицензией MIT.
  Полный текст лицензии находится в файле LICENSE в корне проекта.
*/

const themeToggleBtn = document.getElementById('theme-switch');
const body = document.body;
const lightIcon = document.querySelector('.light-icon');
const darkIcon = document.querySelector('.dark-icon');

// Функция для обновления иконок в зависимости от темы
function updateIcons() {
  if (body.classList.contains('dark_mode')) {
    lightIcon.style.display = 'none';
    darkIcon.style.display = 'block';
  } else {
    lightIcon.style.display = 'block';
    darkIcon.style.display = 'none';
  }
}

// Применение темы из localStorage при загрузке страницы
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  body.classList.add('dark_mode');
}
updateIcons(); // Обновляем иконки при загрузке

// Обработчик нажатия на кнопку
themeToggleBtn.addEventListener('click', () => {
  body.classList.toggle('dark_mode');
  updateIcons(); // Обновляем иконки при переключении

  // Сохраняем текущую тему
  if (body.classList.contains('dark_mode')) {
    localStorage.setItem('theme', 'dark');
  } else {
    localStorage.setItem('theme', 'light');
  }
});