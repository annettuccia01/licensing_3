// Функция полной очистки localStorage
function resetStorage(showConfirm = true) {
  try {
    // Проверка подтверждения
    if (showConfirm && !confirm('Вы уверены, что хотите сбросить все настройки?')) {
      return false;
    }

    // Полная очистка
    localStorage.clear();
    console.log('LocalStorage полностью очищен');

    return true;
  } catch (e) {
    console.error('Ошибка при сбросе хранилища:', e);
    return false;
  }
}

// Инициализация кнопки сброса
function initResetButton(buttonId = 'reset') {
  const button = document.getElementById(buttonId);
  if (!button) {
    console.warn(`Кнопка #${buttonId} не найдена`);
    return;
  }

  button.addEventListener('click', () => {
    const success = resetStorage();
    if (success) {
      location.reload(); // Перезагрузка для применения сброса
    } else {
      alert('Ошибка при сбросе. Проверьте консоль.');
    }
  });
}

// Автоматическая инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
  initResetButton('reset');
});