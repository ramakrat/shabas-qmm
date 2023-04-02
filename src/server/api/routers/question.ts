import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "~/server/api/trpc";

const inputType = z.object({
    id: z.number().optional(),
    active: z.boolean(),
    number: z.string(),
    question: z.string(),
    pillar: z.string(),
    practice_area: z.string(),
    topic_area: z.string(),
    hint: z.string(),
    priority: z.string(),
})

export const questionRouter = createTRPCRouter({
    create: publicProcedure
        .input(inputType)
        .mutation(({ input, ctx }) => {
            return ctx.prisma.question.create({
                data: {
                    active: input.active,
                    number: input.number,
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
    update: publicProcedure
        .input(inputType)
        .mutation(({ input, ctx }) => {
            return ctx.prisma.question.update({
                where: { id: input.id },
                data: {
                    active: input.active,
                    number: input.number,
                    question: input.question,
                    pillar: input.pillar,
                    practice_area: input.practice_area,
                    topic_area: input.topic_area,
                    hint: input.hint,
                    priority: input.priority,
                    updated_at: new Date(),
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
        .input(z.boolean())
        .query(({ ctx }) => {
            return ctx.prisma.question.findMany();
        }),
});
