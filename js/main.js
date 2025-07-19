/* ==========================================================================
   Full JavaScript for Lumetra Agency
   ========================================================================== */

// --------------------------------------------------------------------------
// 0. Reusable Components (Navbar and Footer)
// This loads the header and footer into the correct places on each page.
// --------------------------------------------------------------------------
const headerHTML = `
    <div class="container">
        <a href="index.html" class="logo">
            <img src="icons/logo.png" alt="Lumetra Logo">
        </a>
        <ul class="nav-links">
            <li><a href="index.html">Home</a></li>
            <li><a href="about.html">About</a></li>
            <li><a href="contact.html">Contact</a></li>
        </ul>
    </div>
`;
document.querySelector('header.navbar').innerHTML = headerHTML;

const footerHTML = `
    <div class="container">
        <p>© 2025 Lumetra. All Rights Reserved.</p>
        <div class="social-icons">
            <a href="#"><img src="icons/facebook.svg" alt="Facebook"></a>
            <a href="#"><img src="icons/twitter.svg" alt="Twitter"></a>
            <a href="#"><img src="icons/linkedin.svg" alt="LinkedIn"></a>
        </div>
    </div>
`;
document.querySelector('footer').innerHTML = footerHTML;


// --------------------------------------------------------------------------
// 1. Navbar Scroll Effect
// --------------------------------------------------------------------------
document.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.style.backgroundColor = 'var(--white)';
        } else {
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
        }
    }
});


// --------------------------------------------------------------------------
// 2. Testimonial Slider
// --------------------------------------------------------------------------
const testimonials = [
    { name: "Jane Doe, CEO of InnoTech", photo: "img/client-1.jpg", text: "Lumetra's team is incredibly talented. They delivered a stunning website that exceeded our expectations." },
    { name: "John Smith, Founder of MarketBoost", photo: "img/client-2.jpg", text: "Working with Lumetra was a game-changer for our brand. Their marketing strategies are top-notch." },
    { name: "Emily White, Creative Head at Artisian", photo: "img/client-3.jpg", text: "The design work from Lumetra is simply outstanding. They have a keen eye for detail and aesthetics." }
];

const testimonialSlider = document.querySelector('.testimonial-slider');
if (testimonialSlider) {
    let currentSlide = 0;
    function showSlide(index) {
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
    showSlide(currentSlide);
    setInterval(nextSlide, 5000);
}


// --------------------------------------------------------------------------
// 3. Firebase Contact Form
// --------------------------------------------------------------------------
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

if (typeof firebase !== 'undefined') {
    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();

    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value; // Get phone number
            const message = document.getElementById('message').value;
            const formStatus = document.getElementById('form-status');
            const submitButton = contactForm.querySelector('button[type="submit"]');

            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';

            db.collection('contacts').add({
                name: name,
                email: email,
                phone: phone, // Save phone number to Firestore
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
                submitButton.disabled = false;
                submitButton.textContent = 'Send Message';
            });
        });
    }
}```
