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
