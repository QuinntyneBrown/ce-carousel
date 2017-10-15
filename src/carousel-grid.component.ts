import "./carousel.component";
import { html, render } from "lit-html";

export class CarouselGridComponent extends HTMLElement {
    constructor() {
        super();
    }

    static get observedAttributes () {
        return [];
    }

    async connectedCallback() {
    

        this.attachShadow({ mode: 'open' });

        if (!this.hasAttribute('role'))
            this.setAttribute('role', 'carouselgrid');

        this._bind();
        this._setEventListeners();
    }

    private async _bind() {
        render(html`
            <style>
                :host {
                    display:block;
                }

                .carousel-container {
                    display:none;
                }

                @media (min-width: 800px) {
                    .carousel-container {
                        display:block;
                    }
                }
            </style>
            <div>
                <h1>What?</h1>
                <slot name="item">

                </slot>

                <slot name="item">

                </slot>
            </div>

            <div class="carousel-container">
                <ce-carousel carousel-height="400px" carousel-width="750px">
                    <ce-carousel-viewport>
                        <ce-carousel-container>
                            <ce-carousel-item>
                    
                            </ce-carousel-item>
                            <ce-carousel-item>
                    
                            </ce-carousel-item>
                            <ce-carousel-item>
                    
                            </ce-carousel-item>
                        </ce-carousel-container>
                    </ce-carousel-viewport>
                </ce-carousel>
            </div>
        `, this.shadowRoot);
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

customElements.define(`ce-carousel-grid`,CarouselGridComponent);
