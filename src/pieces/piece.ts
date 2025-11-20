import { Board } from "../models/board";
import { Coordinate } from "../models/coordinate";
import { Move } from "../models/move";

export interface Piece {
    color: PieceColor;
    coordinate: Coordinate;
    name: PieceName;
    
    startRow: number;
    direction: number;

    getDefaultMoves(board: Board, lastMove?: Move): Move[]
}