import { Server } from "socket.io";
import { Redis } from "ioredis";

const pub = new Redis({
    host: 'localhost',
    port: 6379,
    username: "default",
    password: "password123"
});
const sub = new Redis({
    host: 'localhost',
    port: 6379,
    username: "default",
    password: "password123"
});


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
        sub.subscribe("MESSAGES");
    }

    public initEventListener() {
        console.log("socket listerner is ready")
        const io = this.io;
        io.on("connect", (socket) => {
            console.log("New Socket connected", socket.id);
           
            socket.on("event:message", async ({message}: {message: string} ) => {
                console.log("New Message recieved ", message);
                // publish on redis
                await pub.publish("MESSAGES", JSON.stringify({message}))
            });
        });

        sub.on('message', (channel, message) => {
            if (channel === "MESSAGE") {
                io.emit("message", message);
            }
        })
    }

    get io() {
        return this._io_server;
    }
}

export default SocketService;