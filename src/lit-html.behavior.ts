import { render, TemplateResult } from "lit-html";

export abstract class LitHTMLBehavior extends HTMLElement {
    render(template: TemplateResult): void {
        if (!this.shadowRoot) this.attachShadow({ mode: 'open' });
        render(template, this.shadowRoot);
    }
}

export function applyMixins(derivedCtor: any, baseCtors: any[]) {
    baseCtors.forEach(baseCtor => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
            derivedCtor.prototype[name] = baseCtor.prototype[name];
        });
    });
}

export function Mixin(baseCtors: Function[]) {
    return function (derivedCtor: Function) {
        baseCtors.map(baseCtor => {
            Object.getOwnPropertyNames(baseCtor.prototype).map(name => {
                derivedCtor.prototype[name] = baseCtor.prototype[name];
            });
        });
    };
}

export function define(name: string, constructor: Function) {
    applyMixins(constructor, [LitHTMLBehavior]);
    window.customElements.define(name, constructor);
}