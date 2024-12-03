// dropdown in contact-me section form
(function () {
  const dropdown = document.querySelector('.form-dropdown-item');
  const dropdownButton = document.querySelector('.form-dropdown-item__button');
  const dropdownArrow = document.querySelector('.form-dropdown-item__arrow');
  const dropdownBody = document.getElementById('dropdown');

  function updateDropdownState() {
    if (dropdown.classList.contains('expanded')) {
      dropdownButton.setAttribute('aria-expanded', 'true');
    } else {
      dropdownButton.setAttribute('aria-expanded', 'false');
    }
  }

  function getFocusedOption() {
    return dropdownBody.querySelector('.form-dropdown-item__item.widget-focus');
  }

  function focusPreviousOption() {
    const focused = getFocusedOption();
    const beforeFocused = dropdownBody.querySelector(
        '.form-dropdown-item__item:has(+ .form-dropdown-item__item.widget-focus)',
      ),
      firstAndFocused = dropdownBody.querySelector(
        '.form-dropdown-item__item.widget-focus:first-child',
      ),
      last = dropdownBody.querySelector('.form-dropdown-item__item:last-child');

    const previous = beforeFocused ?? (firstAndFocused ? last : null);

    if (previous) {
      previous.classList.add('widget-focus');
    } else {
      last.classList.add('widget-focus');
    }
    focused.classList.remove('widget-focus');
  }

  function focusNextOption() {
    const focused = getFocusedOption();
    const afterFocused = dropdownBody.querySelector(
        '.form-dropdown-item__item.widget-focus + .form-dropdown-item__item',
      ),
      lastAndFocused = dropdownBody.querySelector(
        '.form-dropdown-item__item.widget-focus:last-child',
      ),
      first = dropdownBody.querySelector('.form-dropdown-item__item:first-child');

    const next = afterFocused ?? (lastAndFocused ? first : null);

    if (next) {
      next.classList.add('widget-focus');
    } else {
      first.classList.add('widget-focus');
    }
    focused.classList.remove('widget-focus');
  }

  function toggleDropdown() {
    dropdown.classList.toggle('expanded');
    updateDropdownState();
  }

  dropdownButton.addEventListener('click', (e) => {
    e.preventDefault();
    toggleDropdown();
  });
  dropdownArrow.addEventListener('click', () => dropdownButton.click());

  dropdownButton.addEventListener('keydown', (e) => {
    e.preventDefault();
    if (e.code === 'Tab') return;
    if (e.code === 'Enter') {
      dropdownButton.click();
      return;
    }
    if (e.code === 'ArrowUp' || e.code === 'ArrowLeft') {
      focusPreviousOption();
      return;
    }
    if (e.code === 'ArrowDown' || e.code === 'ArrowRight') {
      focusNextOption();
      return;
    }
    if (e.code === 'Space') {
      getFocusedOption().click();
    }
  });

  dropdownBody.addEventListener('click', (e) => {
    const closestOption = e.target.closest('.form-dropdown-item__item');
    if (closestOption) {
      dropdownBody.querySelector('[aria-selected="true"]')?.setAttribute('aria-selected', 'false');
      closestOption.setAttribute('aria-selected', 'true');
    }
  });
})();

