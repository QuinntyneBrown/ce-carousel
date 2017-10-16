import "./carousel-item.component";
import "./carousel-container.component";
import "./carousel-viewport.component";
import { translateX } from "./translate-x";
import { getX } from "./get-x";
import { CarouselContainerComponent } from "./carousel-container.component";
import { render, html } from "lit-html";

const TRANSITION_END: string = "transitionend";

export class CarouselComponent extends HTMLElement {
    constructor() {
        super();
        this._renderNext = this._renderNext.bind(this);
        this._renderPrevious = this._renderPrevious.bind(this);        
    }

    static get observedAttributes() {
        return [
            "carousel-height",
            "carousel-width"
        ];
    }

    public carouselHeight: string = "";

    public carouselWidth: string = "";

    connectedCallback() {
        this.attachShadow({ mode: 'open' });      
        this.bind();                
        
        setInterval(() => this._renderNext(), 3000);
    }

    bind() {        
        render(html`
            <style>
                :host {
                    display:inline-block;
                    line-height:0px;                    
                    --viewport-height: ${this.carouselHeight};
                    --viewport-width: ${this.carouselWidth};
                    width:100%;
                    max-width:var(--viewport-width);
                }
            </style>
            <ce-carousel-viewport>
                <slot>

                </slot>
            </ce-carousel-viewport>
        `, this.shadowRoot);
    }

    public currentIndex: number = 0;

    private _itemsCount = 0;

    public get itemsCount(): number {
        this._itemsCount = this._itemsCount || this.containerHTMLElement.childNodes.length;
        return this._itemsCount;
    }
    
    private _renderNext() {
        if (!this.inTransition) {
            this.inTransition = true;
            
            let pendingTransitons = this.itemsCount;
            
            for (let i = 0; i < this.itemsCount; i++) {
                var node = this.containerHTMLElement.childNodes[i] as HTMLElement;
                
                translateX(node, getX(node) - this.viewPortWidth);
                
                node.addEventListener(TRANSITION_END, () => {                    
                    pendingTransitons = pendingTransitons - 1;                    
                    if (pendingTransitons === 0)
                        this.moveHeadToTailWithoutTransitions();                    
                });
            }
            
        }
    }

    private _renderPrevious() {
        if (!this.inTransition) {
            this.inTransition = true;
            
            let pendingTransitions = this.itemsCount;

            for (let i = 0; i < this.itemsCount; i++) {
                var node = this.containerHTMLElement.childNodes[i] as HTMLElement;

                translateX(node, getX(node) + this.viewPortWidth);

                node.addEventListener(TRANSITION_END, () => {
                    pendingTransitions = pendingTransitions - 1;
                    if (pendingTransitions === 0)
                        this.moveTailToHeadWithoutTransitions();                    
                });
            }

        }
    }

    public moveWithoutTransitions(move) {
        this.containerHTMLElement.turnOffTransitions();
        move();
        setTimeout(() => {
            this.inTransition = false;
            this.containerHTMLElement.turnOnTransitions();
        }, 100);
    }

    public moveHeadToTailWithoutTransitions() {
        this.moveWithoutTransitions(() => {
            const node = Array.from(this.containerHTMLElement.childNodes)
                .map((x: HTMLElement) => {
                    return { rect: x.getBoundingClientRect(), node: x };
                })
                .sort((a, b) => a.rect.left - b.rect.left)
                .map(x => x.node)[0];                
            const currentLeft = node.offsetLeft;
            const desiredX = this.viewPortWidth * (this.itemsCount - 1);
            const delta = desiredX - currentLeft;
            translateX(node, delta);
        });        
    }

    public moveTailToHeadWithoutTransitions() {
        this.moveWithoutTransitions(() => {
            const node = Array.from(this.containerHTMLElement.childNodes)
                .map((x: HTMLElement) => {
                    return { rect: x.getBoundingClientRect(), node: x };
                })
                .sort((a, b) =>  b.rect.left - a.rect.left)
                .map(x => x.node)[0];
            const currentLeft = node.offsetLeft;
            const desiredX = this.viewPortWidth * -1;
            const delta = desiredX - currentLeft;
            translateX(node, delta);
        });   
    }

    private _viewPortWidth: number = 0;

    public get viewPortWidth(): number {
        this._viewPortWidth = this._viewPortWidth || (<HTMLElement>this.shadowRoot.querySelector("ce-carousel-viewport")).offsetWidth;
        return this._viewPortWidth;
    }

    public inTransition: boolean = false;

    public get containerHTMLElement(): CarouselContainerComponent { return this.querySelector("ce-carousel-container") as CarouselContainerComponent; };    

    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case "carousel-height":
                this.carouselHeight = newValue;
                break;

            case "carousel-width":
                this.carouselWidth = newValue;
                break;
        }
    }
}

customElements.define(`ce-carousel`, CarouselComponent);