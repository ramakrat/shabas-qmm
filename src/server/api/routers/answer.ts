import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "~/server/api/trpc";


const inputType = z.object({
    id: z.number().optional(),
    rating: z.string().optional(),
    rationale: z.string().optional(),
    notes: z.string().optional(),
    user_id: z.number().optional(),
    assessment_question_id: z.number(),
})

export const answerRouter = createTRPCRouter({
    create: publicProcedure
        .input(z.object({ assessmentQuestionId: z.number() }))
        .mutation(({ input, ctx }) => {
            return ctx.prisma.answer.create({
                data: {
                    assessment_question_id: input.assessmentQuestionId,
                    start_time: new Date(),
                    updated_by: '',
                    created_by: '',
                },
            })
        }),
    update: publicProcedure
        .input(inputType)
        .mutation(({ input, ctx }) => {
            return ctx.prisma.answer.update({
                where: { id: input.id },
                data: {
                    rating: input.rating,
                    rationale: input.rationale,
                    notes: input.notes,
                    user_id: input.user_id,
                    assessment_question_id: input.assessment_question_id,
                    updated_at: new Date(),
                    updated_by: '',
                }
            })
        }),
    getById: publicProcedure
        .input(z.object({ id: z.number() }))
        .query(({ input, ctx }) => {
            return ctx.prisma.answer.findUnique({
                where: { id: input.id }
            });
        }),
    getAll: publicProcedure
        .query(({ ctx }) => {
            return ctx.prisma.answer.findMany();
        }),
});
