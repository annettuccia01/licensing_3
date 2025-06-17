function initInfiniteCarousel() {  
    const track = document.querySelector('.running_track');  
    const images = document.querySelectorAll('.running_track img');  
    
    // Клонирование изображений для бесшовного зацикливания  
    images.forEach(img => {  
        const clone = img.cloneNode(true);  
        track.appendChild(clone);  
    });  
    
    let animationFrameId;  
    let speed = 2;
    let position = 0;  
    let isPaused = false;  
    
    function animateCarousel() {  
        if (!isPaused) {  
            position -= speed;  
            
            // Сброс позиции, когда прокрутился набор изображений 
            if (position <= -track.scrollWidth / 2) {  
                position = 0;  
            }  
            
            track.style.transform = `translateX(${position}px)`;  
        }  
        
        animationFrameId = requestAnimationFrame(animateCarousel);  
    }  
    
    // Начало анимации 
    animateCarousel();   
}  

document.addEventListener('DOMContentLoaded', initInfiniteCarousel);  