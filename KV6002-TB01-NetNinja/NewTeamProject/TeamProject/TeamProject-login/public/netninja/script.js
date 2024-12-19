document.addEventListener('scroll', () => {
  const heroImage = document.querySelector('.hero-image');
  const scrollPosition = window.pageYOffset;

  // Hero image parallax effect
  if (heroImage) {
    heroImage.style.transform = `translateY(${scrollPosition * 0.5}px)`;
  }

  // Features animation
  const features = document.querySelector('.features');
  if (features) {
    const featureTop = features.getBoundingClientRect().top;
    if (featureTop < window.innerHeight - 50) {
      features.style.opacity = '1';
      features.style.transform = 'translateY(0)';
    }
  }
});

// Dropdown for modules
document.addEventListener('DOMContentLoaded', () => {
  const dropdownButtons = document.querySelectorAll('.dropdown-btn');

  dropdownButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const moduleContent = button.parentElement.nextElementSibling; 
      const module = button.closest('.module'); 

      if (moduleContent) {
        const isOpen = module.classList.toggle('open');
        moduleContent.style.maxHeight = isOpen ? `${moduleContent.scrollHeight}px` : '0';
        button.textContent = isOpen ? '▲' : '▼'; 
      }
    });
  });
});
