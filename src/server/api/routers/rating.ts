import { Prisma } from "@prisma/client";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

const inputType = z.object({
    id: z.number().optional(),
    criteria_1: z.string(),
    progression_statement_1: z.string().optional(),
    criteria_2: z.string(),
    progression_statement_2: z.string().optional(),
    criteria_3: z.string(),
    progression_statement_3: z.string().optional(),
    criteria_4: z.string(),
    progression_statement_4: z.string().optional(),
    criteria_5: z.string(),
    question_id: z.number(),
    filter_id: z.number().optional(),
})

export const ratingRouter = createTRPCRouter({
    create: protectedProcedure
        .input(inputType)
        .mutation(({ input, ctx }) => {
            return ctx.prisma.rating.create({
                data: {
                    criteria_1: input.criteria_1,
                    progression_statement_1: input.progression_statement_1 ?? '',
                    criteria_2: input.criteria_2,
                    progression_statement_2: input.progression_statement_2 ?? '',
                    criteria_3: input.criteria_3,
                    progression_statement_3: input.progression_statement_3 ?? '',
                    criteria_4: input.criteria_4,
                    progression_statement_4: input.progression_statement_4 ?? '',
                    criteria_5: input.criteria_5,
                    question_id: input.question_id,
                    filter_id: input.filter_id,
                    created_by: '',
                    updated_by: '',
                }
            })
        }),
    update: protectedProcedure
        .input(inputType)
        .mutation(({ input, ctx }) => {
            return ctx.prisma.rating.update({
                where: { id: input.id },
                data: {
                    criteria_1: input.criteria_1,
                    progression_statement_1: input.progression_statement_1 ?? '',
                    criteria_2: input.criteria_2,
                    progression_statement_2: input.progression_statement_2 ?? '',
                    criteria_3: input.criteria_3,
                    progression_statement_3: input.progression_statement_3 ?? '',
                    criteria_4: input.criteria_4,
                    progression_statement_4: input.progression_statement_4 ?? '',
                    criteria_5: input.criteria_5,
                    question_id: input.question_id,
                    filter_id: input.filter_id,
                    updated_at: new Date(),
                    updated_by: '',
                },
            })
        }),
    getByQuestionFilter: protectedProcedure
        .input(z.object({ questionId: z.number().optional(), filterId: z.number().optional() }))
        .query(({ input, ctx }) => {
            return ctx.prisma.rating.findFirst({
                where: {
                    question_id: input.questionId,
                    filter_id: input.filterId ?? null,
                },
            });
        }),
    getById: protectedProcedure
        .input(z.object({ id: z.number() }))
        .query(({ input, ctx }) => {
            return ctx.prisma.rating.findUnique({
                where: { id: input.id }
            });
        }),
    getAll: protectedProcedure
        .query(({ ctx }) => {
            return ctx.prisma.rating.findMany();
        }),
});
