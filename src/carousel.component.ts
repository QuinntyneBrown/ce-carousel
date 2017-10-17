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
    
    private get _height() { return this.getAttribute("carousel-height"); }

    private get _width(): string { return this.getAttribute("carousel-width"); };

    connectedCallback() {
        this.attachShadow({ mode: 'open' });      
        this._bind();                
        
        setInterval(() => this._renderNext(), 3000);
    }

    private _bind() {        
        render(html`<style>:host {display:inline-block;line-height:0px;--viewport-height: ${this._height};--viewport-width: ${this._width};width:100%;max-width:var(--viewport-width);}</style><ce-carousel-viewport><slot></slot></ce-carousel-viewport>`, this.shadowRoot);
    }
    
    private _renderNext() {
        if (!this._inTransition) {
            this._inTransition = true;
            
            let pendingTransitons = this._containerHTMLElement.childNodes.length;
            
            for (let i = 0; i < this._containerHTMLElement.childNodes.length; i++) {
                var node = this._containerHTMLElement.childNodes[i] as HTMLElement;
                
                translateX(node, getX(node) - this._viewportWidth);
                
                node.addEventListener(TRANSITION_END, () => {                    
                    pendingTransitons = pendingTransitons - 1;                    
                    if (pendingTransitons === 0)
                        this._moveHeadToTailWithoutTransitions();                    
                });
            }
            
        }
    }

    private _renderPrevious() {
        if (!this._inTransition) {
            this._inTransition = true;
            
            let pendingTransitions = this._containerHTMLElement.childNodes.length;

            for (let i = 0; i < this._containerHTMLElement.childNodes.length; i++) {
                var node = this._containerHTMLElement.childNodes[i] as HTMLElement;

                translateX(node, getX(node) + this._viewportWidth);

                node.addEventListener(TRANSITION_END, () => {
                    pendingTransitions = pendingTransitions - 1;
                    if (pendingTransitions === 0)
                        this._moveTailToHeadWithoutTransitions();                    
                });
            }

        }
    }

    private _moveWithoutTransitions(move) {
        Array.from(this._containerHTMLElement.children).map(x => x.classList.add("notransition"));
        move();
        setTimeout(() => {
            this._inTransition = false;
            Array.from(this._containerHTMLElement.children).map(x => x.classList.remove("notransition"));
        }, 100);
    }

    private _moveHeadToTailWithoutTransitions() {
        this._moveWithoutTransitions(() => {
            const node = Array.from(this._containerHTMLElement.childNodes)
                .map((x: HTMLElement) => {
                    return { rect: x.getBoundingClientRect(), node: x };
                })
                .sort((a, b) => a.rect.left - b.rect.left)
                .map(x => x.node)[0];                
            const currentLeft = node.offsetLeft;
            const desiredX = this._viewportWidth * (this._containerHTMLElement.childNodes.length - 1);
            const delta = desiredX - currentLeft;
            translateX(node, delta);
        });        
    }

    private _moveTailToHeadWithoutTransitions() {
        this._moveWithoutTransitions(() => {
            const node = Array.from(this._containerHTMLElement.childNodes)
                .map((x: HTMLElement) => {
                    return { rect: x.getBoundingClientRect(), node: x };
                })
                .sort((a, b) =>  b.rect.left - a.rect.left)
                .map(x => x.node)[0];
            const currentLeft = node.offsetLeft;
            const desiredX = this._viewportWidth * -1;
            const delta = desiredX - currentLeft;
            translateX(node, delta);
        });   
    }
    
    private get _viewportWidth(): number { return (<HTMLElement>this.shadowRoot.querySelector("ce-carousel-viewport")).offsetWidth; }

    private _inTransition: boolean = false;

    private get _containerHTMLElement(): CarouselContainerComponent { return this.querySelector("ce-carousel-container") as CarouselContainerComponent; };        
}

customElements.define(`ce-carousel`, CarouselComponent);