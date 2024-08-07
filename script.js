// dropdown in contact-me section form
(function () {
  const dropdown = document.querySelector('.form-dropdown-item');
  const dropdownPanel = document.querySelector('.form-dropdown-item__panel');
  const dropdownItems = document.querySelectorAll('.form-dropdown-item__item');
  const dropdownBody = document.querySelector('.form-dropdown-item__body');
  const dropdownHeader = document.querySelector('.form-dropdown-item__header');

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

  function toggleDropdown() {
    dropdown.classList.toggle('expanded');
    updateDropdownTabIndexes();
  }
  function closeDropdownBody() {
    dropdown.classList.remove('expanded');
    updateDropdownTabIndexes();
  }
  function openDropdownBody() {
    dropdown.classList.add('expanded');
    updateDropdownTabIndexes();
    dropdown.querySelector('label:has(input:not(:checked))').focus();
  }

  const checkDropdownStatus = (function () {
    let previous, status;
    document.addEventListener('keyup', (e) => {
      if (e.code !== 'Tab') return;
      const current = e.target.closest('.form-item');
      status =
        previous === dropdown && current === dropdown
          ? 'hold'
          : previous === dropdown
          ? 'left'
          : dropdown === current
          ? 'entered'
          : 'unknown';
      previous = current;
    });

    return function () {
      return status;
    };
  })();

  dropdownPanel.addEventListener('click', (e) => {
    toggleDropdown();
  });
  document.addEventListener('keyup', (e) => {
    if (e.code === 'Tab') {
      const status = checkDropdownStatus();
      switch (status) {
        case 'entered': {
          openDropdownBody();
          break;
        }
        case 'left': {
          closeDropdownBody();
          break;
        }
      }
    }
    if (e.code === 'Enter' && e.target.closest('.form-dropdown-item__item')) {
      e.target.click();
    }
  });

  dropdownBody.addEventListener('input', (e) => {
    dropdownHeader.textContent = e.target.previousElementSibling.textContent;
    closeDropdownBody();
  });
})();

