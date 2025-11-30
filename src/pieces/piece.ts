import { Board } from '../models/board';
import { Coordinate } from '../models/coordinate';
import { Move } from '../models/move';
import { PieceColor } from '../models/pieceColor';
import { PieceName } from '../models/pieceName';

export abstract class Piece {
  color: PieceColor;
  coordinate: Coordinate;
  name: PieceName;
  icon: string;

  constructor(color: PieceColor, coordinate: Coordinate, name: PieceName, icon: string) {
    (this.color = color), (this.coordinate = coordinate), (this.name = name), (this.icon = icon);
  }

  clone(): Piece {
    const copy = Object.create(this.constructor.prototype);
    Object.assign(copy, this);
    copy.coordinate = new Coordinate(this.coordinate.x, this.coordinate.y);
    return copy;
  }

  abstract getDefaultMoves(board: Board, previousMoves: Move[], lastMove?: Move): Move[];
}
