import { getX } from "./get-x";
import { RenderedNodes } from "./rendered-nodes";
import { render, html } from "lit-html";

export class CarouselContainerComponent extends RenderedNodes {
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
        render(html`
            <style>
                :host {
                    display: inline-block;
                    width: ${this.childNodes.length * this.carouselWidth}px;
                }
            </style>
            <slot></slot>
        `, this.shadowRoot);
    }

    public turnOnTransitions() {        
        if (this.classList.contains("notransition"))
        {
            this.classList.remove("notransition");
            Array.from(this.children).map(x => x.classList.remove("notransition"));
        }
    }

    public turnOffTransitions() {
        if (!this.classList.contains("notransition")) {
            this.classList.add("notransition");
            Array.from(this.children).map(x => x.classList.add("notransition"));            
        }            
    }
}

customElements.define(`ce-carousel-container`,CarouselContainerComponent);
