import { render, html, TemplateResult } from "lit-html";
import { LitHTMLComponent, define } from "./lit-html.component";

export class CarouselContainerComponent extends HTMLElement {    
    connectedCallback() {            
        Array.from(this.childNodes)
            .filter(x => x.nodeType == 3)
            .forEach(x => x.parentNode.removeChild(x));

        this.render(html`<style>:host {display: inline-block;width: ${this.childNodes.length * this.carouselWidth}px;}</style><slot></slot>`)
    }   

    get carouselWidth() { return Number(this.parentElement.getAttribute("carousel-width").replace("px", "")); }
    
    render: (templateResult: TemplateResult) => void;
}

define(`ce-carousel-container`,CarouselContainerComponent);
