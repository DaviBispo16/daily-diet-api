import { FastifyRequest, FastifyReply } from "fastify";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function checkSessionId(request: FastifyRequest, reply: FastifyReply) {
    const cookies = request.cookies.sessionId;
    if (!cookies) {
        reply.status(401).send({ message: "Unauthorized" })
    }
    const findUser = await prisma.user.findFirst({
        where: {
            sessionId: cookies
        }
    })
    if (!findUser) {
        reply.status(404).send({ message: "User not found" })
    }
}