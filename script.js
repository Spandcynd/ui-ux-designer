const dropdown = document.querySelector('.form-dropdown-item');
const dropdownBody = document.querySelector('.form-dropdown-item__body');
const dropdownHeader = document.querySelector('.form-dropdown-item__header');

dropdown.addEventListener('click', (e) => {
  if (!e.target.closest('.form-dropdown-item__body')) e.currentTarget.classList.toggle('expanded');
});

dropdownBody.addEventListener('click', (e) => {
  const inputs = dropdownBody.querySelectorAll('input');
  const input = Array.from(inputs).find((input) => input === e.target);
  if (input) {
    dropdownHeader.textContent = input.previousElementSibling.textContent;
    dropdown.classList.remove('expanded');
  }
});
