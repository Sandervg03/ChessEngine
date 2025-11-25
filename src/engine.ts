import { Board } from './models/board';
import { Coordinate } from './models/coordinate';
import { GameState } from './models/gameState';
import { Move } from './models/move';
import { PieceColor } from './models/pieceColor';
import { SpecialMove } from './models/specialMove';
import { Pawn } from './pieces/pawn';
import { Piece } from './pieces/piece';

export class ChessEngine {
  board: Board;
  lastMove?: Move;
  gameState: GameState;

  constructor(board: Board) {
    this.board = board;
    this.gameState = GameState.playing;
  }

  move(from: Coordinate, to: Coordinate): boolean {
    if (this.gameState !== GameState.playing) {
      return false;
    }

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

      if (simulatedBoard.isKingChecked(piece, pickedMove!)) {
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

      this.confirmGameState();

      return true;
    }

    return false;
  }

  previewMoves(from: Coordinate): Coordinate[] {
    if (this.gameState !== GameState.playing) {
      return [];
    }

    const piece = this.board.getPieceAt(from);

    if (!piece) {
      return [];
    }

    const moves: Move[] = piece.getDefaultMoves(this.board, this.lastMove);

    let validMoves: Move[] = moves.filter((move) => {
      const simulatedBoard: Board = this.simulateMove(move);

      return !simulatedBoard.isKingChecked(piece, move);
    });

    return validMoves.map((move) => new Coordinate(move.to.x, move.to.y));
  }

  simulateMove(move: Move): Board {
    const clonedPieces = this.board.pieces.map((p) => p.clone());

    const clonedBoard = new Board(clonedPieces, this.board.xSize, this.board.ySize);
    const pieceToMove = clonedBoard.getPieceAt(move.from);

    if (!pieceToMove) {
      throw new Error('SimulateMove: piece not found on cloned board');
    }

    const targetPiece = clonedBoard.getPieceAt(move.to);
    if (targetPiece) {
      clonedBoard.removePiece(move.to);
    }

    if (move.special === SpecialMove['en passant'] && pieceToMove instanceof Pawn) {
      clonedBoard.removePiece(new Coordinate(move.to.x, move.to.y - pieceToMove.direction));
    }

    pieceToMove.coordinate = new Coordinate(move.to.x, move.to.y);

    return clonedBoard;
  }

  public confirmGameState(): void {
    if (!this.lastMove) {
      return;
    }

    const pieces: Piece[] =
      this.lastMove.piece.color === PieceColor.white
        ? this.board.pieces.filter((piece) => piece.color === PieceColor.black)
        : this.board.pieces.filter((piece) => piece.color === PieceColor.white);

    const availableCoords: Coordinate[] = pieces.flatMap((piece) =>
      this.previewMoves(piece.coordinate),
    );

    if (!this.board.isKingChecked(pieces[0], this.lastMove)) {
      if (availableCoords.length == 0) {
        this.gameState = GameState.staleMate;
      }

      return;
    }

    if (availableCoords.length == 0) {
      this.gameState = this.lastMove.piece.color === PieceColor.white ? GameState.whiteWin : GameState.blackWin
    };
  }
}
