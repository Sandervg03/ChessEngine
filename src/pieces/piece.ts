import { Board } from "../models/board";
import { Coordinate } from "../models/coordinate";
import { Move } from "../models/move";

export interface Piece {
    color: string;
    coordinate: Coordinate;
    name: string;

    getDefaultMoves(board: Board): Move[]
}