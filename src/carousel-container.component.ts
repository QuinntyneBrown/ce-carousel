import { getX } from "./get-x";
const template = document.createElement("template");

const html = require("./carousel-container.component.html");
const css = require("./carousel-container.component.css");

function applyMixins(derivedCtor: any, baseCtors: any[]) {
    baseCtors.forEach(baseCtor => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
            derivedCtor.prototype[name] = baseCtor.prototype[name];
        });
    });
}

export class CarouselContainerComponent extends HTMLElement {
    constructor(htmlElement: HTMLElement = null) {
        super();

    }
    
    public turnOffTransitions() {
        this.classList.remove("notransition");
    }

    public turnOnTransitions() {
        this.classList.add("notransition");
    }

    async connectedCallback() {
        
        template.innerHTML = `<style>${css}</style>${html}`; 

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(document.importNode(template.content, true));  

        if (!this.hasAttribute('role'))
            this.setAttribute('role', 'carouselcontainer');        
    }   
}

customElements.define(`ce-carousel-container`,CarouselContainerComponent);
