const hamMenu = document.querySelector('.ham-menu');
const offscreenMenu = document.querySelector('.off-screen-menu');

hamMenu.addEventListener('click', () => {
  hamMenu.classList.toggle('active');
  offscreenMenu.classList.toggle('active');
});

// Fade-in effect on scroll
const sections = document.querySelectorAll('.fade-in');

const showOnScroll = () => {
  const triggerBottom = window.innerHeight * 0.85;

  sections.forEach(sec => {
    const rect = sec.getBoundingClientRect();
    if (rect.top < triggerBottom) {
      sec.classList.add('show');
    } else {
      sec.classList.remove('show');
    }
  });
};

window.addEventListener('scroll', showOnScroll);
window.addEventListener('load', showOnScroll);