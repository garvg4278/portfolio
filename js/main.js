// ===================================
// Navigation and Scroll Behavior
// ===================================

// Navbar scroll effect
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    // Add shadow on scroll
    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
});

// Mobile menu toggle
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// Back to top button
const backToTop = document.getElementById('backToTop');

if (backToTop) {
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===================================
// Particle Animation for Hero Section
// ===================================

const particleCanvas = document.getElementById('particleCanvas');

if (particleCanvas) {
    const ctx = particleCanvas.getContext('2d');
    let particles = [];
    let animationId;

    // Set canvas size
    function resizeCanvas() {
        particleCanvas.width = particleCanvas.offsetWidth;
        particleCanvas.height = particleCanvas.offsetHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle class
    class Particle {
        constructor() {
            this.x = Math.random() * particleCanvas.width;
            this.y = Math.random() * particleCanvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 0.5 - 0.25;
            this.opacity = Math.random() * 0.5 + 0.2;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Wrap around screen
            if (this.x > particleCanvas.width) this.x = 0;
            if (this.x < 0) this.x = particleCanvas.width;
            if (this.y > particleCanvas.height) this.y = 0;
            if (this.y < 0) this.y = particleCanvas.height;
        }

        draw() {
            ctx.fillStyle = `rgba(0, 217, 255, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Initialize particles
    function initParticles() {
        particles = [];
        const particleCount = Math.min(Math.floor(particleCanvas.width * particleCanvas.height / 15000), 100);
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    // Animation loop
    function animateParticles() {
        ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);

        // Update and draw particles
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        // Connect nearby particles
        connectParticles();

        animationId = requestAnimationFrame(animateParticles);
    }

    // Connect particles with lines
    function connectParticles() {
        const maxDistance = 120;

        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < maxDistance) {
                    const opacity = (1 - distance / maxDistance) * 0.3;
                    ctx.strokeStyle = `rgba(0, 217, 255, ${opacity})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    initParticles();
    animateParticles();

    // Reinitialize on resize
    window.addEventListener('resize', () => {
        cancelAnimationFrame(animationId);
        initParticles();
        animateParticles();
    });
}

// =============================
// Certification Popup Logic
// =============================

const certModal = document.getElementById("certModal");
const certTitle = document.getElementById("certTitle");
const certProvider = document.getElementById("certProvider");
const certDetails = document.getElementById("certDetails");
const certLink = document.getElementById("certLink");
const certCloseBtn = document.getElementById("certCloseBtn");

// Only run if modal exists on this page
if (certModal && certCloseBtn && certTitle && certProvider && certDetails && certLink) {
    // 1) Certification data
    const certificationInfo = {
        "sql-basic": {
            title: "SQL (Basic & Intermediate)",
            provider: "HackerRank",
            details: `
                <ul>
                    <li>SELECT, WHERE, ORDER BY, GROUP BY, HAVING</li>
                    <li>INNER / LEFT JOIN and basic subqueries</li>
                    <li>Working with relational schemas and constraints</li>
                    <li>Writing optimized queries for real-world datasets</li>
                </ul>
            `,
            link: "https://www.hackerrank.com/certificates/iframe/ff5590a0368d"
        },
        "python-basic": {
            title: "Python (Basic)",
            provider: "HackerRank",
            details: `
                <ul>
                    <li>Variables, data types, loops, conditionals</li>
                    <li>Lists, tuples, dictionaries and basic operations</li>
                    <li>Functions, modules and basic file I/O</li>
                    <li>Solving programming challenges using Python</li>
                </ul>
            `,
            link: "YOUR_PYTHON_CERTIFICATE_LINK"
        },
        "problem-solving-basic": {
            title: "Problem Solving (Basic)",
            provider: "HackerRank",
            details: `
                <ul>
                    <li>Algorithmic thinking and logical reasoning</li>
                    <li>Pattern recognition and breaking problems into steps</li>
                    <li>Time/space tradeoffs at an introductory level</li>
                    <li>Hands-on challenges using data structures & loops</li>
                </ul>
            `,
            link: "YOUR_PROBLEM_SOLVING_CERTIFICATE_LINK"
        },
        "negotiation-michigan": {
            title: "Negotiation",
            provider: "University of Michigan",
            details: `
                <ul>
                    <li>Core negotiation frameworks and strategies</li>
                    <li>Preparing for negotiations with clear objectives</li>
                    <li>Finding win–win solutions and handling conflict</li>
                    <li>Practical case studies and role-play exercises</li>
                </ul>
            `,
            link: "YOUR_NEGOTIATION_CERTIFICATE_LINK"
        },
        "meta-databases": {
            title: "Databases",
            provider: "Meta",
            details: `
                <ul>
                    <li>Relational database concepts and SQL usage</li>
                    <li>Normalization and schema design</li>
                    <li>Indexing and query optimization basics</li>
                    <li>Transactions and consistency concepts</li>
                </ul>
            `,
            link: "YOUR_DATABASE_CERTIFICATE_LINK"
        },
        "psychology-yale": {
            title: "Psychology",
            provider: "Yale University",
            details: `
                <ul>
                    <li>Foundations of cognitive and social psychology</li>
                    <li>How perception, memory and emotion shape behavior</li>
                    <li>Decision-making biases and human motivation</li>
                    <li>Applications of psychology in real-world contexts</li>
                </ul>
            `,
            link: "YOUR_PSYCHOLOGY_CERTIFICATE_LINK"
        }
    };

    // 2) Open modal on card click
    document.querySelectorAll(".cert-card").forEach(card => {
        card.addEventListener("click", () => {
            const key = card.getAttribute("data-cert");
            const cert = certificationInfo[key];

            if (!cert) return;

            certTitle.textContent = cert.title;
            certProvider.textContent = cert.provider;
            certDetails.innerHTML = cert.details;
            certLink.href = cert.link || "#";

            certModal.classList.add("active");
        });
    });

    // 3) Close modal
    certCloseBtn.addEventListener("click", () => {
        certModal.classList.remove("active");
    });

    // Close when clicking outside content
    certModal.addEventListener("click", (e) => {
        if (e.target === certModal) {
            certModal.classList.remove("active");
        }
    });

    // Close with Escape key
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && certModal.classList.contains("active")) {
            certModal.classList.remove("active");
        }
    });
}



// ===================================
// Contact Page Particles
// ===================================

const contactParticles = document.getElementById('contactParticles');

if (contactParticles) {
    const ctx = contactParticles.getContext('2d');
    let particles = [];
    let animationId;

    function resizeCanvas() {
        contactParticles.width = contactParticles.offsetWidth;
        contactParticles.height = contactParticles.offsetHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class ContactParticle {
        constructor() {
            this.x = Math.random() * contactParticles.width;
            this.y = Math.random() * contactParticles.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = Math.random() * 0.3 - 0.15;
            this.speedY = Math.random() * 0.3 - 0.15;
            this.opacity = Math.random() * 0.3 + 0.1;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x > contactParticles.width) this.x = 0;
            if (this.x < 0) this.x = contactParticles.width;
            if (this.y > contactParticles.height) this.y = 0;
            if (this.y < 0) this.y = contactParticles.height;
        }

        draw() {
            ctx.fillStyle = `rgba(14, 165, 233, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initContactParticles() {
        particles = [];
        const particleCount = Math.min(Math.floor(contactParticles.width * contactParticles.height / 20000), 80);
        for (let i = 0; i < particleCount; i++) {
            particles.push(new ContactParticle());
        }
    }

    function animateContactParticles() {
        ctx.clearRect(0, 0, contactParticles.width, contactParticles.height);

        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        animationId = requestAnimationFrame(animateContactParticles);
    }

    initContactParticles();
    animateContactParticles();

    window.addEventListener('resize', () => {
        cancelAnimationFrame(animationId);
        initContactParticles();
        animateContactParticles();
    });
}

// ===================================
// Intersection Observer for Animations
// ===================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');

            // Animate skill bars
            if (entry.target.classList.contains('skill-bar')) {
                const skillFill = entry.target.querySelector('.skill-fill');
                if (skillFill && !skillFill.classList.contains('animated')) {
                    const width = skillFill.getAttribute('data-width');
                    setTimeout(() => {
                        skillFill.style.width = width + '%';
                        skillFill.classList.add('animated');
                    }, 200);
                }
            }
        }
    });
}, observerOptions);

// Observe all slide-up elements
document.querySelectorAll('.slide-up').forEach(el => {
    observer.observe(el);
});

// Observe skill bars
document.querySelectorAll('.skill-bar').forEach(el => {
    observer.observe(el);
});

// ===================================
// Accordion Functionality
// ===================================

const accordionHeaders = document.querySelectorAll('.accordion-header');

accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
        const accordionItem = header.parentElement;
        const isActive = accordionItem.classList.contains('active');

        // Close all accordion items
        document.querySelectorAll('.accordion-item').forEach(item => {
            item.classList.remove('active');
        });

        // Open clicked item if it wasn't active
        if (!isActive) {
            accordionItem.classList.add('active');
        }
    });
});

// ===================================
// Contact Form Validation
// ===================================

const contactForm = document.getElementById('contactForm');

if (contactForm) {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const formSuccess = document.getElementById('formSuccess');

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Show error
    function showError(input, message) {
        const formGroup = input.parentElement;
        const errorElement = formGroup.querySelector('.form-error');
        errorElement.textContent = message;
        errorElement.classList.add('show');
        input.style.borderColor = '#ef4444';
    }

    // Clear error
    function clearError(input) {
        const formGroup = input.parentElement;
        const errorElement = formGroup.querySelector('.form-error');
        errorElement.classList.remove('show');
        input.style.borderColor = '';
    }

    // Validate name
    function validateName() {
        const name = nameInput.value.trim();
        if (name === '') {
            showError(nameInput, 'Name is required');
            return false;
        } else if (name.length < 2) {
            showError(nameInput, 'Name must be at least 2 characters');
            return false;
        }
        clearError(nameInput);
        return true;
    }

    // Validate email
    function validateEmail() {
        const email = emailInput.value.trim();
        if (email === '') {
            showError(emailInput, 'Email is required');
            return false;
        } else if (!emailRegex.test(email)) {
            showError(emailInput, 'Please enter a valid email');
            return false;
        }
        clearError(emailInput);
        return true;
    }

    // Validate message
    function validateMessage() {
        const message = messageInput.value.trim();
        if (message === '') {
            showError(messageInput, 'Message is required');
            return false;
        } else if (message.length < 10) {
            showError(messageInput, 'Message must be at least 10 characters');
            return false;
        }
        clearError(messageInput);
        return true;
    }

    // Real-time validation
    nameInput.addEventListener('blur', validateName);
    emailInput.addEventListener('blur', validateEmail);
    messageInput.addEventListener('blur', validateMessage);

    // Form submission
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Validate all fields
        const isNameValid = validateName();
        const isEmailValid = validateEmail();
        const isMessageValid = validateMessage();

        if (isNameValid && isEmailValid && isMessageValid) {
            // Show success message
            formSuccess.textContent = 'Thank you for your message! I\'ll get back to you soon.';
            formSuccess.classList.add('show');

            // Reset form after 3 seconds
            setTimeout(() => {
                contactForm.reset();
                formSuccess.classList.remove('show');
            }, 3000);

            // In a real implementation, you would send the form data to a server here
            console.log('Form submitted:', {
                name: nameInput.value,
                email: emailInput.value,
                message: messageInput.value
            });
        }
    });
}

// ===================================
// Lazy Loading Images
// ===================================

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ===================================
// Keyboard Navigation Improvements
// ===================================

// Escape key to close mobile menu
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (navMenu && navMenu.classList.contains('active')) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    }
});

// ===================================
// Performance: Debounce Resize Events
// ===================================

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Use debounced resize for better performance
const debouncedResize = debounce(() => {
    // Any resize-specific code here
    console.log('Window resized');
}, 250);

window.addEventListener('resize', debouncedResize);

// ===================================
// Console Welcome Message
// ===================================

console.log('%c👋 Welcome to Garv Gupta\'s Portfolio!', 'color: #00d9ff; font-size: 20px; font-weight: bold;');
console.log('%cInterested in the code? Check out the GitHub repo!', 'color: #0ea5e9; font-size: 14px;');

// ===================================
// Page Load Complete
// ===================================

window.addEventListener('load', () => {
    console.log('Portfolio loaded successfully!');
});



// About page "read more" toggle
const readMoreBtn = document.getElementById('readMoreBtn');
const bioMore = document.getElementById('bioMore');

if (readMoreBtn && bioMore) {
    readMoreBtn.addEventListener('click', () => {
        const expanded = readMoreBtn.getAttribute('aria-expanded') === 'true';
        if (expanded) {
            bioMore.hidden = true;
            readMoreBtn.setAttribute('aria-expanded', 'false');
            readMoreBtn.textContent = 'Show more';
        } else {
            bioMore.hidden = false;
            readMoreBtn.setAttribute('aria-expanded', 'true');
            readMoreBtn.textContent = 'Show less';
        }
    });
}



