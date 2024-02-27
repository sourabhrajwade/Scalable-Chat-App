require('dotenv').config()
import { Server } from "socket.io";
import { Redis } from "ioredis";
import prismaClient from "./prisma";
import {produceMessage, startMessageConsumer} from "./kafka"

const pub = new Redis({
    host: "localhost",
    port: 6379,
    username: "default",
    password: process.env.REDIS_PASSWORD,
  });
  
  const sub = new Redis({
    host: "localhost",
    port: 6379,
    username: "default",
    password: process.env.REDIS_PASSWORD,
  });
  

class SocketService {
    private _io: Server;
    constructor() {
        console.log("Socket is connected");
        this._io = new Server({
            cors: {
                allowedHeaders: ["*"],
                origin: "*"
            }
        });
        sub.subscribe("MESSAGES");
    }

    get io() {
        return this._io;
    }
    public initEventListener() {
        const io = this.io;
        console.log("socket listerner is ready")
        io.on("connect", (socket) => {
            console.log("New Socket connected", socket.id);
           
            socket.on("event:message", async ({message}: {message: string} ) => {
                console.log("New Message recieved ", message);
                // publish on redis
                await pub.publish("MESSAGES", JSON.stringify({ message }));
            });
        });
       
        sub.on('message', async (channel, message) => {
            if (channel === "MESSAGES") {
                console.log("new message from redis", message);
                io.emit("message", message);
               await produceMessage(message);
               console.log("messages produced to Kafka broker")
            }
        })
    }

}

export default SocketService;