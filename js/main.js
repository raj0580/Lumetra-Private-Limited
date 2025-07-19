/* ==========================================================================
   Full JavaScript for Lumetra Agency (Dynamic Portfolio & Testimonials)
   ========================================================================== */

// --------------------------------------------------------------------------
// DYNAMIC CONTENT FUNCTIONS
// --------------------------------------------------------------------------

function generatePortfolioCards() {
    // This function needs Firebase, so it's called after Firebase is initialized.
    const db = firebase.firestore();
    const portfolioContainer = document.querySelector('.portfolio-gallery');

    if (portfolioContainer) {
        portfolioContainer.innerHTML = '<p style="text-align:center;">Loading our work...</p>';

        let query = db.collection("portfolio").orderBy("title");

        // On the homepage, limit to 4 projects. On the full portfolio page, show all.
        if (!window.location.pathname.includes('portfolio.html')) {
            query = query.limit(4);
        }

        query.get().then(snapshot => {
            portfolioContainer.innerHTML = ''; // Clear the loading state
            if (snapshot.empty) {
                portfolioContainer.innerHTML = '<p style="text-align:center;">No projects to display at this time.</p>';
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
            portfolioContainer.innerHTML = '<p style="text-align:center;">Sorry, there was an error loading our work.</p>';
        });
    }
}

function generateTestimonials() {
    // This function fetches testimonials from the Firestore database.
    const db = firebase.firestore();
    const testimonialSlider = document.querySelector('.testimonial-slider');

    if (testimonialSlider) {
        testimonialSlider.innerHTML = '<p>Loading reviews...</p>';
        db.collection("testimonials").get().then(snapshot => {
            if (snapshot.empty) {
                testimonialSlider.innerHTML = '<p>No client reviews yet.</p>';
                return;
            }
            
            const testimonialsData = [];
            snapshot.forEach(doc => testimonialsData.push(doc.data()));

            let currentSlide = 0;
            function showSlide(index) {
                const item = testimonialsData[index];
                testimonialSlider.innerHTML = `
                    <div class="testimonial-slide active">
                        <img src="${item.photo}" alt="${item.name}">
                        <p>"${item.quote}"</p>
                        <h4>- ${item.name}, ${item.role}</h4>
                    </div>
                `;
            }

            function nextSlide() {
                currentSlide = (currentSlide + 1) % testimonialsData.length;
                showSlide(currentSlide);
            }

            // Start the slider if there are testimonials
            if (testimonialsData.length > 0) {
                showSlide(currentSlide);
                setInterval(nextSlide, 5000);
            }
        }).catch(error => {
            console.error("Error fetching testimonials: ", error);
            testimonialSlider.innerHTML = '<p>Could not load client reviews.</p>';
        });
    }
}


// --------------------------------------------------------------------------
// STATIC FUNCTIONS & INITIALIZATION
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
    
    // Run the functions to populate the page once the document is ready
    document.addEventListener('DOMContentLoaded', () => {
        generatePortfolioCards();
        generateTestimonials();
    });

    // Handle the Contact Form
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
            .catch(error => {
                formStatus.textContent = "Error sending message. Please try again.";
                formStatus.style.color = "red";
                console.error("Error sending contact form: ", error);
            })
            .finally(() => {
                submitButton.disabled = false;
                submitButton.textContent = 'Send Message';
            });
        });
    }
}
