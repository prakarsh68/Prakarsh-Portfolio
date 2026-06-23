// script.js - Centralized JavaScript for your portfolio

// --- Helper Functions ---

// Function to handle smooth scrolling to a target ID
function scrollToTarget(targetId) {
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
        window.scrollTo({
            top: targetElement.offsetTop,
            behavior: 'smooth'
        });
    }
}

// Function to apply the theme to the body
// 'theme' can be 'dark' or 'light'
function applyTheme(theme) {
    const body = document.body;
    const toggleSwitch = document.getElementById('toggle-mode');

    if (theme === 'dark') {
        body.classList.add('dark-mode');
        body.classList.remove('light-mode');
        if (toggleSwitch) {
            toggleSwitch.checked = true; // Set toggle to checked state (dark)
        }
    } else { // Defaults to light if not explicitly dark
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
        if (toggleSwitch) {
            toggleSwitch.checked = false; // Set toggle to unchecked state (light)
        }
    }
    // Save the preference to localStorage
    localStorage.setItem('theme', theme);
}

// --- Form Validation Helper ---
function showValidationMessage(inputElement, message) {
    const formGroup = inputElement.closest('.form-group');
    if (!formGroup) return; // Exit if not part of a form-group

    let errorMessageElement = formGroup.querySelector('.error-message');
    if (!errorMessageElement) {
        errorMessageElement = document.createElement('div');
        errorMessageElement.classList.add('error-message');
        formGroup.appendChild(errorMessageElement);
    }
    errorMessageElement.textContent = message;
    formGroup.classList.add('invalid');
}

function clearValidationMessage(inputElement) {
    const formGroup = inputElement.closest('.form-group');
    if (!formGroup) return;

    const errorMessageElement = formGroup.querySelector('.error-message');
    if (errorMessageElement) {
        errorMessageElement.textContent = '';
    }
    formGroup.classList.remove('invalid');
}

function isValidEmail(email) {
    // Simple regex for email validation
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}


