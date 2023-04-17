import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "~/server/api/trpc";

const inputType = z.object({
    id: z.number().optional(),
    active: z.boolean(),
    level_number: z.string(),
    criteria: z.string(),
    progression_statement: z.string(),
    question_id: z.number(),
    site_id: z.number().optional(),
    filter_id: z.number().optional(),
})

export const ratingRouter = createTRPCRouter({
    create: publicProcedure
        .input(inputType)
        .mutation(({ input, ctx }) => {
            return ctx.prisma.rating.create({
                data: {
                    active: input.active,
                    level_number: input.level_number,
                    criteria: input.criteria,
                    progression_statement: input.progression_statement,
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
            return ctx.prisma.rating.update({
                where: { id: input.id },
                data: {
                    active: input.active,
                    level_number: input.level_number,
                    criteria: input.criteria,
                    progression_statement: input.progression_statement,
                    question_id: input.question_id,
                    site_id: input.site_id,
                    filter_id: input.filter_id,
                    updated_at: new Date(),
                    updated_by: '',
                },
            })
        }),
    getByQuestionFilter: publicProcedure
        .input(z.object({ questionId: z.number().optional(), filterId: z.number().optional() }))
        .query(({ input, ctx }) => {
            return ctx.prisma.rating.findMany({
                where: {
                    question_id: input.questionId,
                    filter_id: input.filterId ?? null,
                },
                orderBy: { level_number: 'asc' }
            });
        }),
    getById: publicProcedure
        .input(z.object({ id: z.number() }))
        .query(({ input, ctx }) => {
            return ctx.prisma.rating.findUnique({
                where: { id: input.id }
            });
        }),
    getAll: publicProcedure
        .query(({ ctx }) => {
            return ctx.prisma.rating.findMany();
        }),
});
