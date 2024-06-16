const template = document.createElement('template');
template.innerHTML = `
<style>
  .project {
    font-weight: 700;
    line-height: 1.6;
    border-radius: 1.75em 1.75em 1em 1em;
    overflow: hidden;
  }
  ::slotted(img) {
    max-width: 100%;
  }
  .text-container {
    display: flex;
    justify-content: space-between;
    padding: 1em;
    gap: 1em;
    background-color: var(
      --color-background-0d
    ); /* originally was white with 0.08 opacity */
  }
  .project-name {
    color: var(--color-main-1d-plus-x2);
  }
  .project-category {
    color: var(--color-main-2d);
  }

  @media (max-width: 1050px) {
    .text-container {
      padding: 0.75em;
      gap: 0.75em;
    }
  }
</style>
<div class="project">
  <div class="image-container">
    <slot name="image"/>
  </div>
  <div class="text-container">
    <span class="project-name"><slot name="name" /></span>
    <span class="project-category"><slot name="category" /></span>
  </div>
</div>
`;
window.customElements.define(
  'portfolio-project',
  class extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
  },
);
