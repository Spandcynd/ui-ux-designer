// dropdown in contact-me section form
(function () {
  const dropdown = document.querySelector('.form-dropdown-item');
  const dropdownButton = document.querySelector('.form-dropdown-item__button');
  const dropdownArrow = document.querySelector('.form-dropdown-item__arrow');
  const dropdownBody = document.querySelector('.form-dropdown-item__body');

  function updateDropdownState() {
    if (dropdown.classList.contains('expanded')) {
      dropdownButton.setAttribute('aria-expanded', 'true');
    } else {
      dropdownButton.setAttribute('aria-expanded', 'false');
    }
  }

  function selectPreviousOption() {
    const beforeChecked = dropdownBody.querySelector(
        '.form-dropdown-item__item:has(+ .form-dropdown-item__item :checked)',
      ),
      firstAndChecked = dropdownBody.querySelector(
        '.form-dropdown-item__item:first-child:has(:checked)',
      ),
      last = dropdownBody.querySelector('.form-dropdown-item__item:last-child');

    const previous = beforeChecked ?? (firstAndChecked ? last : null);

    if (previous) {
      previous.click();
    } else {
      last.click();
    }
  }
  function selectNextOption() {
    const afterChecked = dropdownBody.querySelector(
        '.form-dropdown-item__item:has(:checked) + .form-dropdown-item__item',
      ),
      lastAndChecked = dropdownBody.querySelector(
        '.form-dropdown-item__item:last-child:has(:checked)',
      ),
      first = dropdownBody.querySelector('.form-dropdown-item__item:first-child');

    const next = afterChecked ?? (lastAndChecked ? first : null);

    if (next) {
      next.click();
    } else {
      first.click();
    }
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

  window.addEventListener(
    'keydown',
    (e) => {
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].indexOf(e.code) > -1) {
        e.preventDefault();
      }
    },
    false,
  );

  dropdownButton.addEventListener('keydown', (e) => {
    if (e.code === 'Tab') return;
    if (e.code === 'ArrowUp' || e.code === 'ArrowLeft') {
      selectPreviousOption();
      return;
    }
    if (e.code === 'ArrowDown' || e.code === 'ArrowRight') {
      selectNextOption();
      return;
    }
  });

  dropdownBody.addEventListener('input', (e) => {
    dropdownButton.textContent = e.target.previousElementSibling.textContent;
  });
})();

