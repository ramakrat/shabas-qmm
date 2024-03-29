import { Prisma } from "@prisma/client";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";


const inputType = z.object({
    id: z.number().optional(),
    active: z.boolean(),
    interview_question: z.string(),
    question_id: z.number(),
    site_id: z.number(),
    filter_id: z.number(),
})

export const interviewGuideRouter = createTRPCRouter({
    create: protectedProcedure
        .input(inputType)
        .mutation(({ input, ctx }) => {
            return ctx.prisma.interviewGuide.create({
                data: {
                    active: input.active,
                    interview_question: input.interview_question,
                    question_id: input.question_id,
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
                if (o.interview_question != '') {
                    try {
                        const data = await ctx.prisma.interviewGuide.create({
                            data: {
                                active: true,
                                interview_question: o.interview_question,
                                question_id: o.question_id,
                                filter_id: o.filter_id,
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
        .mutation(async ({ input, ctx }) => {
            return await ctx.prisma.interviewGuide.update({
                where: { id: input.id },
                data: {
                    active: input.active,
                    interview_question: input.interview_question,
                    question_id: input.question_id,
                    filter_id: input.filter_id,
                    updated_at: new Date(),
                    updated_by: '',
                },
            })
        }),
    updateArray: protectedProcedure
        .input(z.array(inputType))
        .mutation(async ({ input, ctx }) => {
            for (const o of input) {
                if (o.interview_question != '') {
                    try {
                        await ctx.prisma.interviewGuide.update({
                            where: { id: o.id },
                            data: {
                                active: true,
                                interview_question: o.interview_question,
                                question_id: o.question_id,
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
            }
            return undefined;
        }),
    delete: protectedProcedure
        .input(z.number())
        .mutation(({ input, ctx }) => {
            return ctx.prisma.interviewGuide.delete({
                where: { id: input },
            });
        }),
    deleteArray: protectedProcedure
        .input(z.array(z.number().optional()))
        .mutation(async ({ input, ctx }) => {
            for (const o of input) {
                try {
                    await ctx.prisma.interviewGuide.delete({
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
            return ctx.prisma.interviewGuide.findMany({
                where: { question_id: input.id },
                orderBy: { id: 'asc' }
            });
        }),
    getById: protectedProcedure
        .input(z.object({ id: z.number().optional() }))
        .query(({ input, ctx }) => {
            return ctx.prisma.interviewGuide.findUnique({
                where: { id: input.id }
            });
        }),
    getAll: protectedProcedure
        .query(({ ctx }) => {
            return ctx.prisma.interviewGuide.findMany();
        }),
});
