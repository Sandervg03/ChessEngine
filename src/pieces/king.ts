import { Board } from "../models/board";
import { Coordinate } from "../models/coordinate";
import { Move } from "../models/move";
import { PieceColor } from "../models/pieceColor";
import { PieceName } from "../models/pieceName";
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
    const moves: Move[] = [];

    moves.push(new Move(this, this.coordinate, new Coordinate(this.coordinate.x - 1, this.coordinate.y)))
    moves.push(new Move(this, this.coordinate, new Coordinate(this.coordinate.x - 1, this.coordinate.y + 1)))
    moves.push(new Move(this, this.coordinate, new Coordinate(this.coordinate.x, this.coordinate.y + 1)))
    moves.push(new Move(this, this.coordinate, new Coordinate(this.coordinate.x + 1, this.coordinate.y + 1)))
    moves.push(new Move(this, this.coordinate, new Coordinate(this.coordinate.x + 1, this.coordinate.y)))
    moves.push(new Move(this, this.coordinate, new Coordinate(this.coordinate.x + 1, this.coordinate.y - 1)))
    moves.push(new Move(this, this.coordinate, new Coordinate(this.coordinate.x, this.coordinate.y - 1)))
    moves.push(new Move(this, this.coordinate, new Coordinate(this.coordinate.x - 1, this.coordinate.y - 1)))

    return moves.filter(move => move.to.x > 0 && move.to.x <= board.xSize && move.to.y > 0 && move.to.y <= board.ySize);
  }

}
