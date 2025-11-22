import { Board } from '../models/board';
import { Coordinate } from '../models/coordinate';
import { Move } from '../models/move';
import { PieceColor } from '../models/pieceColor';
import { PieceName } from '../models/pieceName';
import { SpecialMove } from '../models/specialMove';
import { Piece } from './piece';

export class Pawn extends Piece {
  public get direction(): number {
    return this.color === PieceColor.white ? 1 : -1;
  }

  public get startRow(): number {
    return this.color === PieceColor.white ? 2 : 7;
  }

  constructor(color: PieceColor, coordinate: Coordinate) {
    super(color, coordinate, PieceName.pawn);
  }

  public getDefaultMoves(board: Board, lastMove?: Move): Move[] {
    const moves: Move[] = [];

    const forwardCoord = new Coordinate(this.coordinate.x, this.coordinate.y + this.direction);
    const isWithinBounds =
      this.color === PieceColor.white ? forwardCoord.y <= 8 : forwardCoord.y >= 1;

    if (board.coordinateIsEmpty(forwardCoord) && isWithinBounds) {
      moves.push(new Move(this, this.coordinate, forwardCoord));
    }

    if (this.coordinate.y === this.startRow) {
      const intermediateCoord = new Coordinate(
        this.coordinate.x,
        this.coordinate.y + this.direction,
      );
      const doubleStepCoord = new Coordinate(
        this.coordinate.x,
        this.coordinate.y + 2 * this.direction,
      );
      if (board.coordinateIsEmpty(intermediateCoord) && board.coordinateIsEmpty(doubleStepCoord)) {
        moves.push(new Move(this, this.coordinate, doubleStepCoord));
      }
    }

    const rightCaptureCoord = new Coordinate(
      this.coordinate.x + 1,
      this.coordinate.y + this.direction,
    );
    const rightPiece = board.getPieceAt(rightCaptureCoord);
    if (rightPiece && rightPiece.color !== this.color) {
      moves.push(new Move(this, this.coordinate, rightCaptureCoord));
    }

    const leftCaptureCoord = new Coordinate(
      this.coordinate.x - 1,
      this.coordinate.y + this.direction,
    );
    const leftPiece = board.getPieceAt(leftCaptureCoord);
    if (leftPiece && leftPiece.color !== this.color) {
      moves.push(new Move(this, this.coordinate, leftCaptureCoord));
    }

    if (
      lastMove?.piece instanceof Pawn &&
      lastMove.piece.color !== this.color &&
      lastMove.to.y === this.coordinate.y &&
      lastMove.from.y === lastMove.piece.startRow &&
      lastMove.to.y - lastMove.from.y === lastMove.piece.direction * 2 &&
      (lastMove.to.x === this.coordinate.x + 1 || lastMove.to.x === this.coordinate.x - 1)
    ) {
      moves.push(
        new Move(
          this,
          this.coordinate,
          new Coordinate(lastMove.to.x, lastMove.to.y + this.direction),
          SpecialMove['en passant'],
        ),
      );
    }

    return moves;
  }
}
