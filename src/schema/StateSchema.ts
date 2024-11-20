import type { User } from "./UserSchema";

enum GameStage {
    NONE = 0,
    WAITING, 
    ROLLING,
    FINISHED
}

interface GameState {
    users: User[];
    
    currentTurn: string;
    stage: GameStage;

    rolled: string[];
}

export { GameStage };
export type { GameState };