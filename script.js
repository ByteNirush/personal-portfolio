// Initialize AOS Animation Library
try {
  AOS.init({
    duration: 1000,
    easing: 'ease-in-out',
    once: false,
    mirror: true,
    offset: 50,
    delay: 100,
    disable: 'mobile'
  });
} catch (error) {
  console.warn('AOS library not loaded:', error);
}

// Mobile Navigation
class MobileNav {
  constructor() {
    this.nav = document.querySelector('nav');
    this.menuButton = document.querySelector('nav button');
    this.menu = document.createElement('div');
    this.menu.className = 'fixed inset-0 bg-white/95 dark:bg-gray-900/95 z-40 transform translate-x-full transition-all duration-500 ease-in-out lg:hidden';
    this.menu.innerHTML = `
      <div class="flex flex-col items-center justify-center h-full space-y-8">
        <a href="#about" class="text-2xl text-primary hover:text-secondary transition-all duration-300 transform hover:scale-110">About</a>
        <a href="#experience" class="text-2xl text-primary hover:text-secondary transition-all duration-300 transform hover:scale-110">Experience</a>
        <a href="#certifications" class="text-2xl text-primary hover:text-secondary transition-all duration-300 transform hover:scale-110">Certifications</a>
        <a href="#projects" class="text-2xl text-primary hover:text-secondary transition-all duration-300 transform hover:scale-110">Projects</a>
        <a href="#contact" class="text-2xl text-primary hover:text-secondary transition-all duration-300 transform hover:scale-110">Contact</a>
      </div>
    `;
    document.body.appendChild(this.menu);
    this.init();
  }

  init() {
    this.menuButton.addEventListener('click', () => {
      this.menu.classList.toggle('translate-x-0');
      document.body.style.overflow = this.menu.classList.contains('translate-x-0') ? 'hidden' : '';
      
      // Add fade-in animation to menu items
      const links = this.menu.querySelectorAll('a');
      links.forEach((link, index) => {
        link.style.opacity = '0';
        link.style.transform = 'translateY(20px)';
        setTimeout(() => {
          link.style.transition = 'all 0.5s ease-out';
          link.style.opacity = '1';
          link.style.transform = 'translateY(0)';
        }, 100 * (index + 1));
      });
    });

    this.menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        this.menu.classList.remove('translate-x-0');
        document.body.style.overflow = '';
      });
    });
  }
}

// Scroll Progress Indicator
class ScrollProgress {
  constructor() {
    this.progress = document.querySelector('.scroll-progress');
    this.init();
  }

  init() {
    window.addEventListener('scroll', () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      this.progress.style.width = scrolled + '%';
    });
  }
}

// Theme Toggle
const themeToggle = document.querySelector('.theme-toggle');
const html = document.documentElement;

// Check for saved theme preference
if (localStorage.getItem('theme') === 'dark' || 
    (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  html.classList.add('dark');
}

// Handle theme toggle
themeToggle.addEventListener('click', () => {
  html.classList.toggle('dark');
  localStorage.setItem('theme', html.classList.contains('dark') ? 'dark' : 'light');
  
  // Update icon
  const icon = themeToggle.querySelector('i');
  icon.className = html.classList.contains('dark') ? 'fas fa-sun' : 'fas fa-moon';
});

// Smooth Scroll with Lerp
class SmoothScroll {
  constructor() {
    this.currentScroll = window.scrollY;
    this.targetScroll = window.scrollY;
    this.ease = 0.075; // Lower = smoother
    this.init();
  }

  lerp(start, end, t) {
    return start * (1 - t) + end * t;
  }

  init() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          const targetPosition = target.getBoundingClientRect().top + window.scrollY;
          this.animateScroll(targetPosition);
        }
      });
    });
  }

  animateScroll(targetPosition) {
    this.targetScroll = targetPosition;
    const animate = () => {
      this.currentScroll = this.lerp(this.currentScroll, this.targetScroll, this.ease);
      window.scrollTo(0, this.currentScroll);

      if (Math.abs(this.targetScroll - this.currentScroll) > 0.5) {
        requestAnimationFrame(animate);
      }
    };
    animate();
  }
}

