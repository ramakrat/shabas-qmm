import { Prisma } from "@prisma/client";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";


const inputType = z.object({
    id: z.number().optional(),
    question_id: z.number(),
    assessment_id: z.number(),
    filter_id: z.number().optional(),
})

export const assessmentQuestionRouter = createTRPCRouter({
    create: publicProcedure
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
    createArray: publicProcedure
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
    update: publicProcedure
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
    getById: publicProcedure
        .input(z.object({ id: z.number() }))
        .query(({ input, ctx }) => {
            return ctx.prisma.assessmentQuestion.findUnique({
                where: { id: input.id }
            });
        }),
    getByQuestionUsage: publicProcedure
        .input(z.number())
        .query(({ input, ctx }) => {
            return ctx.prisma.assessmentQuestion.findFirst({
                where: { question_id: input }
            });
        }),
    getUnfinishedAssessmentQuestions: publicProcedure
        .input(z.object({ assessmentId: z.number(), status: z.string() }))
        .query(({ input, ctx }) => {
            let nullFields: any = [];
            if (input.status == 'ongoing') {
                nullFields = [
                    { assessor_rating: null },
                    { assessor_rationale: null }
                ]
            }
            if (input.status == 'assessor-review') {
                nullFields = [
                    { consensus_rating: null },
                    { consensus_rationale: null }
                ]
            }
            if (input.status == 'oversight') {
                nullFields = [
                    { oversight_concurrence: null },
                    { oversight_rationale: null }
                ]
            }
            return ctx.prisma.assessmentQuestion.findMany({
                where: {
                    assessment_id: input.assessmentId,
                    OR: [{
                        answer: {
                            OR: nullFields,
                        }
                    }, {
                        answer: null
                    }]
                }
            });
        }),
    getAll: publicProcedure
        .query(({ ctx }) => {
            return ctx.prisma.assessmentQuestion.findMany();
        }),
});
