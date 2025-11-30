import { Board } from './models/board';
import { Coordinate } from './models/coordinate';
import { GameState } from './models/gameState';
import { Move } from './models/move';
import { PieceColor } from './models/pieceColor';
import { SpecialMove } from './models/specialMove';
import { Pawn } from './pieces/pawn';
import { Piece } from './pieces/piece';
import { Rook } from './pieces/rook';

export class ChessEngine {
  board: Board;
  previousMoves: Move[] = [];
  gameState: GameState;

  get previousMove(): Move | undefined {
    return this.previousMoves[this.previousMoves.length - 1];
  }

  constructor(board: Board) {
    this.board = board;
    this.gameState = GameState.playing;
  }

  move(move: Move): boolean {
    if (this.gameState !== GameState.playing) {
      return false;
    }

    const piece = this.board.getPieceAt(move.from);

    if (!this.previousMove && piece?.color !== PieceColor.white) {
      return false;
    }

    if (this.previousMove?.piece.color === piece?.color) {
      return false;
    }

    if (!piece) {
      return false;
    }

    const moves = piece.getDefaultMoves(this.board, this.previousMoves, this.previousMove);

    const isValidMove = moves.some(
      (validMove) =>
        validMove.from.x === move.from.x &&
        validMove.from.y === move.from.y &&
        validMove.to.x === move.to.x &&
        validMove.to.y === move.to.y,
    );

    const pickedMove = moves.find(
      (pickedMove) =>
        pickedMove.from.x === move.from.x &&
        pickedMove.from.y === move.from.y &&
        pickedMove.to.x === move.to.x &&
        pickedMove.to.y === move.to.y,
    );

    if (isValidMove) {
      if (pickedMove?.special === SpecialMove.castle) {
        if (!this.canCastle(pickedMove)) {
          return false;
        }
      }

      const simulatedBoard: Board = this.simulateMove(pickedMove!);

      if (simulatedBoard.isKingChecked(piece, this.previousMoves, pickedMove!)) {
        return false;
      }

      if (pickedMove?.special === SpecialMove.enPassant && pickedMove.piece instanceof Pawn) {
        this.board.removePiece(new Coordinate(move.to.x, move.to.y - pickedMove.piece.direction));
      }

      if (pickedMove?.special === SpecialMove.castle) {
        const direction = move.to.x > move.from.x ? 1 : -1;
        const rookFromX = direction === 1 ? this.board.xSize : 1;
        const rookToX = move.to.x - direction;

        const rook = this.board.getPieceAt(new Coordinate(rookFromX, move.from.y));
        if (rook) {
          rook.coordinate = new Coordinate(rookToX, move.from.y);
        } else {
          return false;
        }
      }

      if (this.board.getPieceAt(move.to)) {
        this.board.removePiece(move.to);
      }

      piece.coordinate = move.to;
      this.previousMoves.push(new Move(piece, move.from, move.to));

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

    const moves: Move[] = piece.getDefaultMoves(this.board, this.previousMoves, this.previousMove);

    let validMoves: Move[] = moves.filter((move) => {
      if (move.special === SpecialMove.castle) {
        if (!this.canCastle(move)) {
          return false;
        }
      }

      const simulatedBoard: Board = this.simulateMove(move);

      return !simulatedBoard.isKingChecked(piece, this.previousMoves, move);
    });

    return validMoves.map((move) => new Coordinate(move.to.x, move.to.y));
  }

  private canCastle(move: Move): boolean {
    const from = move.from;
    const to = move.to;
    const direction = to.x > from.x ? 1 : -1;

    if (this.board.isKingChecked(move.piece, this.previousMoves, this.previousMove!)) {
      return false;
    }

    const rookX = direction === 1 ? this.board.xSize : 1;
    const rookCoord = new Coordinate(rookX, from.y);
    const rookPiece = this.board.getPieceAt(rookCoord);

    if (!(rookPiece instanceof Rook && rookPiece.color === move.piece.color)) {
      return false;
    }

    let currentX = from.x + direction;
    while (currentX !== rookX) {
      const checkCoord = new Coordinate(currentX, from.y);

      if (!this.board.coordinateIsEmpty(checkCoord)) {
        return false;
      }

      currentX += direction;
    }

    currentX = from.x + direction;
    while (currentX !== to.x + direction) {
      const checkCoord = new Coordinate(currentX, from.y);
      const simulatedMove = new Move(move.piece, from, checkCoord);
      const simulatedBoard = this.simulateMove(simulatedMove);

      if (simulatedBoard.isKingChecked(move.piece, this.previousMoves, simulatedMove)) {
        return false;
      }

      currentX += direction;
    }

    return true;
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

    if (move.special === SpecialMove.enPassant && pieceToMove instanceof Pawn) {
      clonedBoard.removePiece(new Coordinate(move.to.x, move.to.y - pieceToMove.direction));
    }

    pieceToMove.coordinate = new Coordinate(move.to.x, move.to.y);

    return clonedBoard;
  }

  public confirmGameState(): void {
    if (!this.previousMove) {
      return;
    }

    const pieces: Piece[] =
      this.previousMove.piece.color === PieceColor.white
        ? this.board.pieces.filter((piece) => piece.color === PieceColor.black)
        : this.board.pieces.filter((piece) => piece.color === PieceColor.white);

    const availableCoords: Coordinate[] = pieces.flatMap((piece) =>
      this.previewMoves(piece.coordinate),
    );

    if (!this.board.isKingChecked(pieces[0], this.previousMoves, this.previousMove)) {
      if (availableCoords.length == 0) {
        this.gameState = GameState.staleMate;
      }

      return;
    }

    if (availableCoords.length == 0) {
      this.gameState =
        this.previousMove.piece.color === PieceColor.white
          ? GameState.whiteWin
          : GameState.blackWin;
    }
  }
}
