export var getX = (element: HTMLElement): number => {        
    const style = getComputedStyle(element);    
    const transform = style.transform;    
    const matrix = transform.match(/^matrix\((.+)\)$/);   
    return matrix ? parseFloat(matrix[1].split(', ')[4]) : 0;
}