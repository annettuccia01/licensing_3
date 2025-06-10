const themeToggleBtn = document.getElementById('theme-switch');
const body = document.body;

  // Применение темы из localStorage при загрузке страницы
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    body.classList.add('dark_mode');
  }

  // Обработчик нажатия на кнопку
  themeToggleBtn.addEventListener('click', () => {
    body.classList.toggle('dark_mode');

    // Сохраняем текущую тему
    if (body.classList.contains('dark_mode')) {
      localStorage.setItem('theme', 'dark');
    } else {
      localStorage.setItem('theme', 'light');
    }
  });