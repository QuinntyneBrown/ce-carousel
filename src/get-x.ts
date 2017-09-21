export var getX = (element: HTMLElement): number => {
    var transform = element.style.transform;
    if (transform === "none") return 0;
    var result = JSON.parse(transform.replace(/^\w+\(/, "[").replace(/\)$/, "]"));
    return JSON.parse(transform.replace(/^\w+\(/, "[").replace(/\)$/, "]"))[4];
}