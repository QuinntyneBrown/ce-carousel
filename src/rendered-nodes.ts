import { getX } from "./get-x";

export class RenderedNodes extends HTMLElement {
    constructor() {        
        super();
        this.getAll = this.getAll.bind(this);
        this.getHead = this.getHead.bind(this);
        this.getTail = this.getTail.bind(this);
        this.getHeadAndTail = this.getHeadAndTail.bind(this);
    }
    
    public get map() {
        var map: Array<any> = [];        
        var nodes = this.querySelectorAll("ce-carousel-item");
        
        for (var i = 0; i < nodes.length; i++) {
            var node = <HTMLElement>nodes[i];
            
            map.push({
                left: getX(node) + node.offsetLeft,
                node: node
            });
        }
        return map;
    }

    public getAll(options: any) {
        var direction: any;
        switch (options.orientation) {
            case "horizontal":
                direction = "left";
                break;

            default:
                direction = "top";
                break;
        }

        switch (options.order) {
            case "desc":
                return this.map.sort((a: any, b: any) => {
                    return b[direction] - a[direction];
                });

            case "asc":
                return this.map.sort((a: any, b: any) => {
                    return a[direction] - b[direction];
                });
        }
    }

    public getHead() {
        var map = this.getAll({ order: "asc" });
        if (map.length < 1) { return null; }
        return map[0];
    }

    public getTail() {
        var map = this.getAll({ order: "desc" });
        if (map.length < 1) { return null; }
        return map[0];
    }

    public getHeadAndTail() {
        var map = this.getAll({ order: "asc" });
        if (map.length < 1) { return null; }
        return {
            head: map[0],
            tail: map[map.length - 1]
        };
    }
}
