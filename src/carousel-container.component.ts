import { getX } from "./get-x";
import { RenderedNodes } from "./rendered-nodes";
import { render, html } from "lit-html";

export class CarouselContainerComponent extends RenderedNodes {
    constructor() {
        super();
    }

    connectedCallback() {        
        this.attachShadow({ mode: 'open' });
        
        if (!this.hasAttribute('role'))
            this.setAttribute('role', 'carouselcontainer'); 

        //TODO: css custom property. calculate width?

        render(html`
            <style>
                :host {
                    display: inline-block;
                    width: 99999999px;
                }
            </style>
            <slot></slot>
        `, this.shadowRoot);

        for (var i = 0; i < this.childNodes.length; i++) {
            if (this.childNodes[i].nodeType == 3)
                this.childNodes[i].parentNode.removeChild(this.childNodes[i]);
        }
    }   

    public turnOnTransitions() {        
        if (this.classList.contains("notransition"))
        {
            this.classList.remove("notransition");
            for (var i = 0; i < this.children.length; i++) {
                this.children[i].classList.remove("notransition")
            }
        }
    }

    public turnOffTransitions() {
        if (this.classList.contains("notransition") == false) {
            this.classList.add("notransition");
            for (var i = 0; i < this.children.length; i++) {
                this.children[i].classList.add("notransition")
            }
        }
            
    }
}

customElements.define(`ce-carousel-container`,CarouselContainerComponent);
