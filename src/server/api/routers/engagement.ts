import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "~/server/api/trpc";


const inputType = z.object({
    id: z.number().optional(),
    status: z.string(),
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
                    status: input.status,
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
    getById: publicProcedure
        .input(z.object({ id: z.number() }))
        .query(({ input, ctx }) => {
            return ctx.prisma.engagement.findUnique({
                where: { id: input.id }
            });
        }),
    getAllInclude: publicProcedure
        .input(z.array(z.boolean()))
        .query(({ ctx }) => {
            return ctx.prisma.engagement.findMany({
                include: {
                    Assessment: true,
                    POC: true,
                }
            });
        }),
    getAll: publicProcedure
        .input(z.boolean())
        .query(({ ctx }) => {
            return ctx.prisma.engagement.findMany({
                include: {
                    Assessment: true,
                    POC: true,
                }
            });
        }),
    getTotalCount: publicProcedure
        .query(({ ctx }) => {
            return ctx.prisma.engagement.count();
        }),
});
