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
  function handler(e) {
    header.classList.toggle('sticky', window.scrollY > 0);
  }
  window.addEventListener('scroll', handler);
  handler();
})();
(function () {
  const bp = matchMedia('(max-width: 540px)');
  let swiper = null;
  // options
  /* 
    destroy: boolean (forced destroy)
  */
  function updateSwiper(options) {
    if (bp.matches && !options?.destroy) {
      swiper?.destroy();
      swiper = new Swiper('.swiper', {
        spaceBetween: '16px',
        slidesPerView: 1.3,
        centeredSlides: true,
        centeredSlidesBounds: true,
      });
    } else if (swiper && (!bp.matches || options?.destroy)) {
      swiper.destroy();
      swiper = null;
    }
  }
  bp.addEventListener('change', () => updateSwiper());
  updateSwiper();

  // Filtering portfolio-projects by category
  const projectsContainer = document.querySelector('.portfolio-projects');
  const portfolioProjects = Array.from(document.querySelectorAll('.portfolio-project'));
  document.querySelectorAll('.category').forEach((category) => {
    category.addEventListener('input', () => {
      let slidesCount = 0;
      const choosenCategory = category.dataset.category;
      if (choosenCategory === 'all') {
        portfolioProjects.forEach((proj) => {
          proj.classList.remove('hidden');
        });
        slidesCount = portfolioProjects.length;
      } else {
        portfolioProjects.forEach((proj) => {
          if (proj.dataset.category === choosenCategory) {
            proj.classList.remove('hidden');
            ++slidesCount;
          } else {
            proj.classList.add('hidden');
          }
        });
      }
      if (slidesCount <= 1) {
        updateSwiper({ destroy: true });
        projectsContainer.classList.add('not-enough-slides');
      } else {
        updateSwiper();
        projectsContainer.classList.remove('not-enough-slides');
      }
    });
  });
})();
