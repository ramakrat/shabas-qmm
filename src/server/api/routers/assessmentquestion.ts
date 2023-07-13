import { Prisma } from "@prisma/client";
import { isEmptyArray } from "formik";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";


const inputType = z.object({
    id: z.number().optional(),
    question_id: z.number(),
    assessment_id: z.number(),
    filter_id: z.number().optional(),
})

export const assessmentQuestionRouter = createTRPCRouter({
    create: protectedProcedure
        .input(inputType)
        .mutation(async ({ input, ctx }) => {
            return await ctx.prisma.assessmentQuestion.create({
                data: {
                    question_id: input.question_id,
                    assessment_id: input.assessment_id,
                    filter_id: input.filter_id,
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
                try {
                    const data = await ctx.prisma.assessmentQuestion.create({
                        data: {
                            question_id: o.question_id,
                            assessment_id: o.assessment_id,
                            filter_id: o.filter_id,
                            created_by: '',
                            updated_by: '',
                        },
                        include: {
                            filter: true,
                            question: {
                                include: {
                                    ratings: {
                                        include: {
                                            filter: true,
                                        }
                                    }
                                }
                            }
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
    deleteArray: protectedProcedure
        .input(z.array(z.number().optional()))
        .mutation(async ({ input, ctx }) => {
            for (const o of input) {
                try {
                    await ctx.prisma.assessmentQuestion.delete({
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
            return ctx.prisma.assessmentQuestion.findUnique({
                where: { id: input.id }
            });
        }),
    getByQuestionUsage: protectedProcedure
        .input(z.number())
        .query(({ input, ctx }) => {
            return ctx.prisma.assessmentQuestion.findFirst({
                where: { question_id: input }
            });
        }),
    getAll: protectedProcedure
        .query(({ ctx }) => {
            return ctx.prisma.assessmentQuestion.findMany();
        }),
});
