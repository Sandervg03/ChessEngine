import { Board } from '../models/board';
import { Coordinate } from '../models/coordinate';
import { Move } from '../models/move';
import { PieceColor } from '../models/pieceColor';
import { PieceName } from '../models/pieceName';
import { Piece } from './piece';

export class Rook extends Piece {
  constructor(color: PieceColor, coordinate: Coordinate) {
    super(color, coordinate, PieceName.rook, "♖");
  }

  public getDefaultMoves(board: Board, previousMoves: Move[], lastMove?: Move): Move[] {
    const moves: Move[] = [];

    const directions = [
      { directionX: 1, directionY: 0 },
      { directionX: -1, directionY: 0 },
      { directionX: 0, directionY: 1 },
      { directionX: 0, directionY: -1 },
    ];

    for (const { directionX, directionY } of directions) {
      let x = this.coordinate.x + directionX;
      let y = this.coordinate.y + directionY;

      while (x >= 1 && x <= board.xSize && y >= 1 && y <= board.ySize) {
        const target = new Coordinate(x, y);
        const piece = board.getPieceAt(target);

        if (piece && piece.color === this.color) break;

        moves.push(new Move(this, this.coordinate, target));

        if (piece) break;

        x += directionX;
        y += directionY;
      }
    }

    return moves;
  }
}
