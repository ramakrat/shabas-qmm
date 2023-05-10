import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";


const inputType = z.object({
    id: z.number().optional(),
    engagement_id: z.number(),
    poc_id: z.number(),
})

export const engagementpocRouter = createTRPCRouter({
    create: publicProcedure
        .input(inputType)
        .mutation(({ input, ctx }) => {
            return ctx.prisma.engagementPoc.create({
                data: {
                    engagement_id: input.engagement_id,
                    poc_id: input.poc_id,
                }
            })
        }),
    update: publicProcedure
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
    getById: publicProcedure
        .input(z.object({ id: z.number() }))
        .query(({ input, ctx }) => {
            return ctx.prisma.engagementPoc.findUnique({
                where: { id: input.id }
            });
        }),
    getByEngagementId: publicProcedure
        .input(z.object({ id: z.number().optional() }))
        .query(({ input, ctx }) => {
            return ctx.prisma.engagementPoc.findMany({
                where: { engagement_id: input.id },
                include: {
                    poc: true
                }
            });
        }),
    getAll: publicProcedure
        .query(({ ctx }) => {
            return ctx.prisma.engagementPoc.findMany();
        }),
});
