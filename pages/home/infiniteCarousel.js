/*
  Copyright (c) 2026 Цед Анна Викторовна
  Данный исходный код распространяется под лицензией MIT.
  Полный текст лицензии находится в файле LICENSE в корне проекта.
*/

function initInfiniteCarousel() {  
    const track = document.querySelector('.running_track');  
    const images = document.querySelectorAll('.running_track img');  
    
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
            
            if (position <= -track.scrollWidth / 2) {  
                position = 0;  
            }  
            
            track.style.transform = `translateX(${position}px)`;  
        }  
        
        animationFrameId = requestAnimationFrame(animateCarousel);  
    }  
    
    animateCarousel();   
}  

document.addEventListener('DOMContentLoaded', initInfiniteCarousel);  