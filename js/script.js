// Initialize AOS (Animate On Scroll)
AOS.init({
    duration: 1000,
    once: false,
    offset: 100
});

// Typing Animation
const typingText = document.querySelector('.typing-text');
const words = ['Developer', 'Learner', 'Problem Solver'];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
const baseText = "A ";

function type() {
    const currentWord = words[wordIndex];
    
    if (isDeleting) {
        typingText.textContent = baseText + currentWord.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingText.textContent = baseText + currentWord.substring(0, charIndex + 1);
        charIndex++;
    }

    if (!isDeleting && charIndex === currentWord.length) {
        isDeleting = true;
        setTimeout(type, 2000);
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        setTimeout(type, 500);
    } else {
        setTimeout(type, isDeleting ? 100 : 200);
    }
}

// Start typing animation
type();

// Mobile Navigation
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const body = document.body;

// Function to toggle menu state
const toggleMenu = (show) => {
    if (show) {
        hamburger.classList.add('active');
        navLinks.classList.add('active');
        body.style.overflow = 'hidden';
    } else {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        body.style.overflow = '';
    }
};

// Reset menu state
const resetMenu = () => {
    if (window.innerWidth <= 768) {  // Only reset on mobile
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        body.style.overflow = '';
    }
};

hamburger.addEventListener('click', () => {
    const isMenuActive = navLinks.classList.contains('active');
    toggleMenu(!isMenuActive);
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (navLinks.classList.contains('active') && 
        !hamburger.contains(e.target) && 
        !navLinks.contains(e.target)) {
        resetMenu();
    }
});

// Handle link clicks
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
            resetMenu();
            setTimeout(() => {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 300);
        }
    });
});

// Handle window resize
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        if (window.innerWidth > 768) {
            navLinks.style.display = 'flex';
            body.style.overflow = '';
        } else {
            navLinks.style.display = navLinks.classList.contains('active') ? 'flex' : 'none';
        }
    }, 250);
});

// Initial setup
window.addEventListener('load', () => {
    if (window.innerWidth > 768) {
        navLinks.style.display = 'flex';
    }
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu if open
            if (window.innerWidth <= 768) {
                navLinks.style.display = 'none';
                hamburger.classList.remove('active');
            }
        }
    });
});

// Skill Bars Animation
const skillBars = document.querySelectorAll('.skill-progress');
const animateSkillBars = () => {
    skillBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0';
        setTimeout(() => {
            bar.style.width = width;
        }, 100);
    });
};

// Intersection Observer for Skill Bars
const skillsSection = document.querySelector('.skills');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateSkillBars();
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

if (skillsSection) {
    observer.observe(skillsSection);
}

// Form Submission
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    // Initialize EmailJS with your public key
    emailjs.init("gh1b-42iuOYgrkZQ6"); // Replace with your actual EmailJS public key

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Show loading state
        const submitBtn = contactForm.querySelector('.submit-btn');
        const originalBtnText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        // Get form data
        const formData = {
            name: contactForm.querySelector('input[type="text"]').value,
            email: contactForm.querySelector('input[type="email"]').value,
            message: contactForm.querySelector('textarea').value
        };

        // Send email using EmailJS
        emailjs.send('service_bou8oyk', 'template_aplef9v', formData)
            .then(function(response) {
                alert('Thank you for your message! I will get back to you soon.');
                contactForm.reset();
            }, function(error) {
                alert('Sorry, there was an error sending your message. Please try again later.');
                console.error('EmailJS Error:', error);
            })
            .finally(() => {
                // Reset button state
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
            });
    });
}

// Parallax Effect for Main Section
const main = document.querySelector('.main');
window.addEventListener('scroll', () => {
    if (main) {
        const scrolled = window.pageYOffset;
        main.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Add hover effect to project cards
const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px)';
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
    });
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Projects Carousel
let currentSlide = 0;
let autoSlideInterval;
const slides = document.querySelectorAll('.project-card');
const dots = document.querySelectorAll('.carousel-dot');
const container = document.querySelector('.projects-container');

function updateCarousel() {
    const offset = -currentSlide * 100;
    container.style.transform = `translateX(${offset}%)`;
    
    // Update dots
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

function moveSlide(direction) {
    currentSlide = (currentSlide + direction + slides.length) % slides.length;
    updateCarousel();
    resetAutoSlide();
}

function goToSlide(index) {
    currentSlide = index;
    updateCarousel();
    resetAutoSlide();
}

function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
        moveSlide(1);
    }, 3000); // Change slide every 5 seconds
}

function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    startAutoSlide();
}

// Initialize carousel
updateCarousel();
startAutoSlide();

// Pause auto-slide on hover
container.addEventListener('mouseenter', () => {
    clearInterval(autoSlideInterval);
});

// Resume auto-slide when mouse leaves
container.addEventListener('mouseleave', () => {
    startAutoSlide();
}); 