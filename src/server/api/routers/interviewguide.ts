import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "~/server/api/trpc";


const inputType = z.object({
    id: z.number().optional(),
    active: z.boolean(),
    interview_question: z.string(),
    question_id: z.number(),
    site_id: z.number(),
    filter_id: z.number(),
})

export const interviewGuideRouter = createTRPCRouter({
    create: publicProcedure
        .input(inputType)
        .mutation(({ input, ctx }) => {
            return ctx.prisma.interviewGuide.create({
                data: {
                    active: input.active,
                    interview_question: input.interview_question,
                    question_id: input.question_id,
                    site_id: input.site_id,
                    filter_id: input.filter_id,
                    created_by: '',
                    updated_by: '',
                }
            })
        }),
    update: publicProcedure
        .input(inputType)
        .mutation(({ input, ctx }) => {
            return ctx.prisma.interviewGuide.update({
                where: { id: input.id },
                data: {
                    active: input.active,
                    interview_question: input.interview_question,
                    question_id: input.question_id,
                    site_id: input.site_id,
                    filter_id: input.filter_id,
                    updated_at: new Date(),
                    updated_by: '',
                },
            })
        }),
    getByQuestionId: publicProcedure
        .input(z.object({ id: z.number() }))
        .query(({ input, ctx }) => {
            return ctx.prisma.interviewGuide.findMany({
                where: { question_id: input.id }
            });
        }),
    getById: publicProcedure
        .input(z.object({ id: z.number() }))
        .query(({ input, ctx }) => {
            return ctx.prisma.interviewGuide.findUnique({
                where: { id: input.id }
            });
        }),
    getAll: publicProcedure
        .query(({ ctx }) => {
            return ctx.prisma.interviewGuide.findMany();
        }),
});
