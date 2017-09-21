import { RenderedNodes } from "./rendered-nodes";

const template = document.createElement("template");

const html = require("./carousel-container.component.html");
const css = require("./carousel-container.component.css");

export class CarouselContainerComponent extends RenderedNodes {
    constructor() {
        super();
    }

    static get observedAttributes () {
        return [];
    }

    public turnOffTransitions() {

    }

    public turnOnTransitions() {

    }

    async connectedCallback() {
    
        template.innerHTML = `<style>${css}</style>${html}`; 

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(document.importNode(template.content, true));  

        if (!this.hasAttribute('role'))
            this.setAttribute('role', 'carouselcontainer');

        this._bind();
        this._setEventListeners();
    }

    private async _bind() {

    }

    private _setEventListeners() {

    }

    disconnectedCallback() {

    }

    attributeChangedCallback (name, oldValue, newValue) {
        switch (name) {
            default:
                break;
        }
    }
}

customElements.define(`ce-carousel-container`,CarouselContainerComponent);
