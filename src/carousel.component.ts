import "./carousel-item.component";
import "./carousel-container.component";
import "./carousel-viewport.component";
import { render, html, TemplateResult } from "lit-html";
import { LitHTMLBehavior, define } from "./lit-html.behavior";

function getX(element: HTMLElement): number {
    const style = getComputedStyle(element);
    const transform = style.transform;
    const matrix = transform.match(/^matrix\((.+)\)$/);
    return matrix ? parseFloat(matrix[1].split(', ')[4]) : 0;
}

function translateX(element: HTMLElement, x: number) {
    element.style.transform = `translateX(${x}px)`;
}

class CarouselComponent extends HTMLElement implements LitHTMLBehavior {
    connectedCallback() {        
        this.render(html`<style>:host {display:inline-block;line-height:0px;overflow-x: hidden;overflow-y: hidden;--viewport-height: ${this._height};--viewport-width: ${this._width};width:100%;max-width:var(--viewport-width);}</style><ce-carousel-viewport><slot></slot></ce-carousel-viewport>`);                        
        setInterval(() => this.next(), 3000);        
    }
    
    public next () {
        if (this.slides.filter(x => x.classList.contains("notransition")).length) return;
        
        let pendingTransitons = this.slides.length - 1;

        this.slides.map((slide: HTMLElement) => {

            requestAnimationFrame(() => translateX(slide, getX(slide) - this.viewportWidth));

            slide.addEventListener("transitionend", () => {                
                if (pendingTransitons-- === 0) {
                    this.slides.map(x => x.classList.add("notransition"));

                    const head = this.slides
                        .map((x: HTMLElement) => {
                            return { rect: x.getBoundingClientRect(), node: x };
                        })
                        .sort((a, b) => a.rect.left - b.rect.left)
                        .map(x => x.node)[0];

                    const desiredX = this.viewportWidth * (this.slides.length - 1);
                    const delta = desiredX - head.offsetLeft;

                    translateX(head, delta);

                    setTimeout(() => this.slides.map(x => x.classList.remove("notransition")), 100);
                }
            });
        });                        
    }

    render(templateResult: TemplateResult):void { /* LitHTMLBehavior */ };

    public get slides(): Array<HTMLElement> { return Array.from(this.querySelector("ce-carousel-container").childNodes) as Array<HTMLElement>; }
    
    private get _height() { return this.getAttribute("carousel-height"); }

    private get _width(): string { return this.getAttribute("carousel-width"); };

    public get viewportWidth(): number { return (<HTMLElement>this.shadowRoot.querySelector("ce-carousel-viewport")).getBoundingClientRect().width; }
}

define(`ce-carousel`, CarouselComponent);