import { Prisma } from "@prisma/client";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

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
    createArray: publicProcedure
        .input(z.array(inputType))
        .mutation(async ({ input, ctx }) => {
            for (const o of input) {
                try {
                    await ctx.prisma.rating.create({
                        data: {
                            active: o.active,
                            level_number: o.level_number,
                            criteria: o.criteria,
                            progression_statement: o.progression_statement,
                            question_id: o.question_id,
                            site_id: o.site_id,
                            filter_id: o.filter_id,
                            created_by: '',
                            updated_by: '',
                        }
                    })
                } catch (e) {
                    if (e instanceof Prisma.PrismaClientKnownRequestError) {
                        // The .code property can be accessed in a type-safe manner
                        if (e.code === 'P2002') {
                            console.log(
                                'There is a unique constraint violation.'
                            )
                        }
                    }
                    throw e;
                }
            }
            return undefined;
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
    updateArray: publicProcedure
        .input(z.array(inputType))
        .mutation(async ({ input, ctx }) => {
            for (const o of input) {
                try {
                    await ctx.prisma.rating.update({
                        where: { id: o.id },
                        data: {
                            active: o.active,
                            level_number: o.level_number,
                            criteria: o.criteria,
                            progression_statement: o.progression_statement,
                            question_id: o.question_id,
                            site_id: o.site_id,
                            filter_id: o.filter_id,
                            created_by: '',
                            updated_by: '',
                        }
                    })
                } catch (e) {
                    if (e instanceof Prisma.PrismaClientKnownRequestError) {
                        // The .code property can be accessed in a type-safe manner
                        if (e.code === 'P2002') {
                            console.log(
                                'There is a unique constraint violation.'
                            )
                        }
                    }
                    throw e;
                }
            }
            return undefined;
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
