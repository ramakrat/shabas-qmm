import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "~/server/api/trpc";


const inputType = z.object({
    id: z.number().optional(),
    active: z.string(),
    question: z.string(),
    pillar: z.string(),
    practice_area: z.string(),
    topic_area: z.string(),
    hint: z.string(),
    priority: z.string(),
})

export const questionRouter = createTRPCRouter({
    upsert: publicProcedure
        .input(inputType)
        .query(({ input, ctx }) => {
            return ctx.prisma.question.upsert({
                where: { id: input.id },
                update: {
                    active: input.active,
                    question: input.question,
                    pillar: input.pillar,
                    practice_area: input.practice_area,
                    topic_area: input.topic_area,
                    hint: input.hint,
                    priority: input.priority,
                    updated_at: new Date(),
                    updated_by: '',
                },
                create: {
                    active: input.active,
                    question: input.question,
                    pillar: input.pillar,
                    practice_area: input.practice_area,
                    topic_area: input.topic_area,
                    hint: input.hint,
                    priority: input.priority,
                    created_by: '',
                    updated_by: '',
                }
            })
        }),
    getById: publicProcedure
        .input(z.object({ id: z.number() }))
        .query(({ input, ctx }) => {
            return ctx.prisma.question.findUnique({
                where: { id: input.id }
            });
        }),
    getAll: publicProcedure
        .query(({ ctx }) => {
            return ctx.prisma.question.findMany();
        }),
});
