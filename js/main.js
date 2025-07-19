/* ==========================================================================
   Full JavaScript for Lumetra Agency
   ========================================================================== */

// --------------------------------------------------------------------------
// 1. Navbar Scroll Effect
// --------------------------------------------------------------------------
document.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    // Ensure the navbar element exists before trying to modify it
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.style.backgroundColor = 'var(--white)';
        } else {
            // This returns the background to semi-transparent when you scroll to the top
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
        }
    }
});


// --------------------------------------------------------------------------
// 2. Testimonial Slider
// --------------------------------------------------------------------------
const testimonials = [
    {
        name: "Jane Doe, CEO of InnoTech",
        photo: "img/client-1.jpg", // Corrected path
        text: "Lumetra's team is incredibly talented. They delivered a stunning website that exceeded our expectations."
    },
    {
        name: "John Smith, Founder of MarketBoost",
        photo: "img/client-2.jpg", // Corrected path
        text: "Working with Lumetra was a game-changer for our brand. Their marketing strategies are top-notch."
    },
    {
        name: "Emily White, Creative Head at Artisian",
        photo: "img/client-3.jpg", // Corrected path
        text: "The design work from Lumetra is simply outstanding. They have a keen eye for detail and aesthetics."
    }
];

// Check if we are on a page that has the testimonial slider
const testimonialSlider = document.querySelector('.testimonial-slider');
if (testimonialSlider) {
    let currentSlide = 0;

    function showSlide(index) {
        // Ensure testimonials array is not empty and index is valid
        if (testimonials.length > 0 && testimonials[index]) {
            testimonialSlider.innerHTML = `
                <div class="testimonial-slide active">
                    <img src="${testimonials[index].photo}" alt="${testimonials[index].name}">
                    <p>"${testimonials[index].text}"</p>
                    <h4>- ${testimonials[index].name}</h4>
                </div>
            `;
        }
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % testimonials.length;
        showSlide(currentSlide);
    }

    // Initial call to show the first slide
    showSlide(currentSlide);
    // Change slide every 5 seconds
    setInterval(nextSlide, 5000);
}


// --------------------------------------------------------------------------
// 3. Firebase Contact Form
// --------------------------------------------------------------------------

// IMPORTANT: Replace with your actual Firebase project configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase only if the firebase library is loaded
if (typeof firebase !== 'undefined') {
    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();

    // Check if we are on a page with the contact form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Get form elements
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            const formStatus = document.getElementById('form-status');
            const submitButton = contactForm.querySelector('button[type="submit"]');

            // Disable button to prevent multiple submissions
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';

            // Save to Firestore
            db.collection('contacts').add({
                name: name,
                email: email,
                message: message,
                timestamp: new Date()
            })
            .then(() => {
                formStatus.textContent = "Message sent successfully!";
                formStatus.style.color = "green";
                contactForm.reset();
            })
            .catch((error) => {
                formStatus.textContent = "Error sending message. Please try again.";
                formStatus.style.color = "red";
                console.error("Error adding document: ", error);
            })
            .finally(() => {
                // Re-enable the button
                submitButton.disabled = false;
                submitButton.textContent = 'Send Message';
            });
        });
    }
}