// --- Main Initialization on DOMContentLoaded ---
document.addEventListener('DOMContentLoaded', () => {

    // 1. Smooth scroll for internal anchor links (on the same page)
    document.querySelectorAll('.scroll-link').forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            const targetPath = link.pathname.replace(/^\//, ''); // Get path without leading slash
            const currentPath = window.location.pathname.replace(/^\//, ''); // Get current path

            // Check if the link is an internal hash link (starts with #)
            // AND if it points to the current page (or no specific page)
            // Example: "index.html#projects" on index.html, or "#about" on current page
            if (targetId && targetId.startsWith('#') && targetPath === currentPath) {
                e.preventDefault(); // Prevent default jump behavior
                scrollToTarget(targetId);
                // Optionally update URL hash without jumping, for better browser history
                history.pushState(null, null, targetId);
            }
            // If it's a link to another page with a hash (e.g., index.html#projects),
            // we let the default browser behavior navigate to that page.
            // The 'handleHashOnLoad' logic will then take over on the new page.
        });
    });

    // 2. Handle scrolling to a specific hash when the page loads (for cross-page navigation)
    const handleHashOnLoad = () => {
        if (window.location.hash) {
            const targetId = window.location.hash;
            // A small delay helps ensure the page content is fully rendered
            // and any AOS animations have completed before attempting to scroll.
            setTimeout(() => {
                scrollToTarget(targetId);
            }, 100); // 100ms delay
        }
    };
    handleHashOnLoad(); // Run once on load
    // Run this if the hash changes on the same page (e.g., if user manually edits URL hash)
    window.addEventListener('hashchange', handleHashOnLoad);


    // 3. Theme toggle (with switch)
    const themeToggle = document.getElementById('toggle-mode');
    if (themeToggle) { // Only run if the toggle element exists on the current page
        // Initialize theme on page load based on localStorage or default
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            applyTheme(savedTheme); // Apply saved theme
        } else {
            // Default theme if nothing is saved (e.g., 'light' or 'dark')
            // Let's set 'dark' as the default initial state if no preference is found
            applyTheme('dark');
        }

        // Add event listener for toggle changes
        themeToggle.addEventListener('change', () => {
            if (themeToggle.checked) { // If checkbox is checked, it means the user wants dark mode
                applyTheme('dark');
            } else { // If unchecked, it means the user wants light mode
                applyTheme('light');
            }
        });
    }

    // 4. Contact form submission (assuming Firebase is loaded globally by firebase-init.js)
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    // Only set up contact form listener if the form element exists on the current page
    if (contactForm) {
        // Add event listeners for input changes to clear errors dynamically
        ['contactName', 'contactEmail', 'contactMessage'].forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.addEventListener('input', () => clearValidationMessage(input));
                input.addEventListener('blur', () => { // Validate on blur
                    if (id === 'contactName' && input.value.trim() === '') {
                        showValidationMessage(input, 'Name is required.');
                    } else if (id === 'contactEmail') {
                        if (input.value.trim() === '') {
                            showValidationMessage(input, 'Email is required.');
                        } else if (!isValidEmail(input.value.trim())) {
                            showValidationMessage(input, 'Please enter a valid email address.');
                        }
                    } else if (id === 'contactMessage' && input.value.trim() === '') {
                        showValidationMessage(input, 'Message cannot be empty.');
                    }
                });
            }
        });


        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Prevent default form submission

            // Clear previous validation messages before re-validating
            document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
            document.querySelectorAll('.form-group.invalid').forEach(el => el.classList.remove('invalid'));

            let isValid = true;

            const nameInput = document.getElementById('contactName');
            const emailInput = document.getElementById('contactEmail');
            const messageInput = document.getElementById('contactMessage');

            // Validate Name
            if (nameInput.value.trim() === '') {
                showValidationMessage(nameInput, 'Name is required.');
                isValid = false;
            }

            // Validate Email
            if (emailInput.value.trim() === '') {
                showValidationMessage(emailInput, 'Email is required.');
                isValid = false;
            } else if (!isValidEmail(emailInput.value.trim())) {
                showValidationMessage(emailInput, 'Please enter a valid email address.');
                isValid = false;
            }

            // Validate Message
            if (messageInput.value.trim() === '') {
                showValidationMessage(messageInput, 'Message cannot be empty.');
                isValid = false;
            }

            if (!isValid) {
                formStatus.textContent = 'Please correct the errors above.';
                formStatus.style.color = '#dc3545'; // Red
                return; // Stop submission if validation fails
            }

            // If validation passes, proceed with Firebase submission
            formStatus.textContent = 'Sending...';
            formStatus.style.color = '#ffd700'; // Yellow/gold

            const name = nameInput.value;
            const email = emailInput.value;
            const message = messageInput.value;

            try {
                const db = firebase.firestore(); // Access Firestore instance

                const docRef = await db.collection('contacts').add({
                    name,
                    email,
                    message,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                });
                console.log("Document written with ID: ", docRef.id);
                formStatus.textContent = 'Message sent successfully!';
                formStatus.style.color = '#28a745'; // Green
                contactForm.reset();
                // Clear any lingering validation styles/messages after successful submit
                document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
                document.querySelectorAll('.form-group.invalid').forEach(el => el.classList.remove('invalid'));

            } catch (error) {
                console.error("Error adding document: ", error);
                formStatus.textContent = 'Failed to send message. Please try again.';
                formStatus.style.color = '#dc3545'; // Red
            }
        });
    }

    // 5. Back to Top Button Logic
    const backToTopButton = document.getElementById('back-to-top');

    if (backToTopButton) {
        // Show/hide button based on scroll position
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) { // Show button after scrolling 300px
                backToTopButton.classList.add('show');
            } else {
                backToTopButton.classList.remove('show');
            }
        });

        // Scroll to top on button click
        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }


    // 6. Initialize AOS (must be called after AOS library is loaded and DOM is ready)
    // This will run after the theme is set, ensuring correct animations based on initial styling.
    AOS.init({
        duration: 800,
        once: true
    });

    // 7. Initialize particles.js
    // Ensure the particles.js library is loaded BEFORE this script runs
    // and that you have a div with id="particles-js" in your HTML.
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            "particles": {
                "number": {
                    "value": 80,
                    "density": {
                        "enable": true,
                        "value_area": 800
                    }
                },
                "color": {
                    "value": "#ffffff" // Particle color (white)
                },
                "shape": {
                    "type": "circle",
                    "stroke": {
                        "width": 0,
                        "color": "#000000"
                    },
                    "polygon": {
                        "nb_sides": 5
                    },
                },
                "opacity": {
                    "value": 0.5,
                    "random": false,
                    "anim": {
                        "enable": false,
                        "speed": 1,
                        "opacity_min": 0.1,
                        "sync": false
                    }
                },
                "size": {
                    "value": 3,
                    "random": true,
                    "anim": {
                        "enable": false,
                        "speed": 40,
                        "size_min": 0.1,
                        "sync": false
                    }
                },
                "line_linked": {
                    "enable": true,
                    "distance": 150,
                    "color": "#ffffff", // Line color (white)
                    "opacity": 0.4,
                    "width": 1
                },
                "move": {
                    "enable": true,
                    "speed": 6,
                    "direction": "none",
                    "random": false,
                    "straight": false,
                    "out_mode": "out",
                    "bounce": false,
                    "attract": {
                        "enable": false,
                        "rotateX": 600,
                        "rotateY": 1200
                    }
                }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": {
                    "onhover": {
                        "enable": true,
                        "mode": "grab" // Link particles on hover
                    },
                    "onclick": {
                        "enable": true,
                        "mode": "push" // Push particles on click
                    },
                    "resize": true
                },
                "modes": {
                    "grab": {
                        "distance": 140,
                        "line_linked": {
                            "opacity": 1
                        }
                    },
                    "bubble": {
                        "distance": 400,
                        "size": 40,
                        "duration": 2,
                        "opacity": 8,
                        "speed": 3
                    },
                    "repulse": {
                        "distance": 200,
                        "duration": 0.4
                    },
                    "push": {
                        "particles_nb": 4
                    },
                    "remove": {
                        "particles_nb": 2
                    }
                }
            },
            "retina_detect": true
        });

        const updateParticleColors = () => {
            const currentTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
            let particleColor = "#ffffff"; // Default for dark mode
            let lineColor = "#ffffff"; // Default for dark mode

            if (currentTheme === 'light') {
                particleColor = "#333333"; // Darker particles for light mode
                lineColor = "#666666"; // Darker lines for light mode
            }

            particlesJS('particles-js', {
                "particles": {
                    "number": { "value": 80, "density": { "enable": true, "value_area": 800 } },
                    "color": { "value": particleColor },
                    "shape": { "type": "circle", "stroke": { "width": 0, "color": "#000000" }, "polygon": { "nb_sides": 5 } },
                    "opacity": { "value": 0.5, "random": false, "anim": { "enable": false, "speed": 1, "opacity_min": 0.1, "sync": false } },
                    "size": { "value": 3, "random": true, "anim": { "enable": false, "speed": 40, "size_min": 0.1, "sync": false } },
                    "line_linked": { "enable": true, "distance": 150, "color": lineColor, "opacity": 0.4, "width": 1 },
                    "move": { "enable": true, "speed": 6, "direction": "none", "random": false, "straight": false, "out_mode": "out", "bounce": false, "attract": { "enable": false, "rotateX": 600, "rotateY": 1200 } }
                },
                "interactivity": {
                    "detect_on": "canvas",
                    "events": {
                        "onhover": { "enable": true, "mode": "grab" },
                        "onclick": { "enable": true, "mode": "push" },
                        "resize": true
                    },
                    "modes": {
                        "grab": { "distance": 140, "line_linked": { "opacity": 1 } },
                        "bubble": { "distance": 400, "size": 40, "duration": 2, "opacity": 8, "speed": 3 },
                        "repulse": { "distance": 200, "duration": 0.4 },
                        "push": { "particles_nb": 4 },
                        "remove": { "particles_nb": 2 }
                    }
                },
                "retina_detect": true
            });
        };

        // Call once to set initial particle colors based on theme
        updateParticleColors();

        // Listen for theme changes and update particle colors
        if (themeToggle) {
            themeToggle.addEventListener('change', updateParticleColors);
        }
    } else {
        console.warn('particles.js library not found. Ensure it is loaded before script.js.');
    }

}); // End of DOMContentLoaded listener