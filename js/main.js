/* ==========================================================================
   Full JavaScript for Lumetra Agency (Dynamic Portfolio from Firestore)
   ========================================================================== */

// --------------------------------------------------------------------------
// DYNAMIC PORTFOLIO - Fetches projects from Firestore Database
// --------------------------------------------------------------------------
function generatePortfolioCards() {
    // This function needs Firebase, so it's called after Firebase is initialized.
    const db = firebase.firestore();
    const portfolioContainer = document.querySelector('.portfolio-gallery');

    if (portfolioContainer) {
        portfolioContainer.innerHTML = '<p>Loading projects...</p>'; // Show a loading state

        let query = db.collection("portfolio").orderBy("title");

        // On the homepage, limit to 4 projects. On the portfolio page, show all.
        if (!window.location.pathname.includes('portfolio.html')) {
            query = query.limit(4);
        }

        query.get().then(snapshot => {
            portfolioContainer.innerHTML = ''; // Clear the loading state
            if (snapshot.empty) {
                portfolioContainer.innerHTML = '<p>No projects to display at this time.</p>';
                return;
            }
            snapshot.forEach(doc => {
                const project = doc.data();
                const cardHTML = `
                    <div class="portfolio-card">
                        <img src="${project.image}" alt="${project.title}">
                        <div class="portfolio-card-content">
                            <span class="category">${project.category}</span>
                            <h3>${project.title}</h3>
                            <p>${project.description.substring(0, 100)}...</p>
                        </div>
                    </div>
                `;
                portfolioContainer.innerHTML += cardHTML;
            });
        }).catch(error => {
            console.error("Error fetching portfolio projects: ", error);
            portfolioContainer.innerHTML = '<p>Sorry, there was an error loading our work.</p>';
        });
    }
}


// --------------------------------------------------------------------------
// Navbar Scroll Effect
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
// Testimonial Slider
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
// Firebase Configuration & Initialization
// --------------------------------------------------------------------------
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDzzNaBj_TjvQMkqLW7_DC0L7M6uULgjs8",
  authDomain: "lumetra-protfolio.firebaseapp.com",
  databaseURL: "https://lumetra-protfolio-default-rtdb.firebaseio.com",
  projectId: "lumetra-protfolio",
  storageBucket: "lumetra-protfolio.firebasestorage.app",
  messagingSenderId: "633062556570",
  appId: "1:633062556570:web:d9cdc60726444ba7fd3023"
};

// Initialize Firebase only if the library is loaded
if (typeof firebase !== 'undefined') {
    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();

    // Call the dynamic portfolio generator now that Firebase is initialized
    document.addEventListener('DOMContentLoaded', () => {
        generatePortfolioCards();
    });

    // Handle the Contact Form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;

            const message = document.getElementById('message').value;
            const formStatus = document.getElementById('form-status');
            const submitButton = contactForm.querySelector('button[type="submit"]');

            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';

            db.collection('contacts').add({
                name: name,
                email: email,
                phone: phone,
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
}
