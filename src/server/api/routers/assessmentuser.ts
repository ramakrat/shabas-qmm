import { Prisma } from "@prisma/client";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";


const inputType = z.object({
    id: z.number().optional(),
    user_id: z.number(),
    assessment_id: z.number(),
})

export const assessmentUserRouter = createTRPCRouter({
    create: protectedProcedure
        .input(inputType)
        .mutation(({ input, ctx }) => {
            return ctx.prisma.assessmentUser.create({
                data: {
                    user_id: input.user_id,
                    assessment_id: input.assessment_id,
                }
            })
        }),
    createArray: protectedProcedure
        .input(z.array(inputType))
        .mutation(async ({ input, ctx }) => {
            const returnData = [];
            for (const o of input) {
                try {
                    const data = await ctx.prisma.assessmentUser.create({
                        data: {
                            user_id: o.user_id,
                            assessment_id: o.assessment_id,
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
            return returnData;
        }),
    update: protectedProcedure
        .input(inputType)
        .mutation(({ input, ctx }) => {
            return ctx.prisma.assessmentUser.update({
                where: { id: input.id },
                data: {
                    user_id: input.user_id,
                    assessment_id: input.assessment_id,
                }
            })
        }),
    updateArray: protectedProcedure
        .input(z.array(inputType))
        .mutation(async ({ input, ctx }) => {
            for (const o of input) {
                try {
                    await ctx.prisma.assessmentUser.update({
                        where: { id: o.id },
                        data: {
                            user_id: o.user_id,
                            assessment_id: o.assessment_id,
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
    deleteArray: protectedProcedure
        .input(z.array(z.number().optional()))
        .mutation(async ({ input, ctx }) => {
            for (const o of input) {
                try {
                    await ctx.prisma.assessmentUser.delete({
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
    getById: protectedProcedure
        .input(z.object({ id: z.number() }))
        .query(({ input, ctx }) => {
            return ctx.prisma.assessmentUser.findUnique({
                where: { id: input.id }
            });
        }),
    getAll: protectedProcedure
        .query(({ ctx }) => {
            return ctx.prisma.assessmentUser.findMany();
        }),
});
