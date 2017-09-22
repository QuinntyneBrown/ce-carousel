import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { translateX } from "./translate-x";
import { getX } from "./get-x";
import { CarouselContainerComponent } from "./carousel-container.component";
import { CarouselViewportComponent } from "./carousel-viewport.component";
import { RenderedNodes } from "./rendered-nodes";
import "./carousel-item.component";

const htmlTemplate = require("./carousel.component.html");
const styles = require("./carousel.component.css");
const template = document.createElement("template");

export const TRANSITION_END:string = "transitionend";

template.innerHTML = `${htmlTemplate}`;

export class CarouselComponent extends HTMLElement {
    constructor() {
        super();
        this.renderNext = this.renderNext.bind(this);
        this.renderPrevious = this.renderPrevious.bind(this);
        this._render = this._render;
        this.initialRender = this.initialRender;
        this.renderedNodes = new RenderedNodes(this.containerHTMLElement.children);
    }

    private _for: string;

    static get observedAttributes () {
        return [
            "for"
        ];
    }

    private renderedNodes: RenderedNodes;

    connectedCallback() {
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(document.importNode(template.content, true));  
        this._bind();
        this._setEventListeners();
        this._render();

        var styleNode = document.createElement("style");
        styleNode.innerHTML = styles;
        this.insertBefore(styleNode, this.childNodes[0]);
        
        setInterval(() => this.renderNext(), 3000);
        
    }
    
    public turnOnTransitions() {
        if(this.containerHTMLElement.classList.contains("notransition"))
            this.containerHTMLElement.classList.remove("notransition");
    }

    public turnOffTransitions() {
        if (this.containerHTMLElement.classList.contains("notransition") == false)
            this.containerHTMLElement.classList.add("notransition");
    }

    public hasRendered: boolean = false;

    private async _bind() {
        this.carouselItems$.next(Array.from(this.shadowRoot.querySelectorAll("ce-carousel-item")) as Array<HTMLElement>);
        
        this.carouselItems$.subscribe(x => {
            //x.map(el => el.style.display = "none");            
        });        
    }

    public _render () {
        if (!this.hasRendered) this.initialRender();
    }

    public currentIndex: number = 0;
    
    public initialRender(){        
        this.hasRendered = true;
        this.currentIndex = 0;
    }

    private reRender = () => {
        translateX(this.containerHTMLElement, 0);
    }

    public get itemsCount(): number { return this.containerHTMLElement.children.length; }
    
    private renderNext() {
        if (!this.inTransition) {
            this.inTransition = true;
            
            var renderedNodes = this.renderedNodes.getAll({ orientation: "horizontal", order: "desc" });
            var numOfTransitions = renderedNodes.length;                        
            for (let i = 0; i < renderedNodes.length; i++) {
                var node = renderedNodes[i].node;
                
                translateX(renderedNodes[i].node, getX(renderedNodes[i].node) - this.lastViewPortWidth);
                
                renderedNodes[i].node.addEventListener("transitionend", () => {
                    
                    numOfTransitions = numOfTransitions - 1;
                    
                    if (numOfTransitions === 0) {
                        
                        this.turnOffTransitions();
                        
                        const renderedNodes = this.renderedNodes.getAll({ orientation: "horizontal", order: "asc" });
                        const node = renderedNodes[0].node;
                        const currentLeft = node.offsetLeft;
                        const desiredX = this.lastViewPortWidth * (this.itemsCount - 1);
                        const delta = desiredX - currentLeft;

                        console.log(delta);

                        translateX(node, delta);

                        setTimeout(() => {
                            this.inTransition = false;
                            this.turnOnTransitions();
                        }, 100);
                    }
                });
            }
            
        }
    }

    private renderPrevious() {
        if (!this.inTransition) {
            this.inTransition = true;
            this.turnOffTransitions();

            const renderedNodes = this.renderedNodes.getAll({ orientation: "horizontal", order: "desc" });
            const tailRenderedNode = renderedNodes[0];
            const currentLeft = tailRenderedNode.node.offsetLeft;
            const desiredX = this.lastViewPortWidth * (-1);
            const delta = desiredX - currentLeft;

            translateX(tailRenderedNode.node, delta);

            setTimeout(() => {
                this.turnOnTransitions();
                const renderedNodes = this.renderedNodes.getAll({ orientation: "horizontal", order: "asc" });
                
                for (let i = 0; i < renderedNodes.length; i++) {
                    const node = renderedNodes[i].node;
                    translateX(renderedNodes[i].node, getX(renderedNodes[i].node) + this.lastViewPortWidth);
                }
                this.inTransition = false;
            }, 0);
        }
    }

    private _setEventListeners() {

    }

    disconnectedCallback() {

    }

    attributeChangedCallback (name, oldValue, newValue) {
        switch (name) {
            case "for":
                this._for = newValue;
                break;
        }
    }

    public get lastViewPortWidth(): number { return this.viewportHTMLElement.offsetWidth; }

    public inTransition: boolean = false;

    public get containerHTMLElement(): CarouselContainerComponent { return this.querySelector("ce-carousel-container") as CarouselContainerComponent; };

    public get viewportHTMLElement(): CarouselViewportComponent { return this.querySelector("ce-carousel-viewport") as CarouselViewportComponent; };

    public carouselItems$: BehaviorSubject<Array<HTMLElement>> = new BehaviorSubject([]);    
}

customElements.define(`ce-carousel`,CarouselComponent);
