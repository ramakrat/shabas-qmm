import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "~/server/api/trpc";


const inputType = z.object({
    id: z.number().optional(),
    first_name: z.string(),
    last_name: z.string(),
    title: z.string(),
    mobile_phone: z.string(),
    work_phone: z.string(),
    email: z.string(),
    staff: z.string(),
})

export const pocRouter = createTRPCRouter({
    upsert: publicProcedure
        .input(inputType)
        .query(({ input, ctx }) => {
            return ctx.prisma.poc.upsert({
                where: { id: input.id },
                update: {
                    first_name: input.first_name,
                    last_name: input.last_name,
                    title: input.title,
                    mobile_phone: input.mobile_phone,
                    work_phone: input.work_phone,
                    email: input.email,
                    staff: input.staff,
                    last_updated: new Date(),
                    last_updated_by: '',
                },
                create: {
                    first_name: input.first_name,
                    last_name: input.last_name,
                    title: input.title,
                    mobile_phone: input.mobile_phone,
                    work_phone: input.work_phone,
                    email: input.email,
                    staff: input.staff,
                    created_by: '',
                    last_updated_by: '',
                }
            })
        }),
    getById: publicProcedure
        .input(z.object({ id: z.number() }))
        .query(({ input, ctx }) => {
            return ctx.prisma.poc.findUnique({
                where: { id: input.id }
            });
        }),
    getAll: publicProcedure
        .query(({ ctx }) => {
            return ctx.prisma.poc.findMany();
        }),
});
