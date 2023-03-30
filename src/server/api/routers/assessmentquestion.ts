import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "~/server/api/trpc";


const inputType = z.object({
    id: z.number().optional(),
    question_id: z.number(),
    assessment_id: z.number(),
})

export const assessmentQuestionRouter = createTRPCRouter({
    upsert: publicProcedure
        .input(inputType)
        .query(({ input, ctx }) => {
            return ctx.prisma.assessmentquestion.upsert({
                where: { id: input.id },
                update: {
                    question_id: input.question_id,
                    assessment_id: input.assessment_id,
                    last_updated: new Date(),
                    last_updated_by: '',
                },
                create: {
                    question_id: input.question_id,
                    assessment_id: input.assessment_id,
                    created_by: '',
                    last_updated_by: '',
                }
            })
        }),
    getById: publicProcedure
        .input(z.object({ id: z.number() }))
        .query(({ input, ctx }) => {
            return ctx.prisma.assessmentquestion.findUnique({
                where: { id: input.id }
            });
        }),
    getAll: publicProcedure
        .query(({ ctx }) => {
            return ctx.prisma.assessmentquestion.findMany();
        }),
});