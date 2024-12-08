// dropdown in contact-me section form
(function () {
  const dropdown = document.querySelector('.form-dropdown-item');
  const dropdownInput = document.querySelector('.form-dropdown-item__input');
  const dropdownArrow = document.querySelector('.form-dropdown-item__arrow');
  const dropdownBody = document.getElementById('dropdown');

  const options = dropdownBody.querySelectorAll('option');

  function setVisualFocus(descendant) {
    descendant.classList.add('active-descendant');
  }
  function removeVisualFocus(descendant) {
    descendant.classList.remove('active-descendant');
  }
  function getFocusedOptionIndex() {
    const focusedADid = dropdownInput.getAttribute('aria-activedescendant');
    if (focusedADid === '') return -1;
    return focusedADid.charAt(focusedADid.length - 1) - 1;
  }
  function focusOptionByIndex(index) {
    clearOptionFocus();
    dropdownInput.setAttribute('aria-activedescendant', 'option1-' + (index + 1));
    setVisualFocus(geOptionByIndex(index));
  }
  function clearOptionFocus() {
    const focusedOptionIndex = getFocusedOptionIndex();
    if (focusedOptionIndex === -1) return;
    dropdownInput.setAttribute('aria-activedescendant', '');
    removeVisualFocus(geOptionByIndex(focusedOptionIndex));
  }

  function focusPreviousOption() {
    const ADindex = getFocusedOptionIndex();
    if (ADindex === 0) {
      return;
    }
    const resultIndex = ADindex - 1;
    focusOptionByIndex(resultIndex);
  }
  function focusNextOption() {
    const ADindex = getFocusedOptionIndex();
    if (ADindex === options.length - 1) {
      return;
    }
    const resultIndex = ADindex + 1;
    focusOptionByIndex(resultIndex);
  }

  dropdownArrow.addEventListener('click', () => dropdownInput.click());

  function geOptionByIndex(index) {
    return document.getElementById('option1-' + (index + 1));
  }
  function getFocusedOption() {
    return document.getElementById(dropdownInput.getAttribute('aria-activedescendant'));
  }

  function isDropdownExpanded() {
    return dropdownInput.getAttribute('aria-expanded') === 'true';
  }

  // variable that holds value of aria-activedescendant
  let indexOfOptionToFocus = 0;

  // Interaction functions
  function openDropdown() {
    dropdown.classList.add('expanded');
    dropdownInput.setAttribute('aria-expanded', 'true');
    focusOptionByIndex(indexOfOptionToFocus);
  }
  function openAndFocusFirstOption() {
    indexOfOptionToFocus = 0;
    openDropdown();
  }
  function openAndFocusLastOption() {
    indexOfOptionToFocus = options.length - 1;
    openDropdown();
  }

  function focusFirstOption() {
    focusOptionByIndex(0);
  }
  function focusLastOption() {
    focusOptionByIndex(options.length - 1);
  }

  function closeDropdown() {
    dropdown.classList.remove('expanded');
    dropdownInput.setAttribute('aria-expanded', 'false');
    const focusedOptionIndex = getFocusedOptionIndex();
    indexOfOptionToFocus = focusedOptionIndex === -1 ? 0 : focusedOptionIndex;
    clearOptionFocus();
  }
  function selectFocusedOptionAndClose() {
    getFocusedOption()?.click();
    closeDropdown();
  }
  function closeAndFocusToPreviousFormItem() {
    closeDropdown();
    document.getElementById('form--tel-input').focus();
  }
  function closeAndSelectAndFocusToNextFormItem() {
    selectFocusedOptionAndClose();
    document.getElementById('form--timeline-input').focus();
  }

  dropdownInput.addEventListener('click', (e) => {
    const isExpanded = isDropdownExpanded();
    if (isExpanded) {
      closeDropdown();
    } else {
      openDropdown();
    }
  });

  dropdownBody.addEventListener('mouseenter', () => {
    clearOptionFocus();
  });

  dropdownInput.addEventListener('keydown', (e) => {
    e.preventDefault();
    // console.log(e);

    const isExpanded = isDropdownExpanded();
    if (e.code === 'Tab') {
      if (e.shiftKey) {
        closeAndFocusToPreviousFormItem();
      } else {
        closeAndSelectAndFocusToNextFormItem();
      }
      return;
    }
    if (e.code === 'Enter' || e.code === 'Space') {
      if (isExpanded) {
        selectFocusedOptionAndClose();
      } else {
        openDropdown();
      }
      return;
    }
    if (e.code === 'Escape' && isExpanded) {
      closeDropdown();
      return;
    }

    if (e.code === 'ArrowDown') {
      if (isExpanded) {
        focusNextOption();
      } else {
        openDropdown();
      }
      return;
    }
    if (e.code === 'ArrowUp') {
      if (!isExpanded) {
        openAndFocusFirstOption();
      } else {
        focusPreviousOption();
      }
      return;
    }

    if (e.code === 'Home') {
      if (!isExpanded) {
        openAndFocusFirstOption();
      } else {
        focusFirstOption();
      }
      return;
    }
    if (e.code === 'End') {
      if (!isExpanded) {
        openAndFocusLastOption();
      } else {
        focusLastOption();
      }
      return;
    }
  });

  dropdownBody.addEventListener('click', (e) => {
    const closestOption = e.target.closest('.form-dropdown-item__item');
    if (closestOption) {
      dropdownBody.querySelector('[aria-selected="true"]')?.setAttribute('aria-selected', 'false');
      closestOption.setAttribute('aria-selected', 'true');
      dropdownInput.value = closestOption.value;
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
