import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";


const inputType = z.object({
    id: z.number().optional(),
    engagement_id: z.number(),
    poc_id: z.number(),
})

export const engagementpocRouter = createTRPCRouter({
    create: protectedProcedure
        .input(inputType)
        .mutation(({ input, ctx }) => {
            return ctx.prisma.engagementPoc.create({
                data: {
                    engagement_id: input.engagement_id,
                    poc_id: input.poc_id,
                }
            })
        }),
    update: protectedProcedure
        .input(inputType)
        .mutation(({ input, ctx }) => {
            return ctx.prisma.engagementPoc.update({
                where: { id: input.id },
                data: {
                    engagement_id: input.engagement_id,
                    poc_id: input.poc_id,
                },
            })
        }),
    getById: protectedProcedure
        .input(z.object({ id: z.number() }))
        .query(({ input, ctx }) => {
            return ctx.prisma.engagementPoc.findUnique({
                where: { id: input.id }
            });
        }),
    getByEngagementId: protectedProcedure
        .input(z.object({ id: z.number().optional() }))
        .query(({ input, ctx }) => {
            return ctx.prisma.engagementPoc.findMany({
                where: { engagement_id: input.id },
                include: {
                    poc: true
                }
            });
        }),
    getAll: protectedProcedure
        .query(({ ctx }) => {
            return ctx.prisma.engagementPoc.findMany();
        }),
});
