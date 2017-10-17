import { render, html } from "lit-html";

export class CarouselItemContainerComponent extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {    
        this.attachShadow({ mode: 'open' });
        render(html`<style>:host {display: inline-block;width: var(--viewport-width);height: var(--viewport-height);transition: transform .500s cubic-bezier(.10, .10, .25, .90);}:host(.notransition) {transition: none;}</style><slot></slot>`, this.shadowRoot);    
    }    
}

customElements.define(`ce-carousel-item`,CarouselItemContainerComponent);
