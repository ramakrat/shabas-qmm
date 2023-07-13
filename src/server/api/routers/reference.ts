import { Prisma } from "@prisma/client";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";


const inputType = z.object({
    id: z.number().optional(),
    citation: z.string(),
    question_id: z.number(),
})

export const referenceRouter = createTRPCRouter({
    create: protectedProcedure
        .input(inputType)
        .mutation(async ({ input, ctx }) => {
            return await ctx.prisma.reference.create({
                data: {
                    citation: input.citation,
                    question_id: input.question_id,
                    created_by: '',
                    updated_by: '',
                }
            })
        }),
    createArray: protectedProcedure
        .input(z.array(inputType))
        .mutation(async ({ input, ctx }) => {
            const returnData = [];
            for (const o of input) {
                if (o.citation != '') {
                    try {
                        const data = await ctx.prisma.reference.create({
                            data: {
                                citation: o.citation,
                                question_id: o.question_id,
                                created_by: '',
                                updated_by: '',
                            }
                        })
                        returnData.push(data);
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
            }
            return returnData;
        }),
    update: protectedProcedure
        .input(inputType)
        .mutation(({ input, ctx }) => {
            return ctx.prisma.reference.update({
                where: { id: input.id },
                data: {
                    citation: input.citation,
                    question_id: input.question_id,
                    updated_at: new Date(),
                    updated_by: '',
                },
            })
        }),
    updateArray: protectedProcedure
        .input(z.array(inputType))
        .mutation(async ({ input, ctx }) => {
            for (const o of input) {
                if (o.citation != '') {
                    try {
                        await ctx.prisma.reference.update({
                            where: { id: o.id },
                            data: {
                                citation: o.citation,
                                question_id: o.question_id,
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
            }
            return undefined;
        }),
    delete: protectedProcedure
        .input(z.number())
        .mutation(({ input, ctx }) => {
            return ctx.prisma.reference.delete({
                where: { id: input },
            });
        }),
    deleteArray: protectedProcedure
        .input(z.array(z.number().optional()))
        .mutation(async ({ input, ctx }) => {
            for (const o of input) {
                try {
                    await ctx.prisma.reference.delete({
                        where: { id: o },
                    });
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
    getByQuestionId: protectedProcedure
        .input(z.object({ id: z.number().optional() }))
        .query(({ input, ctx }) => {
            return ctx.prisma.reference.findMany({
                where: { question_id: input.id },
                orderBy: { id: 'asc' }
            });
        }),
    getById: protectedProcedure
        .input(z.object({ id: z.number().optional() }))
        .query(({ input, ctx }) => {
            return ctx.prisma.reference.findUnique({
                where: { id: input.id }
            });
        }),
    getAll: protectedProcedure
        .query(({ ctx }) => {
            return ctx.prisma.reference.findMany();
        }),
});