// Form Validation
class FormValidation {
  constructor() {
    this.form = document.querySelector('#contact-form');
    this.init();
  }

  init() {
    if (!this.form) return;

    this.form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      if (this.validateForm()) {
        const submitButton = this.form.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        
        try {
          submitButton.disabled = true;
          submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Sending...';
          
          // Simulate form submission
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          this.showNotification('Message sent successfully!', 'success');
          this.form.reset();
        } catch (error) {
          this.showNotification('Failed to send message. Please try again.', 'error');
        } finally {
          submitButton.disabled = false;
          submitButton.innerHTML = originalText;
        }
      }
    });
  }

  validateForm() {
    let isValid = true;
    const inputs = this.form.querySelectorAll('input, textarea');

    inputs.forEach(input => {
      if (!input.value.trim()) {
        this.showError(input, 'This field is required');
        isValid = false;
      } else if (input.type === 'email' && !this.isValidEmail(input.value)) {
        this.showError(input, 'Please enter a valid email');
        isValid = false;
      } else {
        this.showSuccess(input);
      }
    });

    return isValid;
  }

  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  showError(input, message) {
    input.classList.add('border-red-500');
    input.classList.remove('border-green-500');
    
    let errorDiv = input.nextElementSibling;
    if (!errorDiv || !errorDiv.classList.contains('text-red-500')) {
      errorDiv = document.createElement('div');
      errorDiv.className = 'text-red-500 text-sm mt-1';
      input.parentNode.insertBefore(errorDiv, input.nextSibling);
    }
    errorDiv.textContent = message;
  }

  showSuccess(input) {
    input.classList.remove('border-red-500');
    input.classList.add('border-green-500');
    
    const errorDiv = input.nextElementSibling;
    if (errorDiv && errorDiv.classList.contains('text-red-500')) {
      errorDiv.remove();
    }
  }

  showNotification(message, type) {
    const notification = document.createElement('div');
    const bgColor = type === 'success' ? 'var(--success-color)' : 'var(--error-color)';
    notification.className = 'fixed bottom-4 right-4 px-6 py-3 rounded-lg text-white transform translate-y-full transition-transform duration-300';
    notification.style.backgroundColor = bgColor;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.remove('translate-y-full');
    }, 100);
    
    setTimeout(() => {
      notification.classList.add('translate-y-full');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
}

// Enhanced scroll to position function
class ScrollPosition {
  constructor() {
    this.smoothScroll = new SmoothScroll();
    this.init();
  }

  init() {
    const scrollButtons = document.querySelectorAll('[data-scroll-direction]');
    scrollButtons.forEach(button => {
      button.addEventListener('click', (e) => this.scrollToPosition(e));
    });
  }

  scrollToPosition(event) {
    event.preventDefault();
    const direction = event.currentTarget.dataset.scrollDirection;
    let targetScroll = 0;
    
    if (direction === 'top') {
      targetScroll = 0;
    } else if (direction === 'bottom') {
      targetScroll = document.documentElement.scrollHeight - window.innerHeight;
    }

    this.smoothScroll.animateScroll(targetScroll);
  }
}

// Form submission handling for service worker
async function submitForm() {
  const form = document.querySelector('#contact-form');
  if (!form) return;

  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  try {
    // Here you would typically send the data to your server
    // For now, we'll just simulate a successful submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true, data };
  } catch (error) {
    console.error('Form submission failed:', error);
    return { success: false, error };
  }
}

// Initialize all components
document.addEventListener('DOMContentLoaded', () => {
  new MobileNav();
  new ScrollProgress();
  new SmoothScroll();
  new FormValidation();
  new ScrollPosition();
  
  // Add scroll-triggered animations to sections
  const sections = document.querySelectorAll('section');
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px'
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-fade-in');
        entry.target.style.opacity = '1';
      }
    });
  }, observerOptions);

  sections.forEach(section => {
    section.style.opacity = '0';
    sectionObserver.observe(section);
  });
});