import { render, html, TemplateResult } from "lit-html";
import { LitHTMLBehavior, define } from "./lit-html.behavior";

export class CarouselViewportComponent extends HTMLElement implements LitHTMLBehavior {    
    connectedCallback() {            
        this.render(html`<style>:host {display:inline-block;overflow:hidden;max-height: 400px; height:100%; max-width: var(--viewport-width);width:100%;position:relative;}</style><slot></slot>`);
    }

    render: (templateResult: TemplateResult) => void;
}

define(`ce-carousel-viewport`,CarouselViewportComponent);
