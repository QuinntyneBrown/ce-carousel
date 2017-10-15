import { render, html } from "lit-html";

export class CarouselItemContainerComponent extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {    
        this.attachShadow({ mode: 'open' });

        render(html`
            <style>
                :host {
                    display: inline-block;
                    width: var(--viewport-width);
                    height: var(--viewport-height);
                    background-color: #fff;
                    -moz-transition: transform .500s cubic-bezier(.10, .10, .25, .90);
                    -ms-transition: transform .500s cubic-bezier(.10, .10, .25, .90);
                    -webkit-transition: transform .500s cubic-bezier(.10, .10, .25, .90);
                    transition: transform .500s cubic-bezier(.10, .10, .25, .90);
                    border:none;
                    margin:0;
                    padding:0;                 
                }

                :host(.notransition) {
                    -webkit-transition: none;
                    -moz-transition: none;
                    -o-transition: none;
                    -ms-transition: none;
                    transition: none;
                }
            </style>

            <slot></slot>
        `, this.shadowRoot);

        if (!this.hasAttribute('role'))
            this.setAttribute('role', 'carouselitem');        
    }
    
}

customElements.define(`ce-carousel-item`,CarouselItemContainerComponent);
