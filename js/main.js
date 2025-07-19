// Testimonial Data
const testimonials = [
    {
        name: "Jane Doe, CEO of InnoTech",
        photo: "public/img/client-1.jpg",
        text: "Lumetra's team is incredibly talented. They delivered a stunning website that exceeded our expectations."
    },
    {
        name: "John Smith, Founder of MarketBoost",
        photo: "public/img/client-2.jpg",
        text: "Working with Lumetra was a game-changer for our brand. Their marketing strategies are top-notch."
    },
    {
        name: "Emily White, Creative Head at Artisian",
        photo: "public/img/client-3.jpg",
        text: "The design work from Lumetra is simply outstanding. They have a keen eye for detail and aesthetics."
    }
];

// Testimonial Slider
const testimonialSlider = document.querySelector('.testimonial-slider');
if (testimonialSlider) {
    let currentSlide = 0;

    function showSlide(index) {
        testimonialSlider.innerHTML = `
            <div class="testimonial-slide active">
                <img src="${testimonials[index].photo}" alt="${testimonials[index].name}">
                <p>"${testimonials[index].text}"</p>
                <h4>- ${testimonials[index].name}</h4>
            </div>
        `;
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % testimonials.length;
        showSlide(currentSlide);
    }

    showSlide(currentSlide);
    setInterval(nextSlide, 5000); // Change slide every 5 seconds
}


// Firebase Configuration
// IMPORTANT: Replace with your actual Firebase project configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
if (typeof firebase !== 'undefined') {
    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();

    // Contact Form Submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            const formStatus = document.getElementById('form-status');

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
            });
        });
    }
}
