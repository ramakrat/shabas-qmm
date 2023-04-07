import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "~/server/api/trpc";


const inputType = z.object({
    id: z.number().optional(),
    description: z.string(),
    status: z.string().optional(),
    start_date: z.date(),
    end_date: z.date(),
    site_id: z.number(),
    engagement_id: z.number(),
    poc_id: z.number().optional(),
})

export const assessmentRouter = createTRPCRouter({
    create: publicProcedure
        .input(inputType)
        .mutation(async ({ input, ctx }) => {
            return await ctx.prisma.assessment.create({
                data: {
                    description: input.description,
                    status: 'created',
                    start_date: input.start_date,
                    end_date: input.end_date,
                    site_id: input.site_id,
                    engagement_id: input.engagement_id,
                    poc_id: input.poc_id,
                    created_by: '',
                    updated_by: '',
                }
            });
        }),
    update: publicProcedure
        .input(inputType)
        .mutation(({ input, ctx }) => {
            return ctx.prisma.assessment.update({
                where: { id: input.id },
                data: {
                    description: input.description,
                    status: input.status,
                    start_date: input.start_date,
                    end_date: input.end_date,
                    site_id: input.site_id,
                    engagement_id: input.engagement_id,
                    poc_id: input.poc_id,
                    updated_at: new Date(),
                    updated_by: '',
                },
            });
        }),
    status: publicProcedure
        .input(z.object({ id: z.number(), status: z.string() }))
        .mutation(({ input, ctx }) => {
            return ctx.prisma.assessment.update({
                where: { id: input.id },
                data: {
                    status: input.status,
                    updated_at: new Date(),
                    updated_by: '',
                },
            });
        }),
    getById: publicProcedure
        .input(z.object({ id: z.number() }))
        .query(({ input, ctx }) => {
            return ctx.prisma.assessment.findUnique({
                where: { id: input.id }
            });
        }),
    getByIdInclude: publicProcedure
        .input(z.object({ id: z.number().optional() }))
        .query(({ input, ctx }) => {
            if (input.id)
                return ctx.prisma.assessment.findUnique({
                    where: { id: input.id },
                    include: {
                        AssessmentQuestion: {
                            include: {
                                filter: true,
                                question: {
                                    include: {
                                        Rating: {
                                            include: {
                                                filter: true
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                });
            return null;
        }),
    getByIdIncludeAssessor: publicProcedure
        .input(z.object({ id: z.number().optional() }))
        .query(async ({ input, ctx }) => {
            if (input.id)
                return await ctx.prisma.assessment.findUnique({
                    where: { id: input.id },
                    include: {
                        AssessmentQuestion: {
                            include: {
                                filter: true,
                                answer: true,
                                question: true,
                            }
                        },
                        engagement: true
                    }
                });
            return null;
        }),
    getAll: publicProcedure
        .input(z.boolean())
        .query(({ ctx }) => {
            return ctx.prisma.assessment.findMany();
        }),
    getTotalCount: publicProcedure
        .input(z.boolean().optional())
        .query(({ ctx }) => {
            return ctx.prisma.assessment.count();
        }),
});
