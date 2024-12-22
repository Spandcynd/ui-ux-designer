// dropdown in contact-me section form
(function () {
  const dropdown = document.querySelector('.form-dropdown-item');
  const dropdownPanel = document.querySelector('.form-dropdown-item__panel');
  const dropdownInput = document.querySelector('.form-dropdown-item__input');
  const dropdownBody = document.getElementById('dropdown');

  const options = dropdownBody.querySelectorAll('option');

  dropdownPanel.addEventListener('click', (e) => {
    const target = e.target;
    if (target.closest('.form-dropdown-item__input')) return;
    dropdownInput.click();
  });

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
  // Delegate clicks for bigger touch area

  const formItems = document.querySelector('.form-items');

  formItems.addEventListener('click', (e) => {
    const target = e.target;

    if (target.classList.contains('form-item__wrapper')) {
      target.querySelector('.form-item__input').focus();
    }
  });

  // Setup popover for successfull form submission

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

    const screenReaderNotification = {
      element: document.getElementById('form-submission-notification'),
      notificationText: 'Form successfully submited',
      activate: function () {
        this.element.innerHTML = '';
        this.element.textContent = this.notificationText;
      },
    };

    popoverNotification.element.addEventListener('click', (e) => {
      popoverNotification.hideImmediately();
    });

    return function () {
      popoverNotification.activate();
      screenReaderNotification.activate();
    };
  })();

  // Form validation

  const form = document.querySelector('form');

  const nameInput = document.getElementById('form--name-input');
  const emailInput = document.getElementById('form--email-input');
  const phoneInput = document.getElementById('form--tel-input');
  const serviceOfInterestInput = document.getElementById('form--service-of-interest-input');
  const timelineInput = document.getElementById('form--timeline-input');
  const projectDetailsInput = document.getElementById('form--project-details-input');

  function isInputValidatable(input) {
    return input.classList.contains('_has-validation');
  }
  function isInputTouched(input) {
    return input.classList.contains('_touched');
  }
  function touchInput(input) {
    input.classList.add('_touched');
  }
  function updateValidityClass(input) {
    const valid = input.checkValidity();
    input.classList.toggle('invalid', !valid);
  }

  function validateEmail(input) {
    const validityObj = input.validity;
    if (validityObj.valid) {
      return '';
    }
    if (validityObj.patternMismatch) {
      return 'Validation error: wrong email format';
    }
    if (validityObj.valueMissing) {
      return 'Validation error: required field';
    }

    return 'Validation error: invalid email';
  }
  function validatePhoneNumber(input) {
    const validityObj = input.validity;
    if (validityObj.valid) {
      return '';
    }
    if (validityObj.patternMismatch) {
      return 'Validation error: wrong phone number format';
    }
    if (validityObj.valueMissing) {
      return 'Validation error: required field';
    }

    return 'Validation error: invalid phone number';
  }
  function validateText(input) {
    const validityObj = input.validity;
    if (validityObj.valid) {
      return '';
    }
    if (validityObj.patternMismatch) {
      return 'Validation error: wrong text format';
    }
    if (validityObj.valueMissing) {
      return 'Validation error: required field';
    }

    return 'Validation error: invalid input';
  }
  function validate(input) {
    let message;
    switch (input.type) {
      case 'email':
        message = validateEmail(input);
        break;

      case 'tel':
        message = validatePhoneNumber(input);
        break;

      case 'text':
        message = validateText(input);
        break;

      default:
        console.error('Trying to validate input of unknown type');
    }
    return message;
  }

  function validateInput(input) {
    updateValidityClass(input);
    const validityMessage = validate(input);
    input.title = validityMessage;
    // Only set notification message. Notification announcment is done when invalid input receives focus
    input.notificationMessage = validityMessage;
  }

  function isInputValid(input) {
    return !input.classList.contains('invalid');
  }

  formItems.addEventListener('focusout', (e) => {
    const input = e.target;
    if (!isInputValidatable(input)) return;
    if (!isInputTouched(input)) touchInput(input);
    validateInput(input);
  });

  let timeout;
  formItems.addEventListener('input', (e) => {
    const input = e.target;
    if (!isInputTouched(input)) return;
    validateInput(input);

    clearTimeout(timeout);
    timeout = setTimeout(() => {
      validationNotification.innerHTML = '';
      validationNotification.textContent = input.notificationMessage;
    }, 2000);
  });

  const validationNotification = document.getElementById('form-validation-notification');
  formItems.addEventListener('focusin', (e) => {
    const input = e.target;
    if (!isInputValidatable(input) || isInputValid(input)) return;

    validationNotification.innerHTML = '';
    validationNotification.textContent = input.notificationMessage;
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    // form validation

    const validatableInputs = document.querySelectorAll('._has-validation');

    if (!form.checkValidity()) {
      validatableInputs.forEach((input) => {
        touchInput(input);
        validateInput(input);
      });
      document.getElementById('contact-me').scrollIntoView();
      setTimeout(() => {
        form.querySelector('.invalid').focus();
      }, 500);
      return;
    }

    // form submission
    const body = {
      name: nameInput.value,
      email: emailInput.value,
      tel: phoneInput.value,
      'service-of-interest': serviceOfInterestInput.value,
      timeline: timelineInput.value,
      'project-details': projectDetailsInput.value,
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
  const mainNavItemsContainer = document.querySelector('.main-nav-burger__main-nav-items');
  const mainNavItems = Array.from(document.querySelectorAll('.main-nav-burger__main-nav-item'));

  let itemsLength;
  const windowBreakpoint = window.matchMedia('(max-width: 640px)');
  function handleChangeEvent() {
    if (windowBreakpoint.matches) {
      itemsLength = mainNavItemsContainer.length;
    } else {
      itemsLength = mainNavItemsContainer.length - 1;
    }
  }
  windowBreakpoint.addEventListener('change', handleChangeEvent);
  handleChangeEvent();

  function openPopup() {
    if (mainNav.classList.contains('expanded')) return;
    mainNav.classList.add('expanded');
    burgerController.setAttribute('aria-expanded', 'true');
    mainNavItemsContainer.setAttribute('aria-hidden', 'false');
  }
  function closePopup() {
    if (!mainNav.classList.contains('expanded')) return;
    mainNav.classList.remove('expanded');
    burgerController.setAttribute('aria-expanded', 'false');
    mainNavItemsContainer.setAttribute('aria-hidden', 'true');
  }
  function isPopupOpened() {
    return mainNav.classList.contains('expanded');
  }

  function getFirstItemIndex() {
    return 0;
  }
  function getLastItemIndex() {
    return itemsLength - 1;
  }
  function getPreviousItemIndex(pivotIndex) {
    const startIndex = getFirstItemIndex();
    const endIndex = getLastItemIndex();
    if (pivotIndex === startIndex) return endIndex;
    return pivotIndex - 1;
  }
  function getNextItemIndex(pivotIndex) {
    const startIndex = getFirstItemIndex();
    const endIndex = getLastItemIndex();
    if (pivotIndex === endIndex) return startIndex;
    return pivotIndex + 1;
  }
  function getFocusedItemIndex() {
    return mainNavItems.indexOf(document.activeElement);
  }

  function getItemByIndex(index) {
    if (index === -1) {
      console.error('Trying to get unexisted item');
      return;
    }
    return mainNavItems[index];
  }

  function focusItem(item) {
    item?.focus();
  }
  function focusController() {
    burgerController.focus();
  }

  burgerController.addEventListener('click', (e) => {
    if (isPopupOpened()) {
      closePopup();
    } else {
      openPopup();
    }
  });

  burgerController.addEventListener('keydown', (e) => {
    if (e.target !== e.currentTarget) return;
    let customBehaviorTriggered = false;

    switch (e.code) {
      case 'Enter':
      case 'Space':
      case 'ArrowDown':
        openPopup();
        focusItem(getItemByIndex(getFirstItemIndex()));

        customBehaviorTriggered = true;
        break;

      case 'Escape':
        closePopup();
        customBehaviorTriggered = true;
        break;
    }

    if (customBehaviorTriggered) e.preventDefault();
  });

  mainNavItemsContainer.addEventListener('keydown', (e) => {
    // Possible semantic error/incompletness on next line of code: doesn't consider if
    // target item in allowed index range. It should operate with mechanism, which represents current
    // reachable items (now this role takes itemLength variable).
    // Though, current implementation considers that unreachable item is not displayed at all, so it
    // can't even get focus and, consequently, be a target of keydown events.
    if (!mainNavItems.includes(e.target)) return;

    let customBehaviorTriggered = false;

    switch (e.code) {
      case 'Space':
      case 'Enter':
        getItemByIndex(getFocusedItemIndex()).click();
        closePopup();
        customBehaviorTriggered = true;
        break;

      case 'ArrowDown':
        focusItem(getItemByIndex(getNextItemIndex(getFocusedItemIndex())));
        customBehaviorTriggered = true;
        break;

      case 'ArrowUp':
        focusItem(getItemByIndex(getPreviousItemIndex(getFocusedItemIndex())));
        customBehaviorTriggered = true;
        break;

      case 'Escape':
        closePopup();
        focusController();
        customBehaviorTriggered = true;
        break;
    }

    if (customBehaviorTriggered) e.preventDefault();
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
  const copiedNotification = document.getElementById('copied-notification');
  const notificationText = 'copied successfully!';
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
      copiedNotification.innerHTML = '';
      copiedNotification.textContent = notificationText;
      // SR end
    };
    copy.addEventListener('keypress', (e) => {
      if (['Enter', 'Space'].includes(e.code)) copy.click();
    });
  });
})();
