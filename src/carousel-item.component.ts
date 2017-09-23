const template = document.createElement("template");

const html = require("./carousel-item.component.html");
const css = require("./carousel-item.component.css");

export class CarouselItemContainerComponent extends HTMLElement {
    constructor() {
        super();
    }

    async connectedCallback() {
    
        template.innerHTML = `<style>${css}</style>${html}`; 

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(document.importNode(template.content, true));  

        if (!this.hasAttribute('role'))
            this.setAttribute('role', 'carouselitem');        
    }
    
}

customElements.define(`ce-carousel-item`,CarouselItemContainerComponent);
