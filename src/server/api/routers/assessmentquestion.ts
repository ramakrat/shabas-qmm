import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "~/server/api/trpc";


const inputType = z.object({
    id: z.number().optional(),
    question_id: z.number(),
    assessment_id: z.number(),
    filter_id: z.number().optional(),
})

export const assessmentQuestionRouter = createTRPCRouter({
    create: publicProcedure
        .input(inputType)
        .mutation(({ input, ctx }) => {
            return ctx.prisma.assessmentQuestion.create({
                data: {
                    question_id: input.question_id,
                    assessment_id: input.assessment_id,
                    filter_id: input.filter_id,
                    created_by: '',
                    updated_by: '',
                }
            })
        }),
    update: publicProcedure
        .input(inputType)
        .mutation(({ input, ctx }) => {
            return ctx.prisma.assessmentQuestion.update({
                where: { id: input.id },
                data: {
                    question_id: input.question_id,
                    assessment_id: input.assessment_id,
                    filter_id: input.filter_id,
                    updated_at: new Date(),
                    updated_by: '',
                }
            })
        }),
    getById: publicProcedure
        .input(z.object({ id: z.number() }))
        .query(({ input, ctx }) => {
            return ctx.prisma.assessmentQuestion.findUnique({
                where: { id: input.id }
            });
        }),
    getAll: publicProcedure
        .query(({ ctx }) => {
            return ctx.prisma.assessmentQuestion.findMany();
        }),
});
