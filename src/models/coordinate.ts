export class Coordinate {
    private _x: number;
    private _y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public get x(): number {
        return this._x;
    }
    
    public get y(): number {
        return this._y;
    }

    private set x(x: number) {
        this._x = x;
    }

    private set y(y: number) {
        this._y = y;
    }
}