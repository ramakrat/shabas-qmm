import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "~/server/api/trpc";


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
    status: publicProcedure
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
            states: z.array(z.boolean())
        }))
        .query(({ input, ctx }) => {
            return ctx.prisma.engagement.findMany({
                include: {
                    Assessment: {
                        include: { poc: true },
                        where: {
                            OR: input.filters
                        }
                    },
                    client: true,
                    POC: true,
                    EngagementPOC: { include: { poc: true } },
                },
                where: {
                    Assessment: {
                        some: {
                            OR: input.filters
                        }
                    }
                }
            });
        }),
    getAllOngoingInclude: publicProcedure
        .input(z.array(z.boolean()))
        .query(({ ctx }) => {
            return ctx.prisma.engagement.findMany({
                where: {
                    Assessment: {
                        some: {
                            start_date: { lte: new Date() },
                            OR: [
                                { status: 'created' },
                                { status: 'ongoing' },
                                { status: '' },
                            ]
                        }
                    }
                },
                include: {
                    Assessment: {
                        where: {
                            start_date: { lte: new Date() },
                            OR: [
                                { status: 'created' },
                                { status: 'ongoing' },
                                { status: '' },
                            ]
                        }
                    },
                    client: true,
                    POC: true,
                }
            });
        }),
    getAllReviewInclude: publicProcedure
        .input(z.array(z.boolean()))
        .query(({ ctx }) => {
            return ctx.prisma.engagement.findMany({
                where: {
                    Assessment: {
                        some: { status: 'in-review' }
                    }
                },
                include: {
                    Assessment: {
                        where: { status: 'in-review' },
                        include: {
                            AssessmentQuestion: {
                                include: {

                                }
                            }
                        }
                    },
                    client: true,
                    POC: true,
                }
            });
        }),
    getAllOversightInclude: publicProcedure
        .input(z.array(z.boolean()))
        .query(({ ctx }) => {
            return ctx.prisma.engagement.findMany({
                where: {
                    Assessment: {
                        some: { status: 'oversight' }
                    }
                },
                include: {
                    Assessment: {
                        where: { status: 'oversight' }
                    },
                    client: true,
                    POC: true,
                }
            });
        }),
    getAllCompletedInclude: publicProcedure
        .input(z.array(z.boolean()))
        .query(({ ctx }) => {
            return ctx.prisma.engagement.findMany({
                where: {
                    Assessment: {
                        some: { status: 'completed' }
                    }
                },
                include: {
                    Assessment: {
                        where: { status: 'completed' }
                    },
                    client: true,
                    POC: true,
                }
            });
        }),
    getAll: publicProcedure
        .input(z.boolean())
        .query(({ ctx }) => {
            return ctx.prisma.engagement.findMany();
        }),
    getTotalCount: publicProcedure
        .input(z.boolean().optional())
        .query(({ ctx }) => {
            return ctx.prisma.engagement.count();
        }),
});
