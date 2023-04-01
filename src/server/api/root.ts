import { createTRPCRouter } from "~/server/api/trpc";
import { exampleRouter } from "~/server/api/routers/example";
import { assessmentRouter } from "./routers/assessment";
import { clientRouter } from "./routers/client";
import { siteRouter } from "./routers/site";
import { engagementRouter } from "./routers/engagement";
import { questionRouter } from "./routers/question";
import { filterRouter } from "./routers/filter";
import { referenceRouter } from "./routers/reference";
import { interviewGuideRouter } from "./routers/interviewguide";
import { smeRouter } from "./routers/sme";
import { ratingRouter } from "./routers/rating";

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
    engagement: engagementRouter,
    question: questionRouter,
    filter: filterRouter,
    interviewGuide: interviewGuideRouter,
    reference: referenceRouter,
    sme: smeRouter,
    rating: ratingRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
