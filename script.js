// Menú Hamburguesa
const hamburger = document.querySelector('.hamburger');
const navList = document.querySelector('.nav-list');

hamburger.addEventListener('click', () => {
    navList.classList.toggle('active');
});

// Carousel
let slideIndex = 1;
let slideInterval; // Variable para controlar el tiempo

showSlides(slideIndex);
startSlideTimer(); // Iniciar el automático

// Controles siguiente/anterior
function plusSlides(n) {
    clearInterval(slideInterval); // Detener el automático si el usuario toca
    showSlides(slideIndex += n);
    startSlideTimer(); // Reiniciar el automático
}

function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("carousel-slide");
    
    if (slides.length === 0) return; // Evita errores si no hay fotos
    
    if (n > slides.length) {slideIndex = 1}    
    if (n < 1) {slideIndex = slides.length}
    
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";  
    }
    
    slides[slideIndex-1].style.display = "block";  
}

// Función para iniciar el cambio automático
function startSlideTimer() {
    slideInterval = setInterval(() => {
        showSlides(slideIndex += 1);
    }, 5000);
}

// Efecto Sticky Header (Achicar menú al hacer scroll)
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    header.classList.toggle('scrolled', window.scrollY > 50);
});

// Animación de aparición al hacer scroll (Reveal)
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target); // Solo animar una vez
        }
    });
}, {
    root: null,
    threshold: 0.15 // Se activa cuando el 15% del elemento es visible
});

revealElements.forEach(el => revealObserver.observe(el));
