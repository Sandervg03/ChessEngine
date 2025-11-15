import { Board } from "./models/board";
import { Coordinate } from "./models/coordinate";
import { Move } from "./models/move";

export class ChessEngine {
  board: Board;
  lastMove?: Move;

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

    const moves = piece.getDefaultMoves(this.board, this.lastMove);

    const isValidMove = moves.some(
      (move) =>
        move.from.x === from.x &&
        move.from.y === from.y &&
        move.to.x === to.x &&
        move.to.y === to.y
    );

    if (isValidMove) {
      if (this.board.getPieceAt(to)) {
        this.board.removePiece(to)
      }
      piece.coordinate = to;
      this.lastMove = new Move(piece, from, to)
      return true;
    }

    return false;
  }
}
