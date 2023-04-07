import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "~/server/api/trpc";


const inputType = z.object({
    id: z.number().optional(),
    citation: z.string(),
    question_id: z.number(),
})

export const referenceRouter = createTRPCRouter({
    create: publicProcedure
        .input(inputType)
        .mutation(({ input, ctx }) => {
            return ctx.prisma.reference.create({
                data: {
                    citation: input.citation,
                    question_id: input.question_id,
                    created_by: '',
                    updated_by: '',
                }
            })
        }),
    update: publicProcedure
        .input(inputType)
        .mutation(({ input, ctx }) => {
            return ctx.prisma.reference.update({
                where: { id: input.id },
                data: {
                    citation: input.citation,
                    question_id: input.question_id,
                    updated_at: new Date(),
                    updated_by: '',
                },
            })
        }),
    delete: publicProcedure
        .input(z.number())
        .mutation(({ input, ctx }) => {
            return ctx.prisma.reference.delete({
                where: { id: input },
            });
        }),
    getByQuestionId: publicProcedure
        .input(z.object({ id: z.number().optional() }))
        .query(({ input, ctx }) => {
            return ctx.prisma.reference.findMany({
                where: { question_id: input.id },
                orderBy: { id: 'asc' }
            });
        }),
    getById: publicProcedure
        .input(z.object({ id: z.number().optional() }))
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
