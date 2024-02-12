import { Server } from "socket.io";
import { Redis } from "ioredis";
import prismaClient from "./prisma";
import {produceMessage, startMessageConsumer} from "./kafka"



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
                // publish on kafka
                await produceMessage(message);
               
            });
        });
       
        // sub.on('message', async (channel, message) => {
        //     if (channel === "MESSAGE") {
        //         io.emit("message", message);
        //        await produceMessage(message);
        //        console.log("messages produced to Kafka broker")
        //     }
        // })
    }

    get io() {
        return this._io_server;
    }
}

export default SocketService;