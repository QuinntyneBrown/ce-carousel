import { render, html } from "lit-html";

export class CarouselViewportComponent extends HTMLElement {
    constructor() {
        super();
    }
    
    connectedCallback() {    
        this.attachShadow({ mode: 'open' });

        render(html`<style>:host {display:inline-block;overflow-x:hidden;max-width: var(--viewport-width);position:relative;}</style><slot></slot>`, this.shadowRoot);
    }
}

customElements.define(`ce-carousel-viewport`,CarouselViewportComponent);
