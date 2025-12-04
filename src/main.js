// --- 1. Global Initialization ---
lucide.createIcons();

// --- 2. Lenis Smooth Scroll ---
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// --- 3. Header Scroll Effect & Mobile Menu ---
const header = document.querySelector('.header');
const burgerBtn = document.querySelector('.burger-btn');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-menu__link, .mobile-menu__btn');
const body = document.body;

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

function toggleMenu() {
    const isOpen = mobileMenu.classList.contains('is-active');
    
    if (isOpen) {
        mobileMenu.classList.remove('is-active');
        body.style.overflow = ''; // Return scroll
        burgerBtn.innerHTML = '<i data-lucide="menu"></i>';
    } else {
        mobileMenu.classList.add('is-active');
        body.style.overflow = 'hidden'; // Lock scroll
        burgerBtn.innerHTML = '<i data-lucide="x"></i>';
    }
    lucide.createIcons();
}

burgerBtn.addEventListener('click', toggleMenu);

mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (mobileMenu.classList.contains('is-active')) {
            toggleMenu();
        }
    });
});

// --- 4. GSAP & ScrollTrigger Animations ---
document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollTrigger);

    // Hero Animations (Reworked to fix gradient text)
    const baseTextElement = document.querySelector('.hero__title-base');
    if (baseTextElement) {
        new SplitType(baseTextElement, { types: 'lines, words' });
    }
    
    const tl = gsap.timeline();

    tl.fromTo('.hero__title-base .word', 
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.05, duration: 1, ease: "power3.out" }
    )
    .fromTo('.hero__title-accent',
        { opacity: 0, scaleX: 0.8, y: 10 },
        { opacity: 1, scaleX: 1, y: 0, duration: 0.6, ease: "back.out(1.7)" },
        "-=0.5" 
    )
    .fromTo('.hero__desc .reveal-text', 
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }, 
        "-=0.5"
    )
    .fromTo('.reveal-up', 
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out", stagger: 0.2 }, 
        "-=0.5"
    )
    .fromTo('.hero__visual', 
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 1.2, ease: "back.out(1.7)" }, 
        "-=1"
    );
    
    gsap.set('.reveal-text, .reveal-up', { opacity: 1 });


    // General Scroll Animation (Trigger for all sections)
    document.querySelectorAll('.reveal-trigger').forEach(el => {
        gsap.fromTo(el,
            { opacity: 0, y: 50 },
            { 
                opacity: 1, 
                y: 0, 
                duration: 0.8, 
                ease: "power2.out",
                scrollTrigger: {
                    trigger: el,
                    start: "top 90%", // Start animation when element is 90% in viewport
                    toggleActions: "play none none none",
                }
            }
        );
    });

});


// --- 5. Contact Form Logic (Validation & AJAX imitation) ---
const form = document.getElementById('contactForm');
const phoneInput = document.getElementById('phone');
const captchaQuestion = document.getElementById('captchaQuestion');
const captchaInput = document.getElementById('captcha');
const captchaStatus = document.getElementById('captchaStatus');
const formMessage = document.getElementById('formMessage');

let captchaAnswer = 0;

function generateCaptcha() {
    const num1 = Math.floor(Math.random() * 5) + 3; // 3-7
    const num2 = Math.floor(Math.random() * 3) + 1; // 1-3
    captchaAnswer = num1 + num2;
    captchaQuestion.textContent = `${num1} + ${num2}`;
    captchaInput.value = '';
    captchaInput.classList.remove('success', 'error');
    captchaStatus.textContent = '';
}

generateCaptcha();

// Captcha Real-time Validation
captchaInput.addEventListener('input', () => {
    const inputVal = parseInt(captchaInput.value);
    const parent = captchaInput.closest('.form-group');

    if (inputVal === captchaAnswer) {
        parent.classList.remove('error');
        parent.classList.add('success');
        captchaStatus.textContent = '✅';
        captchaStatus.style.color = 'var(--color-success)';
    } else {
        parent.classList.remove('success');
        if (captchaInput.value.length > 0) {
            parent.classList.add('error');
            captchaStatus.textContent = '❌';
            captchaStatus.style.color = 'var(--color-error)';
        } else {
            parent.classList.remove('error');
            captchaStatus.textContent = '';
        }
    }
});

// Phone Input Sanitation (Only digits allowed)
phoneInput.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, '');
});

// AJAX Imitation on Submit
form.addEventListener('submit', (e) => {
    e.preventDefault();
    formMessage.style.display = 'none'; // Hide previous message
    
    // Final Captcha Check
    if (parseInt(captchaInput.value) !== captchaAnswer) {
        formMessage.textContent = 'Ошибка: неверный ответ на капчу.';
        formMessage.classList.remove('success');
        formMessage.classList.add('error');
        formMessage.style.display = 'block';
        return;
    }

    // Simulate AJAX Request (2 seconds delay)
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.textContent = 'Отправка...';
    submitBtn.disabled = true;

    setTimeout(() => {
        // Success response imitation
        formMessage.textContent = 'Спасибо! Ваша заявка принята. Мы свяжемся с вами в ближайшее время.';
        formMessage.classList.remove('error');
        formMessage.classList.add('success');
        formMessage.style.display = 'block';
        
        form.reset();
        generateCaptcha(); // Reset captcha after successful submission
        submitBtn.textContent = 'Запросить консультацию';
        submitBtn.disabled = false;

    }, 2000);
});

// --- 6. Cookie Popup Logic ---
const cookiePopup = document.getElementById('cookiePopup');
const acceptCookiesBtn = document.getElementById('acceptCookies');
const cookieName = 'teyraFlow_cookiesAccepted';

function checkCookieConsent() {
    if (localStorage.getItem(cookieName) !== 'true') {
        cookiePopup.classList.add('visible');
    }
}

function setCookieConsent() {
    localStorage.setItem(cookieName, 'true');
    cookiePopup.classList.remove('visible');
}

acceptCookiesBtn.addEventListener('click', setCookieConsent);

// Check consent on page load
window.addEventListener('load', checkCookieConsent);