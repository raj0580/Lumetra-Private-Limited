/* ==========================================================================
   Full, Final, and Complete JavaScript for Lumetra Agency
   (Advanced Portfolio, Detail Page, Testimonials, & Mobile Menu)
   ========================================================================== */

// --- 1. EVENT LISTENERS & INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    // A. Initialize Hamburger Menu
    const hamburger = document.querySelector('.hamburger-menu');
    const mobileNav = document.querySelector('.nav-mobile');
    if (hamburger && mobileNav) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileNav.classList.toggle('active');
        });
    }

    // B. Check if Firebase is ready and then load dynamic content
    if (typeof firebase !== 'undefined' && firebase.apps.length) {
        initializeAppContent();
    } else {
        document.addEventListener('firebase-ready', initializeAppContent);
    }
});

// Add scroll listener for navbar effect
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

// --- 2. DYNAMIC CONTENT LOADER ---
// This function runs once Firebase is ready and decides what content to load based on the current page.
function initializeAppContent() {
    if (document.querySelector('.portfolio-gallery')) {
        generatePortfolioCards();
    }
    if (document.querySelector('.testimonial-slider')) {
        generateTestimonials();
    }
    if (document.getElementById('project-detail-main')) {
        loadProjectDetail();
    }
}

// --- 3. PORTFOLIO & PROJECT DETAIL FUNCTIONS ---

/**
 * Fetches portfolio projects from Firestore and populates the portfolio grids
 * on the homepage and the main portfolio page.
 */
function generatePortfolioCards() {
    const db = firebase.firestore();
    const portfolioContainer = document.querySelector('.portfolio-gallery');
    if (!portfolioContainer) return;

    portfolioContainer.innerHTML = '<p style="text-align:center;">Loading our work...</p>';
    
    let query = db.collection("portfolio").orderBy("title");
    // On the homepage, limit to 4 projects.
    if (!window.location.pathname.includes('portfolio.html')) {
        query = query.limit(4);
    }

    query.get().then(snapshot => {
        portfolioContainer.innerHTML = ''; // Clear loading message
        if (snapshot.empty) {
            portfolioContainer.innerHTML = '<p style="text-align:center;">No projects to display at this time.</p>';
            return;
        }
        snapshot.forEach(doc => {
            const project = doc.data();
            // Wrap the card in an anchor tag to make it a clickable link
            portfolioContainer.innerHTML += `
                <a href="project-detail.html?id=${doc.id}" class="portfolio-card">
                    <img src="${project.mainImage}" alt="${project.title}">
                    <div class="portfolio-card-content">
                        <span class="category">${project.category}</span>
                        <h3>${project.title}</h3>
                        <p>${project.description ? project.description.substring(0, 100) + '...' : ''}</p>
                    </div>
                </a>`;
        });
    }).catch(error => {
        console.error("Error fetching portfolio projects:", error);
        portfolioContainer.innerHTML = '<p style="text-align:center;">Could not load projects.</p>';
    });
}

/**
 * Fetches the details of a single project based on the ID in the URL
 * and dynamically builds the entire project-detail.html page.
 */
async function loadProjectDetail() {
    const db = firebase.firestore();
    const mainContent = document.getElementById('project-detail-main');
    const params = new URLSearchParams(window.location.search);
    const projectId = params.get('id');

    if (!projectId) {
        mainContent.innerHTML = '<div style="text-align:center; padding: 5rem;"><p>Error: No project ID provided.</p></div>';
        return;
    }

    try {
        const projectDoc = await db.collection("portfolio").doc(projectId).get();
        if (!projectDoc.exists) {
            mainContent.innerHTML = '<div style="text-align:center; padding: 5rem;"><p>Sorry, this project could not be found.</p></div>';
            return;
        }
        const project = projectDoc.data();
        document.title = `${project.title} - Lumetra`; // Update the page title

        // STEP A: Fetch the linked testimonial (if it exists)
        let testimonialHTML = '';
        if (project.testimonialId) {
            const testimonialDoc = await db.collection("testimonials").doc(project.testimonialId).get();
            if (testimonialDoc.exists) {
                const testimonial = testimonialDoc.data();
                testimonialHTML = `
                    <div class="project-testimonial-box">
                        <h4>Client Testimonial</h4>
                        <blockquote>"${testimonial.quote}"</blockquote>
                        <div class="client-info">
                            <img src="${testimonial.photo}" alt="${testimonial.name}">
                            <div>
                                <strong>${testimonial.name}</strong><br>
                                <span>${testimonial.role}</span>
                            </div>
                        </div>
                    </div>`;
            }
        }
        
        // STEP B: Build the image gallery HTML
        let galleryHTML = '';
        if (project.imageGallery && project.imageGallery.length > 0) {
            project.imageGallery.forEach(url => {
                galleryHTML += `<img src="${url}" alt="Project gallery image">`;
            });
        }

        // STEP C: Assemble the final page structure
        const projectHTML = `
            <section class="project-detail-header">
                <span class="category">${project.category}</span>
                <h1>${project.title}</h1>
            </section>
            <div class="container">
                <section class="project-detail-content" style="padding-top:0;">
                    <div class="project-description">
                        <h3>Project Overview</h3>
                        <p>${project.description ? project.description.replace(/\n/g, '<br>') : 'No description available.'}</p>
                        ${galleryHTML ? '<h3>Project Gallery</h3>' : ''}
                        <div class="project-gallery">
                            ${galleryHTML}
                        </div>
                    </div>
                    <aside class="project-sidebar">
                        ${testimonialHTML}
                    </aside>
                </section>
            </div>`;
        
        mainContent.innerHTML = projectHTML;

    } catch (error) {
        console.error("Error loading project details:", error);
        mainContent.innerHTML = '<div style="text-align:center; padding: 5rem;"><p>An error occurred while loading the project.</p></div>';
    }
}

// --- 4. TESTIMONIALS SLIDER FUNCTION ---
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
        }).catch(error => {
            console.error("Error fetching testimonials:", error);
            testimonialSlider.innerHTML = '<p style="text-align:center;">Could not load client reviews.</p>';
        });
    }
}

// --- 5. FIREBASE INITIALIZATION & CONTACT FORM ---
// IMPORTANT: Paste your actual Firebase project configuration object here.
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
    // Check if Firebase is already initialized to prevent errors.
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
        // Dispatch a custom event to signal that Firebase is ready.
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
            .catch(error => {
                formStatus.textContent = "Error sending message. Please try again.";
                formStatus.style.color = "red";
                console.error("Error submitting contact form: ", error);
            })
            .finally(() => {
                submitButton.disabled = false;
                submitButton.textContent = 'Send Message';
            });
        });
    }
}
