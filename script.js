/**
 * GLOUNDER Landing Page Scripts
 * Includes Header scroll logic and Hero Image Sequence Animation
 */

document.addEventListener('DOMContentLoaded', () => {
    initHeader();
    initHeroSequence();
    initAnimations();
});

/**
 * Header Transition Logic
 */
function initHeader() {
    const header = document.getElementById('main-header');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

/**
 * Scroll-Driven Image Sequence Logic
 */
function initHeroSequence() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    const context = canvas.getContext('2d');
    const heroSection = document.getElementById('hero');

    // Configuration
    const frameCount = 100; // Number of images in sequences
    const currentFrame = index => (
        `images/frame_${index.toString().padStart(4, '0')}.jpg`
    );

    // Preload images
    const images = [];
    const sequence = {
        frame: 0
    };

    // Since actual images are missing, we'll draw a placeholder or the @beforeimage if available
    // For now, let's set up the structure.

    const img = new Image();
    img.src = 'images/hero.jpg'; // Primary background

    img.onload = () => {
        updateCanvasSize();
        render();
    };

    // In a real scenario, we'd preload all images:
    /*
    for (let i = 0; i < frameCount; i++) {
        const img = new Image();
        img.src = currentFrame(i);
        images.push(img);
    }
    */

    function updateCanvasSize() {
        canvas.width = window.innerWidth * window.devicePixelRatio;
        canvas.height = window.innerHeight * window.devicePixelRatio;
        render();
    }

    function render() {
        if (!img.complete) return;

        context.clearRect(0, 0, canvas.width, canvas.height);

        // Draw image mimicking background-size: cover
        const imgWidth = img.width;
        const imgHeight = img.height;
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;

        const ratio = Math.max(canvasWidth / imgWidth, canvasHeight / imgHeight);
        const nw = imgWidth * ratio;
        const nh = imgHeight * ratio;

        context.drawImage(img, (canvasWidth - nw) / 2, (canvasHeight - nh) / 2, nw, nh);
    }

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const maxScroll = heroSection.offsetHeight - window.innerHeight;
        const scrollFraction = Math.max(0, Math.min(1, scrollTop / maxScroll));

        const frameIndex = Math.min(
            frameCount - 1,
            Math.floor(scrollFraction * frameCount)
        );

        // Update frame logic here if images were loaded
        // if (images[frameIndex]) {
        //    img = images[frameIndex];
        //    render();
        // }

        // Parallax/Fade effect for content
        const heroContent = document.querySelector('.hero-content');
        heroContent.style.opacity = 1 - (scrollFraction * 1.5);
        heroContent.style.transform = `translateY(${scrollFraction * 100}px)`;
    });

    window.addEventListener('resize', updateCanvasSize);
}

/**
 * Standard Intersection Observer for reveal animations
 */
function initAnimations() {
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

    // Added staggered delay for story cards
    document.querySelectorAll('.story-card').forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
        card.classList.add('fade-in');
        observer.observe(card);
    });
}
