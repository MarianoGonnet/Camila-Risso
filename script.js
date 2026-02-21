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
const lightboxVideo = document.getElementById('lightbox-video');
const lightboxCaption = document.getElementById('lightbox-caption'); // Referencia al texto
const closeBtn = document.querySelector('.close-lightbox');
const galleryImages = document.querySelectorAll('.gallery-item img, .gallery-item video, .carousel-slide img, .about-img img'); // Selecciona todas las imágenes y videos

if (lightbox && galleryImages.length > 0) {
    galleryImages.forEach(img => {
        img.addEventListener('click', (e) => {
            if (img.tagName === 'VIDEO') e.preventDefault(); // Evita comportamientos nativos
            lightbox.style.display = "block";
            
            // Detectar si es video o imagen
            if (img.tagName === 'VIDEO') {
                lightboxImg.style.display = 'none';
                lightboxVideo.style.display = 'block';
                lightboxVideo.src = img.src;
                lightboxVideo.muted = true; // Silencio obligatorio
                lightboxVideo.loop = true; // Bucle infinito
                lightboxVideo.playsInline = true;
                lightboxVideo.removeAttribute('controls'); // Quita los controles para que no puedan activar audio
                lightboxVideo.play();
            } else {
                lightboxVideo.style.display = 'none';
                lightboxVideo.pause();
                lightboxImg.style.display = 'block';
                lightboxImg.src = img.src;
            }
            
            // Lógica para obtener el texto
            let captionText = img.getAttribute('alt') || ""; 

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
        if (lightboxVideo) { lightboxVideo.pause(); lightboxVideo.currentTime = 0; }
    });

    // Cerrar al hacer clic fuera de la imagen
    lightbox.addEventListener('click', (e) => {
        if (e.target !== lightboxImg && e.target !== lightboxVideo) {
            lightbox.style.display = "none";
            if (lightboxVideo) { lightboxVideo.pause(); lightboxVideo.currentTime = 0; }
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

// --- Lógica del Modal de Presupuesto ---
const budgetModal = document.getElementById('budget-modal');
const btnOpenBudget = document.getElementById('btn-open-budget');
const btnCloseBudget = document.getElementById('btn-close-budget');
const productsListContainer = document.getElementById('budget-products-list');
const btnSendWhatsapp = document.getElementById('btn-send-whatsapp');

// Lista de Productos
const products = [
    "Croissant", 
    "Medialunas dulces", 
    "Medialunas saladas", 
    "Chipá", 
    "Pan de molde", 
    "Pan de masa madre", 
    "Mini croissant", 
    "Scones", 
    "Cookies integrales",
    "Cookies con chips de chocolate"
];

// Objeto para guardar cantidades
let quantities = {};

// Inicializar Modal
if (budgetModal && productsListContainer) {
    // Generar HTML de productos
    products.forEach(prod => {
        const isChipa = prod === "Chipá";
        const step = isChipa ? "0.5" : "1";
        const label = isChipa ? "<small>(kg)</small>" : "";
        
        const row = document.createElement('div');
        row.classList.add('product-row');
        row.innerHTML = `
            <span class="product-name">${prod} ${label}</span>
            <div class="qty-selector">
                <button class="qty-btn minus" data-prod="${prod}">-</button>
                <input type="number" class="qty-input" id="qty-${prod.replace(/\s+/g, '-')}" value="0" min="0" step="${step}" data-prod="${prod}">
                <button class="qty-btn plus" data-prod="${prod}">+</button>
            </div>
        `;
        productsListContainer.appendChild(row);
    });

    // Eventos para abrir/cerrar
    if (btnOpenBudget) {
        btnOpenBudget.addEventListener('click', (e) => {
            e.preventDefault();
            budgetModal.classList.add('active');
        });
    }

    if (btnCloseBudget) {
        btnCloseBudget.addEventListener('click', () => {
            budgetModal.classList.remove('active');
        });
    }

    // Delegación de eventos para botones + y -
    productsListContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('qty-btn')) {
            const prod = e.target.getAttribute('data-prod');
            const input = document.getElementById(`qty-${prod.replace(/\s+/g, '-')}`);
            const isPlus = e.target.classList.contains('plus');
            const isChipa = prod === "Chipá";
            const step = isChipa ? 0.5 : 1;
            
            let currentValue = parseFloat(input.value) || 0;

            if (isPlus) {
                currentValue += step;
            } else {
                if (currentValue > 0) currentValue -= step;
            }

            // Ajuste de decimales para Chipá o enteros para el resto
            input.value = isChipa ? parseFloat(currentValue.toFixed(2)) : Math.round(currentValue);
        }
    });

    // Enviar a WhatsApp
    if (btnSendWhatsapp) {
        btnSendWhatsapp.addEventListener('click', () => {
            let message = "Hola Camila! Quisiera solicitar un presupuesto para:\n\n";
            let hasItems = false;

            const inputs = productsListContainer.querySelectorAll('.qty-input');
            
            inputs.forEach(input => {
                const qty = parseFloat(input.value);
                const prod = input.getAttribute('data-prod');

                if (qty > 0) {
                    if (prod === "Chipá") {
                        message += `- ${qty} kg de ${prod}\n`;
                    } else {
                        message += `- ${qty} x ${prod}\n`;
                    }
                    hasItems = true;
                }
            });

            if (!hasItems) {
                alert("Por favor, seleccioná al menos un producto.");
                return;
            }

            message += "\nMuchas gracias!";
            const whatsappUrl = `https://wa.me/5492494214303?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
        });
    }
}
