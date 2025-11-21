import { Board } from './models/board';
import { Coordinate } from './models/coordinate';
import { Move } from './models/move';
import { PieceColor } from './models/pieceColor';
import { SpecialMove } from './models/specialMove';
import { King } from './pieces/king';
import { Pawn } from './pieces/pawn';

export class ChessEngine {
  board: Board;
  lastMove?: Move;
  gameState: GameState;

  constructor(board: Board) {
    this.board = board;
    this.gameState = GameState.playing;
  }

  move(from: Coordinate, to: Coordinate): boolean {
    const piece = this.board.getPieceAt(from);

    if (!this.lastMove && piece?.color !== PieceColor.white) {
      return false;
    }

    if (this.lastMove?.piece.color === piece?.color) {
      return false;
    }

    if (!piece) {
      return false;
    }

    const moves = piece.getDefaultMoves(this.board, this.lastMove);

    const isValidMove = moves.some(
      (move) =>
        move.from.x === from.x &&
        move.from.y === from.y &&
        move.to.x === to.x &&
        move.to.y === to.y,
    );

    const pickedMove = moves.find(
      (move) =>
        move.from.x === from.x &&
        move.from.y === from.y &&
        move.to.x === to.x &&
        move.to.y === to.y,
    );

    if (isValidMove) {
      const simulatedBoard: Board = this.simulateMove(pickedMove!);

      let isKingChecked: boolean;

      piece.color === PieceColor.white
        ? (
            simulatedBoard.pieces.find(
              (piece) => piece.color === PieceColor.white && piece instanceof King,
            ) as King
          ).checkingPieces(simulatedBoard, pickedMove).length > 0
          ? (isKingChecked = true)
          : (isKingChecked = false)
        : (
            simulatedBoard.pieces.find(
              (piece) => piece.color === PieceColor.black && piece instanceof King,
            ) as King
          ).checkingPieces(simulatedBoard, pickedMove).length > 0
        ? (isKingChecked = true)
        : (isKingChecked = false);

      if (isKingChecked) {
        return false;
      }

      if (pickedMove?.special === SpecialMove['en passant'] && pickedMove.piece instanceof Pawn) {
        this.board.removePiece(new Coordinate(to.x, to.y - pickedMove.piece.direction));
      }

      if (this.board.getPieceAt(to)) {
        this.board.removePiece(to);
      }

      piece.coordinate = to;
      this.lastMove = new Move(piece, from, to);

      return true;
    }

    return false;
  }

  previewMoves(from: Coordinate): Coordinate[] {
    const piece = this.board.getPieceAt(from);

    if (!piece) {
      return [];
    }

    const moves: Move[] = piece.getDefaultMoves(this.board, this.lastMove);

    let validMoves: Move[] = moves.filter((move) => {
      const simulatedBoard: Board = this.simulateMove(move);

      let isKingChecked: boolean;

      piece.color === PieceColor.white
        ? (
            simulatedBoard.pieces.find(
              (piece) => piece.color === PieceColor.white && piece instanceof King,
            ) as King
          ).checkingPieces(simulatedBoard, move).length > 0
          ? (isKingChecked = true)
          : (isKingChecked = false)
        : (
            simulatedBoard.pieces.find(
              (piece) => piece.color === PieceColor.black && piece instanceof King,
            ) as King
          ).checkingPieces(simulatedBoard, move).length > 0
        ? (isKingChecked = true)
        : (isKingChecked = false);

      return isKingChecked;
    });

    return validMoves.map((move) => new Coordinate(move.to.x, move.to.y));
  }

  simulateMove(move: Move): Board {
    let simulationPieces = this.board.pieces;
    simulationPieces.find(
      (piece) => piece.coordinate.x === move.from.x && piece.coordinate.y === move.from.y,
    )!.coordinate = new Coordinate(move.to.x, move.to.y);

    return new Board(simulationPieces, this.board.xSize, this.board.ySize);
  }
}
