// Minimal sample; you may expand
const testimonials = [
  {
    name: "Jane D.",
    role: "CEO, FinCo",
    image: "public/img/testimonial-client1.jpg",
    quote: "Lumetra turned our vision into a living, thriving brand presence."
  },
  {
    name: "Sam L.",
    role: "Head of Marketing, BluTech",
    image: "public/img/testimonial-client2.jpg",
    quote: "Professional and creative at every step. Highly recommend!"
  }
];

function renderTestimonial(index) {
  const t = testimonials[index];
  document.getElementById('testimonial-photo').src = t.image;
  document.getElementById('testimonial-quote').textContent = t.quote;
  document.getElementById('testimonial-name').textContent = t.name;
  document.getElementById('testimonial-role').textContent = t.role;
}
