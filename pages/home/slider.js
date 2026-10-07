/*
  Copyright (c) 2026 Цед Анна Викторовна
  Данный исходный код распространяется под лицензией MIT.
  Полный текст лицензии находится в файле LICENSE в корне проекта.
*/

document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    let currentSlide = 0;
    
    // Показываем первый слайд
    showSlide(currentSlide);
    
    // Обработчики для кнопок
    nextBtn.addEventListener('click', function() {
        currentSlide++;
        if (currentSlide >= slides.length) {
            currentSlide = 0;
        }
        showSlide(currentSlide);
    });
    
    prevBtn.addEventListener('click', function() {
        currentSlide--;
        if (currentSlide < 0) {
            currentSlide = slides.length - 1;
        }
        showSlide(currentSlide);
    });
    
    // Функция для показа слайда
    function showSlide(index) {
        // Скрываем все слайды
        slides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Показываем текущий слайд
        slides[index].classList.add('active');
    }
    
    // Автоматическое переключение слайдов (опционально)
    let slideInterval = setInterval(() => {
        currentSlide++;
        if (currentSlide >= slides.length) {
            currentSlide = 0;
        }
        showSlide(currentSlide);
    }, 5000); // Меняем слайд каждые 5 секунд
    
    // Остановка автоматического переключения при наведении
    const slider = document.querySelector('.reviews_slider');
    slider.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
    });
    
    slider.addEventListener('mouseleave', () => {
        slideInterval = setInterval(() => {
            currentSlide++;
            if (currentSlide >= slides.length) {
                currentSlide = 0;
            }
            showSlide(currentSlide);
        }, 5000);
    });
});