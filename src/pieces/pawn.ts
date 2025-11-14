import { Board } from "../models/board";
import { Coordinate } from "../models/coordinate";
import { Move } from "../models/move";
import { Piece } from "./piece";

export class Pawn implements Piece {
    private _color!: string;
    private _coordinate!: Coordinate;
    private _name: string;
    
    private direction = this.color === 'white' ? -1 : 1;
    private startRow = this.color === 'white' ? 7 : 2;

    constructor(color: string, coordinate: Coordinate) {
        this.color = color;
        this.coordinate = coordinate;
        this._name = "pawn"
    }

    public get color(): string {
        return this._color;
    }
    
    public get coordinate(): Coordinate {
        return this._coordinate;
    }

    public get name(): string {
        return this._name;
    }

    private set color(color: string) {
        this._color = color;
    }

    private set coordinate(coordinate: Coordinate) {
        this._coordinate = coordinate;
    }

    public getDefaultMoves(board: Board): Move[] {
        const moves: Move[] = [];

        if (board.coordinateIsEmpty(new Coordinate(this.coordinate.x, this.coordinate.y + this.direction))) {
            moves.push(new Move(this, this.coordinate, new Coordinate(this.coordinate.x, this.coordinate.y + this.direction)));
        }

        if (this.coordinate.y === this.startRow) {
            if (board.coordinateIsEmpty(new Coordinate(this.coordinate.x, this.coordinate.y + 2 * this.direction))) {
                moves.push(new Move(this, this.coordinate, new Coordinate(this.coordinate.x, this.coordinate.y + 2 * this.direction)));
            }
        }

        if (!board.coordinateIsEmpty(new Coordinate(this.coordinate.x + 1, this.coordinate.y + this.direction))) {
            moves.push(new Move(this, this.coordinate, new Coordinate(this.coordinate.x + 1, this.coordinate.y + this.direction)))
        }

        if (!board.coordinateIsEmpty(new Coordinate(this.coordinate.x - 1, this.coordinate.y + this.direction))) {
            moves.push(new Move(this, this.coordinate, new Coordinate(this.coordinate.x - 1, this.coordinate.y + this.direction)))
        }
        
        return moves;
    }
}