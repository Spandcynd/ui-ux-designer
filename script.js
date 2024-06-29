// dropdown in contact-me section form
(function () {
  const formItems = document.querySelector('.form-items');
  const dropdown = document.querySelector('.form-dropdown-item');
  const dropdownItems = document.querySelectorAll('.form-dropdown-item__item');
  const dropdownBody = document.querySelector('.form-dropdown-item__body');
  const dropdownHeader = document.querySelector('.form-dropdown-item__header');
  const labels = Array.from(dropdownBody.querySelectorAll('label'));

  function updateDropdownTabIndexes() {
    if (dropdown.classList.contains('expanded')) {
      dropdown.setAttribute('tabindex', '');
      dropdownItems.forEach((label) => label.setAttribute('tabindex', '0'));
    } else {
      dropdown.setAttribute('tabindex', '0');
      dropdownItems.forEach((label) => label.setAttribute('tabindex', ''));
    }
    const selected = dropdown.querySelector('label:has(input:checked)');
    if (selected) selected.setAttribute('tabindex', '');
  }

  // Обработать выход из дропдавна. Если в 'keydown' e.target === input:last-child то classList.toggle('expanded');

  function handleDropdown() {
    dropdown.classList.toggle('expanded');
    updateDropdownTabIndexes();
  }
  function closeDropdown() {
    dropdown.classList.remove('expanded');
    updateDropdownTabIndexes();
  }
  function openDropdown() {
    dropdown.classList.add('expanded');
    updateDropdownTabIndexes();
  }
  function dropdownEntered(e) {
    return e.target === dropdown;
  }
  function dropdownLeft(e) {
    return e.target.closest('.form-item').previousElementSibling === dropdown;
  }

  dropdown.addEventListener('click', (e) => {
    if (!e.target.closest('.form-dropdown-item__body')) handleDropdown();
  });
  formItems.addEventListener('keyup', (e) => {
    if (e.code === 'Tab') {
      if (dropdownEntered(e)) openDropdown();
      if (dropdownLeft(e)) closeDropdown();
    }
    if (e.code === 'Enter' && e.target.closest('.form-dropdown-item__item')) {
      e.target.dispatchEvent(new MouseEvent('click', { target: e.target }));
    }
  });

  dropdownBody.addEventListener('input', (e) => {
    dropdownHeader.textContent = e.target.previousElementSibling.textContent;
    closeDropdown();
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

// setup modals
(function () {
  const skills = Array.from(document.querySelectorAll('.skill'));
  skills.forEach((skill) => {
    const modal = skill.querySelector('.modal-skill');
    const closeBtn = skill.querySelector('.modal-skill__close-btn');
    skill.addEventListener('click', (e) => {
      modal.showModal();
    });
    closeBtn.addEventListener('click', (e) => {
      modal.close();
      e.stopPropagation();
    });
  });
})();
