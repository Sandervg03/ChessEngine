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
│   ├── engine.ts              # Main engine class (game logic coordinator)
│   ├── models/
│   │   ├── board.ts           # Board representation
│   │   ├── coordinate.ts      # Coordinate system
│   │   └── move.ts            # Move representation
│   └── pieces/
│       ├── piece.ts           # Piece interface
│       ├── pawn.ts            # Pawn implementation
│       ├── rook.ts            # Rook implementation (planned)
│       ├── knight.ts          # Knight implementation (planned)
│       ├── bishop.ts          # Bishop implementation (planned)
│       ├── queen.ts           # Queen implementation (planned)
│       └── king.ts            # King implementation (planned)
└── README.md                  # This file
```

## 🚀 Getting Started

### Installation

#### NPM Package

```bash
npm install chess-engine
```

#### From Source

```bash
# Clone the repository
git clone <repository-url>
cd ChessEngine
npm install
npm run build
```

### Usage

```typescript
import { ChessEngine, Board, Coordinate } from "chess-engine";

// Create a board with pieces
const board = new Board([
  /* your pieces */
]);

// Create the engine
const engine = new ChessEngine(board);

// Make a move
const from = new Coordinate(1, 1);
const to = new Coordinate(1, 3);
const success = engine.move(from, to);
```

## 📚 Key Features

### Implemented

- ✅ Board representation with coordinate system
- ✅ Piece interface and base structure
- ✅ Pawn movement logic (forward moves, captures, initial double-step)
- ✅ Move generation framework

### Planned

- ⏳ Complete all piece types (Rook, Knight, Bishop, Queen, King)
- ⏳ Move validation (check detection, illegal move filtering)
- ⏳ Special moves (castling, en passant, pawn promotion)
- ⏳ Game state detection (check, checkmate, stalemate)
- ⏳ Move history and undo functionality
- ⏳ FEN notation support
- ⏳ UCI protocol support (for integration with chess GUIs)

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
