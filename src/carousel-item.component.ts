import { render, html, TemplateResult } from "lit-html";
import { LitHTMLBehavior, define } from "./lit-html.behavior";

export class CarouselItemContainerComponent extends HTMLElement implements LitHTMLBehavior {    
    connectedCallback() {    
        this.render(html`<style>:host {display: inline-block;max-width: ${this._maxWidth}px;width:100%;height: var(--viewport-height);transition: transform .500s cubic-bezier(.10, .10, .25, .90);}:host(.notransition) {transition: none;}</style><slot></slot>`);    
    }    

    private get _maxWidth() {
        const carousel = this.parentElement.parentElement;
        const outer:any = carousel.parentElement.getBoundingClientRect().width;        
        const max:any = carousel.getAttribute("carousel-width").replace("px", "");
        return outer < max ? outer : max;
    }

    render: (templateResult: TemplateResult) => void;
}

define(`ce-carousel-item`,CarouselItemContainerComponent);
