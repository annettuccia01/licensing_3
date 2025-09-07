function resetStorage(showConfirm = true) {
  try {
    if (showConfirm && !confirm('Вы уверены, что хотите сбросить все настройки?')) {
      return false;
    }

    localStorage.clear();
    console.log('LocalStorage полностью очищен');

    return true;
  } catch (e) {
    console.error('Ошибка при сбросе хранилища:', e);
    return false;
  }
}

function initResetButton(buttonId = 'reset') {
  const button = document.getElementById(buttonId);
  if (!button) {
    console.warn(`Кнопка #${buttonId} не найдена`);
    return;
  }

  button.addEventListener('click', () => {
    const success = resetStorage();
    if (success) {
      location.reload();
    } else {
      alert('Ошибка при сбросе. Проверьте консоль.');
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initResetButton('reset');
});