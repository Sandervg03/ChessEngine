import { Piece } from "../pieces/piece";
import { Coordinate } from "./coordinate";
import { SpecialMove } from "./specialMove";

export class Move {
    private _piece: Piece;
    private _from: Coordinate;
    private _to: Coordinate;
    private _special?: SpecialMove;

    constructor(piece: Piece, from: Coordinate, to: Coordinate, special?: SpecialMove) {
        this._piece = piece;
        this._from = from;
        this._to = to;
        this._special = special;
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

    public get special(): SpecialMove | undefined {
        return this._special
    }
}