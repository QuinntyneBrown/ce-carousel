import "./carousel-item.component";
import "./carousel-container.component";
import "./carousel-viewport.component";
import { render, html, TemplateResult } from "lit-html";
import { LitHTMLComponent, define } from "./lit-html.component";

function getX(element: HTMLElement): number {
    const style = getComputedStyle(element);
    const transform = style.transform;
    const matrix = transform.match(/^matrix\((.+)\)$/);
    return matrix ? parseFloat(matrix[1].split(', ')[4]) : 0;
}

function translateX(element: HTMLElement, x: number) {
    element.style.transform = `translateX(${x}px)`;
}

class CarouselComponent extends HTMLElement implements LitHTMLComponent {
    connectedCallback() {        
        this.render(html`<style>:host {display:inline-block;line-height:0px;overflow-x: hidden;overflow-y: hidden;--viewport-height: ${this._height};--viewport-width: ${this._width};width:100%;max-width:var(--viewport-width);}</style><ce-carousel-viewport><slot></slot></ce-carousel-viewport>`);                        
        setInterval(() => this._next(), 3000);        
    }
    
    private _next () {
        if (this._inTransition) return;
        
        let pendingTransitons = this.slides.length;

        this.slides.map((slide:HTMLElement) => {
            translateX(slide, getX(slide) - this._viewportWidth);

            slide.addEventListener("transitionend", () => {
                pendingTransitons = pendingTransitons - 1;
                if (pendingTransitons === 0) {
                    this.slides.map(x => x.classList.add("notransition"));

                    const head = this.slides
                        .map((x: HTMLElement) => {
                            return { rect: x.getBoundingClientRect(), node: x };
                        })
                        .sort((a, b) => a.rect.left - b.rect.left)
                        .map(x => x.node)[0];

                    const currentLeft = head.offsetLeft;
                    const desiredX = this._viewportWidth * (this.slides.length - 1);
                    const delta = desiredX - currentLeft;
                    translateX(head, delta);

                    setTimeout(() => {
                        this._inTransition = false;
                        this.slides.map(x => x.classList.remove("notransition"));
                    }, 100);
                }
            });
        });                        
    }

    render: (templateResult: TemplateResult) => void;

    public get slides(): Array<HTMLElement> { return Array.from(this.querySelector("ce-carousel-container").childNodes) as Array<HTMLElement>; }
    
    private _inTransition: boolean = false;
    
    private get _height() { return this.getAttribute("carousel-height"); }

    private get _width(): string { return this.getAttribute("carousel-width"); };

    private get _viewportWidth(): number { return (<HTMLElement>this.shadowRoot.querySelector("ce-carousel-viewport")).getBoundingClientRect().width; }
}

define(`ce-carousel`, CarouselComponent);