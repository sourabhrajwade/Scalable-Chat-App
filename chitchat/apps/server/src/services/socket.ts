import { Server } from "socket.io";
import { Redis } from "ioredis";

// const pub = new Redis(7001, "172.25.0.4");
// const sub = new Redis(7002, "172.25.0.4");


class SocketService {
    private _io_server: Server;
    constructor() {
        console.log("Socket is connected");
        this._io_server = new Server({
            cors: {
                allowedHeaders: ["*"],
                origin: "*"
            }
        });
    }

    public initEventListener() {
        console.log("socket listerner is ready")
        const io = this.io;
        io.on("connect", (socket) => {
            console.log("New Socket connected", socket.id);
           
            socket.on("event:message", async ({message}: {message: string} ) => {
                console.log("New Message recieved ", message);
            });
        });
    }

    get io() {
        return this._io_server;
    }
}

export default SocketService;