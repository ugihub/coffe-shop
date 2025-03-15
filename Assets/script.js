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