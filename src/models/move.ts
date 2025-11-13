import { Piece } from "../pieces/piece";
import { Coordinate } from "./coordinate";

export class Move {
    private _piece: Piece;
    private _from: Coordinate;
    private _to: Coordinate;

    constructor(piece: Piece, from: Coordinate, to: Coordinate) {
        this._piece = piece;
        this._from = from;
        this._to = to;
    }

    public get piece(): Piece {
        return this._piece;
    }

    public get from(): Coordinate {
        return this._from;
    }

    public get to(): Coordinate {
        return this._to;
    }
}