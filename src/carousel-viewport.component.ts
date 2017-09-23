const template = document.createElement("template");
const style = document.createElement("style");

const html = require("./carousel-viewport.component.html");
const css = require("./carousel-viewport.component.css");

template.innerHTML = `${html}`;
style.innerText = `${css}`;

export class CarouselViewportComponent extends HTMLElement {
    constructor() {
        super();
    }

    static get observedAttributes () {
        return [];
    }

    async connectedCallback() {
    
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(document.importNode(template.content, true));  

        if (!this.hasAttribute('role'))
            this.setAttribute('role', 'carouselviewport');

        this._bind();
        this._setEventListeners();
        this.insertBefore(style, this.childNodes[0]);
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

customElements.define(`ce-carousel-viewport`,CarouselViewportComponent);
