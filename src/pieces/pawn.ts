import { Board } from "../models/board";
import { Coordinate } from "../models/coordinate";
import { Move } from "../models/move";
import { Piece } from "./piece";

export class Pawn implements Piece {
  private _color!: string;
  private _coordinate!: Coordinate;
  private _name: string;

  public get direction(): number {
    return this.color === "white" ? 1 : -1;
  }

  public get startRow(): number {
    return this.color === "white" ? 2 : 7;
  }

  constructor(color: string, coordinate: Coordinate) {
    this.color = color;
    this.coordinate = coordinate;
    this._name = "pawn";
  }

  public get color(): string {
    return this._color;
  }

  public get coordinate(): Coordinate {
    return this._coordinate;
  }

  public get name(): string {
    return this._name;
  }

  private set color(color: string) {
    this._color = color;
  }

  private set coordinate(coordinate: Coordinate) {
    this._coordinate = coordinate;
  }

  public getDefaultMoves(board: Board, lastMove?: Move): Move[] {
    const moves: Move[] = [];

    if (
      board.coordinateIsEmpty(
        new Coordinate(this.coordinate.x, this.coordinate.y + this.direction)
      )
    ) {
      moves.push(
        new Move(
          this,
          this.coordinate,
          new Coordinate(this.coordinate.x, this.coordinate.y + this.direction)
        )
      );
    }

    if (this.coordinate.y === this.startRow) {
      const intermediateCoord = new Coordinate(
        this.coordinate.x,
        this.coordinate.y + this.direction
      );
      const doubleStepCoord = new Coordinate(
        this.coordinate.x,
        this.coordinate.y + 2 * this.direction
      );
      if (
        board.coordinateIsEmpty(intermediateCoord) &&
        board.coordinateIsEmpty(doubleStepCoord)
      ) {
        moves.push(new Move(this, this.coordinate, doubleStepCoord));
      }
    }

    const rightCaptureCoord = new Coordinate(
      this.coordinate.x + 1,
      this.coordinate.y + this.direction
    );
    const rightPiece = board.getPieceAt(rightCaptureCoord);
    if (rightPiece && rightPiece.color !== this.color) {
      moves.push(new Move(this, this.coordinate, rightCaptureCoord));
    }

    const leftCaptureCoord = new Coordinate(
      this.coordinate.x - 1,
      this.coordinate.y + this.direction
    );
    const leftPiece = board.getPieceAt(leftCaptureCoord);
    if (leftPiece && leftPiece.color !== this.color) {
      moves.push(new Move(this, this.coordinate, leftCaptureCoord));
    }

    if (
      lastMove?.piece.name === "pawn" &&
      lastMove.piece.color !== this.color &&
      lastMove.from.y === lastMove.piece.startRow &&
      lastMove.to.y - lastMove.from.y === lastMove.piece.direction * 2 &&
      (lastMove.to.x === this.coordinate.x + 1 ||
        lastMove.to.x === this.coordinate.x - 1)
    ) {
      moves.push(new Move(this, this.coordinate, new Coordinate(lastMove.to.x, lastMove.to.y + this.direction), "en passant"));
    }
    return moves;
  }
}
