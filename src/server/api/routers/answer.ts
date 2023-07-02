import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";


const inputType = z.object({
    id: z.number().optional(),
    rating: z.string().optional(),
    rationale: z.string().optional(),
    notes: z.string().optional(),
    user_id: z.number().optional(),
    assessment_question_id: z.number(),
})

export const answerRouter = createTRPCRouter({
    create: protectedProcedure
        .input(z.object({ assessmentQuestionId: z.number(), userId: z.number(), status: z.string() }))
        .mutation(async ({ input, ctx }) => {
            const existingAnswer = await ctx.prisma.answer.findFirst({
                where: {
                    assessment_question_id: input.assessmentQuestionId,
                    user_id: input.userId,
                    status: input.status,
                }
            })
            if (!existingAnswer)
                return ctx.prisma.answer.create({
                    data: {
                        assessment_question_id: input.assessmentQuestionId,
                        user_id: input.userId,
                        status: input.status,
                        start_time: new Date(),
                        updated_by: '',
                        created_by: '',
                    },
                })
            throw {
                code: 409,
                message: 'Answer already exists for this user, assessment, and assessment status.'
            }
        }),
    update: protectedProcedure
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
    getById: protectedProcedure
        .input(z.object({ id: z.number() }))
        .query(({ input, ctx }) => {
            return ctx.prisma.answer.findUnique({
                where: { id: input.id }
            });
        }),
    getAll: protectedProcedure
        .query(({ ctx }) => {
            return ctx.prisma.answer.findMany();
        }),
});
