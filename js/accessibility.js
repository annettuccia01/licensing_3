/*
  Copyright (c) 2026 Цед Анна Викторовна
  Данный исходный код распространяется под лицензией MIT.
  Полный текст лицензии находится в файле LICENSE в корне проекта.
*/

function createAccessibilityPanel() {
    const panel = document.createElement('div');
    panel.id = 'accessibility-panel';
    panel.style.position = 'fixed';
    panel.style.top = '10px';
    panel.style.right = '10px';
    panel.style.backgroundColor = '#fff';
    panel.style.border = '1px solid #ccc';
    panel.style.padding = '10px';
    panel.style.zIndex = '1000';
    panel.style.display = 'none';
    panel.innerHTML = `
        <h3>Настройки для слабовидящих</h3>
        <label>Размер шрифта:</label><br>
        <input type="radio" name="font-size" value="font-normal" checked> Нормальный<br>
        <input type="radio" name="font-size" value="font-large"> Большой<br>
        <input type="radio" name="font-size" value="font-extra-large"> Очень большой<br>
        <label>Цветовая схема:</label><br>
        <input type="radio" name="color-scheme" value="white-black" checked> Белый/Черный<br>
        <input type="radio" name="color-scheme" value="beige-brown"> Бежевый/Коричневый<br>
        <input type="radio" name="color-scheme" value="blue-darkblue"> Голубой/Темно-синий<br>
        <label><input type="checkbox" id="no-images"> Отключить изображения</label><br>
        <button id="close-panel">Закрыть</button>
    `;
    document.body.appendChild(panel);

    const fontRadios = panel.querySelectorAll('input[name="font-size"]');
    const colorRadios = panel.querySelectorAll('input[name="color-scheme"]');
    const noImagesCheckbox = panel.querySelector('#no-images');
    const closeButton = panel.querySelector('#close-panel');

    fontRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            document.body.classList.remove('font-normal', 'font-large', 'font-extra-large');
            document.body.classList.add(radio.value);
        });
    });

    colorRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            document.body.classList.remove('white-black', 'beige-brown', 'blue-darkblue');
            document.body.classList.add(radio.value);
        });
    });

    noImagesCheckbox.addEventListener('change', () => {
        if (noImagesCheckbox.checked) {
            document.body.classList.add('no-images');
        } else {
            document.body.classList.remove('no-images');
        }
    });

    closeButton.addEventListener('click', () => {
        panel.style.display = 'none';
    });

    return panel;
}

document.getElementById('accessibility-btn').addEventListener('click', () => {
    let panel = document.getElementById('accessibility-panel');
    if (!panel) {
        panel = createAccessibilityPanel();
    }
    panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    document.body.classList.toggle('accessibility-mode');
});

const resetButton = document.getElementById('reset');
if (resetButton) {
    resetButton.addEventListener('click', () => {
        document.body.classList.remove('accessibility-mode', 'font-normal', 'font-large', 'font-extra-large', 'white-black', 'beige-brown', 'blue-darkblue', 'no-images');
        const panel = document.getElementById('accessibility-panel');
        if (panel) {
            panel.style.display = 'none';
            panel.querySelector('input[name="font-size"][value="font-normal"]').checked = true;
            panel.querySelector('input[name="color-scheme"][value="white-black"]').checked = true;
            panel.querySelector('#no-images').checked = false;
        }
    });
}