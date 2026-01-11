document.addEventListener('DOMContentLoaded', function () {
    // Star Controls
    const starColorPicker = document.getElementById('starColor');
    const starCountSlider = document.getElementById('starCount');
    const starCountValue = document.querySelector('.star-count-value');
    const starsContainer = document.querySelector('.stars-container');
    let stars = [];

    // Physics parameters
    const physics = {
        mouseInfluence: 20,
        mouseRadius: 150,
        friction: 0.3,
        springFactor: 0.1,
        repulsionRadius: 60,
        repulsionForce: 5
    };

    // Mouse position
    let mouseX = null, mouseY = null;
    let mouseActive = false;

    // Initialize stars
    function initStars() {
        starsContainer.innerHTML = '';
        stars = [];

        for (let i = 0; i < starCountSlider.value; i++) {
            createStar();
        }
    }

    // Create a single star
    function createStar() {
        const star = document.createElement('div');
        star.className = 'star';

        // Random size between 1-3px
        const size = Math.random() * 2 + 1;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;

        // Random position
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        star.style.left = `${x}%`;
        star.style.top = `${y}%`;

        // Set initial color
        star.style.backgroundColor = starColorPicker.value;

        starsContainer.appendChild(star);

        // Store reference with physics properties
        stars.push({
            element: star,
            x: x * window.innerWidth / 100,
            y: y * window.innerHeight / 100,
            vx: 0,
            vy: 0,
            size: size
        });
    }

    // Event Listeners
    starColorPicker.addEventListener('input', function () {
        stars.forEach(star => {
            star.element.style.backgroundColor = this.value;
        });
    });

    starCountSlider.addEventListener('input', function () {
        starCountValue.textContent = this.value;
        const difference = this.value - stars.length;

        if (difference > 0) {
            // Add stars
            for (let i = 0; i < difference; i++) {
                createStar();
            }
        } else if (difference < 0) {
            // Remove stars
            const starsToRemove = stars.slice(this.value);
            starsToRemove.forEach(star => {
                star.element.remove();
            });
            stars = stars.slice(0, this.value);
        }
    });

    // Mouse movement tracking
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        mouseActive = true;
    });

    document.addEventListener('mouseleave', () => {
        mouseActive = false;
    });

    // Animation loop
    function animate() {
        stars.forEach(star => {
            // Reset acceleration
            let ax = 0, ay = 0;

            // Mouse influence
            if (mouseActive) {
                const dx = mouseX - star.x;
                const dy = mouseY - star.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < physics.mouseRadius) {
                    const angle = Math.atan2(dy, dx);
                    const force = physics.mouseInfluence * (1 - distance / physics.mouseRadius);

                    // Circular motion around cursor
                    ax += Math.cos(angle + Math.PI / 2) * force * 0.5;
                    ay += Math.sin(angle + Math.PI / 2) * force * 0.5;

                    // Slight attraction to center
                    ax += dx * 0.01;
                    ay += dy * 0.01;

                    // Repulsion when very close
                    if (distance < physics.repulsionRadius) {
                        const repulsion = physics.repulsionForce * (1 - distance / physics.repulsionRadius);
                        ax -= dx * repulsion * 0.1;
                        ay -= dy * repulsion * 0.1;
                    }
                }
            }

            // Star-to-star collisions
            stars.forEach(otherStar => {
                if (star !== otherStar) {
                    const dx = otherStar.x - star.x;
                    const dy = otherStar.y - star.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    const minDistance = (star.size + otherStar.size) * 2;

                    if (distance < minDistance) {
                        const force = physics.repulsionForce * (1 - distance / minDistance);
                        ax -= dx * force * 0.05;
                        ay -= dy * force * 0.05;
                    }
                }
            });

            // Update physics
            star.vx = star.vx * (1 - physics.friction) + ax;
            star.vy = star.vy * (1 - physics.friction) + ay;
            star.x += star.vx;
            star.y += star.vy;

            // Boundary checks
            if (star.x < 0 || star.x > window.innerWidth) {
                star.x = Math.max(0, Math.min(window.innerWidth, star.x));
                star.vx *= -0.5;
            }
            if (star.y < 0 || star.y > window.innerHeight) {
                star.y = Math.max(0, Math.min(window.innerHeight, star.y));
                star.vy *= -0.5;
            }

            // Update DOM
            star.element.style.left = `${star.x}px`;
            star.element.style.top = `${star.y}px`;

            // Twinkle effect based on speed
            const speed = Math.sqrt(star.vx * star.vx + star.vy * star.vy);
            star.element.style.opacity = speed > 2 ? 0.7 + 0.3 * Math.random() : 1;
        });

        requestAnimationFrame(animate);
    }

    // Handle window resize
    window.addEventListener('resize', () => {
        stars.forEach(star => {
            star.x = (parseFloat(star.element.style.left) / window.innerWidth) * window.innerWidth;
            star.y = (parseFloat(star.element.style.top) / window.innerHeight) * window.innerHeight;
        });
    });

    // Initialize
    initStars();
    animate();
});