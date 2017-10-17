import { render, html } from "lit-html";

export class CarouselContainerComponent extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {        
        this.attachShadow({ mode: 'open' });        
        Array.from(this.childNodes)
            .filter(x => x.nodeType == 3)
            .forEach(x => x.parentNode.removeChild(x));
        this._bind();
    }   

    get carouselWidth() {
        return Number(this.parentElement.getAttribute("carousel-width").replace("px", ""));        
    }

    _bind() {        
        render(html`<style>:host {display: inline-block;width: ${this.childNodes.length * this.carouselWidth}px;}</style><slot></slot>`, this.shadowRoot);
    }
}

customElements.define(`ce-carousel-container`,CarouselContainerComponent);
