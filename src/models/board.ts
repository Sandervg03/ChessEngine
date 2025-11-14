import { Piece } from "../pieces/piece";
import { Coordinate } from "./coordinate";

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
      (piece) =>
        piece.coordinate.x === coordinate.x &&
        piece.coordinate.y === coordinate.y
    );
  }

  public getPieceAt(coordinate: Coordinate): Piece | undefined {
    return this._pieces.find(
      (piece) =>
        piece.coordinate.x === coordinate.x &&
        piece.coordinate.y === coordinate.y
    );
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
