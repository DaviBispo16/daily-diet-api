import fastify from "fastify";
import { userRoutes } from "./routes/userRoutes";
import { mealRoutes } from "./routes/mealRoutes";
import { env } from "./.env/shema";
import cookies from "@fastify/cookie"

const app = fastify();

app.register(cookies);

app.register(userRoutes, {
    prefix: "/user"
});

app.register(mealRoutes, {
    prefix: "/meal"
})

const port = env.PORT
app.listen({port: port})
.then(() => console.log(`Server started on http://localhost:${port}/`))