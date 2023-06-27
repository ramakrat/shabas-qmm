import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";


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
    create: protectedProcedure
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
    update: protectedProcedure
        .input(inputType)
        .mutation(async ({ input, ctx }) => {
            return await ctx.prisma.assessment.update({
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
    updateStatus: protectedProcedure
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
    getById: protectedProcedure
        .input(z.object({ id: z.number() }))
        .query(({ input, ctx }) => {
            return ctx.prisma.assessment.findUnique({
                where: { id: input.id }
            });
        }),
    getByIdInclude: protectedProcedure
        .input(z.object({ id: z.number().optional() }))
        .query(({ input, ctx }) => {
            if (input.id)
                return ctx.prisma.assessment.findUnique({
                    where: { id: input.id },
                    include: {
                        assessment_questions: {
                            include: {
                                filter: true,
                                question: {
                                    include: {
                                        ratings: {
                                            include: {
                                                filter: true
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        assessment_users: {
                            include: {
                                user: true,
                            }
                        },
                    }
                });
            return null;
        }),
    getByIdIncludeAssessor: protectedProcedure
        .input(z.object({ id: z.number().optional() }))
        .query(async ({ input, ctx }) => {
            if (input.id)
                return await ctx.prisma.assessment.findUnique({
                    where: { id: input.id },
                    include: {
                        assessment_questions: {
                            include: {
                                filter: true,
                                answers: {
                                    include: {
                                        user: true,
                                    }
                                },
                                question: {
                                    include: {
                                        ratings: true,
                                        references: true,
                                        interview_guides: true,
                                    }
                                },
                            }
                        },
                        engagement: true
                    }
                });
            return null;
        }),
    getByIdExport: protectedProcedure
        .input(z.number())
        .query(({ input, ctx }) => {
            return ctx.prisma.assessment.findMany({
                where: { id: input },
                include: {
                    assessment_questions: {
                        include: {
                            answers: {
                                include: {
                                    user: true,
                                }
                            },
                            question: true,
                        }
                    },
                    site: true,
                }
            });
        }),
    getAll: protectedProcedure
        .input(z.boolean())
        .query(({ ctx }) => {
            return ctx.prisma.assessment.findMany();
        }),
    getTotalCount: protectedProcedure
        .input(z.boolean().optional())
        .query(({ ctx }) => {
            return ctx.prisma.assessment.count();
        }),
    getStatusCounts: protectedProcedure
        .input(z.boolean().optional())
        .query(async ({ ctx }) => {
            const getCounts = async () => {
                const created = await ctx.prisma.assessment.count({
                    where: { status: 'created' }
                });
                const ongoing = await ctx.prisma.assessment.count({
                    where: { status: 'ongoing' }
                });
                const assessorReview = await ctx.prisma.assessment.count({
                    where: { status: 'ongoing-review' }
                });
                const oversight = await ctx.prisma.assessment.count({
                    where: { status: 'oversight' }
                });
                const clientReview = await ctx.prisma.assessment.count({
                    where: { status: 'client-review' }
                });
                const completed = await ctx.prisma.assessment.count({
                    where: { status: 'completed' }
                });

                return {
                    created: created,
                    ongoing: ongoing,
                    assessorReview: assessorReview,
                    oversight: oversight,
                    clientReview: clientReview,
                    completed: completed,
                };
            }

            // Extract `UsersWithPosts` type with
            type ThenArg<T> = T extends PromiseLike<infer U> ? U : T
            type AssessmentStatusCounts = ThenArg<ReturnType<typeof getCounts>>


            // run inside `async` function
            const counts: AssessmentStatusCounts = await getCounts()

            return counts;
        }),
});
