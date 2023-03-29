import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "~/server/api/trpc";


const inputType = z.object({
    id: z.number().optional(),
    description: z.string(),
    status: z.string(),
    start_date: z.string(),
    end_date: z.string(),
    client_id: z.string(),
})

export const engagementRouter = createTRPCRouter({
    upsert: publicProcedure
        .input(inputType)
        .query(({ input, ctx }) => {
            return ctx.prisma.starttime.upsert({
                where: { id: input.id },
                update: {
                    description: input.description,
                    status: input.status,
                    start_date: input.start_date,
                    end_date: input.end_date,
                    client_id: input.client_id,
                    last_updated: new Date(),
                    last_updated_by: '',
                },
                create: {
                    description: input.description,
                    status: input.status,
                    start_date: input.start_date,
                    end_date: input.end_date,
                    client_id: input.client_id,
                    created_by: '',
                    last_updated_by: '',
                }
            })
        }),
    getById: publicProcedure
        .input(z.object({ id: z.number() }))
        .query(({ input, ctx }) => {
            return ctx.prisma.engagementrouter.findUnique({
                where: { id: input.id }
            });
        }),
    getAll: publicProcedure
        .query(({ ctx }) => {
            return ctx.prisma.engagementrouter.findMany();
        }),
});
