// dropdown in contact-me section form
(function () {
  const dropdown = document.querySelector('.form-dropdown-item');
  const dropdownBody = document.querySelector('.form-dropdown-item__body');
  const dropdownHeader = document.querySelector('.form-dropdown-item__header');

  dropdown.addEventListener('click', (e) => {
    if (!e.target.closest('.form-dropdown-item__body'))
      e.currentTarget.classList.toggle('expanded');
  });

  dropdownBody.addEventListener('click', (e) => {
    const inputs = dropdownBody.querySelectorAll('input');
    const input = Array.from(inputs).find((input) => input === e.target);
    if (input) {
      dropdownHeader.textContent = input.previousElementSibling.textContent;
      dropdown.classList.remove('expanded');
    }
  });
})();

// main navigation burger handling
(function () {
  const burgerController = document.querySelector('.main-nav-burger__controller');
  const mainNav = document.querySelector('.main-nav-burger__main-nav');

  burgerController.addEventListener('click', (e) => {
    mainNav.classList.toggle('active');
  });
})();

(function () {
  const header = document.querySelector('header');
  window.addEventListener('scroll', (e) => {
    header.classList.toggle('sticky', window.scrollY > 0);
  });
})();

(function () {
  const bp = matchMedia('(max-width: 540px)');
  let swiper, initialized;
  bp.addEventListener('change', (e) => {
    if (e.matches && !initialized) {
      swiper = new Swiper('.swiper', {
        spaceBetween: '16px',
        slidesPerView: 1.3,
        centeredSlides: true,
        centeredSlidesBounds: true,
      });
      initialized = true;
    } else if (!e.matches && initialized) {
      swiper.destroy();
      initialized = false;
    }
  });
})();

// project category selection
(function () {
  const portfolioProjects = Array.from(
    document.querySelectorAll('.portfolio-projects .portfolio-project'),
  );
  document.querySelectorAll('.category').forEach((category) => {
    category.addEventListener('input', () => {
      const choosenCategory = category.dataset.category;
      if (choosenCategory === 'all') {
        portfolioProjects.forEach((proj) => {
          proj.classList.remove('hidden');
        });
      } else {
        portfolioProjects.forEach((proj) => {
          if (proj.dataset.category === choosenCategory) {
            proj.classList.remove('hidden');
          } else {
            proj.classList.add('hidden');
          }
        });
      }
    });
  });
})();

import './portfolio-project.js';
