import { Board } from '../models/board';
import { Coordinate } from '../models/coordinate';
import { Move } from '../models/move';
import { PieceColor } from '../models/pieceColor';
import { PieceName } from '../models/pieceName';
import { Piece } from './piece';

export class Knight extends Piece {

  constructor(color: PieceColor, coordinate: Coordinate) {
    super(color, coordinate, PieceName.knight, "♘");
  }

  public getDefaultMoves(board: Board, previousMoves: Move[], lastMove?: Move): Move[] {
    const moves: Move[] = [];

    moves.push(new Move(this, this.coordinate, new Coordinate(this.coordinate.x + 1, this.coordinate.y + 2)))
    moves.push(new Move(this, this.coordinate, new Coordinate(this.coordinate.x + 2, this.coordinate.y + 1)))
    moves.push(new Move(this, this.coordinate, new Coordinate(this.coordinate.x + 2, this.coordinate.y - 1)))
    moves.push(new Move(this, this.coordinate, new Coordinate(this.coordinate.x + 1, this.coordinate.y - 2)))
    moves.push(new Move(this, this.coordinate, new Coordinate(this.coordinate.x - 1, this.coordinate.y + 2)))
    moves.push(new Move(this, this.coordinate, new Coordinate(this.coordinate.x - 2, this.coordinate.y + 1)))
    moves.push(new Move(this, this.coordinate, new Coordinate(this.coordinate.x - 2, this.coordinate.y - 1)))
    moves.push(new Move(this, this.coordinate, new Coordinate(this.coordinate.x - 1, this.coordinate.y - 2)))

    const inBoundMoves: Move[] = moves.filter(move => move.to.x > 0 && move.to.x <= board.xSize && move.to.y > 0 && move.to.y <= board.ySize);

    return inBoundMoves.filter(move => {
        const targetPiece = board.getPieceAt(move.to);
        return !targetPiece || targetPiece.color !== this.color;
      })
  }
}
