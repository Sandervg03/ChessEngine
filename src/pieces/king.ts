import { Board } from "../models/board";
import { Coordinate } from "../models/coordinate";
import { Move } from "../models/move";
import { PieceColor } from "../models/pieceColor";
import { PieceName } from "../models/pieceName";
import { SpecialMove } from "../models/specialMove";
import { Piece } from "./piece";
import { Rook } from "./rook";

export class King extends Piece {
  
  constructor(color: PieceColor, coordinate: Coordinate) {
    super(color, coordinate, PieceName.king)
  }

  checkingPieces(board: Board, previousMoves: Move[], lastMove?: Move): Piece[] {
    const checkingPieces: Piece[] = [];

    for (const piece of board.pieces) {
      if (piece.color !== this.color) {
        const pieceMoves: Move[] = piece.getDefaultMoves(board, previousMoves, lastMove);
        for (const move of pieceMoves) {
          if (move.to.x === this.coordinate.x && move.to.y === this.coordinate.y) {
            checkingPieces.push(piece)
          }
        }
      }
    }

    return checkingPieces;
  }

  getDefaultMoves(board: Board, previousMoves: Move[], lastMove?: Move): Move[] {
    const moves: Move[] = [];

    moves.push(new Move(this, this.coordinate, new Coordinate(this.coordinate.x - 1, this.coordinate.y)))
    moves.push(new Move(this, this.coordinate, new Coordinate(this.coordinate.x - 1, this.coordinate.y + 1)))
    moves.push(new Move(this, this.coordinate, new Coordinate(this.coordinate.x, this.coordinate.y + 1)))
    moves.push(new Move(this, this.coordinate, new Coordinate(this.coordinate.x + 1, this.coordinate.y + 1)))
    moves.push(new Move(this, this.coordinate, new Coordinate(this.coordinate.x + 1, this.coordinate.y)))
    moves.push(new Move(this, this.coordinate, new Coordinate(this.coordinate.x + 1, this.coordinate.y - 1)))
    moves.push(new Move(this, this.coordinate, new Coordinate(this.coordinate.x, this.coordinate.y - 1)))
    moves.push(new Move(this, this.coordinate, new Coordinate(this.coordinate.x - 1, this.coordinate.y - 1)))

    const kingMoves: Move[] = previousMoves.filter(move => move.piece instanceof King && move.piece.color === this.color)
    const rooks: Rook[] = board.pieces.filter(piece => piece instanceof Rook && piece.color === this.color && piece.coordinate.y === this.coordinate.y)

    if (kingMoves.length === 0) {
      rooks.forEach(rook => {
        if (!previousMoves.some(move => move.piece === rook)) {
          if (rook.coordinate.x > this.coordinate.x) {
            moves.push(new Move(this, this.coordinate, new Coordinate(this.coordinate.x + 2, this.coordinate.y), SpecialMove.castle))
          }
          if (rook.coordinate.x < this.coordinate.x) {
            moves.push(new Move(this, this.coordinate, new Coordinate(this.coordinate.x - 2, this.coordinate.y), SpecialMove.castle))
          }
        }
      })
    }

    const inBoundMoves: Move[] = moves.filter(move => move.to.x > 0 && move.to.x <= board.xSize && move.to.y > 0 && move.to.y <= board.ySize);

    return inBoundMoves.filter(move => {
      const targetPiece = board.getPieceAt(move.to);
      return !targetPiece || targetPiece.color !== this.color;
    })
  }

}
