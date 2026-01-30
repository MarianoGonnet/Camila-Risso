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
    
    // Usamos rangos separados para evitar el parpadeo (efecto eléctrico)
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else if (window.scrollY < 10) {
        header.classList.remove('scrolled');
    }
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
    threshold: 0 // Se activa apenas el elemento entra en pantalla (ideal para secciones largas en móvil)
});

revealElements.forEach(el => revealObserver.observe(el));

// Lightbox (Galería Pantalla Completa)
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption'); // Referencia al texto
const closeBtn = document.querySelector('.close-lightbox');
const galleryImages = document.querySelectorAll('.gallery-item img, .carousel-slide img, .about-img img'); // Selecciona todas las imágenes

if (lightbox && galleryImages.length > 0) {
    galleryImages.forEach(img => {
        img.addEventListener('click', () => {
            lightbox.style.display = "block";
            lightboxImg.src = img.src;
            
            // Lógica para obtener el texto
            let captionText = img.alt; // Por defecto usa el texto alternativo

            // Excepción: Si es la imagen de "Sobre Mí" en el inicio, no mostrar texto
            if (img.closest('.about-img') && !img.closest('.carousel-slide')) {
                captionText = "";
            }

            // 1. Si es de la Galería (tiene un div hermano .gallery-overlay con un p)
            const overlay = img.nextElementSibling;
            if (overlay && overlay.classList.contains('gallery-overlay')) {
                const p = overlay.querySelector('p');
                if (p) captionText = p.textContent;
            }
            // 2. Si es del Carrusel (tiene un div hermano .caption)
            else if (overlay && overlay.classList.contains('caption')) {
                captionText = overlay.textContent;
            }

            if (lightboxCaption) {
                lightboxCaption.textContent = captionText;
                lightboxCaption.style.display = captionText ? 'block' : 'none'; // Ocultar si no hay texto
            }
        });
    });

    // Cerrar con el botón X
    closeBtn.addEventListener('click', () => {
        lightbox.style.display = "none";
    });

    // Cerrar al hacer clic fuera de la imagen
    lightbox.addEventListener('click', (e) => {
        if (e.target !== lightboxImg) {
            lightbox.style.display = "none";
        }
    });
}