// form handling
(function () {
  const form = document.querySelector('form');

  const formItems = document.getElementsByClassName('form-item');
  const nameFormItem = document.getElementById('form--name-item');
  const emailFormItem = document.getElementById('form--email-item');
  const phoneFormItem = document.getElementById('form--tel-item');
  const serviceOfInterestFormItem = document.getElementById('form--service-of-interest-item');
  const timelineFormItem = document.getElementById('form--timeline-item');
  const projectDetailsFormItem = document.getElementById('form--project-details-item');

  //setup popover for successfull form submission

  const notifySuccessfullSubmission = (function () {
    const popoverNotification = {
      element: document.getElementById('form-popover'),
      state: 'hidden',
      _lclShow: function () {
        if (this.state === 'visible') return;
        this.element.classList.remove('hidden');
        this.state = 'visible';
      },
      _lclHide: function () {
        if (this.state === 'hidden') return;
        this.element.classList.add('hidden');
        this.state = 'hidden';
      },
      activate: function () {
        this._lclShow();
        this._hideWithThrottle();
      },
      ...(function () {
        let timeout = undefined;
        return {
          hideImmediately: function () {
            this._lclHide();
            clearTimeout(timeout);
            timeout = undefined;
          },
          _hideWithThrottle: function () {
            if (timeout) return;
            timeout = setTimeout(() => {
              this._lclHide();
              timeout = undefined;
            }, 5000);
          },
        };
      })(),
    };

    const alertNotification = {
      element: document.getElementById('form-submission-alert'),
      state: 'hidden',
      _lclShow: function () {
        if (this.state === 'visible') return;
        this.element.classList.remove('hidden');
        this.state = 'visible';
      },
      _lclHide: function () {
        if (this.state === 'hidden') return;
        this.element.classList.add('hidden');
        this.state = 'hidden';
      },
      activate: function () {
        this._lclShow();
        this._hideWithThrottle();
      },
      _hideWithThrottle: (function () {
        let timeout = undefined;
        return function () {
          if (timeout) return;
          timeout = setTimeout(() => {
            this._lclHide();
            timeout = undefined;
          }, 500);
        };
      })(),
    };

    popoverNotification.element.addEventListener('click', (e) => {
      popoverNotification.hideImmediately();
    });

    return function () {
      popoverNotification.activate();
      alertNotification.activate();
    };
  })();

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!form.checkValidity()) return;

    // form validation

    // form submission
    const checkedServiceOfInterest = this.querySelector('[name="service-of-interest"]:checked');

    const body = {} ?? {
      name: nameFormItem.input.value,
      email: emailFormItem.input.value,
      tel: phoneFormItem.input.value,
      'service-of-interest': checkedServiceOfInterest?.value ?? '',
      timeline: timelineFormItem.input.value,
      'project-details': projectDetailsFormItem.input.value,
    };

    fetch(this.getAttribute('action'), {
      method: this.getAttribute('method'),
      body: JSON.stringify(body),
      headers: { 'Content-type': 'application/json; charset=UTF-8' },
    });

    notifySuccessfullSubmission();
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

//toggle sticky header
(function () {
  const header = document.querySelector('header');
  function handler(e) {
    header.classList.toggle('sticky', window.scrollY > 0);
  }
  window.addEventListener('scroll', handler);
  handler();
})();

// category filter
(function () {
  const categoriesContainer = document.querySelector('.categories-container');
  categoriesContainer.addEventListener('click', (e) => {
    e.target.closest('.category-container')?.querySelector('input').click();
  });
})();

// setup swiper
(function () {
  let swiper,
    matches = checkMatching();
  // options
  /* 
    destroy: boolean (forced destroy)
  */
  function checkMatching() {
    return window.innerWidth <= 540;
  }
  function updateSwiper(options) {
    if (matches && !options?.destroy) {
      swiper?.destroy();
      swiper = new Swiper('.swiper', {
        spaceBetween: '16px',
        slidesPerView: 1.3,
        centeredSlides: true,
        centeredSlidesBounds: true,
      });
    } else if (swiper && (!matches || options?.destroy)) {
      swiper.destroy();
      swiper = null;
    }
  }
  window.addEventListener('resize', (e) => {
    const currentlyMatching = checkMatching();
    if (currentlyMatching != matches) {
      matches = currentlyMatching;
      updateSwiper();
    }
  });
  updateSwiper();

  // Filtering portfolio-projects by category
  const projectsContainer = document.querySelector('.portfolio-projects');
  const portfolioProjects = Array.from(document.querySelectorAll('.portfolio-project'));
  document.querySelectorAll('.category-container').forEach((category) => {
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

// setup skill modals
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

//copy to clipboard
(function () {
  const copies = Array.from(document.querySelectorAll('._copy-to-clipboard'));
  // Visual
  const tooltipText = { initial: 'copy', replaced: 'copied!' };
  // Visual end
  // SR
  const copiedAlert = document.getElementById('copied-alert');
  // SR end
  copies.forEach((copy) => {
    const target = document.getElementById(copy.dataset.copyTarget);
    // Visual
    const tooltipContent = copy.querySelector('.tooltip__content');

    copy.addEventListener('blur', () => {
      setTimeout(() => {
        tooltipContent.innerText = tooltipText.initial;
      }, 550);
    });
    copy.addEventListener('mouseleave', () => {
      copy.blur();
    });
    // Visual end

    copy.onclick = function () {
      window.navigator.clipboard.writeText(target.textContent);
      // Visual
      tooltipContent.innerText = tooltipText.replaced;
      // Visual end

      // SR
      copiedAlert.classList.add('hidden');
      setTimeout(() => {
        copiedAlert.classList.remove('hidden');
      }, 50);
      // SR end
    };
    copy.addEventListener('keypress', (e) => {
      if (['Enter', 'Space'].includes(e.code)) copy.click();
    });
  });
})();
