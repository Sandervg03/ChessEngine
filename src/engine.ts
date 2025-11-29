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

  move(from: Coordinate, to: Coordinate): boolean {
    if (this.gameState !== GameState.playing) {
      return false;
    }

    const piece = this.board.getPieceAt(from);

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
      if (pickedMove?.special === SpecialMove.castle) {
        if (!this.canCastle(pickedMove)) {
          return false;
        }
      }

      const simulatedBoard: Board = this.simulateMove(pickedMove!);

      if (simulatedBoard.isKingChecked(piece, this.previousMoves, pickedMove!)) {
        return false;
      }

      if (pickedMove?.special === SpecialMove['en passant'] && pickedMove.piece instanceof Pawn) {
        this.board.removePiece(new Coordinate(to.x, to.y - pickedMove.piece.direction));
      }

      if (pickedMove?.special === SpecialMove.castle) {
        const direction = to.x > from.x ? 1 : -1;
        const rookFromX = direction === 1 ? this.board.xSize : 1;
        const rookToX = to.x - direction;

        const rook = this.board.getPieceAt(new Coordinate(rookFromX, from.y));
        if (rook) {
          rook.coordinate = new Coordinate(rookToX, from.y);
        } else {
          return false
        }
      }

      if (this.board.getPieceAt(to)) {
        this.board.removePiece(to);
      }

      piece.coordinate = to;
      this.previousMoves.push(new Move(piece, from, to));

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

    let currentX = from.x + direction;
    const endX = to.x;

    while (currentX !== endX + direction) {
      const checkCoord = new Coordinate(currentX, from.y);

      if (!this.board.coordinateIsEmpty(checkCoord)) {
        const pieceAtSquare = this.board.getPieceAt(checkCoord);

        if (!(pieceAtSquare instanceof Rook && pieceAtSquare.color === move.piece.color)) {
          return false;
        }
      }

      if (currentX >= Math.min(from.x, to.x) && currentX <= Math.max(from.x, to.x)) {
        const simulatedMove = new Move(move.piece, from, checkCoord);
        const simulatedBoard = this.simulateMove(simulatedMove);

        if (simulatedBoard.isKingChecked(move.piece, this.previousMoves, simulatedMove)) {
          return false;
        }
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

    if (move.special === SpecialMove['en passant'] && pieceToMove instanceof Pawn) {
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
