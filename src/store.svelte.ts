import { io, type Socket } from "socket.io-client";
import type { ClientToServerEvents, ServerToClientEvents } from "./types/events";

interface State {
    socket: Socket<ServerToClientEvents, ClientToServerEvents>;
    connected: boolean;
    username: string;
}

const global: State = $state({
    socket: null!,
    connected: false,
    username: ""
});

export default global;