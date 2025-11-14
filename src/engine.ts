import { Board } from "./models/board";
import { Coordinate } from "./models/coordinate";
import { Move } from "./models/move";

export class ChessEngine {
  board: Board;

  constructor(board: Board) {
    this.board = board;
  }

  move(from: Coordinate, to: Coordinate): boolean {
    const piece = this.board.pieces.find(
      (boardPiece) =>
        boardPiece.coordinate.x === from.x && boardPiece.coordinate.y === from.y
    );

    if (!piece) {
      return false;
    }

    const moves = piece.getDefaultMoves(this.board)

    if (moves.includes(new Move(piece, from, to))) {
        piece.coordinate = to;
    }

    return true;
  }
}
