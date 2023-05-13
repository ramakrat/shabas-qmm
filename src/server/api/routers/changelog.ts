import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";


const inputType = z.object({
    id: z.number().optional(),
    field: z.string(),
    former_value: z.string().optional(),
    new_value: z.string().optional(),
    question_id: z.number().optional(),
    answer_id: z.number().optional(),
})

export const changelogRouter = createTRPCRouter({
    create: publicProcedure
        .input(inputType)
        .mutation(async ({ input, ctx }) => {
            return await ctx.prisma.changelog.create({
                data: {
                    field: input.field,
                    former_value: input.former_value,
                    new_value: input.new_value,
                    question_id: input.question_id,
                    answer_id: input.answer_id,
                    updated_at: new Date(),
                    updated_by: '',
                }
            })
        }),
    update: publicProcedure
        .input(inputType)
        .mutation(({ input, ctx }) => {
            return ctx.prisma.changelog.update({
                where: { id: input.id },
                data: {
                    field: input.field,
                    former_value: input.former_value,
                    new_value: input.new_value,
                    question_id: input.question_id,
                    answer_id: input.answer_id,
                    updated_at: new Date(),
                    updated_by: '',
                }
            })
        }),
    getById: publicProcedure
        .input(z.object({ id: z.number() }))
        .query(({ input, ctx }) => {
            return ctx.prisma.changelog.findUnique({
                where: { id: input.id }
            });
        }),
    getAllByQuestion: publicProcedure
        .input(z.object({ questionId: z.number().optional(), refetch: z.number().optional() }))
        .query(({ input, ctx }) => {
            return ctx.prisma.changelog.findMany({
                orderBy: { updated_at: 'asc' },
                where: { question_id: input.questionId }
            });
        }),
    getAllByAssessment: publicProcedure
        .input(z.number().optional())
        .query(({ input, ctx }) => {
            return ctx.prisma.changelog.findMany({
                orderBy: { updated_at: 'asc' },
                where: {
                    answer: {
                        assessment_question: {
                            assessment_id: input
                        }
                    }
                }
            });
        }),
    getAllByAnswer: publicProcedure
        .input(z.number().optional())
        .query(({ input, ctx }) => {
            return ctx.prisma.changelog.findMany({
                orderBy: { updated_at: 'asc' },
                where: { answer_id: input }
            });
        }),
    getAll: publicProcedure
        .query(({ ctx }) => {
            return ctx.prisma.changelog.findMany();
        }),
});
