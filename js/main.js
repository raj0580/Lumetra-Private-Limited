/* ==========================================================================
   Full, Final, and Complete JavaScript for Lumetra Agency
   (Includes URL Slugs and Layout Fix)
   ========================================================================== */

// --- 1. EVENT LISTENERS & INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger-menu');
    const mobileNav = document.querySelector('.nav-mobile');
    if (hamburger && mobileNav) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileNav.classList.toggle('active');
        });
    }
    if (typeof firebase !== 'undefined' && firebase.apps.length) {
        initializeAppContent();
    } else {
        document.addEventListener('firebase-ready', initializeAppContent);
    }
});
document.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (navbar && window.scrollY > 50) { navbar.style.backgroundColor = 'var(--white)'; } 
    else if (navbar) { navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.9)'; }
});

// --- 2. DYNAMIC CONTENT LOADER ---
function initializeAppContent() {
    if (document.querySelector('.portfolio-gallery')) { generatePortfolioCards(); }
    if (document.querySelector('.testimonial-slider')) { generateGlobalTestimonials(); }
    if (document.getElementById('project-detail-main')) { loadProjectDetail(); }
}

// --- 3. PORTFOLIO & PROJECT DETAIL FUNCTIONS ---
function generatePortfolioCards() {
    const db = firebase.firestore();
    const portfolioContainer = document.querySelector('.portfolio-gallery');
    if (!portfolioContainer) return;
    portfolioContainer.innerHTML = '<p style="text-align:center;">Loading our work...</p>';
    let query = db.collection("portfolio").orderBy("title");
    if (!window.location.pathname.includes('portfolio.html')) { query = query.limit(4); }
    query.get().then(snapshot => {
        portfolioContainer.innerHTML = '';
        if (snapshot.empty) { portfolioContainer.innerHTML = '<p>No projects to display.</p>'; return; }
        snapshot.forEach(doc => {
            const project = doc.data();
            portfolioContainer.innerHTML += `<a href="project-detail.html?project=${project.slug}" class="portfolio-card"><img src="${project.mainImage}" alt="${project.title}"><div class="portfolio-card-content"><span class="category">${project.category}</span><h3>${project.title}</h3><p>${project.description ? project.description.substring(0, 100) + '...' : ''}</p></div></a>`;
        });
    });
}
async function loadProjectDetail() {
    const db = firebase.firestore();
    const mainContent = document.getElementById('project-detail-main');
    const params = new URLSearchParams(window.location.search);
    const projectSlug = params.get('project');
    if (!projectSlug) { mainContent.innerHTML = '<p>Project not found.</p>'; return; }

    try {
        const portfolioQuery = await db.collection("portfolio").where("slug", "==", projectSlug).limit(1).get();
        if (portfolioQuery.empty) { mainContent.innerHTML = '<p>Project not found.</p>'; return; }
        const projectDoc = portfolioQuery.docs[0];
        const project = projectDoc.data();
        document.title = `${project.title} - Lumetra`;

        let testimonialHTML = '';
        if (project.projectTestimonial && project.projectTestimonial.name) {
            const testimonial = project.projectTestimonial;
            testimonialHTML = `<div class="project-testimonial-box"><h4>Client Testimonial</h4><blockquote>"${testimonial.quote}"</blockquote><div class="client-info"><img src="${testimonial.photo}" alt="${testimonial.name}"><div><strong>${testimonial.name}</strong><br><span>${testimonial.role}</span></div></div></div>`;
        }
        
        let galleryHTML = '';
        if (project.imageGallery && project.imageGallery.length > 0) {
            project.imageGallery.forEach(url => { galleryHTML += `<img src="${url}" alt="Project gallery image">`; });
        }

        mainContent.innerHTML = `<section class="project-detail-header"><span class="category">${project.category}</span><h1>${project.title}</h1></section><div class="container"><section class="project-detail-content" style="padding-top:0;"><div class="project-description"><h3>Project Overview</h3><p>${project.description ? project.description.replace(/\n/g, '<br>') : ''}</p>${galleryHTML ? '<h3>Project Gallery</h3>' : ''}<div class="project-gallery">${galleryHTML}</div></div><aside class="project-sidebar">${testimonialHTML}</aside></section></div>`;

    } catch (error) { console.error("Error loading project:", error); }
}

// --- 4. GLOBAL TESTIMONIALS SLIDER (HOMEPAGE) ---
function generateGlobalTestimonials() {
    const db = firebase.firestore();
    const testimonialSlider = document.querySelector('.testimonial-slider');
    if (testimonialSlider) {
        testimonialSlider.innerHTML = '<p>Loading reviews...</p>';
        db.collection("testimonials").get().then(snapshot => {
            if (snapshot.empty) { testimonialSlider.innerHTML = '<p>No client reviews yet.</p>'; return; }
            const testimonialsData = [];
            snapshot.forEach(doc => testimonialsData.push(doc.data()));
            let currentSlide = 0;
            function showSlide(index) {
                const item = testimonialsData[index];
                testimonialSlider.innerHTML = `<div class="testimonial-slide active"><img src="${item.photo}" alt="${item.name}"><p>"${item.quote}"</p><h4>- ${item.name}, ${item.role}</h4></div>`;
            }
            function nextSlide() { currentSlide = (currentSlide + 1) % testimonialsData.length; showSlide(currentSlide); }
            if (testimonialsData.length > 0) { showSlide(currentSlide); setInterval(nextSlide, 5000); }
        });
    }
}

// --- 5. FIREBASE INITIALIZATION & CONTACT FORM ---
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
                name: document.getElementById('name').value, email: document.getElementById('email').value,
                phone: document.getElementById('phone').value, message: document.getElementById('message').value,
                timestamp: new Date()
            }).then(() => {
                formStatus.textContent = "Message sent successfully!";
                formStatus.style.color = "green";
                contactForm.reset();
            }).catch(error => { console.error("Error: ", error); })
            .finally(() => { submitButton.disabled = false; submitButton.textContent = 'Send Message'; });
        });
    }
}
