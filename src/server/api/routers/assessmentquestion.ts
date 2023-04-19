import { Prisma } from "@prisma/client";
import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "~/server/api/trpc";


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
            for (const o of input) {
                try {
                    await ctx.prisma.assessmentQuestion.create({
                        data: {
                            question_id: o.question_id,
                            assessment_id: o.assessment_id,
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
    getAll: publicProcedure
        .query(({ ctx }) => {
            return ctx.prisma.assessmentQuestion.findMany();
        }),
});
