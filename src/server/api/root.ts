import { createTRPCRouter } from "~/server/api/trpc";
import { exampleRouter } from "~/server/api/routers/example";
import { assessmentRouter } from "./routers/assessment";
import { clientRouter } from "./routers/client";
import { siteRouter } from "./routers/site";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
    example: exampleRouter,
    client: clientRouter,
    site: siteRouter,
    assessment: assessmentRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
