import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";


const inputType = z.object({
    id: z.number().optional(),
    time: z.string(),
    answer_id: z.number(),
})

export const startTimeRouter = createTRPCRouter({
    upsert: publicProcedure
        .input(inputType)
        .query(({ input, ctx }) => {
            return ctx.prisma.startTime.upsert({
                where: { id: input.id },
                update: {
                    time: input.time,
                    answer_id: input.answer_id,
                    updated_at: new Date(),
                    updated_by: '',
                },
                create: {
                    time: input.time,
                    answer_id: input.answer_id,
                    created_by: '',
                    updated_by: '',
                }
            })
        }),
    getById: publicProcedure
        .input(z.object({ id: z.number() }))
        .query(({ input, ctx }) => {
            return ctx.prisma.startTime.findUnique({
                where: { id: input.id }
            });
        }),
    getAll: publicProcedure
        .query(({ ctx }) => {
            return ctx.prisma.startTime.findMany();
        }),
});
