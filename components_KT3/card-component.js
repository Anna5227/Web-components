class CardComponent extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });

    const template = document.createElement('template');
    template.innerHTML = `
       <style>
    :host {
      display: block;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    .card {
      background: #fcfcfc;
      border-radius: 10px; 
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.10); 
      overflow: hidden;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      border: 1px solid #eaeaea;
    }

    .card:hover {
      transform: translateY(-3px);  
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
    }
 
    .card__header {
      padding: 10px 14px;   
      background: #5e08af;
      color: #fff;
    }

    .card__header ::slotted(*) {
      margin: 0;
      font-size: 1rem;   
      font-weight: 600;
      color: #fff;
    }
 
    .card__content {
      padding: 12px 14px;   
      color: #070707;
      line-height: 1.45; 
      font-size: 0.875rem;          
    }

    .card__content ::slotted(img) {
      max-width: 100%;
      border-radius: 6px;
      margin-top: 8px;
      display: block;
    }

    .card__content ::slotted(p) {
      margin: 0 0 6px;
    }
 
    .card__footer {
      padding: 8px 14px;   
      background: #faf7f7;
      border-top: 1px solid #eee;
      font-size: 0.75rem; 
      color: #686666;
    }
 
    .empty-slot {
      font-style: italic;
      color: #999;
      font-size: 0.85rem;
    }
  </style>

  <article class="card">
    <header class="card__header">
      <slot name="header">
        <span class="empty-slot">Заголовок не задан</span>
      </slot>
    </header>

    <section class="card__content">
      <slot name="content">
        <span class="empty-slot">Содержимое не задано</span>
      </slot>
    </section>

    <footer class="card__footer">
      <slot name="footer"></slot>
    </footer>
  </article>
`;

    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    this.querySelectorAll('template[slot]').forEach((tpl) => {
      const wrapper = document.createElement('div');
      wrapper.setAttribute('slot', tpl.getAttribute('slot'));
      wrapper.appendChild(tpl.content.cloneNode(true));
      tpl.replaceWith(wrapper);
    });
  }
}

customElements.define('card-component', CardComponent);