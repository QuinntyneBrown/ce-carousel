export function translateX(element: HTMLElement, x: number) {
    element.style.transform = `translateX(${x}px)`;
    return element;
}