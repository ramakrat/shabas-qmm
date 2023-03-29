import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "~/server/api/trpc";


const inputType = z.object({
    id: z.number().optional(),
    active: z.string(),
    interview_question: z.string(),
    question_id: z.number(),
    site_id: z.number(),
    filter_id: z.number(),
})

export const interviewGuideRouter = createTRPCRouter({
    upsert: publicProcedure
        .input(inputType)
        .query(({ input, ctx }) => {
            return ctx.prisma.interviewguide.upsert({
                where: { id: input.id },
                update: {
                    active: input.active,
                    interview_question: input.interview_question,
                    question_id: input.question_id,
                    site_id: input.site_id,
                    filler_id: input.filter_id,
                    last_updated: new Date(),
                    last_updated_by: '',
                },
                create: {
                    active: input.active,
                    interview_question: input.interview_question,
                    question_id: input.question_id,
                    site_id: input.site_id,
                    filler_id: input.filter_id,
                    created_by: '',
                    last_updated_by: '',
                }
            })
        }),
    getById: publicProcedure
        .input(z.object({ id: z.number() }))
        .query(({ input, ctx }) => {
            return ctx.prisma.interviewguide.findUnique({
                where: { id: input.id }
            });
        }),
    getAll: publicProcedure
        .query(({ ctx }) => {
            return ctx.prisma.interviewguide.findMany();
        }),
});
