import { Hono } from "hono";
import type { Context } from "hono";
import authRoutes from "./src/routes/auth";

const app = new Hono();

app.get("/", (c: Context) => c.json({ message: "Course Selling API" }));

app.route("/auth", authRoutes);

const port = Number(process.env.PORT) || 3000;

Bun.serve({
  fetch: app.fetch,
  port,
});

console.log(`Server running at http://localhost:${port}`);
