import { render, TemplateResult } from "lit-html";

export abstract class LitHTMLComponent extends HTMLElement {
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

export function define(name: string, constructor: Function) {
    applyMixins(constructor, [LitHTMLComponent]);
    window.customElements.define(name, constructor);
}