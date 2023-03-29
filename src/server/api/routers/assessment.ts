import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "~/server/api/trpc";


const inputType = z.object({
    id: z.number().optional(),
    status: z.string(),
    export: z.string(),
    dates: z.date(),
    side_description: z.string(),
    side_address: z.string(),
    site_id: z.number(),
    engagement_id: z.number(),
})

export const assessmentRouter = createTRPCRouter({
    upsert: publicProcedure
        .input(inputType)
        .query(({ input, ctx }) => {
            return ctx.prisma.assessment.upsert({
                where: { id: input.id },
                update: {
                    status: input.status,
                    export: input.export,
                    dates: input.dates,
                    side_description: input.side_description,
                    side_address: input.side_address,
                    last_updated: new Date(),
                    last_updated_by: '',
                    site_id: input.site_id,
                    engagement_id: input.engagement_id,
                },
                create: {
                    status: input.status,
                    export: input.export,
                    dates: input.dates,
                    side_description: input.side_description,
                    side_address: input.side_address,
                    created_by: '',
                    last_updated_by: '',
                    site_id: input.site_id,
                    engagement_id: input.engagement_id,
                }
            })
        }),
    getById: publicProcedure
        .input(z.object({ id: z.number() }))
        .query(({ input, ctx }) => {
            return ctx.prisma.assessment.findUnique({
                where: { id: input.id }
            });
        }),
    getAll: publicProcedure
        .query(({ ctx }) => {
            return ctx.prisma.assessment.findMany();
        }),
});
