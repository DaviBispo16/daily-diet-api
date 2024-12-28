import { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";
import { z } from 'zod';
import { checkSessionId } from "../middlewares/checkSessionId";

const prisma = new PrismaClient();

export function mealRoutes(app: FastifyInstance) {
    app.post("/", async (request, reply) => {
        const cookies = request.cookies.sessionId;
        const schemaMeal = z.object({
            name: z.string(),
            description: z.string(),
            diet: z.boolean()
        }).parse(request.body);

        const { name, description, diet } = schemaMeal;
        await prisma.meal.create({
            data: {
                name,
                description,
                createdAt: new Date(),
                diet,
                sessionId: cookies
            }
        })
        reply.status(200).send();
    })

    app.get("/", {
        preHandler: [checkSessionId]
    }, async (request, reply) => {
        const cookies = request.cookies.sessionId;
        const meals = await prisma.meal.findMany({
            where: {
                sessionId: cookies
            }
        })
        reply.status(200).send(meals);
    })

    app.get("/:id", {
        preHandler: [checkSessionId]
    }, async (request, reply) => {
        const cookies = request.cookies.sessionId;
        const schemaFindMealById = z.object({
            id: z.string()
        }).parse(request.params)
        const _id = schemaFindMealById.id;

        const meal = await prisma.meal.findFirst({
            where: {
                id: Number(_id),
                sessionId: cookies
            }
        })
        if (!meal) {
            reply.status(404).send({ message: "Meal not found" });
        }
        reply.status(200).send(meal);
    })

    app.put("/:id", {
        preHandler: [checkSessionId]
    }, async (request, reply) => {
        const cookies = request.cookies.sessionId;
        const schemaFindMealById = z.object({
            id: z.string()
        }).parse(request.params)
        const _id = schemaFindMealById.id;

        const schemaMeal = z.object({
            name: z.string(),
            description: z.string(),
            diet: z.boolean()
        }).parse(request.body);
        const { name, description, diet } = schemaMeal;
        const updateMeal = await prisma.meal.update({
            where: {
                id: Number(_id),
                sessionId: cookies
            }, data: {
                name,
                description,
                diet,
                sessionId: cookies
            }
        });
        if (!updateMeal) {
            reply.status(404).send({ message: "Meal not found" })
        }
        reply.status(201).send(updateMeal);
    })

    app.delete("/:id", {
        preHandler: [checkSessionId]
    }, async (request, reply) => {
        const cookies = request.cookies.sessionId;
        const schemaFindMealById = z.object({
            id: z.string()
        }).parse(request.params)
        const _id = schemaFindMealById.id;

        const message = await prisma.meal.delete({
            where: {
                id: Number(_id),
                sessionId: cookies
            }
        })

        reply.status(204).send();
    })

    app.get("/summary", {
        preHandler: [checkSessionId]
    }, async (request, reply) => {
        const cookies = request.cookies.sessionId;
        const sumTotalOfMeals = await prisma.meal.count({ where: { sessionId: cookies } });
        const totalOfMealsIntoDiet = await prisma.meal.count({ where: { diet: true, sessionId: cookies } });
        const totalOfMealsWithoutDiet = await prisma.meal.count({ where: { diet: false, sessionId: cookies } });

        reply.status(200).send({ sumTotalOfMeals, totalOfMealsIntoDiet, totalOfMealsWithoutDiet });
    }
    )
}
