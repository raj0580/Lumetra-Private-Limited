/* ==========================================================================
   Full JavaScript for Lumetra Agency (Mobile Menu & Dynamic Content)
   ========================================================================== */

// --- HAMBURGER MENU LOGIC ---
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger-menu');
    const mobileNav = document.querySelector('.nav-mobile');

    if (hamburger && mobileNav) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileNav.classList.toggle('active');
        });
    }

    // Run dynamic content functions only after Firebase has been initialized.
    if (typeof firebase !== 'undefined' && firebase.apps.length) {
        generatePortfolioCards();
        generateTestimonials();
    } else {
        // If Firebase isn't ready, listen for the custom event.
        document.addEventListener('firebase-ready', () => {
            generatePortfolioCards();
            generateTestimonials();
        });
    }
});


// --------------------------------------------------------------------------
// DYNAMIC CONTENT FUNCTIONS
// --------------------------------------------------------------------------
function generatePortfolioCards() {
    const db = firebase.firestore();
    const portfolioContainer = document.querySelector('.portfolio-gallery');
    if (portfolioContainer) {
        portfolioContainer.innerHTML = '<p style="text-align:center;">Loading our work...</p>';
        let query = db.collection("portfolio").orderBy("title").limit(4);
        // On the full portfolio page, show all projects
        if (window.location.pathname.includes('portfolio.html')) {
            query = db.collection("portfolio").orderBy("title");
        }
        query.get().then(snapshot => {
            portfolioContainer.innerHTML = '';
            if (snapshot.empty) {
                portfolioContainer.innerHTML = '<p style="text-align:center;">No projects to display at this time.</p>';
                return;
            }
            snapshot.forEach(doc => {
                const project = doc.data();
                portfolioContainer.innerHTML += `<div class="portfolio-card"><img src="${project.image}" alt="${project.title}"><div class="portfolio-card-content"><span class="category">${project.category}</span><h3>${project.title}</h3><p>${project.description.substring(0, 100)}...</p></div></div>`;
            });
        }).catch(error => console.error("Error fetching portfolio:", error));
    }
}

function generateTestimonials() {
    const db = firebase.firestore();
    const testimonialSlider = document.querySelector('.testimonial-slider');
    if (testimonialSlider) {
        testimonialSlider.innerHTML = '<p style="text-align:center;">Loading reviews...</p>';
        db.collection("testimonials").get().then(snapshot => {
            if (snapshot.empty) {
                testimonialSlider.innerHTML = '<p style="text-align:center;">No client reviews yet.</p>';
                return;
            }
            const testimonialsData = [];
            snapshot.forEach(doc => testimonialsData.push(doc.data()));
            let currentSlide = 0;
            function showSlide(index) {
                const item = testimonialsData[index];
                testimonialSlider.innerHTML = `<div class="testimonial-slide active"><img src="${item.photo}" alt="${item.name}"><p>"${item.quote}"</p><h4>- ${item.name}, ${item.role}</h4></div>`;
            }
            function nextSlide() {
                currentSlide = (currentSlide + 1) % testimonialsData.length;
                showSlide(currentSlide);
            }
            if (testimonialsData.length > 0) {
                showSlide(currentSlide);
                setInterval(nextSlide, 5000);
            }
        }).catch(error => console.error("Error fetching testimonials:", error));
    }
}

// --------------------------------------------------------------------------
// FIREBASE & STATIC INITIALIZATION
// --------------------------------------------------------------------------
document.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 50) { navbar.style.backgroundColor = 'var(--white)'; } 
        else { navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.9)'; }
    }
});

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

if (typeof firebase !== 'undefined') {
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
        // Dispatch a custom event to signal that Firebase is ready for other scripts.
        document.dispatchEvent(new CustomEvent('firebase-ready'));
    }

    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const formStatus = document.getElementById('form-status');
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';
            const db = firebase.firestore();
            db.collection('contacts').add({
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                message: document.getElementById('message').value,
                timestamp: new Date()
            })
            .then(() => {
                formStatus.textContent = "Message sent successfully!";
                formStatus.style.color = "green";
                contactForm.reset();
            })
            .catch(error => { console.error("Error submitting contact form: ", error); })
            .finally(() => { submitButton.disabled = false; submitButton.textContent = 'Send Message'; });
        });
    }
}
