import { Board } from "../models/board";
import { Coordinate } from "../models/coordinate";
import { Move } from "../models/move";
import { PieceColor } from "../models/pieceColor";
import { PieceName } from "../models/pieceName";

export interface Piece {
    color: PieceColor;
    coordinate: Coordinate;
    name: PieceName;

    getDefaultMoves(board: Board, lastMove?: Move): Move[]
}