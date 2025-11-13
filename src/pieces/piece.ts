import { Board } from "../models/board";
import { Coordinate } from "../models/coordinate";
import { Move } from "../models/move";

export interface Piece {
    color: string;
    coordinate: Coordinate;

    getDefaultMoves(board: Board): Move[]
}