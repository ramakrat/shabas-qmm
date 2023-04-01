import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "~/server/api/trpc";


const inputType = z.object({
    id: z.number().optional(),
    first_name: z.string(),
    last_name: z.string(),
    mobile_phone: z.string(),
    email: z.string(),
    question_id: z.number(),
})

export const smeRouter = createTRPCRouter({
    create: publicProcedure
        .input(inputType)
        .mutation(({ input, ctx }) => {
            return ctx.prisma.sME.create({
                data: {
                    first_name: input.first_name,
                    last_name: input.last_name,
                    mobile_phone: input.mobile_phone,
                    email: input.email,
                    question_id: input.question_id,
                    created_by: '',
                    updated_by: '',
                }
            })
        }),
    update: publicProcedure
        .input(inputType)
        .mutation(({ input, ctx }) => {
            return ctx.prisma.sME.update({
                where: { id: input.id },
                data: {
                    first_name: input.first_name,
                    last_name: input.last_name,
                    mobile_phone: input.mobile_phone,
                    email: input.email,
                    question_id: input.question_id,
                    updated_at: new Date(),
                    updated_by: '',
                },
            })
        }),
    getByQuestionId: publicProcedure
        .input(z.object({ id: z.number() }))
        .query(({ input, ctx }) => {
            return ctx.prisma.sME.findFirst({
                where: { question_id: input.id }
            });
        }),
    getById: publicProcedure
        .input(z.object({ id: z.number() }))
        .query(({ input, ctx }) => {
            return ctx.prisma.sME.findUnique({
                where: { id: input.id }
            });
        }),
    getAll: publicProcedure
        .query(({ ctx }) => {
            return ctx.prisma.sME.findMany();
        }),
});
