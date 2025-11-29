import { Board } from '../models/board';
import { Coordinate } from '../models/coordinate';
import { Move } from '../models/move';
import { PieceColor } from '../models/pieceColor';
import { PieceName } from '../models/pieceName';
import { Piece } from './piece';

export class Knight extends Piece {

  constructor(color: PieceColor, coordinate: Coordinate) {
    super(color, coordinate, PieceName.knight);
  }

  public getDefaultMoves(board: Board, lastMove?: Move): Move[] {
    const moves: Move[] = [];

    moves.push(new Move(this, this.coordinate, new Coordinate(this.coordinate.x + 1, this.coordinate.y + 2)))
    moves.push(new Move(this, this.coordinate, new Coordinate(this.coordinate.x + 2, this.coordinate.y + 1)))
    moves.push(new Move(this, this.coordinate, new Coordinate(this.coordinate.x + 2, this.coordinate.y - 1)))
    moves.push(new Move(this, this.coordinate, new Coordinate(this.coordinate.x + 1, this.coordinate.y - 2)))
    moves.push(new Move(this, this.coordinate, new Coordinate(this.coordinate.x - 1, this.coordinate.y + 2)))
    moves.push(new Move(this, this.coordinate, new Coordinate(this.coordinate.x - 2, this.coordinate.y + 1)))
    moves.push(new Move(this, this.coordinate, new Coordinate(this.coordinate.x - 2, this.coordinate.y - 1)))
    moves.push(new Move(this, this.coordinate, new Coordinate(this.coordinate.x - 1, this.coordinate.y - 2)))

    return moves.filter(move => {
        const targetPiece = board.getPieceAt(move.to);
        return !targetPiece || targetPiece.color !== this.color;
      })
  }
}
