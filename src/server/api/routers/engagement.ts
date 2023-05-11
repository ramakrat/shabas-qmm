import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";


const inputType = z.object({
    id: z.number().optional(),
    status: z.string().optional(),
    description: z.string(),
    start_date: z.date(),
    end_date: z.date(),
    client_id: z.number(),
})

export const engagementRouter = createTRPCRouter({
    create: publicProcedure
        .input(inputType)
        .mutation(({ input, ctx }) => {
            return ctx.prisma.engagement.create({
                data: {
                    status: 'created',
                    description: input.description,
                    start_date: input.start_date,
                    end_date: input.end_date,
                    client_id: input.client_id,
                    created_by: '',
                    updated_by: '',
                }
            })
        }),
    update: publicProcedure
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
    updateStatus: publicProcedure
        .input(z.object({ id: z.number(), status: z.string() }))
        .mutation(({ input, ctx }) => {
            return ctx.prisma.engagement.update({
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
            return ctx.prisma.engagement.findUnique({
                where: { id: input.id }
            });
        }),
    getAllInclude: publicProcedure
        .input(z.object({
            filters: z.array(z.any()),
            states: z.array(z.boolean()).optional(),
            includeEmptyEngagements: z.boolean().optional(),
        }))
        .query(({ input, ctx }) => {
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
                                            { status: 'assessor-review' },
                                            { status: 'oversight' },
                                            { status: 'client-review' },
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
    getAll: publicProcedure
        .input(z.boolean().optional())
        .query(({ ctx }) => {
            return ctx.prisma.engagement.findMany();
        }),
    getTotalCount: publicProcedure
        .input(z.boolean().optional())
        .query(({ ctx }) => {
            return ctx.prisma.engagement.count();
        }),
});
