import { King } from '../pieces/king';
import { Pawn } from '../pieces/pawn';
import { Piece } from '../pieces/piece';
import { Rook } from '../pieces/rook';
import { Knight } from '../pieces/knight';
import { Bishop } from '../pieces/bishop';
import { Queen } from '../pieces/queen';
import { Coordinate } from './coordinate';
import { Move } from './move';
import { PieceColor } from './pieceColor';
import { Promotion, SpecialMove } from './specialMove';

export class Board {
  private _pieces: Piece[];
  private _xSize: number;
  private _ySize: number;

  constructor(pieces: Piece[], xSize: number = 8, ySize: number = 8) {
    this._pieces = pieces;
    this._xSize = xSize;
    this._ySize = ySize;
  }

  public coordinateIsEmpty(coordinate: Coordinate): boolean {
    return !this._pieces.some(
      (piece) => piece.coordinate.x === coordinate.x && piece.coordinate.y === coordinate.y,
    );
  }

  public getPieceAt(coordinate: Coordinate): Piece | undefined {
    return this._pieces.find(
      (piece) => piece.coordinate.x === coordinate.x && piece.coordinate.y === coordinate.y,
    );
  }

  public removePiece(coordinate: Coordinate): boolean {
    const piece = this.getPieceAt(coordinate);
    if (!piece) {
      return false;
    }
    const index = this._pieces.indexOf(piece);
    this._pieces.splice(index, 1);
    return true;
  }

  public promotePawn(move: Move, promotion: Promotion): boolean {
    if (!(move.piece instanceof Pawn)) {
      return false;
    }

    const isWhitePromotion = move.piece.color === PieceColor.white && move.to.y === this.ySize;
    const isBlackPromotion = move.piece.color === PieceColor.black && move.to.y === 1;

    if (!isWhitePromotion && !isBlackPromotion) {
      return false;
    }

    this.removePiece(move.to);

    let promotedPiece: Piece;
    switch (promotion) {
      case SpecialMove.PromoteQueen:
        promotedPiece = new Queen(move.piece.color, move.to);
        break;
      case SpecialMove.PromoteRook:
        promotedPiece = new Rook(move.piece.color, move.to);
        break;
      case SpecialMove.PromoteBishop:
        promotedPiece = new Bishop(move.piece.color, move.to);
        break;
      case SpecialMove.PromoteKnight:
        promotedPiece = new Knight(move.piece.color, move.to);
        break;
      default:
        return false;
    }

    this._pieces.push(promotedPiece);
    return true;
  }

  public isKingChecked(piece: Piece, previousMoves: Move[], lastMove: Move): boolean {
    const king = this.pieces.find(
      (p) => p.color === piece.color && p instanceof King,
    ) as King;

    return king ? king.checkingPieces(this, previousMoves, lastMove).length > 0 : false;
  }

  public get xSize(): number {
    return this._xSize;
  }

  public get ySize(): number {
    return this._ySize;
  }

  public get pieces(): Piece[] {
    return this._pieces;
  }
}