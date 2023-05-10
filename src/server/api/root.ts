import { createTRPCRouter } from "~/server/api/trpc";
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
import { assessmentQuestionRouter } from "./routers/assessmentquestion";
import { answerRouter } from "./routers/answer";
import { pocRouter } from "./routers/poc";
import { engagementpocRouter } from "./routers/engagementpoc";
import { changelogRouter } from "./routers/changelog";
import { userRouter } from "./routers/user";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
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
    assessmentQuestion: assessmentQuestionRouter,
    answer: answerRouter,
    poc: pocRouter,
    engagementPoc: engagementpocRouter,
    changelog: changelogRouter,
    user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
