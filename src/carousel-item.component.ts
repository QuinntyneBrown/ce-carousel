import { render, html } from "lit-html";

declare var ResizeObserver: any;

export class CarouselItemContainerComponent extends HTMLElement {    
    connectedCallback() {    
        this.attachShadow({ mode: 'open' });        
        render(html`<style>:host {display: inline-block;max-width: ${this._maxWidth}px;width:100%;height: var(--viewport-height);transition: transform .500s cubic-bezier(.10, .10, .25, .90);}:host(.notransition) {transition: none;}</style><slot></slot>`, this.shadowRoot);    
    }    

    private get _maxWidth() {
        var outerContainerWidth = Number(this.parentElement.parentElement.parentElement.getBoundingClientRect().width);        
        var carouselMaxWidth = Number(this.parentElement.parentElement.getAttribute("carousel-width").replace("px", ""));
        return outerContainerWidth < carouselMaxWidth ? outerContainerWidth : carouselMaxWidth;
    }
}

customElements.define(`ce-carousel-item`,CarouselItemContainerComponent);
