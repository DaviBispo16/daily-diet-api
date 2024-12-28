import { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";
import { z } from 'zod'
import { randomUUID } from "node:crypto";

const prisma = new PrismaClient()

export function userRoutes(app: FastifyInstance) {
    app.post("/", async (request, reply) => {
        const schemaUser = z.object({
            name: z.string(),
            email: z.string()
        }).parse(request.body)

        const { name, email } = schemaUser;
        let sessionId = request.cookies.sessionId;
        if (!sessionId) {
            sessionId = randomUUID();
            reply.cookie('sessionId', sessionId, {
                path: '/',
                maxAge: 60 * 60 * 24 * 7, // 7 days
                httpOnly: true
            })
        }
        await prisma.user.create({
            data: {
                name,
                email,
                createdAt: new Date(),
                sessionId
            }
        })
        reply.status(201).send();
    }),

        app.get("/:id", async (request, reply) => {
            const schemaFindUserById = z.object({
                id: z.string()
            }).parse(request.params)
            const _id = schemaFindUserById.id;
            const findUserById = await prisma.user.findUnique({
                where: {
                    id: Number(_id)
                }, select : {
                    name: true, email: true, sessionId: true
                }
            })
            if (!findUserById) {
                reply.status(404).send({message: "ID not found"})
            }
            reply.status(200).send(findUserById);
        })
}