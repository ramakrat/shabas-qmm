import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";


const inputType = z.object({
    id: z.number().optional(),
    status: z.string().optional(),
    description: z.string(),
    start_date: z.date(),
    end_date: z.date(),
    client_id: z.number(),
})

export const engagementRouter = createTRPCRouter({
    create: protectedProcedure
        .input(inputType)
        .mutation(({ input, ctx }) => {
            return ctx.prisma.engagement.create({
                data: {
                    status: 'pending',
                    description: input.description,
                    start_date: input.start_date,
                    end_date: input.end_date,
                    client_id: input.client_id,
                    created_by: '',
                    updated_by: '',
                }
            })
        }),
    update: protectedProcedure
        .input(inputType)
        .mutation(({ input, ctx }) => {
            return ctx.prisma.engagement.update({
                where: { id: input.id },
                data: {
                    status: input.status,
                    description: input.description,
                    start_date: input.start_date,
                    end_date: input.end_date,
                    client_id: input.client_id,
                    updated_at: new Date(),
                    updated_by: '',
                }
            })
        }),
    getById: protectedProcedure
        .input(z.object({ id: z.number() }))
        .query(({ input, ctx }) => {
            return ctx.prisma.engagement.findUnique({
                where: { id: input.id }
            });
        }),
    getAllInclude: protectedProcedure
        .input(z.object({
            filters: z.array(z.any()),
            states: z.boolean().optional(),
            includeEmptyEngagements: z.boolean().optional(),
        }))
        .query(async ({ input, ctx }) => {
            const allEngagements = await ctx.prisma.engagement.findMany();
            allEngagements.forEach(async e => {
                const utcDate = new Date();
                const currDate = new Date(utcDate.getTime() - utcDate.getTimezoneOffset() * 60000);
                if (e.status != 'open' && e.start_date < currDate && e.end_date > currDate) {
                    await ctx.prisma.engagement.update({
                        where: { id: e.id },
                        data: {
                            status: 'open',
                            updated_at: new Date(),
                        },
                    });
                }
                if (e.status != 'closed' && e.end_date < currDate) {
                    await ctx.prisma.engagement.update({
                        where: { id: e.id },
                        data: {
                            status: 'closed',
                            updated_at: new Date(),
                        },
                    });
                }
            });
            if (input.includeEmptyEngagements) {
                return ctx.prisma.engagement.findMany({
                    include: {
                        assessments: {
                            include: { poc: true },
                            where: {
                                OR: input.filters
                            }
                        },
                        client: true,
                        pocs: true,
                        engagement_pocs: { include: { poc: true } },
                    },
                    where: {
                        OR: [{
                            assessments: {
                                some: {
                                    OR: input.filters
                                }
                            }
                        }, {
                            NOT: {
                                assessments: {
                                    some: {
                                        AND: [
                                            { status: 'created' },
                                            { status: 'ongoing' },
                                            { status: 'ongoing-review' },
                                            { status: 'oversight' },
                                            { status: 'oversight-review' },
                                            { status: 'completed' },
                                        ]
                                    }
                                }
                            }
                        }]
                    }
                });
            }
            return ctx.prisma.engagement.findMany({
                include: {
                    assessments: {
                        include: { poc: true },
                        where: {
                            OR: input.filters
                        }
                    },
                    client: true,
                    pocs: true,
                    engagement_pocs: { include: { poc: true } },
                },
                where: {
                    OR: [{
                        assessments: {
                            some: {
                                OR: input.filters
                            }
                        }
                    }]
                }
            });
        }),
    getAll: protectedProcedure
        .input(z.boolean().optional())
        .query(({ ctx }) => {
            return ctx.prisma.engagement.findMany();
        }),
    getTotalCount: protectedProcedure
        .input(z.boolean().optional())
        .query(({ ctx }) => {
            return ctx.prisma.engagement.count();
        }),
    getUserAssessments: protectedProcedure
        .input(z.object({ userId: z.number().optional(), status: z.string() }))
        .query(async ({ input, ctx }) => {

            const filters = input.status == 'ongoing' ? [{ status: 'created' }, { status: 'ongoing' }] : [{ status: input.status }];

            if (input.status == 'completed') {
                return ctx.prisma.engagement.findMany({
                    include: {
                        assessments: {
                            include: { poc: true },
                            where: {
                                OR: filters
                            }
                        },
                        client: true,
                        pocs: true,
                        engagement_pocs: { include: { poc: true } },
                    },
                    where: {
                        OR: [{
                            assessments: {
                                some: {
                                    OR: filters
                                }
                            }
                        }]
                    }
                });
            }

            return ctx.prisma.engagement.findMany({
                include: {
                    assessments: {
                        include: { poc: true },
                        where: {
                            assessment_users: {
                                some: {
                                    user_id: input.userId,
                                }
                            },
                            OR: filters
                        }
                    },
                    client: true,
                    pocs: true,
                    engagement_pocs: { include: { poc: true } },
                },
                where: {
                    assessments: {
                        some: {
                            assessment_users: {
                                some: {
                                    user_id: input.userId,
                                }
                            }
                        }
                    },
                    OR: [{
                        assessments: {
                            some: {
                                OR: filters
                            }
                        }
                    }]
                }
            });
        }),
});
