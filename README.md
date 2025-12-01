# Chess Engine

A modern, object-oriented chess engine built with TypeScript, designed with clean architecture principles and separation of concerns.

## 🎯 Project Goal

This project aims to build a fully-functional chess engine that can:

- **Validate chess moves** according to all standard chess rules
- **Generate legal moves** for any position on the board
- **Detect game states** such as check, checkmate, and stalemate
- **Support all special moves** including castling, en passant, and pawn promotion
- **Provide a clean, maintainable codebase** that's easy to extend and test

The engine is designed to serve as the core logic for chess applications, whether for human vs. human games, human vs. computer games, or computer vs. computer simulations.

## 🏗️ Architecture

This chess engine follows a **hybrid architecture** that elegantly separates piece-level logic from game-level logic:

### Piece Responsibilities

- Each piece (Pawn, Rook, Knight, Bishop, Queen, King) knows its own **movement patterns**
- Pieces generate **candidate moves** based on their specific rules
- Pieces check for basic constraints (blocking, board boundaries)

### Engine Responsibilities

- The `Engine` class maintains the **board state** and **game state**
- Filters candidate moves to remove illegal ones (e.g., moves that put own king in check)
- Validates **game-level rules** (turn order, castling rights, en passant)
- Detects **check, checkmate, and stalemate**

This separation ensures:

- ✅ **Maintainability**: Clear responsibilities for each component
- ✅ **Testability**: Piece movement patterns can be tested independently
- ✅ **Extensibility**: Easy to add new pieces or modify rules
- ✅ **Performance**: Each layer can be optimized separately

## 📁 Project Structure

```
ChessEngine/
├── src/
│   ├── index.ts               # Index file exporting needed classes
│   ├── engine.ts              # Main engine class (game logic coordinator)
│   ├── models/
│   │   ├── board.ts           # Board representation
│   │   ├── coordinate.ts      # Coordinate class
│   │   ├── gameState.ts       # Gamestate enum
│   │   ├── move.ts            # Move class
│   │   ├── pieceColor.ts      # Piececolor enum
│   │   ├── pieceName.ts       # Piecename enum
│   │   └── specialMove.ts     # Specialmove enum
│   ├── pieces/
│   │   ├── piece.ts           # Piece interface
│   │   ├── pawn.ts            # Pawn implementation
│   │   ├── rook.ts            # Rook implementation
│   │   ├── knight.ts          # Knight implementation
│   │   ├── bishop.ts          # Bishop implementation
│   │   ├── queen.ts           # Queen implementation
│   │   └── king.ts            # King implementation
│   └── util/
│       └── defaultPiecesSetup.ts # The standard chess pieces setup
└── README.md                  # This file
```

## 🚀 Getting Started

### Installation

#### NPM Package

```bash
npm install ts-chess-engine
```

#### From Source

```bash
# Clone the repository
git clone https://github.com/Sandervg03/ChessEngine.git
cd ChessEngine
npm install
npm run build
```

### Usage

Initializing your board and engine
```typescript
import { ChessEngine, Board, Pawn, PieceColor } from "ts-chess-engine";

// Create a board with pieces. When you don't declare your pieces yourself, 
// the board will have the standard chess setup listed in src/util/defaultPiecesSetup.ts.
const board = new Board([
  new Pawn(PieceColor.white, new Coordinate(1, 1))
  /* your pieces */
]);

// Create the engine
const engine = new ChessEngine(board);
```

Previewing all possible moves from a piece
```typescript
engine.previewMoves(new Coordinate(1, 1))
```

Making a move
```typescript
const piece = engine.board.getPieceAt(new Coordinate(1, 1));
const from = new Coordinate(1, 1);
const to = new Coordinate(1, 3);
const success = engine.move(new Move(piece, from, to));
```

Pawn promotion
```typescript
import { SpecialMove } from "ts-chess-engine"

if (to.y === 8 /* or 1 for black */) {
  const success = engine.move(new Move(piece, from, to), SpecialMove.PromoteQueen)
}
```

Keeping track of the game
```typescript
const gamestate: GameState = engine.gameState

if (gamestate === GameState.whiteWin) {
  alert("White has won the game!")
}
```

## 🧩 Design Principles

1. **Separation of Concerns**: Piece logic vs. game logic
2. **Single Responsibility**: Each class has one clear purpose
3. **Open/Closed Principle**: Easy to extend without modifying existing code
4. **Type Safety**: Full TypeScript support with proper interfaces
5. **Testability**: Architecture designed for easy unit testing

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**Built with ❤️ using TypeScript**
