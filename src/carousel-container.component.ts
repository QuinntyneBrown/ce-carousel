import { getX } from "./get-x";
import { RenderedNodes } from "./rendered-nodes";
const template = document.createElement("template");
const style = document.createElement("style");

const html = require("./carousel-container.component.html");
const css = require("./carousel-container.component.css");

export class CarouselContainerComponent extends RenderedNodes {
    constructor() {
        super();
    }

    connectedCallback() {        
        template.innerHTML = `${html}`; 
        style.innerText = `${css}`;
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(document.importNode(template.content, true));  

        if (!this.hasAttribute('role'))
            this.setAttribute('role', 'carouselcontainer'); 

        this.insertBefore(style, this.childNodes[0]);
    }   

    public turnOnTransitions() {
        if (this.classList.contains("notransition"))
            this.classList.remove("notransition");
    }

    public turnOffTransitions() {
        if (this.classList.contains("notransition") == false)
            this.classList.add("notransition");
    }
}

customElements.define(`ce-carousel-container`,CarouselContainerComponent);