// form handling
(function () {
  const formItems = document.getElementsByClassName('form-item');

  const nameFormItem = document.getElementById('form--name-item');
  nameFormItem.label = nameFormItem.querySelector('label');
  nameFormItem.input = nameFormItem.querySelector('input');
  nameFormItem.errorsMap = {
    valueMissing: 'You have to input your name',
  };
  nameFormItem.warningsMap = {
    wrongName: 'Your name cannot be "Name"',
  };
  nameFormItem.checkWarnings = function () {
    const warnings = [];
    if (this.input.value.toLowerCase() === 'name') warnings.push(this.warningsMap.wrongName);
    return warnings;
  };

  const emailFormItem = document.getElementById('form--email-item');
  emailFormItem.input = emailFormItem.querySelector('input');
  emailFormItem.errorsMap = {
    valueMissing: 'You have to input your email',
    typeMismatch: 'Input valid email address',
  };
  emailFormItem.warningsMap = {
    wrongEmail: 'Real email cannot have @example domain',
  };
  emailFormItem.infosMap = {
    tip: 'This email will only be used to contact you. Dont be afraid of spam',
  };
  emailFormItem.checkWarnings = function () {
    const warnings = [];
    if (this.input.value.includes('@example')) warnings.push(this.warningsMap.wrongEmail);
    return warnings;
  };

  const phoneFormItem = document.getElementById('form--tel-item');
  phoneFormItem.input = phoneFormItem.querySelector('input');
  phoneFormItem.errorsMap = {
    valueMissing: 'You have to input your phone',
    patternMismatch: 'Input valid phone number',
  };
  phoneFormItem.warningsMap = {
    wrongPhone: 'Your phone cannot be 123456789',
  };
  phoneFormItem.checkWarnings = function () {
    const warnings = [];
    if (this.input.value === '123456789') warnings.push(this.warningsMap.wrongPhone);
    return warnings;
  };

  const serviceOfInterestFormItem = document.getElementById('form--service-of-interest-item');
  serviceOfInterestFormItem.input = serviceOfInterestFormItem.querySelector('input');
  serviceOfInterestFormItem.infoContent =
    serviceOfInterestFormItem.querySelector('.tooltip__content');

  const timelineFormItem = document.getElementById('form--timeline-item');
  timelineFormItem.input = timelineFormItem.querySelector('input');

  const projectDetailsFormItem = document.getElementById('form--project-details-item');
  projectDetailsFormItem.input = projectDetailsFormItem.querySelector('textarea');
  projectDetailsFormItem.errorsMap = {
    valueMissing: 'This field is required',
    valueUnderflow: 'Your input too short',
    valueOverflow: 'Your input too long',
  };
  projectDetailsFormItem.infosMap = {
    tip: 'Describe project you are interested in or select one of listed categories above, except "Other"',
  };

  const form = document.querySelector('form');

  function errors() {
    if (this.input.validity.valid) return [];
    const validityObj = this.input.validity;
    const errorsMap = this.errorsMap;
    const errorArray = [];
    for (const error of Object.keys(validityObj.__proto__)) {
      if (!validityObj[error]) continue;
      errorArray.push(errorsMap[error]);
    }
    return errorArray;
  }

  function warnings() {
    return this.checkWarnings ? this.checkWarnings() : [];
  }

  function infos() {
    return this.checkInfos ? this.checkInfos() : [];
  }

  function validate() {
    const errorArray = errors.call(this);
    const warningsArray = warnings.call(this);
    const infosArray = infos.call(this);

    this.infoContent = {
      errors: errorArray,
      warnings: warningsArray,
      infos: infosArray,
    };
  }

  function insertEventListener(type, callback, options) {
    this.addEventListener(type, callback, options);
    this.setAttribute('listener', 'true');
  }

  function ejectEventListener(type, callback, options) {
    this.removeEventListener(type, callback, options);
    this.removeAttribute('listener');
  }

  const validateOnSubmit = (function () {
    const formItemsArray = Array.from(formItems);
    return function () {
      formItemsArray.forEach((formItem) => {
        validate.call(formItem);
        const ffi = new FormFieldInfo(formItem.querySelector('.tooltip__content'), formItem);
        ffi.mount();
      });
    };
  })();

  function resetValidators() {
    Array.from(formItems).forEach((formItem) => {
      if (!formItem.input.getAttribute('listener')) {
        insertEventListener.call(formItem.input, 'input', (e) => {
          validate.call(formItem);
        });
      }
    });
  }
  resetValidators();

  serviceOfInterestFormItem.addEventListener('input', (e) => {
    if (e.target.closest('.form-dropdown-item__item:last-child')) {
      projectDetailsFormItem.input.setAttribute('required', '');
      projectDetailsFormItem.input.setAttribute('minlength', 10);
      projectDetailsFormItem.input.setAttribute('maxlength', 250);
    } else {
      projectDetailsFormItem.input.removeAttribute('required');
      projectDetailsFormItem.input.removeAttribute('minlength');
      projectDetailsFormItem.input.removeAttribute('maxlength');
    }
  });

  class FormFieldInfo {
    #node = undefined;
    #asociatedFormControll = undefined;

    // `
    //     <ul class="ffi-categories">
    //         <li class="ffi-category ffi-errors-container">
    //           <ul class="ffi-errors">
    //           </ul>
    //         </li>
    //         <li class="ffi-category ffi-warnings-container">
    //           <ul class="ffi-warnings">
    //           </ul>
    //         </li>
    //         <li class="ffi-category ffi-infos-container">
    //           <ul class="ffi-infos">
    //           </ul>
    //         </li>
    //       </ul>`

    constructor(node, asociatedFormControll) {
      this.#node = node;
      this.#asociatedFormControll = asociatedFormControll;
    }

    mount() {
      const content = this.#asociatedFormControll.infoContent;

      this.#node.innerHTML = '';

      const markupContainer = document.createElement('div');
      markupContainer.className = 'ffi-container';
      this.#node.appendChild(markupContainer);

      const infoCategories = document.createElement('ul');
      infoCategories.className = 'ffi-categories';
      markupContainer.appendChild(infoCategories);

      if (content.errors.length) {
        const errorsContainer = document.createElement('li');
        errorsContainer.className = 'ffi-category ffi-errors-container';
        infoCategories.appendChild(errorsContainer);

        const errors = document.createElement('ul');
        errors.className = 'ffi-errors';
        errorsContainer.appendChild(errors);

        for (const errorText of content.errors) {
          const error = document.createElement('li');
          error.className = 'ffi-error';
          error.textContent = errorText;
          errors.appendChild(error);
        }
      }

      if (content.warnings.length) {
        const warningsContainer = document.createElement('li');
        warningsContainer.className = 'ffi-category ffi-warnings-container';
        infoCategories.appendChild(warningsContainer);

        const warnings = document.createElement('ul');
        warnings.className = 'ffi-warnings';
        warningsContainer.appendChild(warnings);

        for (const warningText of content.warnings) {
          const warning = document.createElement('li');
          warning.className = 'ffi-warning';
          warning.textContent = warningText;
          warnings.appendChild(warning);
        }
      }

      if (content.infos.length) {
        const infosContainer = document.createElement('li');
        infosContainer.className = 'ffi-category ffi-infos-container';
        infoCategories.appendChild(infosContainer);

        const infos = document.createElement('ul');
        infos.className = 'ffi-infos';
        infosContainer.appendChild(infos);

        for (const infosText of content.infos) {
          const info = document.createElement('li');
          info.className = 'ffi-info';
          info.textContent = infosText;
          infos.appendChild(info);
        }
      }
    }
  }

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
    validateOnSubmit();
    if (!form.checkValidity()) {
      document.getElementById('contact-me').scrollIntoView();
      setTimeout(() => {
        Array.from(formItems).forEach((formItem) => {
          if (!formItem.input.validity.valid) {
            formItem
              .querySelector('.form-item__info')
              .animate(
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
      'project-details': projectDetailsFormItem.input.value,
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
