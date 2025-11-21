import { Board } from "../models/board";
import { Coordinate } from "../models/coordinate";
import { Move } from "../models/move";
import { Piece } from "./piece";

export class King implements Piece {
  private _color!: PieceColor;
  private _coordinate!: Coordinate;
  private _name: PieceName;

  constructor(color: PieceColor, coordinate: Coordinate) {
    this.color = color;
    this.coordinate = coordinate;
    this._name = PieceName.king;
  }

  public get color(): PieceColor {
    return this._color;
  }

  public get coordinate(): Coordinate {
    return this._coordinate;
  }

  public get name(): PieceName {
    return this._name;
  }

  private set color(color: PieceColor) {
    this._color = color;
  }

  private set coordinate(coordinate: Coordinate) {
    this._coordinate = coordinate;
  }

  checkingPieces(board: Board, lastMove?: Move): Piece[] {
    const checkingPieces: Piece[] = [];

    for (const piece of board.pieces) {
      if (piece.color !== this.color) {
        const pieceMoves: Move[] = piece.getDefaultMoves(board, lastMove);
        for (const move of pieceMoves) {
          if (move.to.x === this.coordinate.x && move.to.y === this.coordinate.y) {
            checkingPieces.push(piece)
          }
        }
      }
    }

    return checkingPieces;
  }

  getDefaultMoves(board: Board, lastMove?: Move): Move[] {
    throw new Error("Method not implemented.");
  }

}
