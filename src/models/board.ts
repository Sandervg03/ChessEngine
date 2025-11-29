import { King } from '../pieces/king';
import { Piece } from '../pieces/piece';
import { Coordinate } from './coordinate';
import { Move } from './move';
import { PieceColor } from './pieceColor';

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

  public isKingChecked(piece: Piece, previousMoves: Move[], lastMove: Move): boolean {
    return piece.color === PieceColor.white
      ? (
          this.pieces.find(
            (piece) => piece.color === PieceColor.white && piece instanceof King,
          ) as King
        ).checkingPieces(this, previousMoves, lastMove).length > 0
        ? true
        : false
      : (
          this.pieces.find(
            (piece) => piece.color === PieceColor.black && piece instanceof King,
          ) as King
        ).checkingPieces(this, previousMoves, lastMove).length > 0
      ? true
      : false;
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
