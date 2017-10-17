import { render, html } from "lit-html";

export class CarouselViewportComponent extends HTMLElement {
    constructor() {
        super();
    }
    
    connectedCallback() {    
        this.attachShadow({ mode: 'open' });

        render(html`<style>:host {display:inline-block;overflow:hidden;max-height: 400px; height:100%; max-width: var(--viewport-width);width:100%;position:relative;}</style><slot></slot>`, this.shadowRoot);
    }
}

customElements.define(`ce-carousel-viewport`,CarouselViewportComponent);
