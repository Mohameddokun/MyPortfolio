// Slide navigation functionality
const slides = document.querySelectorAll(".slide");
const navLinks = document.querySelectorAll("nav a[data-slide]");
const prevBtn = document.querySelector(".prev-btn");
const nextBtn = document.querySelector(".next-btn");
const menuToggle = document.getElementById("menu-toggle");
const navMenu = document.getElementById("nav-menu");
let currentSlide = 0;

// Typing effect for hero section
const typedTextSpan = document.querySelector(".typed-text");
const phrases = ["a Computer Engineer", "a Data Analyst", "a .NET Backend Engineer"];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typingSpeed = 100; // milliseconds per character
const deletingSpeed = 50; // milliseconds per character
const delayBetweenPhrases = 1500; // milliseconds

function type() {
  if (!typedTextSpan) return; // Exit if element not found

  const currentPhrase = phrases[phraseIndex];
  if (isDeleting) {
    typedTextSpan.textContent = currentPhrase.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typedTextSpan.textContent = currentPhrase.substring(0, charIndex + 1);
    charIndex++;
  }

  if (!isDeleting && charIndex === currentPhrase.length) {
    isDeleting = true;
    setTimeout(type, delayBetweenPhrases);
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    setTimeout(type, typingSpeed);
  } else {
    setTimeout(type, isDeleting ? deletingSpeed : typingSpeed);
  }
}

// Function to show a specific slide
function showSlide(index) {
  // Ensure index is within bounds
  if (index < 0) index = 0;
  if (index >= slides.length) index = slides.length - 1;
  
  // Hide all slides
  slides.forEach((slide) => slide.classList.remove("active"));
  
  // Show the selected slide
  slides[index].classList.add("active");
  
  // Update current slide index
  currentSlide = index;
  
  // Update URL hash
  window.location.hash = `slide-${index}`;

  // Start typing effect if the first slide is active
  if (index === 0) {
    // Reset typing effect when returning to slide 0
    charIndex = 0;
    isDeleting = false;
    phraseIndex = 0;
    if (typedTextSpan) typedTextSpan.textContent = ''; // Clear content before starting
    setTimeout(type, typingSpeed); // Start typing after a short delay
  }
}

// Navigation event listeners
prevBtn.addEventListener("click", () => showSlide(currentSlide - 1));
nextBtn.addEventListener("click", () => showSlide(currentSlide + 1));

// Nav link event listeners
navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const slideIndex = parseInt(link.getAttribute("data-slide"));
    showSlide(slideIndex);
    navMenu.classList.remove("show");
  });
});

// Mobile menu toggle
menuToggle.addEventListener("click", () => {
  navMenu.classList.toggle("show");
});

// Keyboard navigation
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") showSlide(currentSlide - 1);
  if (e.key === "ArrowRight") showSlide(currentSlide + 1);
});

// Check URL hash on load
window.addEventListener("load", () => {
  const hash = window.location.hash;
  if (hash) {
    const slideIndex = parseInt(hash.split("-")[1]);
    if (!isNaN(slideIndex) && slideIndex >= 0 && slideIndex < slides.length) {
      showSlide(slideIndex);
    }
  } else {
    // If no hash, ensure slide 0 is active and start typing
    showSlide(0);
  }
  
  // Animate elements on page load
  setTimeout(() => {
    animateBars();
    animateOnScroll();
  }, 500);
});

// Theme toggle functionality
const toggle = document.getElementById("theme-toggle");
toggle.addEventListener("click", () => {
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  document.documentElement.setAttribute("data-theme", isDark ? "light" : "dark");
  toggle.textContent = isDark ? "🌙" : "☀️";
  localStorage.setItem("theme", isDark ? "light" : "dark");
});

// Check for saved theme preference
const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
  document.documentElement.setAttribute("data-theme", savedTheme);
  toggle.textContent = savedTheme === "dark" ? "☀️" : "🌙";
}

// Animate skill bars
const bars = document.querySelectorAll(".bar");
function animateBars() {
  bars.forEach((bar) => {
    const rect = bar.getBoundingClientRect();
    const fill = bar.dataset.percent;
    if (rect.top < window.innerHeight - 100) {
      if (!bar.querySelector(".fill").style.width) {
        setTimeout(() => {
          bar.querySelector(".fill").style.width = fill;
        }, 100);
      }
    }
  });
}

// Animate elements on scroll
function animateOnScroll() {
  const elements = document.querySelectorAll(".fade-in");
  elements.forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
      el.style.opacity = 1;
      el.style.transform = "translateY(0)";
    }
  });
}

// Initialize fill elements
bars.forEach((bar) => {
  const fillDiv = document.createElement("div");
  fillDiv.classList.add("fill");
  bar.appendChild(fillDiv);
});

// Scroll event listeners
window.addEventListener("scroll", () => {
  animateBars();
  animateOnScroll();
});

