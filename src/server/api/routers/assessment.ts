import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "~/server/api/trpc";


const inputType = z.object({
    id: z.number().optional(),
    description: z.string(),
    status: z.string(),
    start_date: z.date(),
    end_date: z.date(),
    site_id: z.number(),
    engagement_id: z.number(),
})

export const assessmentRouter = createTRPCRouter({
    create: publicProcedure
        .input(inputType)
        .mutation(({ input, ctx }) => {
            return ctx.prisma.assessment.create({
                data: {
                    description: input.description,
                    status: input.status,
                    start_date: input.start_date,
                    end_date: input.end_date,
                    site_id: input.site_id,
                    engagement_id: input.engagement_id,
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
    getAll: publicProcedure
        .input(z.boolean())
        .query(({ ctx }) => {
            return ctx.prisma.assessment.findMany();
        }),
    getTotalCount: publicProcedure
        .query(({ ctx }) => {
            return ctx.prisma.assessment.count();
        }),
});
