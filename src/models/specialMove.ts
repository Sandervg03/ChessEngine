export enum SpecialMove {
    EnPassant = "enPassant",
    Castle = "castle",
    PromoteRook = "promoteRook",
    PromoteKnight = "promoteKnight",
    PromoteBishop = "promoteBishop",
    PromoteQueen = "promoteQueen"
}

export type Promotion = 
    | SpecialMove.PromoteRook
    | SpecialMove.PromoteKnight
    | SpecialMove.PromoteBishop
    | SpecialMove.PromoteQueen;