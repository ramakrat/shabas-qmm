import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "~/server/api/trpc";


const inputType = z.object({
    id: z.number().optional(),
    citation: z.string(),
    question_id: z.number(),
})

export const referenceRouter = createTRPCRouter({
    upsert: publicProcedure
        .input(inputType)
        .query(({ input, ctx }) => {
            return ctx.prisma.reference.upsert({
                where: { id: input.id },
                update: {
                    citation: input.citation,
                    question_id: input.question_id,
                    last_updated: new Date(),
                    last_updated_by: '',
                },
                create: {
                    citation: input.citation,
                    question_id: input.question_id,
                    created_by: '',
                    last_updated_by: '',
                }
            })
        }),
    getById: publicProcedure
        .input(z.object({ id: z.number() }))
        .query(({ input, ctx }) => {
            return ctx.prisma.reference.findUnique({
                where: { id: input.id }
            });
        }),
    getAll: publicProcedure
        .query(({ ctx }) => {
            return ctx.prisma.reference.findMany();
        }),
});
