import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "~/server/api/trpc";


const inputType = z.object({
    id: z.number().optional(),
    time: z.string(),
    answer_id: z.number(),
})

export const startTimeRouter = createTRPCRouter({
    upsert: publicProcedure
        .input(inputType)
        .query(({ input, ctx }) => {
            return ctx.prisma.starttime.upsert({
                where: { id: input.id },
                update: {
                    time: input.time,
                    answer_id: input.answer_id,
                    last_updated: new Date(),
                    last_updated_by: '',
                },
                create: {
                    time: input.time,
                    answer_id: input.answer_id,
                    created_by: '',
                    last_updated_by: '',
                }
            })
        }),
    getById: publicProcedure
        .input(z.object({ id: z.number() }))
        .query(({ input, ctx }) => {
            return ctx.prisma.starttime.findUnique({
                where: { id: input.id }
            });
        }),
    getAll: publicProcedure
        .query(({ ctx }) => {
            return ctx.prisma.starttime.findMany();
        }),
});
