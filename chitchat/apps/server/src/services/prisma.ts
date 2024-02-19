import { PrismaClient, PrismaPromise } from "@prisma/client";

const prismaClient = new PrismaClient({
    log: ["query"]
});

export default prismaClient;