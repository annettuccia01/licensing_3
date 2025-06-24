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

// Запускаем анимацию после полной загрузки страницы
window.addEventListener("load", animatePreloader);