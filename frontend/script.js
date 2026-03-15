document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      const navbarHeight = 55;
      const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navbarHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
      
      const navMenu = document.getElementById('navMenu');
      const menuToggle = document.getElementById('menuToggle');
      
      if (navMenu && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        const icon = menuToggle?.querySelector('i');
        if (icon) {
          icon.classList.remove('fa-times');
          icon.classList.add('fa-bars');
        }
      }
      
      this.blur();
    }
  });
});

const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

if (menuToggle && navMenu) {
  menuToggle.addEventListener("click", () => {
    navMenu.classList.toggle("active");
    
    const icon = menuToggle.querySelector('i');
    if (icon) {
      if (navMenu.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
      } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      }
    }
  });
}

document.querySelectorAll('.nav-menu a').forEach(link => {
  link.addEventListener('click', () => {
    if (navMenu && navMenu.classList.contains('active')) {
      navMenu.classList.remove('active');
      const icon = menuToggle?.querySelector('i');
      if (icon) {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      }
    }
  });
});

function animateProgressBars() {
  const skillSection = document.querySelector('#skills');
  if (!skillSection) return;
  
  const sectionPosition = skillSection.getBoundingClientRect();
  const windowHeight = window.innerHeight;
  
  if (sectionPosition.top < windowHeight - 100 && sectionPosition.bottom > 0) {
    const progressBars = document.querySelectorAll('.progress');
    
    progressBars.forEach(bar => {
      const targetWidth = bar.style.width;
      const targetValue = parseInt(targetWidth);
      
      bar.style.width = '0%';
      bar.textContent = '0%';
      
      let currentValue = 0;
      const interval = setInterval(() => {
        if (currentValue >= targetValue) {
          clearInterval(interval);
          bar.textContent = targetValue + '%';
        } else {
          currentValue++;
          bar.style.width = currentValue + '%';
          bar.textContent = currentValue + '%';
        }
      }, 20);
    });
    
    window.removeEventListener('scroll', animateProgressBars);
  }
}

window.addEventListener('scroll', animateProgressBars);
setTimeout(animateProgressBars, 500);

document.querySelectorAll('.btn, .project-link').forEach(button => {
  button.addEventListener('click', function() {
    this.blur();
  });
});