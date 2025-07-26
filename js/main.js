// Initialize the page
document.addEventListener('DOMContentLoaded', function () {
    // Create stars for background
    createStars();

    // Initialize intersection observer for scroll animations
    initIntersectionObserver();

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Form submission handler
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }
});

// Create stars for the background
function createStars() {
    const starsContainer = document.querySelector('.stars-container');
    if (!starsContainer) return;

    // Clear existing stars
    starsContainer.innerHTML = '';

    // Create 100 stars
    for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.classList.add('star');

        // Random size between 1px and 3px
        const size = Math.random() * 2 + 1;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;

        // Random position
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;

        // Random animation duration and delay
        star.style.animationDuration = `${Math.random() * 2 + 2}s`;
        star.style.animationDelay = `${Math.random() * 2}s`;

        starsContainer.appendChild(star);
    }
}

// Initialize Intersection Observer for scroll animations
function initIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, observerOptions);

    // Observe all elements with the section-entry class
    document.querySelectorAll('.section-entry').forEach(section => {
        observer.observe(section);
    });
}

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const submitBtn = form.querySelector('button[type="submit"]');

    // Disable submit button during submission
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    // Simulate form submission (in a real scenario, you'd use fetch or similar)
    setTimeout(() => {
        alert('Thank you for your message! I will get back to you soon.');
        form.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
    }, 1500);
    // Highlight current page in navigation
    function highlightCurrentPage() {
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.navbar a');

        navLinks.forEach(link => {
            const linkPath = link.getAttribute('href');
            if (currentPath === linkPath) {
                link.parentElement.classList.add('current-page');
            } else {
                link.parentElement.classList.remove('current-page');
            }
        });
    }

    // Call this in DOMContentLoaded
    document.addEventListener('DOMContentLoaded', function () {
        highlightCurrentPage();
        // Rest of your existing code...
    });