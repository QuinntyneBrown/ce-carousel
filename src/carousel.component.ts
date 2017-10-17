import "./carousel-item.component";
import "./carousel-container.component";
import "./carousel-viewport.component";

import { CarouselContainerComponent } from "./carousel-container.component";
import { render, html } from "lit-html";

const TRANSITION_END: string = "transitionend";

export var getX = (element: HTMLElement): number => {
    const style = getComputedStyle(element);
    const transform = style.transform;
    const matrix = transform.match(/^matrix\((.+)\)$/);
    return matrix ? parseFloat(matrix[1].split(', ')[4]) : 0;
}

export function translateX(element: HTMLElement, x: number) {
    element.style.transform = `translateX(${x}px)`;
    return element;
}

export class CarouselComponent extends HTMLElement {
    constructor() {
        super();
        this._renderNext = this._renderNext.bind(this);
        this._renderPrevious = this._renderPrevious.bind(this);        
    }
    
    public get carouselHeight() { return this.getAttribute("carousel-height"); }

    public get carouselWidth(): string { return this.getAttribute("carousel-width"); };

    connectedCallback() {
        this.attachShadow({ mode: 'open' });      
        this.bind();                
        
        setInterval(() => this._renderNext(), 3000);
    }

    bind() {        
        render(html`<style>:host {display:inline-block;line-height:0px;--viewport-height: ${this.carouselHeight};--viewport-width: ${this.carouselWidth};width:100%;max-width:var(--viewport-width);}</style><ce-carousel-viewport><slot></slot></ce-carousel-viewport>`, this.shadowRoot);
    }
    
    private _renderNext() {
        if (!this.inTransition) {
            this.inTransition = true;
            
            let pendingTransitons = this.containerHTMLElement.childNodes.length;
            
            for (let i = 0; i < this.containerHTMLElement.childNodes.length; i++) {
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
            
            let pendingTransitions = this.containerHTMLElement.childNodes.length;

            for (let i = 0; i < this.containerHTMLElement.childNodes.length; i++) {
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
            const desiredX = this.viewPortWidth * (this.containerHTMLElement.childNodes.length - 1);
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
    
    public get viewPortWidth(): number { return (<HTMLElement>this.shadowRoot.querySelector("ce-carousel-viewport")).offsetWidth; }

    public inTransition: boolean = false;

    public get containerHTMLElement(): CarouselContainerComponent { return this.querySelector("ce-carousel-container") as CarouselContainerComponent; };        
}

customElements.define(`ce-carousel`, CarouselComponent);