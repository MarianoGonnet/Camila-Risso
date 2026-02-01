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
    } else if (window.scrollY < 80) {
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

// Notificación de formulario enviado (Toast)
const urlParams = new URLSearchParams(window.location.search);
const toast = document.getElementById('toast');

if (urlParams.has('status') && urlParams.get('status') === 'success') {
    if (toast) {
        // Mostrar notificación con un pequeño delay
        setTimeout(() => {
            toast.classList.add('show');
        }, 500);

        // Ocultar después de 5 segundos
        setTimeout(() => {
            toast.classList.remove('show');
        }, 5000);
        
        // Limpiar la URL para que no aparezca al recargar
        window.history.replaceState({}, document.title, window.location.pathname);
    }
}

// Rotación de Testimonios (Si hay más de 3)
const testimonials = document.querySelectorAll('.testimonial-card');

if (testimonials.length > 3) {
    let testimonialIndex = 0;
    const showCount = 3; // Cantidad a mostrar simultáneamente

    // Iniciar rotación automática cada 7 segundos
    setInterval(() => {
        // 1. Identificar los visibles actuales para desvanecerlos
        for (let i = 0; i < showCount; i++) {
            let index = (testimonialIndex + i) % testimonials.length;
            testimonials[index].classList.add('testimonial-fade-out');
        }

        // 2. Esperar a que termine la animación de salida (500ms) antes de cambiar
        setTimeout(() => {
            // Ocultar todos y limpiar clases
            testimonials.forEach(card => {
                card.style.display = 'none';
                card.classList.remove('testimonial-fade-in', 'testimonial-fade-out');
            });

            // Avanzar índice
            // Avanzamos de a 3 para renovar todo el bloque (evita que los repetidos parpadeen)
            testimonialIndex = (testimonialIndex + showCount) % testimonials.length;

            // Mostrar los nuevos con animación de entrada
            for (let i = 0; i < showCount; i++) {
                let index = (testimonialIndex + i) % testimonials.length;
                testimonials[index].classList.add('testimonial-fade-in'); // Agregamos clase antes de mostrar
                testimonials[index].style.display = 'block';
            }
        }, 500); // Coincide con la duración de fadeOutTestimonial en CSS

    }, 7000);
}
