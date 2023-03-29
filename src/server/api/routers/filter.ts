import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "~/server/api/trpc";


const inputType = z.object({
    id: z.number().optional(),
    type: z.string(),
    name: z.string(),
})

export const filterRouter = createTRPCRouter({
    upsert: publicProcedure
        .input(inputType)
        .query(({ input, ctx }) => {
            return ctx.prisma.filter.upsert({
                where: { id: input.id },
                update: {
                    type: input.type,
                    name: input.name,
                    last_updated: new Date(),
                    last_updated_by: '',
                },
                create: {
                    type: input.type,
                    name: input.name,
                    created_by: '',
                    last_updated_by: '',
                }
            })
        }),
    getById: publicProcedure
        .input(z.object({ id: z.number() }))
        .query(({ input, ctx }) => {
            return ctx.prisma.filter.findUnique({
                where: { id: input.id }
            });
        }),
    getAll: publicProcedure
        .query(({ ctx }) => {
            return ctx.prisma.filter.findMany();
        }),
});
