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
        // Google Cybersecurity (Professional)
        "google-cybersecurity": {
            title: "Google Cybersecurity (Professional)",
            provider: "Google",
            details: `
                <ul>
                    <li>Covered core security concepts: CIA triad, defense-in-depth, and security frameworks.</li>
                    <li>Hands-on experience with Linux, Python, SIEM tools, and log analysis.</li>
                    <li>Identifying, investigating, and responding to security incidents.</li>
                    <li>Working with IDS/IPS, vulnerability management, and risk assessment.</li>
                </ul>
            `,
            link: "https://coursera.org/verify/professional-cert/ULL6I7CMIE9I"
        },

        // EC-Council Cybersecurity – Cybersecurity Attack & Defense
        "eccouncil-cyberfundamentals": {
            title: "Cybersecurity Attack & Defense",
            provider: "EC-Council",
            details: `
                <ul>
                    <li>Fundamentals of ethical hacking and security assessment.</li>
                    <li>Common attack vectors, exploits, and defense mechanisms.</li>
                    <li>Network security, perimeter defense, and security hardening.</li>
                    <li>Intro to digital forensics and incident response practices.</li>
                </ul>
            `,
            link: "https://coursera.org/verify/specialization/Q9UPMCKAAXX7"
        },

        // IBM DevOps
        "ibm-devops": {
            title: "Introduction to DevOps",
            provider: "IBM",
            details: `
                <ul>
                    <li>DevOps culture, principles, and collaboration practices.</li>
                    <li>CI/CD pipelines and automated build–test–deploy workflows.</li>
                    <li>Version control, issue tracking, and environment management.</li>
                    <li>Monitoring, feedback loops, and continuous improvement.</li>
                </ul>
            `,
            link: "https://coursera.org/verify/F5ZD04KMUIV2"
        },

        // NPTEL Cloud · IoT · Edge · ML (Elite)
        "nptel-cloud-iot": {
            title: "Cloud · IoT · Edge · ML (Elite)",
            provider: "IIT Kanpur (NPTEL)",
            details: `
                <ul>
                    <li>Architectures for IoT, edge, and cloud-based systems.</li>
                    <li>Data pipelines from sensors to cloud and edge devices.</li>
                    <li>Applying machine learning to IoT/edge scenarios.</li>
                    <li>Scalability, reliability, and performance considerations.</li>
                </ul>
            `,
            // link: "YOUR_NPTEL_CLOUD_IOT_EDGE_ML_CERTIFICATE_LINK"
        },

        // IBM Databases & SQL (Honors)
        "ibm-sql-honors": {
            title: "Databases & SQL (Honors)",
            provider: "IBM",
            details: `
                <ul>
                    <li>Writing complex queries using SELECT, WHERE, GROUP BY, HAVING.</li>
                    <li>Joins, subqueries, set operations, and aggregations.</li>
                    <li>Transactions, ACID properties, and locking concepts.</li>
                    <li>Relational modeling and designing normalized schemas.</li>
                </ul>
            `,
            link: "https://coursera.org/verify/W83AX2JYPWJL"
        },

        // Meta Introduction to Databases
        "meta-databases": {
            title: "Introduction to Databases",
            provider: "Meta",
            details: `
                <ul>
                    <li>Core relational database concepts and terminology.</li>
                    <li>ERD modeling, keys, and integrity constraints.</li>
                    <li>Normalization (1NF, 2NF, 3NF) and schema design.</li>
                    <li>Basics of indexing and query performance considerations.</li>
                </ul>
            `,
            link: "https://coursera.org/verify/KW7L457PM5R4"
        },

        // HackerRank SQL (Basic & Intermediate)
        "hackerrank-sql": {
            title: "SQL (Basic & Intermediate)",
            provider: "HackerRank",
            details: `
                <ul>
                    <li>SELECT, WHERE, ORDER BY, GROUP BY, HAVING.</li>
                    <li>INNER/LEFT joins, subqueries, and aggregations.</li>
                    <li>Working with relational schemas and constraints.</li>
                    <li>Writing optimized queries on realistic datasets.</li>
                </ul>
            `,
            link: "https://www.hackerrank.com/certificates/iframe/ff5590a0368d"
        },

        // HackerRank Problem Solving (Basic)
        "hackerrank-problem-solving": {
            title: "Problem Solving (Basic)",
            provider: "HackerRank",
            details: `
                <ul>
                    <li>Algorithmic thinking and logical reasoning skills.</li>
                    <li>Pattern recognition and stepwise problem decomposition.</li>
                    <li>Using arrays, strings, and basic data structures.</li>
                    <li>Introductory analysis of time and space complexity.</li>
                </ul>
            `,
            link: "https://www.hackerrank.com/certificates/f424711b287f"
        },

        // HackerRank Python (Basic)
        "hackerrank-python-basic": {
            title: "Python (Basic)",
            provider: "HackerRank",
            details: `
                <ul>
                    <li>Variables, basic data types, and operators.</li>
                    <li>Control flow: conditionals, loops, and iterations.</li>
                    <li>Lists, tuples, dictionaries, and common operations.</li>
                    <li>Functions, simple scripts, and basic problem solving.</li>
                </ul>
            `,
            link: "https://www.hackerrank.com/certificates/70104e33ae38"
        },

        // Successful Negotiation – University of Michigan
        "michigan-negotiation": {
            title: "Successful Negotiation",
            provider: "University of Michigan",
            details: `
                <ul>
                    <li>Structured negotiation frameworks and key phases.</li>
                    <li>Preparation and setting clear, realistic objectives.</li>
                    <li>Creating value and finding win–win outcomes.</li>
                    <li>Managing conflict and closing durable agreements.</li>
                </ul>
            `,
            link: "https://coursera.org/verify/YARGC9MFXLTJ"
        },

        // Introduction to Psychology – Yale
        "yale-psychology": {
            title: "Introduction to Psychology",
            provider: "Yale University",
            details: `
                <ul>
                    <li>Foundations of cognitive, behavioral, and social psychology.</li>
                    <li>How perception, memory, and emotion influence behavior.</li>
                    <li>Personality, motivation, and mental health basics.</li>
                    <li>Applications of psychology in everyday life and decisions.</li>
                </ul>
            `,
            link: "https://coursera.org/verify/CNA3P7529ZN3"
        },

        // Multi-Core Computer Architecture – NPTEL
        "nptel-multicore": {
            title: "Multi-Core Computer Architecture",
            provider: "IIT Guwahati (NPTEL)",
            details: `
                <ul>
                    <li>Basics of parallel architectures and multi-core processors.</li>
                    <li>Caches, memory hierarchy, and coherence protocols.</li>
                    <li>Instruction-level, thread-level, and data-level parallelism.</li>
                    <li>Performance optimization and scalability considerations.</li>
                </ul>
            `,
            // link: "YOUR_NPTEL_MULTICORE_CERTIFICATE_LINK"
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



