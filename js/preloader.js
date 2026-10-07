/*
  Copyright (c) 2026 Цед Анна Викторовна
  Данный исходный код распространяется под лицензией MIT.
  Полный текст лицензии находится в файле LICENSE в корне проекта.
*/

function animatePreloader() {
    let width = 0;
    const progress = document.querySelector(".progress");
    const percent = document.querySelector(".percent");
    
    const interval = setInterval(() => {
        if (width >= 100) {
            clearInterval(interval);
            document.querySelector(".preloader").style.opacity = "0";
            setTimeout(() => {
                document.querySelector(".preloader").style.display = "none";
            }, 500);
        } else {
            width += 1;
            progress.style.width = `${width}%`;
            percent.textContent = `${width}%`;
        }
    }, 30);
}

window.addEventListener("load", animatePreloader);