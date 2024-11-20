import type { GameState } from "../schema/StateSchema";
import type { User } from "../schema/UserSchema";

interface ServerToClientEvents {
    "init": (user: User) => void;
    "state-update": (state: GameState) => void;
    "error": (message: string) => void;
}
  
interface ClientToServerEvents {
    "roll": () => void;
    "request-state": () => void;
}

export type { ServerToClientEvents, ClientToServerEvents };