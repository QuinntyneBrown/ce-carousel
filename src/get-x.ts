export var getX = (element: HTMLElement): number => {        
    const style = getComputedStyle(element);    
    const transform = style.transform;    
    const mat = transform.match(/^matrix\((.+)\)$/);   
    return mat ? parseFloat(mat[1].split(', ')[4]) : 0;
}