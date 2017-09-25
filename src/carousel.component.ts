import "./carousel-item.component";
import "./carousel-container.component";
import "./carousel-viewport.component";
import { translateX } from "./translate-x";
import { getX } from "./get-x";
import { CarouselContainerComponent } from "./carousel-container.component";
import { BehaviorSubject } from "rxjs/BehaviorSubject";

const htmlTemplate = require("./carousel.component.html");
const css = require("./carousel.component.css");
const template = document.createElement("template");
const style = document.createElement("style");
const TRANSITION_END: string = "transitionend";

template.innerHTML = `${htmlTemplate}`;
style.innerText = `${css}`;

export class CarouselComponent extends HTMLElement {
    constructor() {
        super();
        this._renderNext = this._renderNext.bind(this);
        this.renderPrevious = this.renderPrevious.bind(this);        
    }

    static get observedAttributes() {
        return [
            "carousel-height",
            "carousel-width"
        ];
    }

    public carouselHeight$: BehaviorSubject<string> = new BehaviorSubject("");

    public carouselWidth$: BehaviorSubject<string> = new BehaviorSubject("");

    connectedCallback() {
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(document.importNode(template.content, true));          
        this.insertBefore(style, this.childNodes[0]);        
        this.bind();                
    }

    bind() {
        this.carouselHeight$.subscribe(x => this.style.setProperty("--viewport-height",`${x}`));

        this.carouselWidth$.subscribe(x => this.style.setProperty("--viewport-width", `${x}`));

        setInterval(() => this._renderNext(), 3000);
    }

    public currentIndex: number = 0;
    
    public get itemsCount(): number { return this.containerHTMLElement.querySelectorAll("ce-carousel-item").length; }
    
    private _renderNext() {
        if (!this.inTransition) {
            this.inTransition = true;
            
            const renderedNodes = this.containerHTMLElement.getAll({ orientation: "horizontal", order: "desc" });
            
            let numOfTransitions = renderedNodes.length;                        
            for (let i = 0; i < renderedNodes.length; i++) {
                var node = renderedNodes[i].node;
                
                translateX(renderedNodes[i].node, getX(renderedNodes[i].node) - this.lastViewPortWidth);
                
                renderedNodes[i].node.addEventListener(TRANSITION_END, () => {                    
                    numOfTransitions = numOfTransitions - 1;                    
                    if (numOfTransitions === 0) {
                        
                        this.containerHTMLElement.turnOffTransitions();
                        
                        const renderedNodes = this.containerHTMLElement.getAll({ orientation: "horizontal", order: "asc" });
                        const node = renderedNodes[0].node;
                        const currentLeft = node.offsetLeft;
                        const desiredX = this.lastViewPortWidth * (this.itemsCount - 1);
                        const delta = desiredX - currentLeft;
                        
                        translateX(node, delta);

                        setTimeout(() => {
                            this.inTransition = false;
                            this.containerHTMLElement.turnOnTransitions();
                        }, 100);
                    }
                });
            }
            
        }
    }

    private renderPrevious() {
        if (!this.inTransition) {
            this.inTransition = true;
            this.containerHTMLElement.turnOffTransitions();

            const renderedNodes = this.containerHTMLElement.getAll({ orientation: "horizontal", order: "desc" });
            const tailRenderedNode = renderedNodes[0];
            const currentLeft = tailRenderedNode.node.offsetLeft;
            const desiredX = this.lastViewPortWidth * (-1);
            const delta = desiredX - currentLeft;

            translateX(tailRenderedNode.node, delta);

            setTimeout(() => {
                this.containerHTMLElement.turnOnTransitions();
                const renderedNodes = this.containerHTMLElement.getAll({ orientation: "horizontal", order: "asc" });
                
                for (let i = 0; i < renderedNodes.length; i++) {
                    const node = renderedNodes[i].node;
                    translateX(renderedNodes[i].node, getX(renderedNodes[i].node) + this.lastViewPortWidth);
                }
                this.inTransition = false;
            }, 0);
        }
    }
    
    public get lastViewPortWidth(): number { return (<HTMLElement>this.shadowRoot.querySelector("ce-carousel-viewport")).offsetWidth; }

    public inTransition: boolean = false;

    public get containerHTMLElement(): CarouselContainerComponent { return this.querySelector("ce-carousel-container") as CarouselContainerComponent; };    

    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case "carousel-height":
                this.carouselHeight$.next(newValue);
                break;

            case "carousel-width":
                this.carouselWidth$.next(newValue);
                break;
        }
    }
}

customElements.define(`ce-carousel`,CarouselComponent);
