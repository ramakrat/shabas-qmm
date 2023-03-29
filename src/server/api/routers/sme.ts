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

export const startTimeRouter = createTRPCRouter({
    upsert: publicProcedure
        .input(inputType)
        .query(({ input, ctx }) => {
            return ctx.prisma.sme.upsert({
                where: { id: input.id },
                update: {
                    first_name: input.first_name,
                    last_name: input.last_name,
                    mobile_phone: input.mobile_phone_number,
                    email: input.email,
                    question_id: input.question_id,
                    last_updated: new Date(),
                    last_updated_by: '',
                },
                create: {
                    first_name: input.first_name,
                    last_name: input.last_name,
                    mobile_phone: input.mobile_phone_number,
                    email: input.email,
                    question_id: input.question_id,
                    created_by: '',
                    last_updated_by: '',
                }
            })
        }),
    getById: publicProcedure
        .input(z.object({ id: z.number() }))
        .query(({ input, ctx }) => {
            return ctx.prisma.sme.findUnique({
                where: { id: input.id }
            });
        }),
    getAll: publicProcedure
        .query(({ ctx }) => {
            return ctx.prisma.sme.findMany();
        }),
});
