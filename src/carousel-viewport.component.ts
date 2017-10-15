import { render, html } from "lit-html";

export class CarouselViewportComponent extends HTMLElement {
    constructor() {
        super();
    }
    
    connectedCallback() {
    
        this.attachShadow({ mode: 'open' });

        if (!this.hasAttribute('role'))
            this.setAttribute('role', 'carouselviewport');

        this._bind();
    }

    private async _bind() {
        render(html`
            <style>
                :host {
                    display: inline-block;
                    overflow-x: hidden;
                    max-width: var(--viewport-width,750px);
                    overflow-x: hidden;
                    background-color: #fff;
                    position: relative;
                }
            </style>
            <slot></slot>
        `,this.shadowRoot);
    }
}

customElements.define(`ce-carousel-viewport`,CarouselViewportComponent);
