import {Kafka, Producer} from "kafkajs";
import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient({ log: ['query', 'info'] })
const kafka = new Kafka({
    brokers: [""],
    ssl: {
        ca: [fs.readFileSync('./ca.pem', 'utf-8')]
    },
    sasl: {
        username: '',
        password: '',
        mechanism: "plain"
    }
});

let producer: null | Producer = null;

export async function createProducer() {
    if (producer) return producer;
    // local producer to cache producer/ reusable producer
    const _producer = kafka.producer();
    await _producer.connect();
    producer = _producer
    return producer;
}

export async function produceMessage(message:string) {
    const producer = await createProducer();
    console.log("message in producer", )
    await producer.send({
        messages: [{ key: `message-${Date.now()}`, value: message }],
        topic: "MESSAGES",
      });
    console.log("message in producer", message )
    return true;
}

export async function startMessageConsumer() {
    const consumer = kafka.consumer({groupId: "default"});
    await consumer.connect();
    await consumer.subscribe({topic: "MESSAGES", fromBeginning: true});

    await consumer.run({
        autoCommit: true, 
        eachMessage: async ({message, pause}) => {
            if (!message.value) return;
            console.log('message rec on kafka consumer');
            try {
                await prisma.message.create({
                    data: {
                        text: message.value?.toString()
                    }
                })
            } catch (error) {
               pause() 
               setTimeout(() => {consumer.resume([{topic:"MESSAGES"}])}, 60*1000)
            }
        }
    })
}

export default kafka;