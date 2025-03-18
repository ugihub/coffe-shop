// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// JavaScript untuk menghapus efek blur saat scroll
window.addEventListener('scroll', () => {
    const heroBackground = document.querySelector('.hero-background');
    const heroSection = document.querySelector('.hero');

    // Hitung posisi scroll
    const scrollPosition = window.scrollY;

    // Jika scroll melewati hero section, hapus efek blur
    if (scrollPosition > heroSection.offsetHeight) {
        heroBackground.style.filter = 'blur(0px)';
    } else {
        heroBackground.style.filter = 'blur(8px)';
    }
});

const container = document.getElementById("scroll-container");
const cards = Array.from(container.children);

// Duplikasi elemen untuk looping mulus
cards.forEach(card => {
    const clone = card.cloneNode(true);
    container.appendChild(clone);
});

let animationId;
let scrollSpeed = 2; // Kecepatan scroll dalam pixel/frame

function startScrolling() {
    animationId = requestAnimationFrame(scroll);
}

function scroll() {
    container.scrollLeft += scrollSpeed;
    if (container.scrollLeft >= container.scrollWidth / 2) {
        container.scrollLeft = 0; // Reset scroll jika setengahnya sudah bergeser
    }
    animationId = requestAnimationFrame(scroll);
}

function stopScrolling() {
    cancelAnimationFrame(animationId);
}

// Mulai scrolling
startScrolling();

// Pause scroll saat pointer berada di atas container
container.addEventListener("mouseenter", stopScrolling);
container.addEventListener("mouseleave", startScrolling);

const testimonials = document.querySelectorAll('.testimonial');
let currentIndex = 0;
let interval;

function animateTestimonials() {
    testimonials.forEach((testimonial, index) => {
        if (index === currentIndex) {
            testimonial.classList.add('active');
        } else {
            testimonial.classList.remove('active');
        }
    });
    currentIndex = (currentIndex + 1) % testimonials.length; // Loop ke testimonial berikutnya
}

// Jalankan animasi otomatis
function startAnimation() {
    interval = setInterval(animateTestimonials, 2000);
}

// Hentikan animasi
function stopAnimation() {
    clearInterval(interval);
}

// Tambahkan event listener ke masing-masing testimonial
testimonials.forEach((testimonial) => {
    testimonial.addEventListener('mouseenter', () => {
        stopAnimation();
        testimonials.forEach((t) => t.classList.remove('active')); // Set semua card kembali semula
        testimonial.classList.add('hovered'); // Tambahkan efek hover khusus pada card yang di-cursor
    });

    testimonial.addEventListener('mouseleave', () => {
        testimonial.classList.remove('hovered'); // Hapus efek hover
        startAnimation(); // Mulai ulang animasi otomatis
    });
});

// Mulai animasi saat halaman dimuat
startAnimation();

const navbar = document.getElementById('header');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('blur'); // Tambahkan kelas 'blur' saat di-scroll
    } else {
        navbar.classList.remove('blur'); // Hapus kelas 'blur' saat kembali ke atas
    }
});

document.querySelectorAll('.nav-links a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault(); // Cegah perilaku default link
        const targetId = this.getAttribute('href').substring(1); // Ambil ID target
        const targetElement = document.getElementById(targetId);

        // Scroll ke target dengan offset
        window.scrollTo({
            top: targetElement.offsetTop - 80, // Tambahkan offset (80px ke atas)
            behavior: 'smooth' // Scroll dengan efek smooth
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.fade-in-section');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.2 // Animasi mulai saat 20% elemen terlihat
    });

    sections.forEach(section => {
        observer.observe(section);
    });
});