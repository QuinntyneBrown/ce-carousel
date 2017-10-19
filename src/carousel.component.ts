import "./carousel-item.component";
import "./carousel-container.component";
import "./carousel-viewport.component";
import { CarouselContainerComponent } from "./carousel-container.component";
import { render, html, TemplateResult } from "lit-html";

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

export abstract class LitComponent extends HTMLElement {        
    render(template: TemplateResult): void {
        render(template, this.shadowRoot);
    }    
}

function applyMixins(derivedCtor: any, baseCtors: any[]) {
    baseCtors.forEach(baseCtor => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
            derivedCtor.prototype[name] = baseCtor.prototype[name];
        });
    });
}

export class CarouselComponent extends HTMLElement implements LitComponent {
    constructor() {
        super();
        this._next = this._next.bind(this);
    }
    
    private get _height() { return this.getAttribute("carousel-height"); }

    private get _width(): string { return this.getAttribute("carousel-width"); };

    render: (templateResult: TemplateResult) => void;

    connectedCallback() {
        this.attachShadow({ mode: 'open' });      
        this.render(html`<style>:host {display:inline-block;line-height:0px;overflow-x: hidden;overflow-y: hidden;--viewport-height: ${this._height};--viewport-width: ${this._width};width:100%;max-width:var(--viewport-width);}</style><ce-carousel-viewport><slot></slot></ce-carousel-viewport>`);                
        
        setInterval(() => this._next(), 3000);        
    }
    
    private _next() {
        if (this._inTransition) return;
        
        let pendingTransitons = this._containerHTMLElement.childNodes.length;

        Array.from(this._containerHTMLElement.childNodes).map((node:HTMLElement) => {
            translateX(node, getX(node) - this._viewportWidth);

            node.addEventListener(TRANSITION_END, () => {
                pendingTransitons = pendingTransitons - 1;
                if (pendingTransitons === 0) {
                    Array.from(this._containerHTMLElement.children).map(x => x.classList.add("notransition"));

                    const head = Array.from(this._containerHTMLElement.childNodes)
                        .map((x: HTMLElement) => {
                            return { rect: x.getBoundingClientRect(), node: x };
                        })
                        .sort((a, b) => a.rect.left - b.rect.left)
                        .map(x => x.node)[0];

                    const currentLeft = head.offsetLeft;
                    const desiredX = this._viewportWidth * (this._containerHTMLElement.childNodes.length - 1);
                    const delta = desiredX - currentLeft;
                    translateX(head, delta);

                    setTimeout(() => {
                        this._inTransition = false;
                        Array.from(this._containerHTMLElement.children).map(x => x.classList.remove("notransition"));
                    }, 100);
                }
            });
        });                        

    }
    
    private get _viewportWidth(): number { return (<HTMLElement>this.shadowRoot.querySelector("ce-carousel-viewport")).getBoundingClientRect().width; }

    private _inTransition: boolean = false;

    private get _containerHTMLElement(): CarouselContainerComponent { return this.querySelector("ce-carousel-container") as CarouselContainerComponent; };        
}

applyMixins(CarouselComponent, [LitComponent]);

customElements.define(`ce-carousel`, CarouselComponent);