// form handling
(function () {
  const nameFormItem = document.getElementById('form--name-item');
  nameFormItem.label = nameFormItem.querySelector('label');
  nameFormItem.input = nameFormItem.querySelector('input');
  nameFormItem.error = nameFormItem.querySelector('.form-item__error');
  nameFormItem.errorsMap = {
    valueMissing: 'You have to input your name',
  };
  nameFormItem.errorList = nameFormItem.querySelector('.error-list');
  nameFormItem.errorArray = undefined;

  const emailFormItem = document.getElementById('form--email-item');
  emailFormItem.label = emailFormItem.querySelector('label');
  emailFormItem.input = emailFormItem.querySelector('input');
  emailFormItem.error = emailFormItem.querySelector('.form-item__error');
  emailFormItem.errorsMap = {
    valueMissing: 'You have to input your email',
    typeMismatch: 'Input valid email address',
  };
  emailFormItem.errorList = emailFormItem.querySelector('.error-list');
  emailFormItem.errorArray = undefined;

  const phoneFormItem = document.getElementById('form--tel-item');
  phoneFormItem.label = phoneFormItem.querySelector('label');
  phoneFormItem.input = phoneFormItem.querySelector('input');
  phoneFormItem.error = phoneFormItem.querySelector('.form-item__error');
  phoneFormItem.errorsMap = {
    valueMissing: 'You have to input your phone',
    patternMismatch: 'Input valid phone number',
  };
  phoneFormItem.errorList = phoneFormItem.querySelector('.error-list');
  phoneFormItem.errorArray = undefined;

  const serviceOfInterestFormItem = document.getElementById('form--service-of-interest-item');
  serviceOfInterestFormItem.label = serviceOfInterestFormItem.querySelector('label');
  serviceOfInterestFormItem.input = serviceOfInterestFormItem.querySelector('input');
  serviceOfInterestFormItem.error = serviceOfInterestFormItem.querySelector('.form-item__error');
  serviceOfInterestFormItem.errorsMap = {
    valueMissing: 'You have to choose any option',
  };
  serviceOfInterestFormItem.errorList = serviceOfInterestFormItem.querySelector('.error-list');
  serviceOfInterestFormItem.errorArray = undefined;

  const timelineFormItem = document.getElementById('form--timeline-item');
  timelineFormItem.input = timelineFormItem.querySelector('input');

  const projectDetailsFormItem = document.getElementById('form--project-details-item');
  projectDetailsFormItem.textArea = projectDetailsFormItem.querySelector('textarea');

  const form = document.querySelector('form');

  function errors() {
    const validityObj = this.input.validity;
    const errorsMap = this.errorsMap;
    this.errorArray = [];
    for (const error of Object.keys(validityObj.__proto__)) {
      if (!validityObj[error]) continue;
      this.errorArray.push(errorsMap[error]);
    }
  }

  function validate() {
    errors.call(this);
    this.errorList.innerHTML = '';
    this.errorArray.forEach((error) => {
      const errorItem = document.createElement('li');
      errorItem.className = 'error-list__item';
      errorItem.innerText = error;
      this.errorList.appendChild(errorItem);
    });
  }

  function validateForm() {
    Array.from(form.querySelectorAll('.form-item:has(._will-validate)')).forEach((formItem) => {
      validate.call(formItem);
    });
  }

  nameFormItem.input.addEventListener('input', (e) => {
    validate.call(nameFormItem);
  });
  emailFormItem.input.addEventListener('input', (e) => {
    validate.call(emailFormItem);
  });
  phoneFormItem.input.addEventListener('input', (e) => {
    validate.call(phoneFormItem);
  });
  serviceOfInterestFormItem.input.addEventListener('input', (e) => {
    validate.call(serviceOfInterestFormItem);
  });

  //setup popover for successfull form submission

  const popover = {
    element: document.getElementById('form-popover'),
    state: 'hidden',
    timeout: undefined,
    show: function () {
      if (this.state === 'visible') return;
      this.element.classList.remove('hidden');
      this.updateState();
    },
    hide: function () {
      if (this.state === 'hidden') return;
      this.element.classList.add('hidden');
      this.updateState();
    },
    updateState: function () {
      this.state = this.element.classList.contains('hidden') ? 'hidden' : 'visible';
    },
    timeoutHide: function (time) {
      this.clearTimeout();
      this.timeout = setTimeout(() => {
        this.hide();
        this.clearTimeout();
      }, time);
    },
    clearTimeout: function () {
      this.timeout = clearTimeout(this.timeout);
    },
    pop: function () {
      this.show();
      this.timeoutHide(5000);
    },
    forceClose: function () {
      this.hide();
      this.clearTimeout();
    },
  };

  popover.element.addEventListener('click', (e) => {
    popover.forceClose();
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // form validation
    validateForm();
    if (!form.checkValidity()) {
      document.getElementById('contact-me').scrollIntoView();
      setTimeout(() => {
        Array.from(form.querySelectorAll('._will-validate')).forEach((formControll) => {
          if (!formControll.validity.valid) {
            formControll
              .closest('.form-item')
              .error.animate(
                [
                  { scale: 1 },
                  { scale: 1.2, offset: 0.25 },
                  { scale: 1, offset: 0.5 },
                  { scale: 1.2, offset: 0.75 },
                  { scale: 1 },
                ],
                500,
              );
          }
        });
      }, 1000);
      return;
    }

    // form submission
    const checkedServiceOfInterest = this.querySelector('[name="service-of-interest"]:checked');

    const body = {
      name: nameFormItem.input.value,
      email: emailFormItem.input.value,
      tel: phoneFormItem.input.value,
      'service-of-interest': checkedServiceOfInterest?.value ?? '',
      timeline: timelineFormItem.input.value,
      'project-details': projectDetailsFormItem.textArea.value,
    };

    fetch(this.getAttribute('action'), {
      method: this.getAttribute('method'),
      body: JSON.stringify(body),
      headers: { 'Content-type': 'application/json; charset=UTF-8' },
    });

    popover.pop();
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

//copy to clipboard logic
(function () {
  const copies = Array.from(document.querySelectorAll('._copy-to-clipboard'));
  copies.forEach((copy) => {
    const target = document.getElementById(copy.dataset.copyTarget);
    const tooltipContent = copy.querySelector('.tooltip__content');
    const tooltipText = { initial: 'copy', replaced: 'copied!' };

    const handler = (() => {
      let timeout;
      return function () {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          tooltipContent.innerText = tooltipText.initial;
        }, 550);
      };
    })();

    copy.addEventListener('blur', handler);
    copy.addEventListener('mouseleave', () => {
      copy.blur();
    });

    copy.onclick = function () {
      window.navigator.clipboard.writeText(target.textContent);
      tooltipContent.innerText = tooltipText.replaced;
    };
    copy.addEventListener('keypress', (e) => {
      if (e.code === 'Enter') copy.click();
    });
  });

  // const tooltipContent = target.classList.contains('_tooltip-modifiable')
  //   ? target.querySelector('tooltip__content')
  //   : null;
  function copyToClipboard() {
    window.navigator.clipboard.writeText(target.textContent);
  }
  function writeTextToTooltip() {
    const tooltips = document.querySelector();
  }
})();

// category filter
(function () {
  const categoryFilter = document.querySelector('.category-filter');
  categoryFilter.addEventListener('keypress', (e) => {
    if (e.code !== 'Enter') return;
    if (e.target.classList.contains('category')) {
      e.target.click();
    }
  });
})();
