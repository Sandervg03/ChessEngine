import { Board } from '../models/board';
import { Coordinate } from '../models/coordinate';
import { Move } from '../models/move';
import { PieceColor } from '../models/pieceColor';
import { PieceName } from '../models/pieceName';
import { Piece } from './piece';

export class Bishop extends Piece {
  constructor(color: PieceColor, coordinate: Coordinate) {
    super(color, coordinate, PieceName.bishop);
  }

  public getDefaultMoves(board: Board, lastMove?: Move): Move[] {
    const moves: Move[] = [];

    let x = this.coordinate.x;
    let y = this.coordinate.y;

    while (x > 0 && x <= board.xSize && y > 0 && y <= board.ySize) {
      moves.push(new Move(this, this.coordinate, new Coordinate(x, y)));
      if (board.getPieceAt(new Coordinate(x, y))) {
        break;
      }
      x++;
      y++;
    }

    x = this.coordinate.x;
    y = this.coordinate.y;

    while (x > 0 && x <= board.xSize && y > 0 && y <= board.ySize) {
      moves.push(new Move(this, this.coordinate, new Coordinate(x, y)));
      if (board.getPieceAt(new Coordinate(x, y))) {
        break;
      }
      x--;
      y--;
    }

    x = this.coordinate.x;
    y = this.coordinate.y;

    while (x > 0 && x <= board.xSize && y > 0 && y <= board.ySize) {
      moves.push(new Move(this, this.coordinate, new Coordinate(x, y)));
      if (board.getPieceAt(new Coordinate(x, y))) {
        break;
      }
      x++;
      y--;
    }

    x = this.coordinate.x;
    y = this.coordinate.y;

    while (x > 0 && x <= board.xSize && y > 0 && y <= board.ySize) {
      moves.push(new Move(this, this.coordinate, new Coordinate(x, y)));
      if (board.getPieceAt(new Coordinate(x, y))) {
        break;
      }
      x--;
      y++;
    }

    return moves.filter((move) => {
      const targetPiece = board.getPieceAt(move.to);
      return !targetPiece || targetPiece.color !== this.color;
    });
  }
}
